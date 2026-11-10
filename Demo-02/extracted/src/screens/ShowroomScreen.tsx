import { useMemo, useState } from "react";
import {
  BadgeCheck, CalendarCheck2, CarFront, ChevronRight, Cog, Fuel, Gauge,
  MapPin, MessageCircle, Users, Wallet, Zap,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useLang, fmtNum } from "../i18n";
import { useNav } from "../nav";
import { branchOf, carOf, SHOWROOM, waLink, type Brand, type Condition } from "../data";
import { Chip, EmptyState, PrimaryCta, SectionTitle, SubHeader } from "../components";

/* ============================================================================
   SHOWROOM — live mirror of the DMS stock table. New/Pre-owned toggle, brand
   chips, and per-car test-drive deep links into the booking wizard.
   ============================================================================ */

type BrandFilter = Brand | "all";

export function ShowroomScreen() {
  const { t, lang } = useLang();
  const nav = useNav();
  const [cond, setCond] = useState<Condition>("new");
  const [brand, setBrand] = useState<BrandFilter>("all");

  const list = useMemo(
    () => SHOWROOM.filter((c) => c.cond === cond && (brand === "all" || c.brand === brand)),
    [cond, brand],
  );

  const brandChips: { id: BrandFilter; label: string }[] = [
    { id: "all", label: t.all },
    { id: "toyota", label: t.brandToyota },
    { id: "jetour", label: t.brandJetour },
    { id: "haval", label: t.brandHaval },
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar bg-alu pb-28">
      {/* Header */}
      <header className="carbon relative overflow-hidden rounded-b-[30px] px-4 pt-10 pb-6 text-white">
        <div className="pointer-events-none absolute -top-14 -start-8 size-44 rounded-full bg-toyota/25 blur-2xl" />
        <div className="flex items-end justify-between">
          <div className="text-start">
            <h1 className="text-[21px] font-black leading-tight rise">{t.showroom}</h1>
            <p className="text-[11px] font-medium text-white/55 rise rise-1">{t.showroomSub}</p>
          </div>
          <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[10.5px] font-bold text-white/80 rise tabular">
            {list.length} {t.results}
          </span>
        </div>

        {/* New | Pre-owned segmented toggle */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1 backdrop-blur rise rise-1">
          {(["new", "used"] as Condition[]).map((c2) => (
            <button key={c2} onClick={() => setCond(c2)}
              className={cn("press rounded-full py-2 text-[12.5px] font-extrabold transition-all",
                cond === c2 ? "bg-white text-charcoal shadow-card" : "text-white/65")}>
              {c2 === "new" ? t.newCond : t.usedCond}
            </button>
          ))}
        </div>
      </header>

      {/* Brand filter chips */}
      <div className="snapx sticky top-0 z-10 mt-0 flex gap-2 overflow-x-auto bg-alu/90 px-4 py-3 no-scrollbar backdrop-blur-lg">
        {brandChips.map((b) => (
          <Chip key={b.id} active={brand === b.id} onClick={() => setBrand(b.id)}>{b.label}</Chip>
        ))}
      </div>

      {/* Inventory */}
      {list.length === 0 ? (
        <EmptyState title={lang === "ar" ? "ما فيه سيارات هنا" : "No cars here"} desc={lang === "ar" ? "جرب فلتر ثاني أو كلمنا ندور لك" : "Try another filter or ask us to source one"} />
      ) : (
        <div className="flex flex-col gap-3.5 px-4">
          {list.map((car, i) => {
            const br = branchOf(car.branchId);
            return (
              <article key={car.id} onClick={() => nav.push("vehicle", { id: car.id })}
                className={cn("press-soft cursor-pointer overflow-hidden rounded-[24px] bg-white shadow-card", i === 0 ? "rise rise-1" : i === 1 ? "rise rise-2" : "rise rise-3")}>
                <div className="relative h-[158px]">
                  <img src={car.images[0]} alt={car.nameEn} className="size-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent" />
                  {/* condition + brand + year badges */}
                  <div className="absolute top-2.5 start-2.5 flex flex-wrap gap-1.5">
                    <span className={cn("rounded-full px-2.5 py-1 text-[9.5px] font-black backdrop-blur",
                      car.cond === "new" ? "bg-white/92 text-charcoal" : "bg-amber-400/95 text-charcoal")}>
                      {car.cond === "new" ? t.newCond : t.usedCond}
                    </span>
                    <span className={cn("rounded-full px-2.5 py-1 text-[9.5px] font-black text-white",
                      car.brand === "toyota" ? "bg-toyota" : "bg-charcoal/85 backdrop-blur")}>
                      {car.brand === "toyota" ? t.brandToyota : car.brand === "jetour" ? t.brandJetour : t.brandHaval}
                    </span>
                    <span className="rounded-full bg-charcoal/80 px-2.5 py-1 text-[9.5px] font-bold text-white backdrop-blur tabular">{car.year}</span>
                  </div>
                  {car.km != null && (
                    <span className="absolute top-2.5 end-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[9.5px] font-extrabold text-charcoal tabular">
                      {fmtNum(car.km)} {t.km}
                    </span>
                  )}
                  <p className="absolute bottom-2.5 start-3 text-[16px] font-black text-white drop-shadow">
                    {lang === "ar" ? car.nameAr : car.nameEn}
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3.5">
                  <div className="min-w-0 flex-1 text-start">
                    <p className="text-[16px] font-black text-charcoal tabular">
                      {fmtNum(car.price)} <span className="text-[10.5px] font-bold text-steel/60">{t.sar}</span>
                    </p>
                    {/* spec line: gearbox + engine + mileage — the Saudi buyer's first three questions */}
                    <p className="mt-0.5 truncate text-[10px] font-bold text-steel/55">
                      {lang === "ar" ? car.specs.gearAr : car.specs.gearEn} · {car.specs.engine}
                      {car.km != null && ` · ${fmtNum(car.km)} ${t.km}`}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold text-steel/60">
                      <MapPin className="size-3 text-toyota" />
                      {t.availableAt} {lang === "ar" ? br.nameAr : br.nameEn}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); nav.startBooking({ serviceType: "testdrive", vehicleLabel: lang === "ar" ? car.nameAr : car.nameEn }); }}
                    className="press inline-flex shrink-0 items-center gap-1.5 rounded-full bg-charcoal px-3.5 py-2.5 text-[10.5px] font-extrabold text-white">
                    <CalendarCheck2 className="size-3.5 text-toyota" />
                    {t.bookTestDrive}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   VEHICLE DETAIL — pushed screen. Gallery, full specs, VIN, plate status,
   financing calculator CTA and WhatsApp lead capture.
   ============================================================================ */

export function VehicleDetailScreen({ id }: { id: string }) {
  const { t, lang } = useLang();
  const nav = useNav();
  const car = carOf(id);
  const br = branchOf(car.branchId);
  const [img, setImg] = useState(0);
  const monthly = Math.round((car.price * 1.08) / 60); // mock flat-rate 60-mo estimate

  const specItems = [
    { icon: Fuel, label: t.engine, value: car.specs.engine },
    { icon: Zap, label: t.power, value: `${car.specs.hp} ${t.hp}` },
    { icon: Cog, label: t.transmission, value: lang === "ar" ? car.specs.gearAr : car.specs.gearEn },
    { icon: Gauge, label: t.drivetrain, value: lang === "ar" ? car.specs.driveAr : car.specs.driveEn },
    { icon: Users, label: t.seats, value: `${car.specs.seats}` },
    { icon: CarFront, label: t.year, value: `${car.year}` },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader
        title={lang === "ar" ? car.nameAr : car.nameEn}
        sub={`${lang === "ar" ? br.nameAr : br.nameEn} · ${t.plateStatus}: ${car.platesReady ? t.platesReady : t.platesProcessing}`}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Gallery */}
        <div className="relative m-4 mb-0 overflow-hidden rounded-[26px] shadow-card">
          <div className="relative h-[218px] bg-charcoal">
            {car.images.map((src, i) => (
              <img key={src} src={src} alt="" loading="lazy"
                className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", i === img ? "opacity-100" : "opacity-0")} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-charcoal/10" />
            <span className="absolute start-3 top-3 rounded-full bg-charcoal/75 px-2.5 py-1 text-[9.5px] font-bold text-white backdrop-blur tabular">
              {img + 1} / {car.images.length}
            </span>
            {car.platesReady
              ? <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[9.5px] font-black text-white"><BadgeCheck className="size-3" />{t.platesReady}</span>
              : <span className="absolute end-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[9.5px] font-black text-white">{t.platesProcessing}</span>}
          </div>
          <div className="flex gap-2 bg-white p-2.5">
            {car.images.map((src, i) => (
              <button key={src} onClick={() => setImg(i)}
                className={cn("press h-14 flex-1 overflow-hidden rounded-xl transition-all", i === img ? "ring-2 ring-toyota" : "opacity-60")}>
                <img src={src} alt="" className="size-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Price + identity */}
        <div className="mx-4 mt-3 rounded-[24px] bg-white p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="text-start">
              <p className="text-[18px] font-black text-charcoal">{lang === "ar" ? car.nameAr : car.nameEn}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-steel/60">{t.vin} <span className="tabular">{car.vin}</span></p>
            </div>
            <div className="text-end">
              <p className="text-[18px] font-black text-toyota tabular">{fmtNum(car.price)}</p>
              <p className="text-[10px] font-bold text-steel/60">{t.sar} · {lang === "ar" ? "شامل الضريبة" : "VAT incl."}</p>
            </div>
          </div>
          <div className="hairline my-3" />
          <div className="flex items-center gap-2 text-[11px] font-bold text-steel/70">
            <MapPin className="size-3.5 text-toyota" />
            {t.availableAt} {lang === "ar" ? br.nameAr : br.nameEn}
            <span className="ms-auto flex items-center gap-1 text-emerald-600">
              <BadgeCheck className="size-3.5" /> {lang === "ar" ? "فحص الوكالة" : "Agency inspected"}
            </span>
          </div>
        </div>

        {/* Specs */}
        <section className="mx-4 mt-4">
          <SectionTitle>{t.specs}</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {specItems.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 rounded-[18px] bg-white p-3 shadow-card">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-charcoal text-white">
                  <s.icon className="size-4" />
                </span>
                <div className="min-w-0 text-start">
                  <p className="text-[9.5px] font-bold text-steel/55">{s.label}</p>
                  <p className="truncate text-[11.5px] font-extrabold text-charcoal">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Financing teaser — mock of the financing partner inbox */}
        <section className="mx-4 mt-4 overflow-hidden rounded-[24px] carbon p-4 text-white shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-toyota shadow-red">
              <Wallet className="size-5" />
            </span>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-[13.5px] font-extrabold">{t.financeTitle}</p>
              <p className="text-[11px] font-medium text-white/60">
                {t.financeFrom} <span className="font-black text-white tabular">{fmtNum(monthly)} {t.sar}{t.perMonth}</span>
              </p>
            </div>
            <button className="press rounded-full bg-white px-3.5 py-2 text-[10.5px] font-extrabold text-charcoal">{t.financeCta}</button>
          </div>
        </section>

        {/* WhatsApp lead capture */}
        <section className="mx-4 mt-3 rounded-[24px] border border-wa/25 bg-wa/8 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-wa text-white">
              <MessageCircle className="size-5" />
            </span>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-[12.5px] font-extrabold text-charcoal">{t.whatsappLead}</p>
              <p className="text-[10.5px] font-semibold text-steel/60">{t.repliesIn}</p>
            </div>
            <a target="_blank" rel="noreferrer"
              href={waLink("966551112233", lang === "ar" ? `السلام عليكم، أبي أسأل عن ${car.nameAr} موديل ${car.year} — رقم الهيكل ${car.vin}` : `Hi! Asking about the ${car.year} ${car.nameEn} — VIN ${car.vin}`)}
              className="press rounded-full bg-wa px-3.5 py-2 text-[10.5px] font-extrabold text-white shadow-card">
              {lang === "ar" ? "واتساب" : "WhatsApp"}
            </a>
          </div>
        </section>
      </div>

      {/* Sticky CTA */}
      <div className="border-t border-black/5 bg-white/90 p-4 backdrop-blur-xl">
        <PrimaryCta onClick={() => nav.startBooking({ serviceType: "testdrive", vehicleLabel: lang === "ar" ? car.nameAr : car.nameEn })}>
          <span className="inline-flex items-center gap-2">
            {t.bookTestDrive} <ChevronRight className="size-4 rtl-mirror" />
          </span>
        </PrimaryCta>
      </div>
    </div>
  );
}
