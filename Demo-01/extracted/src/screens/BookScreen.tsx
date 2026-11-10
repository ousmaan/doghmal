import { useState } from "react";
import { useApp } from "../lib/store";
import { digits, fmtDate, fmtTime, isoPlus, weekday } from "../lib/i18n";
import type { TKey } from "../lib/i18n";
import { ADVISORS, BRANCHES, SERVICES, TIME_SLOTS } from "../lib/data";
import { Icon } from "../components/icons";
import { AdvisorCard, AvailabilityChip, Btn, Field, KV, Money, ScreenHeader, branchById, inputCls } from "../components/ui";

/* BOOK — a real 5-step stack flow (service → branch → advisor →
   date/time → confirm). Submitting creates a REQUEST, not a DMS
   write: the human advisor confirms it in the legacy system.
   Draft + step auto-save to localStorage via the store, so the
   form survives tab switches and reloads. */
export default function BookScreen() {
  const app = useApp();
  const { t, L, lang, draft, setDraft, step, setStep } = app;
  const [dirAnim, setDirAnim] = useState<"fwd" | "back">("fwd");
  const [submitting, setSubmitting] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);

  const isTest = draft.serviceId === "test";
  const service = SERVICES.find((s) => s.id === draft.serviceId);
  const stepKeys: TKey[] = ["b.st1", "b.st2", "b.st3", "b.st4", "b.st5"];

  const go = (n: number) => {
    setDirAnim(n > step ? "fwd" : "back");
    setStep(n);
  };

  const next = () => {
    if (submitting) return;
    if (step === 1 && !draft.serviceId) return app.toast(t("b.pickService"));
    if (step === 2 && !draft.branchId) return app.toast(t("b.pickBranch"));
    if (step === 3 && !draft.advisorId) return app.toast(t("b.pickAdvisor"));
    if (step === 4 && (!draft.date || !draft.time)) return app.toast(t("b.pickTime"));
    if (step === 5) {
      /* guest contact validation — Saudi mobile format */
      if (!/^05\d{8}$/.test(draft.phone ?? "")) {
        setPhoneErr(true);
        app.toast(t("b.phoneErr"));
        return;
      }
      setPhoneErr(false);
      setSubmitting(true);
      window.setTimeout(() => {
        app.confirmBooking();
        setSubmitting(false);
      }, 1200);
      return;
    }
    go(step + 1);
  };
  const back = () => (step > 1 ? go(step - 1) : app.switchTab("home"));

  /* ————— step 6: success ————— */
  if (step === 6 && app.confirmed) {
    const a = app.confirmed;
    const advisor = ADVISORS.find((x) => x.id === a.advisorId) ?? ADVISORS[0];
    return (
      <div className="h-full overflow-y-auto pb-28">
        <ScreenHeader title={t("b.title")} />
        <div className="px-5 pt-8 text-center">
          <div className="relative w-24 h-24 mx-auto ring-pop">
            <svg viewBox="0 0 96 96" className="w-24 h-24">
              <circle cx="48" cy="48" r="42" fill="rgba(46,204,143,0.12)" stroke="#2ecc8f" strokeWidth="3" />
              <path d="M32 49.5 43 60l21-24" fill="none" stroke="#2ecc8f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="draw-check" />
            </svg>
            <span className="absolute -top-1 -end-2 text-warn"><Icon name="sparkles" size={20} /></span>
            <span className="absolute bottom-0 -start-3 text-redhi"><Icon name="sparkles" size={14} /></span>
          </div>
          <h2 className="text-[22px] font-black metal-text mt-5">{t("b.success")}</h2>
          <p className="text-[12px] text-mute font-semibold leading-relaxed mt-2 max-w-[280px] mx-auto">{t("b.successSub")}</p>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mt-4">
            <span className="text-[10px] font-bold text-mute">{t("b.ref")}</span>
            <span className="text-[13px] font-black text-alu tabular-nums" dir="ltr">{app.bookingRef}</span>
          </div>

          <div className="card-sheen border border-white/8 rounded-[22px] p-4 mt-5 text-start fade-up">
            <KV k={t("b.service")} v={t(`sv.${a.serviceId}` as TKey)} strong />
            <KV k={t("b.dateTime")} v={`${fmtDate(a.date, lang, { weekday: "long" })} · ${fmtTime(a.time, lang)}`} strong />
            <KV k={t("b.branch")} v={L(branchById(a.branchId).name)} />
            <KV k={t("b.vehicle")} v={a.vehicleLabel ? L(a.vehicleLabel) : L(app.garage.find((g) => g.id === a.vehicleId)?.nickname ?? { ar: "—", en: "—" })} />
            <KV k={t("b.phone")} v={<span dir="ltr">{digits(draft.phone ?? "", lang)}</span>} />
          </div>

          <div className="mt-4 text-start">
            <AdvisorCard advisor={advisor} compact />
          </div>

          <div className="flex gap-2.5 mt-5">
            <Btn className="flex-1" onClick={() => app.switchTab("home")}>{t("b.viewAppt")}</Btn>
            <Btn variant="ghost" onClick={() => app.startBooking({})}>{t("b.another")}</Btn>
          </div>
        </div>
      </div>
    );
  }

  const vehicleName = draft.vehicleLabel
    ? L(draft.vehicleLabel)
    : draft.vehicleId === "other"
      ? t("b.otherCar")
      : L(app.garage.find((g) => g.id === draft.vehicleId)?.nickname ?? { ar: "—", en: "—" });

  return (
    <div className="h-full flex flex-col">
      <ScreenHeader title={t("b.title")} sub={`${t("c.step")} ${digits(step, lang)} ${t("c.of")} ${digits(5, lang)}`} />

      {/* step rail */}
      <div className="px-4 pt-3 pb-3 shrink-0">
        <div className="flex gap-1.5">
          {stepKeys.map((k, i) => {
            const n = i + 1;
            const state = n < step ? "done" : n === step ? "now" : "todo";
            return (
              <button key={k} onClick={() => n < step && go(n)} className={`flex-1 ${n < step ? "press" : ""}`}>
                <div className={`h-1 rounded-full transition-colors duration-300 ${state === "todo" ? "bg-white/10" : "btn-red"}`} />
                <p className={`text-[8.5px] font-bold mt-1.5 text-center ${state === "now" ? "text-redhi" : state === "done" ? "text-silver" : "text-mute/60"}`}>{t(k)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div key={step} className={dirAnim === "fwd" ? "screen-enter" : "screen-back"}>

          {/* STEP 1 — service + vehicle */}
          {step === 1 && (
            <div>
              <h2 className="text-[17px] font-black text-alu">{t("b.s1")}</h2>
              <p className="text-[11px] text-mute font-semibold mt-1">{t("b.s1sub")}</p>
              <div className="space-y-2.5 mt-4">
                {SERVICES.filter((s) => s.id !== "test" || isTest).map((s) => {
                  const active = draft.serviceId === s.id;
                  return (
                    <button key={s.id} onClick={() => setDraft((d) => ({ ...d, serviceId: s.id }))}
                      className={`press w-full text-start card-sheen border rounded-[20px] p-3.5 flex items-center gap-3 transition-colors ${active ? "border-red/60 shadow-[0_0_0_1px_rgba(235,10,26,0.4)]" : "border-white/8"}`}>
                      <span className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${active ? "btn-red text-white border-transparent" : "bg-white/5 text-redhi border-white/8"}`}>
                        <Icon name={s.icon} size={20} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="text-[13.5px] font-extrabold text-alu block">{t(`sv.${s.id}` as TKey)}</span>
                        <span className="text-[10px] text-mute font-semibold block mt-0.5">{t(`sv.${s.id}Sub` as TKey)} · {t(s.durKey as TKey)}</span>
                      </span>
                      <span className="text-end shrink-0">
                        {s.price > 0 ? (
                          <>
                            <span className="text-[8.5px] text-mute font-bold block">{t("c.from")}</span>
                            <Money n={s.price} className="text-[13px] font-black text-alu" />
                          </>
                        ) : (
                          <span className="text-[11px] font-black text-ok">{t("c.free")}</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isTest ? (
                <div className="mt-4 rounded-2xl border border-info/25 bg-info/8 p-3.5 flex items-center gap-3">
                  <Icon name="steering" size={20} className="text-info shrink-0" />
                  <div>
                    <p className="text-[9.5px] font-bold text-mute">{t("b.testDriveFor")}</p>
                    <p className="text-[13px] font-extrabold text-alu mt-0.5">{draft.vehicleLabel ? L(draft.vehicleLabel) : "—"}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <h3 className="text-[13px] font-extrabold text-alu mb-2.5">{t("b.whichCar")}</h3>
                  <div className="flex gap-2 overflow-x-auto no-sb -mx-4 px-4 pb-1">
                    {app.garage.map((g) => {
                      const active = draft.vehicleId === g.id;
                      return (
                        <button key={g.id} onClick={() => setDraft((d) => ({ ...d, vehicleId: g.id, vehicleLabel: undefined }))}
                          className={`press shrink-0 rounded-2xl border p-2 w-[124px] text-start ${active ? "border-red/60 bg-red/8" : "border-white/8 bg-white/4"}`}>
                          <img src={g.img} alt="" loading="lazy" className="w-full h-14 object-cover rounded-xl" />
                          <p className="text-[10.5px] font-extrabold text-alu mt-1.5 truncate">{L(g.nickname)}</p>
                          <p className="text-[8.5px] text-mute font-semibold truncate">{L(g.model)}</p>
                        </button>
                      );
                    })}
                    <button onClick={() => setDraft((d) => ({ ...d, vehicleId: "other", vehicleLabel: undefined }))}
                      className={`press shrink-0 rounded-2xl border w-[96px] flex flex-col items-center justify-center gap-1.5 ${draft.vehicleId === "other" ? "border-red/60 bg-red/8 text-redhi" : "border-dashed border-white/15 text-mute"}`}>
                      <Icon name="plus" size={18} />
                      <span className="text-[9.5px] font-bold">{t("b.otherCar")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — branch, with distance + drive-time ETA */}
          {step === 2 && (
            <div>
              <h2 className="text-[17px] font-black text-alu">{t("b.s2")}</h2>
              <p className="text-[11px] text-mute font-semibold mt-1">{t("b.s2sub")}</p>
              <div className="space-y-2.5 mt-4">
                {BRANCHES.map((b) => {
                  const active = draft.branchId === b.id;
                  return (
                    <button key={b.id} onClick={() => setDraft((d) => ({ ...d, branchId: b.id }))}
                      className={`press w-full text-start card-sheen border rounded-[20px] p-3.5 transition-colors ${active ? "border-red/60 shadow-[0_0_0_1px_rgba(235,10,26,0.4)]" : "border-white/8"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${active ? "btn-red text-white border-transparent" : "bg-white/5 text-redhi border-white/8"}`}>
                          <Icon name="pin" size={18} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="text-[13px] font-extrabold text-alu block truncate">{L(b.name)}</span>
                          <span className="text-[9.5px] text-mute font-semibold block mt-0.5">{L(b.kind)}</span>
                        </span>
                        <AvailabilityChip status={b.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-white/6 text-[9.5px] font-bold text-mute flex-wrap">
                        <span className="flex items-center gap-1"><Icon name="gauge" size={11} /> {digits(b.km, lang)} {t("c.km")} · {digits(Math.round(b.km * 1.6), lang)} {t("b.driveMin")}</span>
                        <span className="flex items-center gap-1"><Icon name="clock" size={11} /> {t("b.hours")}: {L(b.hours)}</span>
                        {active && <span className="ms-auto text-redhi flex items-center gap-1"><Icon name="check" size={12} strokeWidth={3} /></span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 — advisor (human hand-off: chat + WhatsApp on every card) */}
          {step === 3 && (
            <div>
              <h2 className="text-[17px] font-black text-alu">{t("b.s3")}</h2>
              <p className="text-[11px] text-mute font-semibold mt-1">{t("b.s3sub")}</p>
              <div className="space-y-3 mt-4">
                {[...ADVISORS].sort((a, b) => Number(b.branchId === draft.branchId) - Number(a.branchId === draft.branchId)).map((a) => (
                  <div key={a.id}>
                    {a.branchId === draft.branchId && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-ok mb-1.5 ms-1">
                        <Icon name="pin" size={10} /> {L(branchById(a.branchId).name)}
                      </span>
                    )}
                    <AdvisorCard advisor={a} selected={draft.advisorId === a.id}
                      onSelect={() => setDraft((d) => ({ ...d, advisorId: a.id }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — date & time */}
          {step === 4 && <DateTimePicker />}

          {/* STEP 5 — review + guest contact */}
          {step === 5 && service && (
            <div>
              <h2 className="text-[17px] font-black text-alu">{t("b.s5")}</h2>
              <div className="card-sheen border border-white/8 rounded-[22px] p-4 mt-4">
                <KV k={t("b.service")} v={`${t(`sv.${service.id}` as TKey)} · ${t(service.durKey as TKey)}`} strong />
                <KV k={t("b.vehicle")} v={vehicleName} strong />
                <KV k={t("b.branch")} v={L(branchById(draft.branchId ?? "b1").name)} />
                <KV k={t("b.dateTime")} v={draft.date ? `${fmtDate(draft.date, lang, { weekday: "long" })} · ${fmtTime(draft.time ?? "10:00", lang)}` : "—"} strong />
                <KV k={t("b.advisor")} v={L((ADVISORS.find((a) => a.id === draft.advisorId) ?? ADVISORS[0]).name)} />
              </div>

              <div className="mt-3.5">
                <AdvisorCard advisor={ADVISORS.find((a) => a.id === draft.advisorId) ?? ADVISORS[0]} compact />
              </div>

              <div className="mt-4 card-sheen border border-white/8 rounded-[20px] p-4">
                <Field label={t("b.phone")} hint={t("b.phoneHint")} error={phoneErr ? t("b.phoneErr") : undefined}>
                  <input className={`${inputCls} tabular-nums ${phoneErr ? "border-red/60" : ""}`} dir="ltr" type="tel" inputMode="numeric" maxLength={10}
                    value={draft.phone ?? ""} placeholder={t("b.phonePh")}
                    onChange={(e) => { setPhoneErr(false); setDraft((d) => ({ ...d, phone: e.target.value.replace(/\D/g, "") })); }} />
                </Field>
                <div className="flex items-center justify-between -mt-1">
                  <div>
                    <p className="text-[10.5px] font-bold text-mute">{t("b.estCost")}</p>
                    {service.price > 0 ? <Money n={service.price} className="text-[20px] font-black metal-text mt-0.5" /> : <p className="text-[18px] font-black text-ok mt-0.5">{t("c.free")}</p>}
                  </div>
                  <span className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-redhi">
                    <Icon name={service.icon} size={21} />
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-3 px-1">
                <Icon name="shield" size={14} className="text-ok shrink-0 mt-0.5" />
                <p className="text-[10px] text-mute font-semibold leading-relaxed">{t("b.payNote")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* footer nav — real back/next, spinner on submission */}
      <div className="shrink-0 px-4 py-3 border-t border-white/6 bg-ink/92 backdrop-blur-xl flex gap-2.5">
        <Btn variant="ghost" onClick={back} className="w-[110px]" disabled={submitting}>
          <Icon name={app.dir === "rtl" ? "chevR" : "chevL"} size={15} />
          {t("c.back")}
        </Btn>
        <Btn className="flex-1" onClick={next} disabled={submitting}>
          {submitting ? (
            <><Icon name="refresh" size={16} className="spin" /> {t("b.submitting")}</>
          ) : (
            <>
              {step === 5 ? t("b.confirmBooking") : t("c.next")}
              {step < 5 && <Icon name={app.dir === "rtl" ? "chevL" : "chevR"} size={15} />}
            </>
          )}
        </Btn>
      </div>
    </div>
  );
}

/* Friday = day 5 in JS; Najran workshops open 4 PM on Fridays.
   Same-day booking: slots earlier than the current hour are gone. */
function DateTimePicker() {
  const { t, lang, draft, setDraft } = useApp();
  const days = Array.from({ length: 14 }, (_, i) => isoPlus(i));
  const selDate = draft.date ?? "";
  const isFriday = selDate ? new Date(selDate + "T12:00:00").getDay() === 5 : false;
  const nowHour = new Date().getHours();

  const slotState = (iso: string, slot: string, si: number): "past" | "taken" | "free" => {
    const h = Number(slot.split(":")[0]);
    const friday = new Date(iso + "T12:00:00").getDay() === 5;
    if (friday && h < 16) return "taken";
    if (iso === isoPlus(0) && h <= nowHour) return "past";
    const di = days.indexOf(iso);
    if ((di * 3 + si * 2) % 7 === 0) return "taken"; // deterministic "already booked"
    return "free";
  };

  return (
    <div>
      <h2 className="text-[17px] font-black text-alu">{t("b.s4")}</h2>
      <div className="flex gap-2 overflow-x-auto no-sb -mx-4 px-4 mt-4 pb-1">
        {days.map((iso, i) => {
          const active = selDate === iso;
          const d = new Date(iso + "T12:00:00");
          return (
            <button key={iso} onClick={() => setDraft((dr) => ({ ...dr, date: iso, time: undefined }))}
              className={`press shrink-0 w-[58px] rounded-2xl border py-2.5 text-center ${active ? "btn-red text-white border-transparent" : "bg-white/4 border-white/8"}`}>
              <p className={`text-[9px] font-bold ${active ? "text-white/85" : "text-mute"}`}>
                {i === 0 ? t("c.today") : i === 1 ? t("c.tomorrow") : weekday(iso, lang)}
              </p>
              <p className={`text-[17px] font-black tabular-nums mt-0.5 ${active ? "text-white" : "text-alu"}`}>{digits(d.getDate(), lang)}</p>
              <p className={`text-[8px] font-bold ${active ? "text-white/85" : "text-mute"}`}>
                {fmtDate(iso, lang, { day: undefined, year: undefined, month: "short" })}
              </p>
            </button>
          );
        })}
      </div>

      {isFriday && (
        <div className="flex items-center gap-2 mt-3 rounded-xl bg-warn/10 border border-warn/25 px-3 py-2.5">
          <Icon name="info" size={14} className="text-warn shrink-0" />
          <p className="text-[10px] font-bold text-warn">{t("b.friday")}</p>
        </div>
      )}

      {selDate ? (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {TIME_SLOTS.map((slot, si) => {
            const st = slotState(selDate, slot, si);
            const active = draft.time === slot;
            return (
              <button key={slot} disabled={st !== "free"}
                onClick={() => setDraft((dr) => ({ ...dr, time: slot }))}
                className={`press rounded-xl border py-3 min-h-[48px] text-center ${active ? "btn-red text-white border-transparent" : st !== "free" ? "bg-white/3 border-white/5 opacity-40" : "bg-white/4 border-white/8"}`}>
                <span className={`text-[12px] font-extrabold tabular-nums ${active ? "text-white" : "text-alu"}`} dir="ltr">{fmtTime(slot, lang)}</span>
                {st !== "free" && <span className="block text-[7.5px] font-bold text-mute mt-0.5">{st === "past" ? t("b.slotPast") : t("b.slotTaken")}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-[11px] text-mute font-semibold text-center mt-8">{lang === "ar" ? "اختر اليوم من فوق 👆" : "Pick a day above 👆"}</p>
      )}
    </div>
  );
}
