import { useState } from "react";
import { useApp } from "../lib/store";
import { digits, isoPlus } from "../lib/i18n";
import { CAR_MODELS, SHOWROOM, warrantyState, type GarageCar, type WarrantyState } from "../lib/data";
import { Icon } from "../components/icons";
import { Btn, Field, Money, Plate, ScreenHeader, Sheet, StatusPill, inputCls, EmptyState } from "../components/ui";

export const warrantyChipCls: Record<WarrantyState, string> = {
  active: "bg-ok/12 text-ok border-ok/25",
  expiring: "bg-warn/12 text-warn border-warn/25",
  expired: "bg-white/6 text-mute border-white/12",
};

export default function GarageScreen() {
  const app = useApp();
  const { t, L, lang, garage } = app;
  const [addOpen, setAddOpen] = useState(false);

  const wLabel: Record<WarrantyState, string> = { active: t("g.wActive"), expiring: t("g.wExpiring"), expired: t("g.wExpired") };

  return (
    <div className="h-full overflow-y-auto pb-28">
      <ScreenHeader title={t("g.title")} sub={t("g.sub")} />
      <div className="px-4 pt-4">
        <Btn className="w-full" onClick={() => setAddOpen(true)}>
          <Icon name="plus" size={17} strokeWidth={2.4} /> {t("g.add")}
        </Btn>

        <div className="mt-4 space-y-3.5 stagger">
          {garage.length === 0 ? (
            <EmptyState variant="car"
              title={t("g.emptyTitle")}
              sub={t("g.emptySub")}
              actionLabel={t("g.add")}
              onAction={() => setAddOpen(true)} />
          ) : (
            garage.map((g) => {
              const ws = warrantyState(g.warrantyUntil);
              const liveStatus = g.id === "g1" ? (app.jobStage >= 4 ? "ready" : "service") : g.status;
              return (
                <button key={g.id} onClick={() => app.push({ name: "garageCar", id: g.id })}
                  className="press w-full text-start card-sheen border border-white/8 rounded-[22px] p-3.5">
                  <div className="flex gap-3.5">
                    <div className="relative shrink-0">
                      <img src={g.img} alt={L(g.model)} loading="lazy" className="w-24 h-[86px] object-cover rounded-2xl border border-white/8" />
                      {liveStatus && <span className="absolute -top-1.5 -start-1.5"><StatusPill small status={liveStatus} /></span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14.5px] font-extrabold text-alu truncate">{L(g.nickname)}</p>
                        <Icon name={app.dir === "rtl" ? "chevL" : "chevR"} size={15} className="text-mute shrink-0" />
                      </div>
                      <p className="text-[10.5px] text-mute font-semibold">{L(g.model)} · {digits(g.year, lang)}</p>
                      <p className="text-[8.5px] font-mono text-mute/70 mt-1 tracking-wide truncate" dir="ltr">{g.vin || t("g.vinMissing")}</p>
                      <div className="mt-2"><Plate letters={g.plate.letters} digits={g.plate.digits} small /></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-silver">
                      <Icon name="gauge" size={13} className="text-redhi" />
                      {t("g.odo")}: <span className="tabular-nums" dir="ltr">{digits(g.odo.toLocaleString("en-US"), lang)} {t("c.km")}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black border ${warrantyChipCls[ws]}`}>
                      <Icon name="shield" size={10} />
                      {t("g.warranty")}: {wLabel[ws]}
                    </span>
                  </div>
                  {/* next recommended service with a starting price */}
                  <div className="flex items-center justify-between mt-2 bg-red/6 border border-red/15 rounded-xl px-2.5 py-2">
                    <span className="flex items-center gap-1.5 text-[9.5px] font-bold text-silver">
                      <Icon name="wrench" size={11} className="text-redhi" />
                      {t("g.recService")} · <span dir="ltr">{digits(g.nextKm.toLocaleString("en-US"), lang)} {t("c.km")}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-mute">
                      {t("c.from")} <Money n={350} className="text-[10.5px] font-black text-redhi" />
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-start gap-2 mt-5 px-1">
          <Icon name="info" size={13} className="text-mute shrink-0 mt-0.5" />
          <p className="text-[9.5px] text-mute/80 font-semibold leading-relaxed">{t("g.readonlyNote")}</p>
        </div>
      </div>

      <AddVehicleSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function AddVehicleSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const app = useApp();
  const { t, L } = app;
  const [nickname, setNickname] = useState("");
  const [modelIdx, setModelIdx] = useState(0);
  const [year, setYear] = useState(2024);
  const [vin, setVin] = useState("");
  const [letters, setLetters] = useState("");
  const [digitsF, setDigitsF] = useState("");
  const [errs, setErrs] = useState<{ name?: string; vin?: string }>({});

  const save = () => {
    const e: typeof errs = {};
    if (!nickname.trim()) e.name = t("g.nameErr");
    /* VIN-or-plate entry: a full 17-char VIN, or the plate number.
       A partial VIN is always an error (format validation). */
    const v = vin.trim();
    if (v.length > 0 && v.length !== 17) e.vin = t("g.vinErr");
    else if (v.length === 0 && digitsF.trim().length < 3) e.vin = t("g.vinOrPlate");
    setErrs(e);
    if (Object.keys(e).length) return;
    const model = CAR_MODELS[modelIdx];
    const car: GarageCar = {
      id: `g-${Date.now()}`,
      nickname: { ar: nickname.trim(), en: nickname.trim() },
      model,
      year,
      img: SHOWROOM[modelIdx % SHOWROOM.length].img,
      vin: v.toUpperCase(),
      plate: {
        letters: { ar: letters.trim() || "— — —", en: letters.trim() || "- - -" },
        digits: digitsF.trim() || "0000",
      },
      odo: 0,
      nextKm: 10000,
      warrantyUntil: isoPlus(720),
      paintUntil: isoPlus(720),
      recall: null,
      status: null,
      history: [],
    };
    app.addVehicle(car);
    app.toast(t("g.added"));
    onClose();
    setNickname(""); setVin(""); setLetters(""); setDigitsF(""); setErrs({});
    app.push({ name: "garageCar", id: car.id });
  };

  return (
    <Sheet open={open} onClose={onClose} title={t("g.addTitle")}>
      <p className="text-[11px] text-mute font-semibold -mt-1 mb-4">{t("g.addSub")}</p>
      <Field label={t("g.nickname")} error={errs.name}>
        <input className={inputCls} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={t("g.nicknamePh")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("g.model")}>
          <select className={inputCls} value={modelIdx} onChange={(e) => setModelIdx(Number(e.target.value))}>
            {CAR_MODELS.map((m, i) => <option key={i} value={i} className="bg-panel">{L(m)}</option>)}
          </select>
        </Field>
        <Field label={t("g.yearF")}>
          <select className={inputCls} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => 2026 - i).map((y) => <option key={y} value={y} className="bg-panel">{y}</option>)}
          </select>
        </Field>
      </div>
      <Field label={t("g.vinF")} hint={`${digitsHint(vin.length)} ${t("g.vinHint")}`} error={errs.vin}>
        <input className={`${inputCls} font-mono tracking-widest uppercase`} dir="ltr" maxLength={17}
          value={vin} onChange={(e) => setVin(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())} placeholder="JTMAH7BJ0P40XXXXX" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("g.plateF")}>
          <input className={inputCls} value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="ح ر ب" />
        </Field>
        <Field label={t("g.plateN")}>
          <input className={inputCls} dir="ltr" inputMode="numeric" maxLength={4} value={digitsF} onChange={(e) => setDigitsF(e.target.value.replace(/\D/g, ""))} placeholder="4521" />
        </Field>
      </div>
      <Btn className="w-full mt-1" onClick={save}>
        <Icon name="plus" size={16} strokeWidth={2.4} /> {t("g.save")}
      </Btn>
    </Sheet>
  );
}

function digitsHint(n: number) {
  return `${n}/17 ·`;
}
