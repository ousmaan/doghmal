import type { ReactNode } from "react";
import { ArrowLeft, BadgeCheck, ChevronLeft, MessageCircle, MessagesSquare, Star } from "lucide-react";
import { cn } from "./utils/cn";
import { useLang } from "./i18n";
import { waLink, type Advisor } from "./data";
import { useNav } from "./nav";

/* ---------- Doghmal brand mark: charcoal plate + red slash + D ---------- */
export function DoghmalMark({ dark = false, size = 34 }: { dark?: boolean; size?: number }) {
  return (
    <div
      className={cn("relative grid place-items-center rounded-[26%] overflow-hidden shrink-0",
        dark ? "bg-white" : "bg-charcoal")}
      style={{ width: size, height: size }}
      aria-label="Doghmal"
    >
      <span className={cn("font-en font-black leading-none", dark ? "text-charcoal" : "text-white")}
        style={{ fontSize: size * 0.52 }}>D</span>
      {/* Toyota-red speed slash */}
      <span className="absolute -top-[12%] -end-[10%] h-[135%] w-[16%] rotate-[24deg] bg-toyota" />
    </div>
  );
}

/* ---------- Section title with red rule ---------- */
export function SectionTitle({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between", className)}>
      <h2 className="rule-red text-[15px] font-extrabold text-charcoal">{children}</h2>
      {action}
    </div>
  );
}

/* ---------- Status pill (In Service / Ready) ---------- */
export function StatusPill({ kind, className }: { kind: "in-service" | "ready"; className?: string }) {
  const { t } = useLang();
  const isReady = kind === "ready";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold", className,
      isReady ? "bg-emerald-500/12 text-emerald-700" : "bg-amber-500/15 text-amber-700")}>
      <span className={cn("size-1.5 rounded-full pulse-dot", isReady ? "bg-emerald-500" : "bg-amber-500")} />
      {isReady ? t.readyPickup : t.inService}
    </span>
  );
}

/* ---------- Filter chip ---------- */
export function Chip({ active, children, onClick, className }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick}
      className={cn("press shrink-0 rounded-full px-4 py-2.5 text-[12.5px] font-bold transition-colors",
        active ? "bg-charcoal text-white shadow-pop" : "bg-white text-steel border border-black/8", className)}>
      {children}
    </button>
  );
}

/* ---------- Pushed-screen header with back ---------- */
export function SubHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  const { pop } = useNav();
  const { dir } = useLang();
  return (
    <div className="sticky top-0 z-20 flex min-h-[64px] items-center gap-3 px-4 pt-5 pb-3 bg-alu/85 backdrop-blur-xl border-b border-black/5">
      <button onClick={pop} aria-label="back"
        className="press grid size-9 place-items-center rounded-full bg-white shadow-card text-charcoal">
        {dir === "rtl" ? <ChevronLeft className="size-5 rtl-mirror" /> : <ArrowLeft className="size-5" />}
      </button>
      <div className="min-w-0 flex-1 text-start">
        <h1 className="truncate text-[16px] font-extrabold text-charcoal leading-tight">{title}</h1>
        {sub && <p className="text-[11px] text-steel/70 font-medium truncate">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- WhatsApp deep-link button ---------- */
export function WaButton({ num, msg, label, small, full }: { num: string; msg: string; label: string; small?: boolean; full?: boolean }) {
  return (
    <a href={waLink(num, msg)} target="_blank" rel="noreferrer"
      className={cn("press inline-flex items-center justify-center gap-1.5 rounded-full bg-wa/12 text-[#128C3E] font-bold",
        small ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-[12.5px]", full && "w-full")}
      onClick={(e) => e.stopPropagation()}>
      <MessageCircle className={small ? "size-3.5" : "size-4"} fill="#1fbd59" strokeWidth={0} />
      {label}
    </a>
  );
}

/* ---------- Advisor card — the humanization layer ----------
   Every advisor surfaces their real WhatsApp. Response-time promise is
   part of Doghmal's service brand, shown as a badge, not fine print. */
export function AdvisorCard({ advisor, selected, onSelect, msgAr, msgEn, onChat }: {
  advisor: Advisor; selected?: boolean; onSelect?: () => void; msgAr: string; msgEn: string; onChat?: () => void;
}) {
  const { lang, t } = useLang();
  const specLabel = { maintenance: t.specMaintenance, electrical: t.specElectrical, sales: t.specSales, bodyshop: t.specBodyshop }[advisor.spec];
  return (
    <div
      onClick={onSelect}
      className={cn("press-soft relative flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-card transition-all cursor-pointer",
        selected ? "ring-2 ring-toyota" : "ring-1 ring-black/5")}
    >
      <div className="relative shrink-0">
        <img src={advisor.photo} alt={lang === "ar" ? advisor.nameAr : advisor.nameEn}
          className="size-14 rounded-2xl object-cover bg-alu-deep" loading="lazy" />
        {advisor.online && (
          <span className="absolute -bottom-0.5 -end-0.5 size-3.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>
      <div className="min-w-0 flex-1 text-start">
        <div className="flex items-center gap-1">
          <p className="truncate text-[13px] font-extrabold text-charcoal">{lang === "ar" ? advisor.nameAr : advisor.nameEn}</p>
          <BadgeCheck className="size-3.5 shrink-0 text-toyota" />
        </div>
        {/* role + workshop specialty badge */}
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          <span className="rounded-full bg-alu-deep/80 px-1.5 py-px text-[9px] font-bold text-steel/75">{t.advisorRole}</span>
          <span className="rounded-full bg-toyota/8 px-1.5 py-px text-[9px] font-black text-toyota">{specLabel}</span>
          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-amber-600 tabular">
            <Star className="size-2.5 fill-amber-400 text-amber-400" />{advisor.rating}
          </span>
        </div>
        {/* Saudi service promise: real human, real fast */}
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          <span className="size-1 rounded-full bg-emerald-500 pulse-dot" />
          {t.repliesIn}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <WaButton small num={advisor.wa} msg={lang === "ar" ? msgAr : msgEn} label={lang === "ar" ? "واتساب" : "WhatsApp"} />
        {onChat && (
          <button aria-label={t.chatTitle}
            onClick={(e) => { e.stopPropagation(); onChat(); }}
            className="press grid size-7 place-items-center rounded-full bg-charcoal text-white">
            <MessagesSquare className="size-3.5" />
          </button>
        )}
      </div>
      {selected && (
        <span className="absolute -top-1.5 -end-1.5 grid size-6 place-items-center rounded-full bg-toyota text-white shadow-red pop-check">
          <BadgeCheck className="size-3.5" />
        </span>
      )}
    </div>
  );
}

/* ---------- Empty state with CSS illustration ---------- */
export function EmptyState({ title, desc, cta }: { title: string; desc: string; cta?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
      <div className="relative grid size-24 place-items-center rounded-[28px] bg-white shadow-card floaty">
        <div className="absolute inset-x-6 bottom-5 h-1.5 rounded-full bg-alu-deep" />
        <div className="size-10 rounded-[14px] bg-charcoal relative overflow-hidden">
          <span className="absolute -top-1 end-1 h-8 w-2 rotate-[24deg] bg-toyota" />
        </div>
        <div className="absolute -top-2 -end-2 size-5 rounded-full bg-toyota shadow-red" />
      </div>
      <p className="text-[15px] font-extrabold text-charcoal">{title}</p>
      <p className="text-[12px] font-medium text-steel/70 leading-relaxed">{desc}</p>
      {cta}
    </div>
  );
}

/* ---------- Big primary CTA ---------- */
export function PrimaryCta({ children, onClick, disabled, ghost }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; ghost?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn("press w-full rounded-[18px] py-3.5 text-[14px] font-extrabold transition-all",
        ghost ? "bg-white text-charcoal border border-black/10"
          : "bg-toyota text-white shadow-red disabled:bg-steel/40 disabled:shadow-none")}>
      {children}
    </button>
  );
}
