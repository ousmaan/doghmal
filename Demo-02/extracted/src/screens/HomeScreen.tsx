import { useRef, useState } from "react";
import {
  ArrowRight, BadgePercent, CarFront, ChevronRight, Clock,
  Droplets, Gauge, Languages, MapPin, Wrench,
} from "lucide-react";
import { useLang, fmtNum } from "../i18n";
import { useNav } from "../nav";
import { ADVISORS, APPOINTMENT, BRANCHES, IMG, waLink } from "../data";
import { DoghmalMark, SectionTitle, StatusPill } from "../components";

/* ============================================================================
   HOME — the "digital majlis": greeting, quick actions, garage snapshot and
   the next appointment. Everything below is a read-only mirror of the DMS.
   ============================================================================ */

export function HomeScreen() {
  const { t, lang, toggle } = useLang();
  const nav = useNav();
  const cars = nav.garageCars;
  const aptAdvisor = ADVISORS[APPOINTMENT.advisorIdx];
  const aptBranch = BRANCHES[APPOINTMENT.branchIdx];
  const aptCar = cars[APPOINTMENT.vehicleIdx];
  // Time-aware Saudi hospitality — صباح الخير before noon, مساء after
  const timeGreet = new Date().getHours() < 12 ? t.timeMorning : t.timeEvening;

  /* ---- Pull-to-refresh (visual only): drag from top → spinner → done ---- */
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [phase, setPhase] = useState<"idle" | "refreshing" | "done">("idle");

  const onDown = (e: React.PointerEvent) => {
    if ((scrollRef.current?.scrollTop ?? 1) <= 0 && phase === "idle") startY.current = e.clientY;
  };
  const onMove = (e: React.PointerEvent) => {
    if (startY.current == null) return;
    const dy = e.clientY - startY.current;
    if (dy > 0 && (scrollRef.current?.scrollTop ?? 1) <= 0) setPull(Math.min(dy * 0.45, 84));
  };
  const onUp = () => {
    if (pull > 56) {
      setPhase("refreshing");
      setTimeout(() => setPhase("done"), 900);
      setTimeout(() => { setPhase("idle"); setPull(0); }, 1500);
    } else setPull(0);
    startY.current = null;
  };

  const quick = [
    { icon: Wrench, label: t.qBookService, act: () => nav.startBooking({ serviceType: "routine" }) },
    { icon: Droplets, label: t.qOilChange, act: () => nav.startBooking({ serviceType: "oil" }) },
    { icon: Gauge, label: t.qTestDrive, act: () => nav.startBooking({ serviceType: "testdrive" }) },
    { icon: BadgePercent, label: t.qTodayOffer, act: () => nav.pushOn("more", "offers") },
  ];

  return (
    <div
      ref={scrollRef}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
      className="overscroll-contain absolute inset-0 overflow-y-auto no-scrollbar bg-alu pb-28"
    >
      {/* Pull indicator */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex justify-center transition-opacity"
        style={{ opacity: pull > 8 || phase !== "idle" ? 1 : 0, transform: `translateY(${phase === "refreshing" || phase === "done" ? 14 : Math.max(pull - 34, -20)}px)` }}>
        <div className="grid size-9 place-items-center rounded-full bg-charcoal shadow-pop">
          {phase === "done"
            ? <span className="text-[10px] font-black text-emerald-400">✓</span>
            : <div className="ring-spinner" style={{ animationPlayState: phase === "refreshing" ? "running" : "paused", transform: `rotate(${pull * 4}deg)` }} />}
        </div>
      </div>

      {/* ============ CHARCOAL HERO HEADER ============ */}
      <header className="carbon relative overflow-hidden rounded-b-[30px] px-4 pt-10 pb-5 text-white">
        {/* red swoosh accent */}
        <div className="pointer-events-none absolute -top-16 -end-10 size-52 rotate-[24deg] rounded-full bg-toyota/25 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 -start-8 size-40 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center gap-3 rise">
          <DoghmalMark dark size={40} />
          <div className="min-w-0 flex-1 text-start">
            <h1 className="text-[19px] font-black leading-tight">{t.greeting}</h1>
            <p className="text-[11px] font-medium text-white/60">{timeGreet}</p>
          </div>
          {/* Language toggle — instant AR↔EN flip, layout mirrors automatically */}
          <button onClick={toggle} aria-label="language"
            className="press flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
            <Languages className="size-4" />
            <span className="text-[11px] font-extrabold">{lang === "ar" ? "EN" : "عربي"}</span>
          </button>
        </div>

        {/* profile chip + active job status */}
        <div className="relative mt-4 flex items-center gap-2 rise rise-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/12 px-3 py-1.5 text-[11px] font-bold text-white/90">
            <span className="size-1.5 rounded-full bg-toyota" />
            {t.valuedCustomer}
          </span>
          {aptCar.status && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-300/25 px-3 py-1.5 text-[11px] font-bold text-amber-200">
              <span className="size-1.5 rounded-full bg-amber-400 pulse-dot" />
              {lang === "ar" ? aptCar.nickAr : aptCar.nickEn} · {t.inService}
            </span>
          )}
        </div>
      </header>

      {/* ============ QUICK ACTIONS ============ */}
      <section className="mt-5 px-4 rise rise-1">
        <SectionTitle>{t.quickTitle}</SectionTitle>
        <div className="snapx mt-3 flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {quick.map((q) => (
            <button key={q.label} onClick={q.act}
              className="press flex w-[96px] shrink-0 flex-col items-center gap-2.5 rounded-[22px] bg-white p-3 shadow-card">
              <span className="grid size-11 place-items-center rounded-2xl bg-toyota/8 text-toyota">
                <q.icon className="size-5" strokeWidth={2.2} />
              </span>
              <span className="text-[11.5px] font-extrabold text-charcoal leading-tight text-center">{q.label}</span>
            </button>
          ))}
          {/* spacer so last card clears the edge */}
          <span className="w-1 shrink-0" />
        </div>
      </section>

      {/* ============ MY VEHICLES CAROUSEL ============ */}
      <section className="mt-6 rise rise-2">
        <SectionTitle className="px-4" action={
          <button onClick={() => nav.setTab("garage")} className="press flex items-center gap-0.5 text-[11.5px] font-extrabold text-toyota">
            {t.viewAll} <ChevronRight className="size-3.5 rtl-mirror" />
          </button>
        }>{t.myVehicles}</SectionTitle>

        <div className="snapx mt-3 flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {cars.map((car) => (
            <button key={car.id} onClick={() => nav.pushOn("garage", "car", { id: car.id })}
              className="press w-[248px] shrink-0 overflow-hidden rounded-[24px] bg-white text-start shadow-card">
              <div className="relative h-[104px]">
                <img src={car.img} alt={car.modelEn} className="size-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent" />
                {car.status && <StatusPill kind={car.status} className="absolute top-2 start-2 !bg-white/90" />}
                <span className="absolute bottom-2 end-2 rounded-full bg-charcoal/70 px-2 py-0.5 text-[9.5px] font-bold text-white backdrop-blur">
                  {car.plate}
                </span>
              </div>
              <div className="p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13.5px] font-extrabold text-charcoal">{lang === "ar" ? car.nickAr : car.nickEn}</p>
                  <p className="text-[10.5px] font-bold text-steel/60">{car.year}</p>
                </div>
                <p className="text-[10.5px] font-semibold text-steel/60">{t.vin} •••{car.vin.slice(-6)}</p>
                <div className="hairline my-2" />
                <div className="flex items-center justify-between text-[10.5px] font-bold">
                  <span className="text-steel/60">{t.lastService}: {lang === "ar" ? car.lastServiceAr.split("—")[0] : car.lastServiceEn.split("—")[0]}</span>
                  <span className="text-toyota">{t.nextServiceAt} {fmtNum(car.nextKm)} {t.km}</span>
                </div>
              </div>
            </button>
          ))}
          {/* add-vehicle tile → straight into the VIN form */}
          <button onClick={() => nav.pushOn("garage", "addcar")}
            className="press grid w-[104px] shrink-0 place-items-center rounded-[24px] border-2 border-dashed border-steel/25 bg-white/50">
            <span className="flex flex-col items-center gap-1.5 text-steel/60">
              <CarFront className="size-6" />
              <span className="text-[10.5px] font-extrabold leading-tight text-center px-2">{t.addVehicle}</span>
            </span>
          </button>
        </div>
      </section>

      {/* ============ UPCOMING APPOINTMENT ============ */}
      <section className="mt-6 px-4 rise rise-3">
        <SectionTitle>{t.upcomingTitle}</SectionTitle>
        <div className="relative mt-3 overflow-hidden rounded-[24px] bg-white p-4 shadow-card">
          <div className="absolute inset-y-0 end-0 w-1.5 bg-toyota" />
          <div className="flex items-start gap-3.5">
            {/* calendar tile */}
            <div className="grid w-[58px] shrink-0 place-items-center rounded-2xl bg-charcoal px-2 py-2.5 text-white">
              <span className="text-[9.5px] font-bold text-white/60">{lang === "ar" ? APPOINTMENT.dayAr : APPOINTMENT.dayEn}</span>
              <span className="text-[15px] font-black leading-tight tabular">{lang === "ar" ? APPOINTMENT.dateAr : APPOINTMENT.dateEn}</span>
            </div>
            <div className="min-w-0 flex-1 text-start">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13.5px] font-extrabold text-charcoal">{lang === "ar" ? APPOINTMENT.serviceAr : APPOINTMENT.serviceEn}</p>
                <StatusPill kind={APPOINTMENT.status} />
              </div>
              <p className="mt-0.5 text-[11.5px] font-semibold text-steel/70">{lang === "ar" ? aptCar.nickAr : aptCar.nickEn} · {aptCar.plate}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-steel/70">
                <span className="inline-flex items-center gap-1"><Clock className="size-3.5 text-toyota" />{lang === "ar" ? APPOINTMENT.timeAr : APPOINTMENT.timeEn}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5 text-toyota" />{lang === "ar" ? aptBranch.nameAr : aptBranch.nameEn}</span>
              </div>
            </div>
          </div>

          <div className="hairline my-3" />

          {/* advisor row — the human face of the booking; tap → in-app chat */}
          <div className="flex items-center gap-3">
            <button onClick={() => nav.push("chat", { id: aptAdvisor.id })} aria-label={t.chatTitle}
              className="press flex min-w-0 flex-1 items-center gap-3 text-start">
              <img src={aptAdvisor.photo} alt={aptAdvisor.nameEn} className="size-11 rounded-xl object-cover bg-alu-deep" loading="lazy" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-extrabold text-charcoal">{lang === "ar" ? aptAdvisor.nameAr : aptAdvisor.nameEn}</span>
                <span className="block text-[10px] font-bold text-emerald-600">{t.repliesIn}</span>
              </span>
            </button>
            <a
              href={waLink(aptAdvisor.wa, lang === "ar" ? `السلام عليكم ${aptAdvisor.nameAr}، بخصوص موعدي ${APPOINTMENT.dayAr}` : `Hi ${aptAdvisor.nameEn}, about my ${APPOINTMENT.dayEn} appointment`)}
              target="_blank" rel="noreferrer"
              className="press inline-flex items-center gap-1.5 rounded-full bg-wa px-3.5 py-2 text-[11px] font-extrabold text-white shadow-card">
              <svg viewBox="0 0 24 24" className="size-3.5 fill-current"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1c0 1.3.9 2.5 1 2.6s1.9 3 4.7 4.1c1.7.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.2-.2-.2-.6-.4Z"/></svg>
              {lang === "ar" ? "واتساب" : "WhatsApp"}
            </a>
          </div>
        </div>
      </section>

      {/* ============ CAMPAIGN BANNER ============ */}
      <section className="mt-6 px-4 rise rise-4">
        <button onClick={() => nav.pushOn("more", "offers")}
          className="press relative block h-[128px] w-full overflow-hidden rounded-[24px] text-start shadow-card">
          <img src={IMG.lcDesert} alt="campaign" className="absolute inset-0 size-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/45 to-transparent rtl:bg-gradient-to-l" />
          <div className="relative flex h-full flex-col justify-center gap-1.5 p-4">
            <span className="w-fit rounded-full bg-toyota px-2.5 py-1 text-[9.5px] font-black text-white">{t.bannerTag}</span>
            <p className="max-w-[220px] text-[15px] font-black leading-snug text-white">{t.bannerTitle}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold text-white/85">
              {t.bannerCta} <ArrowRight className="size-3.5 rtl-mirror" />
            </span>
          </div>
        </button>
      </section>
    </div>
  );
}
