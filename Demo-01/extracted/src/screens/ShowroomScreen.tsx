import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { digits } from "../lib/i18n";
import { SHOWROOM, type Brand } from "../lib/data";
import { Icon } from "../components/icons";
import { BrandBadge, Chip, EmptyState, Money, ScreenHeader, Segmented, branchById } from "../components/ui";

export default function ShowroomScreen() {
  const { t, L, lang, push, startBooking } = useApp();
  const [condition, setCondition] = useState<"new" | "used">("new");
  const [brand, setBrand] = useState<"all" | Brand>("all");

  const cars = useMemo(
    () => SHOWROOM.filter((c) => c.condition === condition && (brand === "all" || c.brand === brand)),
    [condition, brand]
  );

  const brands: { id: "all" | Brand; label: string }[] = [
    { id: "all", label: t("s.all") },
    { id: "toyota", label: t("s.toyota") },
    { id: "gwm", label: t("s.gwm") },
    { id: "haval", label: t("s.haval") },
    { id: "jetour", label: t("s.jetour") },
  ];

  return (
    <div className="h-full overflow-y-auto pb-28">
      <ScreenHeader title={t("s.title")} sub={t("s.sub")} />
      <div className="px-4 pt-4">
        <Segmented
          options={[{ id: "new" as const, label: t("s.new") }, { id: "used" as const, label: t("s.used") }]}
          value={condition}
          onChange={(v) => setCondition(v)}
        />
        <div className="flex gap-2 overflow-x-auto no-sb -mx-4 px-4 mt-3.5 pb-1">
          {brands.map((b) => (
            <Chip key={b.id} active={brand === b.id} onClick={() => setBrand(b.id)}>{b.label}</Chip>
          ))}
        </div>
        <p className="text-[10.5px] font-bold text-mute mt-3">
          {digits(cars.length, lang)} {t("s.results")}
        </p>

        {cars.length === 0 ? (
          <EmptyState
            title={t("s.emptyTitle")}
            sub={t("s.emptySub")}
            actionLabel={t("s.clear")}
            onAction={() => setBrand("all")}
            variant="car"
          />
        ) : (
          <div className="mt-3 space-y-4 stagger" key={condition + brand}>
            {cars.map((c) => (
              <div key={c.id} className="card-sheen border border-white/8 rounded-[24px] overflow-hidden">
                <button onClick={() => push({ name: "vehicle", id: c.id })} className="press block w-full relative text-start">
                  <img src={c.img} alt={L(c.model)} loading="lazy" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                  {c.tag && !c.certified && (
                    <span className="absolute top-3 start-3 btn-red text-white text-[9.5px] font-black px-2.5 py-1 rounded-full">{L(c.tag)}</span>
                  )}
                  {c.certified && (
                    <span className="absolute top-3 start-3 bg-ok/90 text-ink text-[9.5px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Icon name="shield" size={11} strokeWidth={2.4} /> {t("s.certified")}
                    </span>
                  )}
                  <span className="absolute top-3 end-3"><BrandBadge brand={c.brand} /></span>
                  <span className="absolute bottom-3 end-3 bg-black/60 backdrop-blur text-alu text-[9.5px] font-bold px-2.5 py-1 rounded-full border border-white/15">
                    {c.condition === "new" ? t("s.new") : t("s.used")} · {digits(c.year, lang)}
                  </span>
                </button>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button onClick={() => push({ name: "vehicle", id: c.id })} className="press min-w-0 text-start">
                      <h3 className="text-[15px] font-extrabold text-alu leading-snug">{L(c.model)}</h3>
                      <p className="text-[10.5px] text-mute font-semibold mt-1 flex items-center gap-1">
                        <Icon name="pin" size={12} className="text-redhi shrink-0" />
                        {L(branchById(c.branchId).name)}
                      </p>
                    </button>
                    <div className="text-end shrink-0">
                      {c.condition === "new" && <p className="text-[8.5px] font-bold text-mute">{t("c.from")}</p>}
                      <Money n={c.price} className="text-[17px] font-black text-alu" />
                    </div>
                  </div>
                  {/* price · mileage · transmission — the three numbers buyers scan */}
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-silver bg-white/5 border border-white/8 rounded-full px-2 py-1">
                      <Icon name="gauge" size={11} className="text-redhi" />
                      <span dir="ltr">{digits((c.km ?? 0).toLocaleString("en-US"), lang)} {t("c.km")}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-silver bg-white/5 border border-white/8 rounded-full px-2 py-1">
                      <Icon name="gear" size={11} className="text-redhi" />
                      {L(c.specs.trans)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-silver bg-white/5 border border-white/8 rounded-full px-2 py-1">
                      <Icon name="zap" size={11} className="text-redhi" />
                      {digits(c.specs.power, lang)} {t("v.hp")}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3.5">
                    <button onClick={() => startBooking({ serviceId: "test", vehicleId: c.id, vehicleLabel: { ar: `${c.model.ar} ${c.year}`, en: `${c.model.en} ${c.year}` }, branchId: c.branchId })}
                      className="press flex-1 min-h-[44px] btn-red text-white text-[12px] font-bold rounded-xl py-2.5 flex items-center justify-center gap-1.5">
                      <Icon name="steering" size={15} /> {t("s.testDrive")}
                    </button>
                    <button onClick={() => push({ name: "vehicle", id: c.id })}
                      className="press px-4 min-h-[44px] bg-white/5 border border-white/10 text-silver text-[12px] font-bold rounded-xl">
                      {lang === "ar" ? "التفاصيل" : "Details"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
