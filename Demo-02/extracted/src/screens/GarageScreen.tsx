import { CalendarCheck2, ChevronRight, Gauge, History, Plus, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { cn } from "../utils/cn";
import { useLang, fmtNum } from "../i18n";
import { useNav } from "../nav";
import { BRANCHES } from "../data";
import { PrimaryCta, SectionTitle, StatusPill, SubHeader } from "../components";

/* ============================================================================
   MY CARS — digital garage. Read-only mirror of each vehicle's DMS record:
   warranty entitlements, odometer-based maintenance milestones, recall feed,
   and the full workshop history across all 6 Doghmal branches.
   ============================================================================ */

export function GarageScreen() {
  const { t, lang } = useLang();
  const nav = useNav();
  const cars = nav.garageCars;

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar bg-alu pb-28">
      <header className="carbon relative overflow-hidden rounded-b-[30px] px-4 pt-10 pb-6 text-white">
        <div className="pointer-events-none absolute -top-12 -end-8 size-44 rounded-full bg-toyota/25 blur-2xl" />
        <div className="flex items-end justify-between">
          <div className="text-start">
            <h1 className="text-[21px] font-black rise">{t.myCars}</h1>
            <p className="text-[11px] font-medium text-white/55 rise rise-1">{t.myCarsSub}</p>
          </div>
          <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[10.5px] font-bold rise tabular">
            {cars.length} {lang === "ar" ? "سيارات" : "cars"}
          </span>
        </div>
      </header>

      <div className="mt-4 flex flex-col gap-3.5 px-4">
        {/* Add vehicle CTA — pushes the VIN-validated registration form */}
        <button onClick={() => nav.push("addcar")}
          className="press flex items-center gap-3 rounded-[24px] border-2 border-dashed border-steel/30 bg-white/60 p-4 text-start rise">
          <span className="grid size-11 place-items-center rounded-2xl bg-toyota text-white shadow-red"><Plus className="size-5" strokeWidth={2.6} /></span>
          <span>
            <span className="block text-[13.5px] font-extrabold text-charcoal">{t.addVehicle}</span>
            <span className="block text-[10.5px] font-semibold text-steel/60">{t.addVehicleSub}</span>
          </span>
          <ChevronRight className="size-4 ms-auto text-steel/40 rtl-mirror" />
        </button>

        {cars.map((car, i) => {
          const toNext = car.nextKm - car.odo;
          const urgent = toNext < 2000;
          return (
            <button key={car.id} onClick={() => nav.push("car", { id: car.id })}
              className={cn("press-soft relative flex items-center gap-3 overflow-hidden rounded-[24px] bg-white p-3 text-start shadow-card",
                i === 0 ? "rise rise-1" : i === 1 ? "rise rise-2" : "rise rise-3")}>
              <div className="relative size-[86px] shrink-0 overflow-hidden rounded-2xl">
                <img src={car.img} alt={car.modelEn} className="size-full object-cover" loading="lazy" />
                {car.status && <StatusPill kind={car.status} className="absolute bottom-1 start-1 !px-1.5 !py-0.5 !text-[8px] !bg-white/90" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[14px] font-extrabold text-charcoal">{lang === "ar" ? car.nickAr : car.nickEn}</p>
                  <span className="shrink-0 rounded-full bg-charcoal px-2 py-0.5 text-[9px] font-bold text-white tabular">{car.plate}</span>
                </div>
                <p className="text-[10.5px] font-semibold text-steel/60">{lang === "ar" ? car.modelAr : car.modelEn} · {car.year}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] font-bold">
                  <span className="inline-flex items-center gap-1 text-steel/60">
                    <Gauge className="size-3 text-toyota" />{fmtNum(car.odo)} {t.km}
                  </span>
                  <span className={cn("inline-flex items-center gap-1", (car.agentYearsLeft ?? 0) > 0 ? "text-emerald-600" : "text-steel/45")}>
                    <ShieldCheck className="size-3" />
                    {(car.agentYearsLeft ?? 0) > 0 ? `${t.warranty} ${t.active}` : t.expired}
                  </span>
                </div>
                {/* remaining-to-service micro bar */}
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-alu-deep">
                  <div className={cn("h-full rounded-full", urgent ? "bg-toyota" : "bg-charcoal")}
                    style={{ width: `${Math.min((car.odo / car.nextKm) * 100, 100)}%` }} />
                </div>
                <p className="mt-1 text-[9px] font-bold text-steel/55">{t.nextServiceAt} {fmtNum(car.nextKm)} {t.km}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-steel/35 rtl-mirror" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   CAR DETAIL (pushed) — warranty cards, mileage milestone, recall status,
   and the service-history timeline.
   ============================================================================ */

export function CarDetailScreen({ id }: { id: string }) {
  const { t, lang } = useLang();
  const nav = useNav();
  const car = nav.findCar(id)!;
  const pct = Math.min((car.odo / car.nextKm) * 100, 100);
  const remaining = car.nextKm - car.odo;

  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader title={lang === "ar" ? car.nickAr : car.nickEn} sub={`${lang === "ar" ? car.modelAr : car.modelEn} · ${car.year}`} />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Hero card */}
        <div className="relative m-4 mb-0 overflow-hidden rounded-[26px] shadow-card">
          <div className="relative h-[176px]">
            <img src={car.img} alt={car.modelEn} className="size-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10" />
            {car.status && <StatusPill kind={car.status} className="absolute top-3 start-3 !bg-white/90" />}
            <div className="absolute bottom-3 start-4 end-4 flex items-end justify-between">
              <div className="text-start text-white">
                <p className="text-[17px] font-black">{lang === "ar" ? car.nickAr : car.nickEn}</p>
                <p className="text-[10.5px] font-semibold text-white/70">{lang === "ar" ? car.modelAr : car.modelEn} · {car.year}</p>
              </div>
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-charcoal tabular">{car.plate}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-black/5 rtl:divide-x-reverse bg-white py-3 text-center">
            {[
              { k: t.odometer, v: `${fmtNum(car.odo)}` },
              { k: t.vin, v: `•••${car.vin.slice(-6)}` },
              { k: t.lastService, v: (lang === "ar" ? car.lastServiceAr : car.lastServiceEn).split("—")[0] },
            ].map((s) => (
              <div key={s.k} className="px-1">
                <p className="text-[9px] font-bold text-steel/55">{s.k}</p>
                <p className="mt-0.5 truncate text-[12px] font-extrabold text-charcoal tabular">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next service milestone */}
        <section className="mx-4 mt-4 rounded-[24px] bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold text-charcoal">
              <Sparkles className="size-4 text-toyota" />{t.nextMilestone}
            </p>
            <p className="text-[11px] font-black text-toyota tabular">{fmtNum(car.nextKm)} {t.km}</p>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-alu-deep">
            <div className="relative h-full rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-charcoal to-toyota transition-all"
              style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-bold text-steel/55 tabular">
            <span>{fmtNum(car.odo)} {t.km}</span>
            <span className="text-toyota">{t.remaining} {fmtNum(remaining)} {t.km}</span>
          </div>
          {/* "next service recommended" badge with price — the wrapper prices it early */}
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-toyota/6 px-3 py-2">
            <span className="text-[10.5px] font-extrabold text-charcoal/75">{t.estCost}</span>
            <span className="text-[12.5px] font-black text-toyota tabular">{fmtNum(car.nextCost)} {t.sar}</span>
          </div>
        </section>

        {/* Warranty cards */}
        <section className="mx-4 mt-4">
          <SectionTitle>{t.warranty}</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <WarrantyCard icon={<ShieldCheck className="size-4" />} title={t.agentWarranty} desc={t.agentWarrantyD} yearsLeft={car.agentYearsLeft} unit={`${t.yr}`} tail={t.yearsLeft} />
            <WarrantyCard icon={<Wallet className="size-4" />} title={t.paintWarranty} desc={t.paintWarrantyD} yearsLeft={car.paintYearsLeft} unit={t.yr} tail={t.yearsLeft} />
          </div>
        </section>

        {/* Recall status — green, reassuring, Saudi phrasing */}
        <section className="mx-4 mt-4">
          <div className="flex items-center gap-3 rounded-[20px] border border-emerald-500/25 bg-emerald-500/8 p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white"><ShieldCheck className="size-5" /></span>
            <div className="text-start">
              <p className="text-[12.5px] font-extrabold text-emerald-800">{t.recallTitle}: {t.recallNone}</p>
              <p className="text-[10px] font-semibold text-emerald-700/70">{t.recallNoneD}</p>
            </div>
          </div>
        </section>

        {/* Service history timeline */}
        <section className="mx-4 mt-5">
          <SectionTitle action={<span className="flex items-center gap-1 text-[10px] font-bold text-steel/50"><History className="size-3" />{t.historySub}</span>}>
            {t.historyTitle}
          </SectionTitle>
          {car.history.length === 0 ? (
            <div className="mt-3 rounded-[20px] border border-dashed border-steel/25 bg-white/60 p-4 text-center">
              <p className="text-[11.5px] font-extrabold text-charcoal">{lang === "ar" ? "لسه ما عندها زيارات" : "No visits yet"}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-steel/60">{lang === "ar" ? "أول صيانة لك عند دغمل بتظهر هنا" : "Your first Doghmal service will appear here"}</p>
            </div>
          ) : (
          <div className="relative mt-3 ms-2 flex flex-col gap-0 border-s-2 border-dashed border-steel/25 ps-4">
            {car.history.map((h, i) => {
              const br = BRANCHES[h.branchIdx];
              return (
                <div key={h.id} className="relative pb-4 last:pb-0">
                  <span className={cn("absolute -start-[23px] top-3 size-3 rounded-full border-[2.5px] border-alu",
                    i === 0 ? "bg-toyota" : "bg-steel/40")} />
                  <div className="rounded-[18px] bg-white p-3 shadow-card text-start">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] font-extrabold text-charcoal">{lang === "ar" ? h.typeAr : h.typeEn}</p>
                      <span className="shrink-0 text-[10px] font-black text-toyota tabular">
                        {h.cost > 0 ? `${fmtNum(h.cost)} ${t.sar}` : (lang === "ar" ? "جارٍ" : "open")}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] font-semibold text-steel/60">
                      {lang === "ar" ? h.dateAr : h.dateEn} · {lang === "ar" ? br.nameAr : br.nameEn} · {fmtNum(h.km)} {t.km}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </section>
      </div>

      {/* Sticky CTA — pre-fills the booking wizard for this exact vehicle */}
      <div className="border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl">
        <PrimaryCta onClick={() => nav.startBooking({ serviceType: "routine", vehicleLabel: `${lang === "ar" ? car.nickAr : car.nickEn} · ${car.plate}` })}>
          <span className="inline-flex items-center gap-2"><CalendarCheck2 className="size-4" />{t.bookForThis}</span>
        </PrimaryCta>
      </div>
    </div>
  );
}

function WarrantyCard({ icon, title, desc, yearsLeft, unit, tail }: {
  icon: React.ReactNode; title: string; desc: string; yearsLeft: number; unit: string; tail: string;
}) {
  const { t } = useLang();
  const active = yearsLeft > 0;
  return (
    <div className={cn("rounded-[20px] p-3.5 text-start shadow-card", active ? "bg-white" : "bg-white/60")}>
      <span className={cn("grid size-9 place-items-center rounded-xl text-white", active ? "bg-charcoal" : "bg-steel/40")}>{icon}</span>
      <p className="mt-2 text-[11.5px] font-extrabold text-charcoal leading-tight">{title}</p>
      <p className="mt-0.5 text-[9.5px] font-semibold text-steel/55 leading-snug">{desc}</p>
      <span className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-black",
        active ? "bg-emerald-500/12 text-emerald-700" : "bg-steel/10 text-steel/50")}>
        {active ? `${tail} ${yearsLeft} ${unit}` : t.expired}
      </span>
    </div>
  );
}
