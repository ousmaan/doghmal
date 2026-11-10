import { useEffect, useState } from "react";
import { BadgeCheck, CarFront, Check, ShieldAlert } from "lucide-react";
import { cn } from "../utils/cn";
import { useLang } from "../i18n";
import { useNav } from "../nav";
import { SHOWROOM, type GarageCar } from "../data";
import { PrimaryCta, SubHeader } from "../components";

/* ============================================================================
   ADD VEHICLE — VIN-first registration, mirroring how the DMS keys vehicles.
   Checks the real 17-char VIN format, requires a plate, autosaves the form to
   localStorage mid-entry (dropped sessions lose nothing), and on success the
   car joins the local garage mirror instantly — no backend involved.
   ============================================================================ */

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i; // standard: 17 chars, excludes I/O/Q

type Form = { nick: string; plate: string; vin: string; modelId: string; year: number; odo: string };
const blank: Form = { nick: "", plate: "", vin: "", modelId: SHOWROOM[0].id, year: 2024, odo: "" };

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

export function AddVehicleScreen() {
  const { t, lang } = useLang();
  const nav = useNav();
  const [f, setF] = useState<Form>(() => {
    try { return { ...blank, ...JSON.parse(localStorage.getItem("doghmal-addcar") ?? "{}") }; } catch { return blank; }
  });
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  // autosave draft as the user types
  useEffect(() => { try { localStorage.setItem("doghmal-addcar", JSON.stringify(f)); } catch { /* noop */ } }, [f]);

  const vin = f.vin.replace(/\s/g, "").toUpperCase();
  const vinOk = VIN_RE.test(vin);
  const plateOk = f.plate.trim().length >= 4;
  const model = SHOWROOM.find((m) => m.id === f.modelId)!;
  const canSave = vinOk && plateOk;

  const set = (p: Partial<Form>) => setF((s) => ({ ...s, ...p }));

  const save = () => {
    setTouched(true);
    if (!canSave) return;
    const car: GarageCar = {
      id: `gx-${Date.now()}`,
      nickAr: f.nick.trim() || (lang === "ar" ? model.nameAr : model.nameEn),
      nickEn: f.nick.trim() || model.nameEn,
      modelAr: model.nameAr, modelEn: model.nameEn, year: f.year,
      plate: f.plate.trim(), vin,
      odo: Math.max(Number(f.odo) || 0, 0),
      nextKm: (Math.floor((Number(f.odo) || 0) / 10000) + 1) * 10000,
      nextCost: model.brand === "toyota" ? 1150 : 740,
      img: model.images[0], status: null,
      agentYearsLeft: 2025 - f.year >= 3 ? 0 : 3 - (2025 - f.year),
      paintYearsLeft: 2025 - f.year >= 5 ? 0 : 5 - (2025 - f.year),
      lastServiceAr: "—", lastServiceEn: "—",
      history: [],
    };
    nav.addCar(car);
    try { localStorage.removeItem("doghmal-addcar"); } catch { /* noop */ }
    setDone(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader title={t.addVehicleTitle} sub={t.addVehicleForm} />

      {!done ? (
        <div className="flex-1 overflow-y-auto no-scrollbar p-4">
          {/* nickname */}
          <Field label={t.fieldNick} hint={t.nickHint}
            input={<input value={f.nick} onChange={(e) => set({ nick: e.target.value })} placeholder={t.nickHint}
              className="field" maxLength={20} />} />

          {/* plate — required */}
          <Field label={t.fieldPlate} required error={touched && !plateOk ? t.plateError : null}
            input={<input dir="auto" value={f.plate} onChange={(e) => set({ plate: e.target.value })} placeholder={t.plateHint}
              className={cn("field", touched && !plateOk && "field-error")} maxLength={14} />} />

          {/* VIN — format-validated */}
          <Field label={t.fieldVin} hint={t.vinHint} required
            error={touched && !vinOk ? t.vinError : null}
            trailing={
              <span className={cn("text-[9.5px] font-black tabular", vin.length === 17 && vinOk ? "text-emerald-600" : "text-steel/45")}>
                {vin.length}/17
              </span>
            }
            input={<input dir="ltr" inputMode="text" autoCapitalize="characters" value={vin}
              onChange={(e) => set({ vin: e.target.value.replace(/[^a-z0-9]/gi, "").slice(0, 17) })}
              placeholder="JTMCB3FV5P4012244"
              className={cn("field font-en tracking-widest", touched && vin.length > 0 && !vinOk && "field-error")} />} />

          {/* model picker from the agency catalogue (read-only mirror) */}
          <p className="mb-1.5 mt-4 text-[11px] font-extrabold text-charcoal">{t.fieldModel}</p>
          <div className="snapx flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {SHOWROOM.slice(0, 8).map((m) => (
              <button key={m.id} type="button" onClick={() => set({ modelId: m.id })}
                className={cn("press flex w-[88px] shrink-0 flex-col items-center gap-1 rounded-[16px] p-2 transition-all",
                  f.modelId === m.id ? "bg-charcoal text-white shadow-pop" : "bg-white text-charcoal shadow-card")}>
                <img src={m.images[0]} alt={m.nameEn} className="h-10 w-full rounded-lg object-cover" loading="lazy" />
                <span className="w-full truncate text-center text-[9px] font-extrabold">{lang === "ar" ? m.nameAr : m.nameEn}</span>
              </button>
            ))}
            <span className="w-1 shrink-0" />
          </div>

          {/* year */}
          <p className="mb-1.5 mt-4 text-[11px] font-extrabold text-charcoal">{t.fieldYear}</p>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <button key={y} type="button" onClick={() => set({ year: y })}
                className={cn("press rounded-full px-3.5 py-2 text-[11.5px] font-extrabold tabular transition-all",
                  f.year === y ? "bg-toyota text-white shadow-red" : "bg-white text-charcoal shadow-card")}>
                {y}
              </button>
            ))}
          </div>

          {/* odometer — optional */}
          <Field label={t.fieldOdo} hint={lang === "ar" ? "تقريبي عادي" : "Approximate is fine"}
            input={<input dir="ltr" inputMode="numeric" value={f.odo} placeholder="45,000"
              onChange={(e) => set({ odo: e.target.value.replace(/[^0-9]/g, "").slice(0, 7) })}
              className="field font-en" />} />

          <div className="mt-5 mb-28">
            <PrimaryCta onClick={save} disabled={touched && !canSave}>{t.save}</PrimaryCta>
          </div>
        </div>
      ) : (
        /* success — car now lives in the local garage mirror */
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="relative pop-check">
            <div className="grid size-20 place-items-center rounded-full bg-charcoal shadow-pop">
              <Check className="size-9 text-emerald-400" strokeWidth={3} />
            </div>
            <span className="absolute -end-1 -top-1 grid size-6 place-items-center rounded-full bg-toyota text-white shadow-red">
              <CarFront className="size-3.5" />
            </span>
          </div>
          <h2 className="mt-4 text-[19px] font-black text-charcoal">{t.addedOk}</h2>
          <p className="mt-1 max-w-[240px] text-[11.5px] font-medium leading-relaxed text-steel/65">{t.addedOkSub}</p>
          <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card">
            <BadgeCheck className="size-4 text-toyota" />
            <span className="font-en text-[11px] font-black tracking-wider text-charcoal tabular">{vin}</span>
          </div>
          <div className="mt-6 w-full">
            <PrimaryCta onClick={() => nav.pop()}>{t.back}</PrimaryCta>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, required, error, trailing, input }: {
  label: string; hint?: string; required?: boolean; error?: string | null; trailing?: React.ReactNode; input: React.ReactNode;
}) {
  return (
    <div className="mt-4 first:mt-0">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[11px] font-extrabold text-charcoal">
          {label} {required && <span className="text-toyota">*</span>}
        </p>
        {trailing ?? (hint && !error && <p className="text-[9px] font-semibold text-steel/50">{hint}</p>)}
      </div>
      {input}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[10px] font-extrabold text-toyota">
          <ShieldAlert className="size-3" /> {error}
        </p>
      )}
    </div>
  );
}
