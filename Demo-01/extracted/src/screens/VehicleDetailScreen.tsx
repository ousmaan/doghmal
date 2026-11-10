import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useApp } from "../lib/store";
import { digits, fill, money } from "../lib/i18n";
import { SHOWROOM } from "../lib/data";
import { Icon } from "../components/icons";
import { BrandBadge, Money, ScreenHeader, WaButton, branchById } from "../components/ui";

/* Financing: flat-rate approximation, clearly labelled تقديري.
   Lead capture hands off to WhatsApp — the Tier 1 way: the app
   never pretends to approve credit, a human takes it from here. */
export default function VehicleDetailScreen({ id }: { id: string }) {
  const { t, L, lang, pop, startBooking, toast } = useApp();
  const car = SHOWROOM.find((c) => c.id === id) ?? SHOWROOM[0];
  const [slide, setSlide] = useState(0);
  const [downPct, setDownPct] = useState(20);
  const [term, setTerm] = useState(48);
  const galleryRef = useRef<HTMLDivElement>(null);

  const down = Math.round((car.price * downPct) / 100);
  const years = term / 12;
  const monthly = Math.round(((car.price - down) * (1 + 0.035 * years)) / term);
  const branch = branchById(car.branchId);

  const copyVin = async () => {
    try { await navigator.clipboard.writeText(car.vin); } catch { /* clipboard unavailable */ }
    toast(t("c.copied"));
  };

  const specs = [
    { icon: "engine", label: t("v.engine"), val: L(car.specs.engine) },
    { icon: "zap", label: t("v.power"), val: `${digits(car.specs.power, lang)} ${t("v.hp")}` },
    { icon: "gear", label: t("v.trans"), val: L(car.specs.trans) },
    { icon: "steering", label: t("v.drive"), val: L(car.specs.drive) },
    { icon: "users", label: t("v.seats"), val: digits(car.specs.seats, lang) },
    { icon: "fuel", label: t("v.fuel"), val: `${digits(car.specs.fuel, lang)} ${t("v.kml")}` },
    { icon: "drop", label: t("v.color"), val: L(car.specs.color) },
    { icon: "gauge", label: t("v.kmDriven"), val: `${money(car.km ?? 0, lang)} ${t("c.km")}` },
  ];

  /* WhatsApp payloads keep Latin digits — advisor systems parse them */
  const leadMsg = fill(t("v.leadMsg"), { car: L(car.model), year: car.year, price: money(car.price) });
  const finMsg = fill(t("v.finMsg"), { car: L(car.model), year: car.year, down: money(down), term });

  const goSlide = (i: number) => {
    const el = galleryRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const idx = Math.max(0, Math.min(car.gallery.length - 1, i));
    el.scrollTo({ left: lang === "ar" ? -(idx * w) : idx * w, behavior: "smooth" });
  };

  return (
    <div className="h-full overflow-y-auto pb-8 bg-ink">
      <ScreenHeader title={L(car.model)} sub={`${digits(car.year, lang)} · ${car.condition === "new" ? t("s.new") : t("s.used")}`} onBack={pop} />

      {/* gallery */}
      <div className="relative">
        <div ref={galleryRef} className="flex overflow-x-auto no-sb snap-x snap-mandatory"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
            setSlide(i);
          }}>
          {car.gallery.map((g, i) => (
            <img key={i} src={g} alt={`${L(car.model)} ${i + 1}`} className="w-full h-56 object-cover shrink-0 snap-center" loading={i === 0 ? "eager" : "lazy"} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-3 start-3"><BrandBadge brand={car.brand} /></span>
        <span className="absolute top-3 end-3 bg-black/60 backdrop-blur text-alu text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/15" dir="ltr">
          {digits(slide + 1, lang)} / {digits(car.gallery.length, lang)}
        </span>
        <div className="absolute bottom-1 inset-x-0 flex justify-center">
          {car.gallery.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} aria-label={`photo ${i + 1}`}
              className="press h-11 w-7 flex items-center justify-center">
              <span className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-red" : "w-1.5 bg-white/40"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-1 relative stagger">
        {/* price block */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[19px] font-black text-alu leading-tight">{L(car.model)}</h2>
              {car.certified && (
                <span className="bg-ok/12 text-ok border border-ok/25 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Icon name="shield" size={10} /> {t("s.certified")}
                </span>
              )}
            </div>
            <p className="text-[11px] text-mute font-semibold mt-1 flex items-center gap-1">
              <Icon name="pin" size={12} className="text-redhi" /> {t("v.at")} {L(branch.name)}
            </p>
          </div>
          <div className="text-end">
            {car.condition === "new" && <p className="text-[9px] font-bold text-mute">{t("c.from")}</p>}
            <Money n={car.price} className="text-[22px] font-black metal-text" />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2 mt-4">
          <button onClick={() => startBooking({ serviceId: "test", vehicleId: car.id, vehicleLabel: { ar: `${car.model.ar} ${car.year}`, en: `${car.model.en} ${car.year}` }, branchId: car.branchId })}
            className="press flex-1 btn-red text-white text-[13px] font-bold rounded-2xl py-3.5 min-h-[48px] flex items-center justify-center gap-2">
            <Icon name="steering" size={17} /> {t("s.testDrive")}
          </button>
          <WaButton phone={branch.phone} text={leadMsg} label={t("v.waSales")} />
        </div>

        {/* full specs */}
        <div className="mt-5">
          <h3 className="text-[14px] font-extrabold text-alu mb-3">{t("v.specs")}</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {specs.map((s) => (
              <div key={s.label} className="card-sheen border border-white/8 rounded-2xl p-3 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-redhi shrink-0">
                  <Icon name={s.icon} size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[8.5px] font-bold text-mute">{s.label}</p>
                  <p className="text-[11px] font-extrabold text-alu truncate mt-0.5">{s.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIN + plate status */}
        <div className="mt-4 card-sheen border border-white/8 rounded-[20px] p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9.5px] font-bold text-mute">{t("v.vin")}</p>
              <p className="text-[12.5px] font-mono font-bold text-alu tracking-wider mt-1 truncate" dir="ltr">{car.vin}</p>
            </div>
            <button onClick={copyVin} aria-label={t("v.vin")}
              className="press shrink-0 w-11 h-11 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-silver">
              <Icon name="copy" size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-white/6">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${car.plateReady ? "bg-ok/12 text-ok" : "bg-warn/12 text-warn"}`}>
              <Icon name="key" size={15} />
            </span>
            <div>
              <p className="text-[9.5px] font-bold text-mute">{t("v.plate")}</p>
              <p className={`text-[11px] font-extrabold mt-0.5 ${car.plateReady ? "text-ok" : "text-warn"}`}>
                {car.plateReady ? t("v.plateReady") : t("v.plateProc")}
              </p>
            </div>
          </div>
        </div>

        {/* financing calculator — live, always visible */}
        <div className="mt-4 relative overflow-hidden rounded-[22px] border border-white/10 p-4 bg-gradient-to-br from-[#26262c] to-[#1c1c20]">
          <div className="absolute -end-10 -top-10 w-32 h-32 rounded-full bg-red/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl btn-red flex items-center justify-center text-white"><Icon name="card" size={17} /></span>
            <div>
              <h3 className="text-[14px] font-extrabold text-alu">{t("v.finance")}</h3>
              <p className="text-[9.5px] text-mute font-semibold">{t("v.financeSub")}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-silver">{t("v.down")} · {digits(downPct, lang)}٪</span>
              <Money n={down} className="text-[12px] font-extrabold text-alu" />
            </div>
            <input type="range" min={0} max={50} step={5} value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="dg-range w-full" aria-label={t("v.down")}
              style={{ "--fill": `${(downPct / 50) * 100}%` } as CSSProperties} />
          </div>

          <div className="mt-4">
            <span className="text-[11px] font-bold text-silver block mb-2">{t("v.term")}</span>
            <div className="flex gap-1.5">
              {[12, 24, 36, 48, 60].map((m) => (
                <button key={m} onClick={() => setTerm(m)}
                  className={`press flex-1 min-h-[44px] rounded-xl text-[11px] font-extrabold border ${term === m ? "btn-red text-white border-transparent" : "bg-white/5 text-mute border-white/8"}`}>
                  {digits(m, lang)}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-mute font-semibold mt-1 text-center">{t("v.months")}</p>
          </div>

          <div className="mt-4 rounded-2xl bg-black/30 border border-white/8 p-3.5 text-center">
            <p className="text-[10px] font-bold text-mute">{t("v.monthly")}</p>
            <Money n={monthly} className="text-[26px] font-black metal-text mt-1" />
          </div>
          <p className="text-[8.5px] text-mute/80 font-medium leading-relaxed mt-2.5">{t("v.financeNote")}</p>
          <WaButton phone={branch.phone} text={finMsg} label={t("v.requestFinance")} full />
        </div>
      </div>
    </div>
  );
}
