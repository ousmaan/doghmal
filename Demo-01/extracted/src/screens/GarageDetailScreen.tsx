import { useApp } from "../lib/store";
import { digits, fmtDate, money } from "../lib/i18n";
import { warrantyState, type WarrantyState } from "../lib/data";
import { Icon } from "../components/icons";
import { Btn, EmptyState, Money, Plate, ProgressBar, ScreenHeader, StatusPill, branchById } from "../components/ui";
import { warrantyChipCls } from "./GarageScreen";

/* GARAGE DETAIL — a read-only window into the legacy DMS:
   history timeline, ALJ warranty, OEM recall registry. VIN is the
   natural key echoed on every screen. The only action offered is
   "book service", which creates a request for a human to confirm. */
export default function GarageDetailScreen({ id }: { id: string }) {
  const app = useApp();
  const { t, L, lang } = app;
  const car = app.garage.find((g) => g.id === id) ?? app.garage[0];
  const done = app.jobStage >= 4;
  const liveStatus = car.id === "g1" ? (done ? "ready" : "service") : car.status;

  const interval = 10000;
  const sinceLast = Math.max(0, car.odo - (car.nextKm - interval));
  const progress = Math.min(1, sinceLast / interval);
  const remaining = Math.max(0, car.nextKm - car.odo);
  const ws = warrantyState(car.warrantyUntil);
  const ps = warrantyState(car.paintUntil);
  const wLabel: Record<WarrantyState, string> = { active: t("g.wActive"), expiring: t("g.wExpiring"), expired: t("g.wExpired") };

  const copyVin = async () => {
    try { await navigator.clipboard.writeText(car.vin); } catch { /* noop */ }
    app.toast(t("c.copied"));
  };

  const warrantyCard = (state: WarrantyState, until: string | null, icon: string, title: string, sub: string) => (
    <div className={`card-sheen border rounded-[20px] p-3.5 ${state === "active" ? "border-ok/20" : state === "expiring" ? "border-warn/25" : "border-white/8"}`}>
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${state === "active" ? "bg-ok/12 text-ok" : state === "expiring" ? "bg-warn/12 text-warn" : "bg-white/6 text-mute"}`}>
        <Icon name={icon} size={17} />
      </span>
      <p className="text-[10.5px] font-extrabold text-alu mt-2.5 leading-snug">{title}</p>
      <p className="text-[8.5px] text-mute font-semibold mt-1 leading-relaxed">{sub}</p>
      <span className={`inline-block mt-2 text-[8.5px] font-black px-2 py-1 rounded-full border ${warrantyChipCls[state]}`}>
        {state === "expired" ? wLabel.expired : `${wLabel[state]} · ${t("g.until")} ${fmtDate(until!, lang, { day: undefined })}`}
      </span>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-ink">
      <ScreenHeader title={L(car.nickname)} sub={`${L(car.model)} · ${digits(car.year, lang)}`} onBack={app.pop} />

      <div className="relative">
        <img src={car.img} alt={L(car.model)} className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        {liveStatus && <span className="absolute top-3 start-4"><StatusPill status={liveStatus} /></span>}
        <div className="absolute bottom-3 end-4"><Plate letters={car.plate.letters} digits={car.plate.digits} /></div>
      </div>

      <div className="px-4 pt-3 pb-4 stagger">
        {/* identity card — VIN is the primary key across the wrapper */}
        <div className="card-sheen border border-white/8 rounded-[20px] p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9.5px] font-bold text-mute">{t("v.vin")}</p>
              {car.vin ? (
                <p className="text-[12.5px] font-mono font-bold text-alu tracking-wider mt-1 truncate" dir="ltr">{car.vin}</p>
              ) : (
                <p className="text-[11px] font-bold text-warn mt-1">{t("g.vinMissing")}</p>
              )}
            </div>
            {car.vin && (
              <button onClick={copyVin} aria-label={t("v.vin")}
                className="press shrink-0 w-11 h-11 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-silver">
                <Icon name="copy" size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-silver">
              <Icon name="gauge" size={14} className="text-redhi" /> {t("g.odo")}
            </span>
            <span className="text-[13px] font-black text-alu tabular-nums" dir="ltr">{money(car.odo, lang)} {t("c.km")}</span>
          </div>
        </div>

        {/* next milestone + recommended service with price */}
        <div className="mt-3.5 relative overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#26262c] to-[#1c1c20] p-4">
          <div className="absolute -start-8 -bottom-10 w-28 h-28 rounded-full bg-red/10 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-extrabold text-alu flex items-center gap-2">
              <Icon name="wrench" size={15} className="text-redhi" /> {t("g.nextService")}
            </p>
            <span className="text-[10px] font-black text-redhi tabular-nums" dir="ltr">{t("g.remaining")} {money(remaining, lang)} {t("c.km")}</span>
          </div>
          <p className="text-[22px] font-black metal-text mt-2 tabular-nums" dir="ltr">
            {money(car.nextKm, lang)} <span className="text-[12px]">{t("c.km")}</span>
          </p>
          <ProgressBar value={progress} className="mt-2.5" />
          <div className="flex justify-between text-[8.5px] font-bold text-mute mt-1.5 tabular-nums">
            <span dir="ltr">{money(car.nextKm - interval, lang)}</span><span dir="ltr">{money(car.nextKm, lang)}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-silver">
              <Icon name="sparkles" size={12} className="text-warn" /> {t("g.recService")}
            </span>
            <span className="flex items-center gap-1 text-[9.5px] font-bold text-mute">
              {t("c.from")} <Money n={350} className="text-[13px] font-black text-alu" />
            </span>
          </div>
        </div>

        {/* warranty — General Agent + paint, tri-state */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          {warrantyCard(ws, car.warrantyUntil, "shield", t("g.wAgent"), t("g.wAgentSub"))}
          {warrantyCard(ps, car.paintUntil, "drop", t("g.wPaint"), t("g.wPaintSub"))}
        </div>

        {/* recall registry */}
        {car.recall ? (
          <div className="mt-3.5 rounded-[20px] border border-warn/30 bg-warn/8 p-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-warn/15 text-warn flex items-center justify-center shrink-0 pulse-dot">
                <Icon name="alert" size={19} />
              </span>
              <div className="flex-1">
                <p className="text-[12.5px] font-extrabold text-warn">{t("g.recallOpen")}</p>
                <p className="text-[10px] text-silver font-semibold mt-1 leading-relaxed">{L(car.recall)} — {t("g.recallOpenSub")}</p>
              </div>
            </div>
            <Btn small className="w-full mt-3" onClick={() => app.startBooking({ serviceId: "repair", vehicleId: car.id })}>
              <Icon name="wrench" size={14} /> {t("g.recallCta")}
            </Btn>
          </div>
        ) : (
          <div className="mt-3.5 rounded-[20px] border border-ok/20 bg-ok/6 p-3.5 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-ok/12 text-ok flex items-center justify-center shrink-0">
              <Icon name="shield" size={17} />
            </span>
            <div>
              <p className="text-[11.5px] font-extrabold text-ok">{t("g.recallOk")}</p>
              <p className="text-[9px] text-mute font-semibold mt-0.5">{t("g.recallOkSub")}</p>
            </div>
          </div>
        )}

        {/* service history timeline (from the DMS, untouched) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-extrabold text-alu">{t("g.history")}</h3>
            <span className="text-[10px] font-bold text-mute">{digits(car.history.length, lang)} {t("g.visits")}</span>
          </div>
          {car.history.length === 0 ? (
            <div className="card-sheen border border-white/8 rounded-[20px]">
              <EmptyState variant="history" title={t("g.historyEmpty")} sub={t("g.historyEmptySub")} />
            </div>
          ) : (
            <div className="relative ps-5">
              <span className="absolute start-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-red/60 via-white/10 to-transparent" />
              <div className="space-y-3">
                {car.history.map((h, i) => (
                  <div key={h.inv} className="relative">
                    <span className={`absolute -start-5 top-4 w-[15px] h-[15px] rounded-full border-[3px] ${i === 0 ? "bg-red border-red/30" : "bg-card2 border-white/15"}`} />
                    <div className="card-sheen border border-white/8 rounded-[18px] p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12px] font-extrabold text-alu">{L(h.title)}</p>
                        <span className="text-[9.5px] font-bold text-mute shrink-0">{fmtDate(h.date, lang)}</span>
                      </div>
                      <p className="text-[9.5px] font-bold text-mute mt-1 tabular-nums" dir="ltr">{money(h.km, lang)} {t("c.km")}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {h.items.map((it, j) => (
                          <span key={j} className="text-[9px] font-bold text-silver bg-white/5 border border-white/8 rounded-full px-2 py-1">{L(it)}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/6">
                        <span className="text-[9px] font-bold text-mute">{L(branchById(h.branchId).name)} · {t("g.inv")} <span dir="ltr">{h.inv}</span></span>
                        <span className="text-[11.5px] font-black text-alu tabular-nums" dir="ltr">{money(h.cost, lang)} {t("c.sar")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 mt-4 px-1">
          <Icon name="info" size={13} className="text-mute shrink-0 mt-0.5" />
          <p className="text-[9px] text-mute/80 font-semibold leading-relaxed">{t("g.readonlyNote")}</p>
        </div>
      </div>

      {/* sticky CTA */}
      <div className="sticky bottom-0 px-4 pb-4 pt-6 bg-gradient-to-t from-ink via-ink/90 to-transparent">
        <Btn className="w-full" onClick={() => app.startBooking({ vehicleId: car.id })}>
          <Icon name="wrench" size={17} /> {t("g.bookForCar")}
        </Btn>
      </div>
    </div>
  );
}
