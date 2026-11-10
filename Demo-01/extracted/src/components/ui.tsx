import { useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useApp, openWhatsApp } from "../lib/store";
import { digits, fill, money } from "../lib/i18n";
import type { Advisor, Branch, Brand } from "../lib/data";
import { BRANCHES } from "../lib/data";
import { Icon, WhatsAppIcon } from "./icons";
import { OverlayRoot } from "./overlay";

export { OverlayRoot };

/* —— buttons (≥44px touch targets) —— */
export function Btn({ children, onClick, variant = "primary", className = "", disabled = false, small = false }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "dark" | "ghost" | "wa" | "outline" | "danger";
  className?: string; disabled?: boolean; small?: boolean;
}) {
  const base = small ? "px-3.5 py-2 text-[12px] rounded-xl gap-1.5 min-h-[44px]" : "px-5 py-3.5 text-[14px] rounded-2xl gap-2 min-h-[48px]";
  const styles: Record<string, string> = {
    primary: "btn-red text-white font-bold",
    dark: "bg-card2 text-alu font-bold border border-white/10",
    ghost: "bg-white/5 text-silver font-bold border border-white/8",
    outline: "bg-transparent text-red font-bold border border-red/40",
    wa: "btn-wa text-white font-bold",
    danger: "bg-red/12 text-redhi font-bold border border-red/30",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`press inline-flex items-center justify-center ${base} ${styles[variant]} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}>
      {children}
    </button>
  );
}

export function WaButton({ phone, text, small = false, full = false, label }: {
  phone: string; text: string; small?: boolean; full?: boolean; label?: string;
}) {
  const { t } = useApp();
  return (
    <Btn variant="wa" small={small} className={full ? "w-full" : ""} onClick={() => openWhatsApp(phone, text)}>
      <WhatsAppIcon size={small ? 14 : 17} />
      <span>{label ?? t("c.whatsapp")}</span>
    </Btn>
  );
}

/* —— brand marks on car cards (Toyota ellipses / Latin wordmarks) —— */
export function BrandBadge({ brand }: { brand: Brand }) {
  const { t } = useApp();
  return (
    <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur border border-white/15 text-alu text-[8.5px] font-black tracking-wider px-2.5 py-1.5 rounded-full">
      {brand === "toyota" ? (
        <>
          <svg width="14" height="10" viewBox="0 0 28 18" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="14" cy="9" rx="12.5" ry="7.5" /><ellipse cx="14" cy="9" rx="4.8" ry="7.5" /><ellipse cx="14" cy="5.6" rx="8.4" ry="2.6" />
          </svg>
          {t("s.toyota").toUpperCase()}
        </>
      ) : brand === "haval" ? "HAVAL" : brand === "jetour" ? "JETOUR" : "GWM"}
    </span>
  );
}

/* —— headers —— */
export function ScreenHeader({ title, sub, onBack, right }: {
  title: string; sub?: string; onBack?: () => void; right?: ReactNode;
}) {
  const { dir, t, lang, setLang } = useApp();
  return (
    <div className="sticky top-0 z-30 bg-ink/88 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3 px-4 py-3 min-h-[64px]">
        {onBack && (
          <button onClick={onBack} aria-label={t("c.back")}
            className="press w-11 h-11 shrink-0 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-alu">
            <Icon name={dir === "rtl" ? "chevR" : "chevL"} size={18} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-extrabold text-alu leading-tight truncate">{title}</h1>
          {sub && <p className="text-[11px] text-mute font-medium truncate mt-0.5">{sub}</p>}
        </div>
        {right ?? (
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label="Toggle language / تبديل اللغة"
            className="press h-9 px-3 rounded-xl bg-white/6 border border-white/8 flex items-center gap-1.5 text-[10px] font-extrabold">
            <Icon name="globe" size={14} className="text-redhi" />
            <span className={lang === "ar" ? "text-alu" : "text-mute"}>ع</span>
            <span className="text-mute/50">|</span>
            <span className={lang === "en" ? "text-alu" : "text-mute"}>EN</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { dir } = useApp();
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] font-extrabold text-alu">{title}</h2>
      {action && (
        <button onClick={onAction} className="press min-h-[36px] text-[11.5px] font-bold text-redhi flex items-center gap-0.5">
          {action}
          <Icon name={dir === "rtl" ? "chevL" : "chevR"} size={13} />
        </button>
      )}
    </div>
  );
}

/* —— status pill (workshop job states) —— */
export function StatusPill({ status, small = false }: { status: "service" | "ready"; small?: boolean }) {
  const { t } = useApp();
  const ready = status === "ready";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${small ? "px-2 py-0.5 text-[9.5px]" : "px-2.5 py-1 text-[10.5px]"} ${ready ? "bg-ok/15 text-ok border border-ok/25" : "bg-warn/15 text-warn border border-warn/25"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ready ? "bg-ok pulse-ok" : "bg-warn pulse-dot"}`} />
      {ready ? t("h.ready") : t("h.inService")}
    </span>
  );
}

/* —— filter chip —— */
export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick}
      className={`press shrink-0 min-h-[44px] px-4 rounded-full text-[12px] font-bold border ${active ? "bg-red text-white border-red shadow-[0_4px_14px_-4px_rgba(235,10,26,0.6)]" : "bg-white/5 text-silver border-white/8"}`}>
      {children}
    </button>
  );
}

/* —— segmented control —— */
export function Segmented<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="flex bg-white/5 border border-white/8 rounded-2xl p-1 gap-1">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`press flex-1 min-h-[42px] rounded-xl text-[12.5px] font-bold transition-colors ${value === o.id ? "btn-red text-white" : "text-mute"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* —— advisor card: the human face over the legacy DMS —— */
export function AdvisorCard({ advisor, selected, onSelect, compact = false }: {
  advisor: Advisor; selected?: boolean; onSelect?: () => void; compact?: boolean;
}) {
  const app = useApp();
  const { t, L, lang } = app;
  const msg = fill(t("a.waMsg"), { name: L(advisor.name).split(" ")[0] });
  return (
    <div onClick={onSelect} role={onSelect ? "button" : undefined} aria-label={onSelect ? L(advisor.name) : undefined}
      className={`${onSelect ? "press cursor-pointer" : ""} card-sheen rounded-[20px] border p-3.5 transition-colors ${selected ? "border-red/60 shadow-[0_0_0_1px_rgba(235,10,26,0.4),0_10px_30px_-12px_rgba(235,10,26,0.35)]" : "border-white/8"}`}>
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img src={advisor.photo} alt={L(advisor.name)} loading="eager"
            className={`${compact ? "w-12 h-12" : "w-14 h-14"} rounded-2xl object-cover border border-white/10 bg-card2`} />
          <span className="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-ok border-2 border-card" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13.5px] font-extrabold text-alu truncate">{L(advisor.name)}</p>
            {selected && <span className="w-4.5 h-4.5 shrink-0 rounded-full btn-red flex items-center justify-center text-white"><Icon name="check" size={11} strokeWidth={3} /></span>}
          </div>
          {/* full name in the other language — Arabicized yet searchable */}
          <p className="text-[9px] text-mute/80 font-semibold truncate" dir={lang === "ar" ? "ltr" : "rtl"}>
            {lang === "ar" ? advisor.name.en : advisor.name.ar}
          </p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[9px] font-bold text-silver bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{t("a.role")}</span>
            <span className="text-[9px] font-bold text-info bg-info/10 border border-info/20 rounded-full px-2 py-0.5">{L(advisor.tag)}</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-warn">
              <Icon name="star" size={11} filled /> {digits(advisor.rating, lang)}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ok">
              <span className="w-1.5 h-1.5 rounded-full bg-ok pulse-ok" />
              {t("a.reply5")}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1"><WaButton phone={advisor.phone} text={msg} small full /></div>
        <button onClick={() => app.openChat(advisor)} aria-label={t("a.chat")}
          className="press w-11 h-11 shrink-0 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-alu relative">
          <Icon name="chat" size={18} />
          <span className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-ok" />
        </button>
      </div>
    </div>
  );
}

/* —— Saudi license plate: Arabic-Indic row over Latin row —— */
export function Plate({ letters, digits: dgs, small = false }: {
  letters: { ar: string; en: string }; digits: string; small?: boolean;
}) {
  return (
    <div dir="ltr" className={`inline-flex items-stretch rounded-lg overflow-hidden border border-black/30 shadow-sm bg-white ${small ? "h-8" : "h-11"}`}>
      <div className={`bg-[#1d4ed8] flex flex-col items-center justify-center px-1 ${small ? "w-4" : "w-5"}`}>
        <span className="text-white font-black leading-none" style={{ fontSize: small ? 5 : 6 }}>KSA</span>
        <span className="text-white/90 leading-none mt-0.5" style={{ fontSize: small ? 4 : 5 }}>السعودية</span>
      </div>
      <div className={`flex ${small ? "gap-1.5 px-1.5" : "gap-2.5 px-2.5"} items-center`}>
        <div className="text-center leading-none">
          <div className={`plate-font text-black ${small ? "text-[9px]" : "text-[12px]"}`}>{digits(dgs, "ar")}</div>
          <div className={`text-black/80 font-bold ${small ? "text-[6px]" : "text-[8px]"} tracking-wider`}>{dgs}</div>
        </div>
        <div className="w-px bg-black/15 self-stretch my-1" />
        <div className="text-center leading-none">
          <div className={`plate-font text-black ${small ? "text-[9px]" : "text-[12px]"}`}>{letters.ar}</div>
          <div className={`text-black/80 font-bold ${small ? "text-[6px]" : "text-[8px]"} tracking-widest`}>{letters.en}</div>
        </div>
      </div>
    </div>
  );
}

/* —— bottom sheet (portals into the phone frame) —— */
export function Sheet({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  const root = useContext(OverlayRoot);
  const { t } = useApp();
  if (!open) return null;
  return createPortal(
    <div className="absolute inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label={t("c.close")} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-[2px] scrim-in w-full" />
      <div className="absolute bottom-0 inset-x-0 sheet-up bg-panel border-t border-white/10 rounded-t-[28px] max-h-[88%] flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
        <div className="pt-3 pb-1 flex justify-center shrink-0"><div className="w-10 h-1 rounded-full bg-white/15" /></div>
        <div className="flex items-center justify-between px-5 pb-3 shrink-0">
          <h3 className="text-[15px] font-extrabold text-alu">{title}</h3>
          <button onClick={onClose} aria-label={t("c.close")} className="press w-11 h-11 rounded-full bg-white/6 text-mute flex items-center justify-center"><Icon name="x" size={15} /></button>
        </div>
        <div className="overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>,
    root ?? document.body
  );
}

export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, danger, onConfirm, onCancel, icon = "logout" }: {
  open: boolean; title: string; body: string; confirmLabel: string; cancelLabel: string;
  danger?: boolean; onConfirm: () => void; onCancel: () => void; icon?: string;
}) {
  const root = useContext(OverlayRoot);
  if (!open) return null;
  return createPortal(
    <div className="absolute inset-0 z-[65] flex items-center justify-center p-6" role="alertdialog" aria-modal="true" aria-label={title}>
      <button aria-label="close" onClick={onCancel} className="absolute inset-0 bg-black/70 backdrop-blur-[2px] scrim-in w-full" />
      <div className="relative pop-in w-full card-sheen border border-white/10 rounded-[24px] p-5 text-center shadow-2xl">
        <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${danger ? "bg-red/12 text-redhi" : "bg-white/6 text-alu"}`}>
          <Icon name={icon} size={26} />
        </div>
        <h3 className="text-[16px] font-extrabold text-alu mt-3">{title}</h3>
        <p className="text-[12px] text-mute font-medium mt-1.5 leading-relaxed">{body}</p>
        <div className="flex gap-2.5 mt-5">
          <Btn variant="ghost" className="flex-1" onClick={onCancel}>{cancelLabel}</Btn>
          <Btn variant={danger ? "primary" : "dark"} className="flex-1" onClick={onConfirm}>{confirmLabel}</Btn>
        </div>
      </div>
    </div>,
    root ?? document.body
  );
}

/* —— illustrated empty states, never a blank screen —— */
export function EmptyState({ title, sub, actionLabel, onAction, variant = "car" }: {
  title: string; sub: string; actionLabel?: string; onAction?: () => void; variant?: "car" | "history";
}) {
  return (
    <div className="text-center py-8 px-6 fade-up">
      <svg width="150" height="104" viewBox="0 0 150 104" className="mx-auto float-slow" aria-hidden="true">
        <ellipse cx="75" cy="92" rx="52" ry="6" fill="#000" opacity="0.4" />
        {variant === "car" ? (
          <g>
            <path d="M30 72v-12l8-18c1.5-3.5 4.5-5 8-5h40c3.5 0 6.5 1.5 8 5l8 18v12" fill="none" stroke="#5a5f68" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 62h92" stroke="#5a5f68" strokeWidth="3" strokeLinecap="round" />
            <path d="M44 58l5-13h34l5 13" fill="none" stroke="#8a9099" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="26" y="70" width="100" height="8" rx="4" fill="#2b2b32" stroke="#5a5f68" strokeWidth="2" />
            <circle cx="48" cy="80" r="9" fill="#1a1a1a" stroke="#eb0a1a" strokeWidth="3" />
            <circle cx="104" cy="80" r="9" fill="#1a1a1a" stroke="#eb0a1a" strokeWidth="3" />
            <circle cx="115" cy="30" r="13" fill="none" stroke="#f0f0f0" strokeWidth="3" />
            <path d="m124 40 9 9" stroke="#eb0a1a" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <rect x="45" y="18" width="60" height="70" rx="8" fill="#232329" stroke="#5a5f68" strokeWidth="3" />
            <rect x="62" y="12" width="26" height="12" rx="5" fill="#2b2b32" stroke="#8a9099" strokeWidth="2.5" />
            <path d="M56 40h38M56 52h38M56 64h22" stroke="#4a4e57" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
            <circle cx="104" cy="76" r="15" fill="#eb0a1a" />
            <path d="M104 69v14M97 76h14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
        <path d="M22 26l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#eb0a1a" opacity="0.8" />
        <path d="M132 60l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5 1.5-3.5Z" fill="#8a9099" />
      </svg>
      <h3 className="text-[15px] font-extrabold text-alu mt-3">{title}</h3>
      <p className="text-[12px] text-mute font-medium mt-1.5 leading-relaxed max-w-[250px] mx-auto">{sub}</p>
      {actionLabel && <Btn className="mt-4" small onClick={onAction}>{actionLabel}</Btn>}
    </div>
  );
}

/* —— progress bar —— */
export function ProgressBar({ value, tone = "red", className = "" }: { value: number; tone?: "red" | "ok" | "warn"; className?: string }) {
  const tones = { red: "linear-gradient(90deg,#ff2d3d,#eb0a1a)", ok: "linear-gradient(90deg,#3ee6a4,#2ecc8f)", warn: "linear-gradient(90deg,#ffc95c,#ffb020)" };
  return (
    <div className={`h-1.5 rounded-full bg-white/8 overflow-hidden ${className}`}>
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, background: tones[tone] }} />
    </div>
  );
}

/* —— labelled field —— */
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="text-[11.5px] font-bold text-silver">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error ? <span className="text-[10.5px] font-bold text-redhi mt-1 block">{error}</span>
        : hint ? <span className="text-[10px] text-mute font-medium mt-1 block">{hint}</span> : null}
    </label>
  );
}

export const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 min-h-[46px] text-[13px] font-semibold text-alu placeholder:text-mute/60 outline-none focus:border-red/50 focus:bg-white/7 transition-colors";

/* —— key/value row —— */
export function KV({ k, v, strong = false }: { k: string; v: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-[11.5px] text-mute font-semibold shrink-0">{k}</span>
      <span className={`text-[12.5px] font-bold text-end ${strong ? "text-alu" : "text-silver"}`}>{v}</span>
    </div>
  );
}

/* —— money with unit, locale-aware numerals —— */
export function Money({ n, className = "", unitCls = "" }: { n: number; className?: string; unitCls?: string }) {
  const { t, lang } = useApp();
  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`} dir="ltr">
      <span className="tabular-nums">{money(n, lang)}</span>
      <span className={`text-[0.68em] font-bold opacity-75 ${unitCls}`}>{t("c.sar")}</span>
    </span>
  );
}

/* —— branch availability chip —— */
export function AvailabilityChip({ status }: { status: Branch["status"] }) {
  const { t } = useApp();
  const map = {
    open: { cls: "bg-ok/12 text-ok border-ok/25", dot: "bg-ok", label: t("b.open") },
    busy: { cls: "bg-warn/12 text-warn border-warn/25", dot: "bg-warn", label: t("b.busy") },
    closed: { cls: "bg-white/6 text-mute border-white/10", dot: "bg-mute", label: t("b.closed") },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9.5px] font-bold ${map.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${map.dot} ${status === "open" ? "pulse-ok" : status === "busy" ? "pulse-dot" : ""}`} />
      {map.label}
    </span>
  );
}

export function branchById(id: string): Branch {
  return BRANCHES.find((b) => b.id === id) ?? BRANCHES[0];
}

/* —— toasts with optional undo action —— */
export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="absolute inset-x-4 bottom-[92px] z-[80] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pop-in mx-auto max-w-full bg-[#2e2e35]/95 backdrop-blur border border-white/12 border-s-2 border-s-red text-alu text-[12px] font-bold px-4 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.55)] flex items-center gap-3">
          <span>{t.msg}</span>
          {t.action && (
            <button onClick={t.action.onClick}
              className="press pointer-events-auto shrink-0 text-redhi bg-red/12 border border-red/30 rounded-lg px-2.5 py-1.5 text-[11px] font-black">
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export type { CSSProperties };
