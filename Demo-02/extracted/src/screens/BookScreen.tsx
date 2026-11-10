import { useMemo, useState } from "react";
import {
  BadgeCheck, CalendarDays, Check, ChevronRight, Clock, Droplets, Gauge,
  MapPin, Navigation, ScanSearch, ShieldAlert, Wrench, Zap,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useLang } from "../i18n";
import { nextDays, TIMES, useNav } from "../nav";
import { ADVISORS, advisorOf, BRANCHES, branchOf } from "../data";
import { AdvisorCard, PrimaryCta, SectionTitle } from "../components";

/* ============================================================================
   BOOK APPOINTMENT — the ONLY write-path of the wrapper. Five real steps with
   their own back/next state; the confirmed request becomes a DMS inbox ticket
   (here: a mock reference number). Legacy systems are never touched directly.
   ============================================================================ */

const SERVICES = [
  { id: "routine", icon: Wrench, mins: 90 },
  { id: "oil", icon: Droplets, mins: 30 },
  { id: "electrical", icon: ScanSearch, mins: 45 },
  { id: "general", icon: Zap, mins: 120 },
  { id: "testdrive", icon: Gauge, mins: 20 },
] as const;

type SvcId = (typeof SERVICES)[number]["id"];

export function BookScreen() {
  const { t, lang } = useLang();
  const nav = useNav();
  const { step, stepDir, draft } = nav;
  const days = useMemo(() => nextDays(8), []);

  const svcMeta: Record<SvcId, { label: string; desc: string }> = {
    routine: { label: t.svcRoutine, desc: t.svcRoutineD },
    oil: { label: t.svcOil, desc: t.svcOilD },
    electrical: { label: t.svcElectrical, desc: t.svcElectricalD },
    general: { label: t.svcGeneral, desc: t.svcGeneralD },
    testdrive: { label: t.svcTestDrive, desc: t.svcTestDriveD },
  };

  const [sending, setSending] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Guest identity validation — the DMS ticket requires a reachable Saudi mobile
  const phoneOk = /^05\d{8}$/.test((draft.guestPhone ?? "").replace(/\s/g, ""));
  const nameOk = (draft.guestName ?? "").trim().length >= 2;

  const canNext =
    (step === 0 && !!draft.serviceType) ||
    (step === 1 && !!draft.branchId) ||
    (step === 2 && !!draft.advisorId) ||
    (step === 3 && draft.dayOffset != null && !!draft.time);
  const canConfirm = nameOk && phoneOk && !sending;

  const stepTitles = [t.stepService, t.stepBranch, t.stepAdvisor, t.stepTime, t.stepConfirm];

  const confirm = () => {
    setFormTouched(true);
    if (!canConfirm) return;
    // Loading state — the request goes to the DMS inbox as a ticket; UI simulates the round-trip
    setSending(true);
    setTimeout(() => {
      const ref = `DG-${Math.floor(2000 + Math.random() * 7000)}`;
      const day = days[draft.dayOffset ?? 0];
      nav.patchDraft({ confirmedRef: ref });
      nav.addBooking({
        ref,
        serviceKey: draft.serviceType!,
        when: `${lang === "ar" ? day.dayAr : day.dayEn} · ${lang === "ar" ? day.labelAr : day.labelEn} · ${lang === "ar" ? TIMES.find(x => x.id === draft.time)?.ar : TIMES.find(x => x.id === draft.time)?.en}`,
        branchAr: branchOf(draft.branchId!).nameAr, branchEn: branchOf(draft.branchId!).nameEn,
      });
      setSending(false);
      nav.goStep(5);
    }, 1200);
  };

  const branchStatus = (s: string) =>
    s === "today" ? { txt: t.availableToday, cls: "bg-emerald-500/12 text-emerald-700" }
    : s === "tomorrow" ? { txt: t.nearestTomorrow, cls: "bg-sky-500/12 text-sky-700" }
    : s === "limited" ? { txt: t.limited, cls: "bg-amber-500/15 text-amber-700" }
    : { txt: t.full, cls: "bg-steel/10 text-steel/50" };

  /* ---------------- SUCCESS VIEW ---------------- */
  if (step === 5) {
    const br = branchOf(draft.branchId!);
    const ad = advisorOf(draft.advisorId!);
    const day = days[draft.dayOffset ?? 0];
    const svc = svcMeta[draft.serviceType as SvcId];
    return (
      <div className="absolute inset-0 overflow-y-auto no-scrollbar bg-alu pb-28">
        <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
          <div className="relative pop-check">
            <div className="grid size-24 place-items-center rounded-full bg-charcoal shadow-pop">
              <Check className="size-11 text-emerald-400" strokeWidth={3} />
            </div>
            <span className="absolute -end-1 -top-1 size-6 rounded-full bg-toyota shadow-red" />
          </div>
          <h1 className="mt-5 text-[22px] font-black text-charcoal">{t.bookingDone}</h1>
          <p className="mt-1.5 max-w-[260px] text-[12px] font-medium leading-relaxed text-steel/70">{t.bookingDoneSub}</p>

          <div className="mt-5 w-full rounded-[24px] bg-white p-4 text-start shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-steel/60">{t.bookingRef}</span>
              <span className="rounded-full bg-charcoal px-3 py-1 font-en text-[12px] font-black tracking-wider text-white">{draft.confirmedRef}</span>
            </div>
            <div className="hairline my-3" />
            <SummaryRow k={t.sumService} v={svc.label} />
            <SummaryRow k={t.sumBranch} v={lang === "ar" ? br.nameAr : br.nameEn} />
            <SummaryRow k={t.sumAdvisor} v={lang === "ar" ? ad.nameAr : ad.nameEn} />
            <SummaryRow k={t.sumWhen} v={`${lang === "ar" ? day.dayAr : day.dayEn} · ${lang === "ar" ? day.labelAr : day.labelEn} · ${lang === "ar" ? TIMES.find(x => x.id === draft.time)?.ar : TIMES.find(x => x.id === draft.time)?.en}`} />
            {draft.vehicleLabel && <SummaryRow k={t.sumVehicle} v={draft.vehicleLabel} />}
          </div>

          <p className="mt-4 max-w-[280px] text-[10.5px] font-semibold leading-relaxed text-steel/55">{t.addNote}</p>

          <div className="mt-5 w-full">
            <PrimaryCta onClick={() => { nav.resetBooking(); nav.setTab("home"); }}>{t.backHome}</PrimaryCta>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      {/* Header + progress */}
      <header className="carbon rounded-b-[30px] px-4 pt-10 pb-5 text-white">
        <div className="flex items-end justify-between">
          <div className="text-start">
            <h1 className="text-[21px] font-black leading-tight">{t.bookTitle}</h1>
            <p className="text-[11px] font-medium text-white/55">{t.bookSub}</p>
          </div>
          <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[10.5px] font-bold tabular">
            {step + 1}/5
          </span>
        </div>
        {/* segmented progress */}
        <div className="mt-4 flex gap-1.5" dir="ltr">
          {stepTitles.map((_, i) => (
            <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300",
              i < step ? "bg-toyota" : i === step ? "bg-white" : "bg-white/20")} />
          ))}
        </div>
        <p className="mt-2 text-start text-[11px] font-bold text-white/70">{stepTitles[step]}</p>
      </header>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        <div key={step} className={stepDir === "fwd" ? "step-fwd" : "step-bck"}>

          {/* ========= STEP 1 · SERVICE ========= */}
          {step === 0 && (
            <section className="pt-4">
              <SectionTitle>{t.chooseService}</SectionTitle>
              {draft.vehicleLabel && (
                <p className="mt-2 rounded-full bg-toyota/8 px-3 py-2 text-start text-[11px] font-extrabold text-toyota">
                  {t.forVehiclePrefix} {draft.vehicleLabel}
                </p>
              )}
              <div className="mt-3 flex flex-col gap-2.5">
                {SERVICES.map((s) => {
                  const active = draft.serviceType === s.id;
                  return (
                    <button key={s.id} onClick={() => nav.patchDraft({ serviceType: s.id })}
                      className={cn("press-soft flex items-center gap-3 rounded-[20px] bg-white p-3.5 text-start shadow-card transition-all",
                        active ? "ring-2 ring-toyota" : "ring-1 ring-black/5")}>
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl transition-colors",
                        active ? "bg-toyota text-white shadow-red" : "bg-charcoal text-white")}>
                        <s.icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-extrabold text-charcoal">{svcMeta[s.id].label}</span>
                        <span className="block text-[10.5px] font-semibold text-steel/60">{svcMeta[s.id].desc}</span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-steel/55 tabular">
                          <Clock className="size-3" />{s.mins} {t.durationMin.split(" ")[0]}
                        </span>
                        {active && <BadgeCheck className="size-4 text-toyota" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ========= STEP 2 · BRANCH ========= */}
          {step === 1 && (
            <section className="pt-4">
              <SectionTitle>{t.chooseBranch}</SectionTitle>
              <div className="mt-3 flex flex-col gap-2.5">
                {BRANCHES.map((b) => {
                  const active = draft.branchId === b.id;
                  const st = branchStatus(b.status);
                  const disabled = b.status === "full";
                  return (
                    <button key={b.id} disabled={disabled}
                      onClick={() => nav.patchDraft({ branchId: b.id })}
                      className={cn("press-soft flex items-center gap-3 rounded-[20px] bg-white p-3.5 text-start shadow-card transition-all",
                        active ? "ring-2 ring-toyota" : "ring-1 ring-black/5", disabled && "opacity-50")}>
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl",
                        active ? "bg-toyota text-white shadow-red" : "bg-alu-deep text-charcoal")}>
                        <MapPin className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-extrabold text-charcoal">{lang === "ar" ? b.nameAr : b.nameEn}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-steel/55 tabular">
                          <Navigation className="size-2.5 text-toyota" />
                          {b.distKm} {t.kmAway} · ≈{Math.round(b.distKm * 2.4)} {t.driveMin} · {b.bays} {lang === "ar" ? "رفع صيانة" : "bays"}
                        </span>
                      </span>
                      <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[9.5px] font-black", st.cls)}>{st.txt}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ========= STEP 3 · ADVISOR ========= */}
          {step === 2 && (
            <section className="pt-4">
              <SectionTitle action={<span className="text-[10.5px] font-bold text-steel/55">{t.chooseAdvisorSub}</span>}>
                {t.chooseAdvisor}
              </SectionTitle>
              <div className="mt-3 flex flex-col gap-2.5">
                {ADVISORS.map((a) => (
                  <AdvisorCard key={a.id} advisor={a} selected={draft.advisorId === a.id}
                    onSelect={() => nav.patchDraft({ advisorId: a.id })}
                    onChat={() => nav.push("chat", { id: a.id })}
                    msgAr="السلام عليكم، بخصوص حجز الصيانة عند دغمل" msgEn="Hi! About my service booking at Doghmal" />
                ))}
              </div>
            </section>
          )}

          {/* ========= STEP 4 · DATE & TIME ========= */}
          {step === 3 && (
            <section className="pt-4">
              <SectionTitle>{t.chooseTime}</SectionTitle>
              {/* days rail */}
              <div className="snapx mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
                {days.map((d) => {
                  const active = draft.dayOffset === d.offset;
                  return (
                    <button key={d.offset} disabled={d.closed}
                      onClick={() => nav.patchDraft({ dayOffset: d.offset })}
                      className={cn("press flex w-[64px] shrink-0 flex-col items-center gap-0.5 rounded-[18px] py-3 transition-all",
                        active ? "bg-charcoal text-white shadow-pop"
                          : d.closed ? "bg-alu-deep/60 text-steel/40" : "bg-white text-charcoal shadow-card")}>
                      {/* same-day booking gets the strongest label */}
                      <span className={cn("text-[9.5px] font-bold", d.offset === 0 ? "text-toyota" : "opacity-70")}>
                        {d.offset === 0 ? t.todayWord : (lang === "ar" ? d.dayArShort : d.dayEn.slice(0, 3))}
                      </span>
                      <span className="text-[17px] font-black tabular">{d.dayNum}</span>
                      <span className="text-[8.5px] font-bold opacity-70">{d.closed ? t.closed : (lang === "ar" ? d.labelAr.split(" ")[1] : d.labelEn.split(" ")[0])}</span>
                    </button>
                  );
                })}
                <span className="w-1 shrink-0" />
              </div>
              {/* time slots */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {TIMES.map((slot) => {
                  const active = draft.time === slot.id;
                  return (
                    <button key={slot.id} disabled={slot.taken}
                      onClick={() => nav.patchDraft({ time: slot.id })}
                      className={cn("press rounded-[16px] py-3 text-[12px] font-extrabold transition-all tabular",
                        active ? "bg-toyota text-white shadow-red"
                          : slot.taken ? "bg-alu-deep/60 text-steel/35 line-through" : "bg-white text-charcoal shadow-card")}>
                      {lang === "ar" ? slot.ar : slot.en}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[10.5px] font-bold text-steel/55">
                <CalendarDays className="size-3.5 text-toyota" />
                {lang === "ar" ? "الجمعة إجازة — الورشة ترد السبت" : "Fridays closed — workshop resumes Saturday"}
              </p>
            </section>
          )}

          {/* ========= STEP 5 · CONFIRM ========= */}
          {step === 4 && (
            <section className="pt-4">
              <SectionTitle>{t.summaryTitle}</SectionTitle>

              {/* guest identity — required before the DMS ticket is written */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <div>
                  <input value={draft.guestName ?? ""} aria-label={t.yourName} placeholder={t.yourName}
                    onChange={(e) => nav.patchDraft({ guestName: e.target.value })}
                    className={cn("field", formTouched && !nameOk && "field-error")} maxLength={30} />
                  {formTouched && !nameOk && (
                    <p className="mt-1 flex items-center gap-1 text-[9px] font-extrabold text-toyota"><ShieldAlert className="size-2.5" />{t.nameError}</p>
                  )}
                </div>
                <div>
                  <input dir="ltr" inputMode="tel" aria-label={t.yourPhone} placeholder="05XXXXXXXX"
                    value={draft.guestPhone ?? ""}
                    onChange={(e) => nav.patchDraft({ guestPhone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                    className={cn("field font-en text-left", formTouched && !phoneOk && "field-error")} />
                  {formTouched && !phoneOk && (
                    <p className="mt-1 flex items-center gap-1 text-[9px] font-extrabold text-toyota"><ShieldAlert className="size-2.5" />{t.phoneError}</p>
                  )}
                </div>
              </div>
              <p className="mt-1.5 px-1 text-[9.5px] font-semibold text-steel/55">{t.phoneHint}</p>

              <div className="mt-3 overflow-hidden rounded-[24px] bg-white shadow-card">
                <div className="carbon flex items-center justify-between p-4 text-white">
                  <div className="text-start">
                    <p className="text-[10px] font-bold text-white/55">{t.sumService}</p>
                    <p className="text-[15px] font-black">{svcMeta[draft.serviceType as SvcId]?.label}</p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-2xl bg-toyota shadow-red">
                    <Wrench className="size-5" />
                  </span>
                </div>
                <div className="p-4">
                  <SummaryRow k={t.sumBranch} v={lang === "ar" ? branchOf(draft.branchId!).nameAr : branchOf(draft.branchId!).nameEn} icon={<MapPin className="size-4 text-toyota" />} />
                  <SummaryRow k={t.sumWhen}
                    v={`${lang === "ar" ? days[draft.dayOffset!].dayAr : days[draft.dayOffset!].dayEn} · ${lang === "ar" ? days[draft.dayOffset!].labelAr : days[draft.dayOffset!].labelEn} · ${lang === "ar" ? TIMES.find(x => x.id === draft.time)?.ar : TIMES.find(x => x.id === draft.time)?.en}`}
                    icon={<Clock className="size-4 text-toyota" />} />
                  {draft.vehicleLabel && <SummaryRow k={t.sumVehicle} v={draft.vehicleLabel} icon={<Gauge className="size-4 text-toyota" />} />}
                  <div className="hairline my-3" />
                  {/* advisor summary w/ WhatsApp + in-app chat */}
                  <AdvisorCard advisor={advisorOf(draft.advisorId!)} selected={false}
                    onChat={() => nav.push("chat", { id: draft.advisorId! })}
                    msgAr="السلام عليكم، أكدت حجزي من التطبيق" msgEn="Hi! I just confirmed my booking in the app" />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Back / Next bar — floats above the tab bar on the Book tab root */}
      <div className="mb-[86px] flex gap-2.5 border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl">
        {step > 0 && (
          <button onClick={() => nav.goStep(step - 1)}
            className="press w-[30%] rounded-[18px] bg-white py-3.5 text-[13px] font-extrabold text-charcoal border border-black/10">
            {t.back}
          </button>
        )}
        {step < 4 ? (
          <div className="flex-1">
            <PrimaryCta disabled={!canNext} onClick={() => canNext && nav.goStep(step + 1)}>
              <span className="inline-flex items-center gap-1.5">{t.next}<ChevronRight className="size-4 rtl-mirror" /></span>
            </PrimaryCta>
          </div>
        ) : (
          <div className="flex-1">
            <PrimaryCta onClick={confirm} disabled={sending}>
              <span className="inline-flex items-center gap-2">
                {sending
                  ? <><span className="ring-spinner !size-4 !border-white/25" style={{ borderTopColor: "#fff" }} />{t.sending}</>
                  : <><Check className="size-4" />{t.confirmBooking}</>}
              </span>
            </PrimaryCta>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ k, v, icon }: { k: string; v: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 text-start">
      {icon}
      <span className="text-[11px] font-bold text-steel/55">{k}</span>
      <span className="ms-auto max-w-[62%] truncate text-[12px] font-extrabold text-charcoal">{v}</span>
    </div>
  );
}
