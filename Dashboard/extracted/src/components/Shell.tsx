import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeftRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Gauge,
  Globe2,
  LayoutDashboard,
  Lock,
  Menu,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundCheck,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { bi, useI18n, type Bi } from "@/lib/i18n";
import { branches, periods, type BranchId, type PeriodId } from "@/data";
import type { SectionId } from "@/lib/export";
import { Avatar, Badge, ExportMenu, statusMeta } from "./ui";

export type Persona = "csuite" | "branch" | "advisor";

export const navItems: { id: SectionId; num: string; label: Bi; icon: typeof LayoutDashboard }[] = [
  { id: "executive", num: "01", label: bi("Executive Summary", "الرئيسية التنفيذية"), icon: LayoutDashboard },
  { id: "bays", num: "02", label: bi("Bay Utilization", "استهلاك البايات"), icon: Gauge },
  { id: "parts", num: "03", label: bi("Parts Inventory", "المخزون"), icon: Package },
  { id: "advisors", num: "04", label: bi("Advisor Performance", "الأداء الاستشاري"), icon: UserRoundCheck },
  { id: "conversion", num: "05", label: bi("Sales-to-Service", "التحويل للخدمة"), icon: Workflow },
  { id: "csi", num: "06", label: bi("CSI & Wait Times", "CSI والانتظار"), icon: Star },
  { id: "transfers", num: "07", label: bi("Parts Transfers", "نقل القطع"), icon: ArrowLeftRight },
  { id: "compliance", num: "08", label: bi("Regulatory Compliance", "التوافق التنظيمي"), icon: ShieldCheck },
];

const personas: { id: Persona; label: Bi; desc: Bi; icon: typeof Users; recommended: SectionId[] }[] = [
  { id: "csuite", label: bi("Executive", "تنفيذي"), desc: bi("Network summary", "ملخص الشبكة"), icon: Sparkles, recommended: ["executive", "conversion"] },
  { id: "branch", label: bi("Branch manager", "مدير فرع"), desc: bi("Operational detail", "تفاصيل تشغيلية"), icon: Building2, recommended: ["bays", "parts", "csi"] },
  { id: "advisor", label: bi("Service advisor", "مستشار خدمة"), desc: bi("Throughput & wait", "الإنتاجية والانتظار"), icon: UserRoundCheck, recommended: ["advisors", "csi"] },
];

/* ── Small popover ───────────────────────────────────────────────────────── */

function Popover({ trigger, children, width = "w-64", align = "end" }: { trigger: (open: boolean) => ReactNode; children: (close: () => void) => ReactNode; width?: string; align?: "start" | "end" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger(open)}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute top-[calc(100%+6px)] z-40 rounded-lg border border-line bg-white p-1.5 shadow-[var(--shadow-lift)] fade-up",
              width,
              align === "end" ? "end-0" : "start-0"
            )}
          >
            {children(() => setOpen(false))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterButton({ children, onClick, active }: { children: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 max-w-[220px] items-center gap-1.5 rounded-md border px-2.5 text-[11.5px] font-medium transition",
        active ? "border-ink/25 bg-ink/[0.04] text-ink" : "border-line bg-white text-ink hover:border-ink/25"
      )}
    >
      {children}
      <ChevronDown size={12} className="shrink-0 text-steel" />
    </button>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */

export function Shell({
  section,
  onNavigate,
  branchIds,
  onBranchIds,
  period,
  onPeriod,
  autoRefresh,
  onAutoRefresh,
  onRefresh,
  syncing,
  lastSync,
  cloudDelayed,
  onExport,
  persona,
  onPersona,
  children,
}: {
  section: SectionId;
  onNavigate: (s: SectionId) => void;
  branchIds: BranchId[] | "all";
  onBranchIds: (ids: BranchId[] | "all") => void;
  period: PeriodId;
  onPeriod: (p: PeriodId) => void;
  autoRefresh: boolean;
  onAutoRefresh: (v: boolean) => void;
  onRefresh: () => void;
  syncing: boolean;
  lastSync: string;
  cloudDelayed: boolean;
  onExport: (f: "csv" | "pdf") => void;
  persona: Persona;
  onPersona: (p: Persona) => void;
  children: ReactNode;
}) {
  const { lang, setLang, pick, n, pct } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [custom, setCustom] = useState({ from: "2026-03-01", to: "2026-03-24" });
  const current = navItems.find((x) => x.id === section)!;
  const activePersona = personas.find((p) => p.id === persona)!;

  const selectedLabels =
    branchIds === "all"
      ? pick(bi("All branches", "كل الفروع"))
      : branchIds.length === 1
        ? pick(branches.find((b) => b.id === branchIds[0])!.name)
        : lang === "ar"
          ? `مقارنة ${n(branchIds.length)} فروع`
          : `Comparing ${branchIds.length} branches`;

  const toggleBranch = (id: BranchId) => {
    if (branchIds === "all") {
      onBranchIds([id]);
      return;
    }
    if (branchIds.includes(id)) {
      const next = branchIds.filter((b) => b !== id);
      onBranchIds(next.length ? next : "all");
      return;
    }
    if (branchIds.length >= 3) {
      onBranchIds([branchIds[1], branchIds[2], id]);
      return;
    }
    onBranchIds([...branchIds, id]);
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-[#141514] text-white">
      {/* Brand */}
      <div className="border-b border-white/[0.07] px-4 pb-4 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-white">
            <svg viewBox="0 0 40 40" className="h-9 w-9">
              <rect width="40" height="40" fill="#fff" />
              <path d="M0 28 L40 12 L40 20 L0 36 Z" fill="#EB0A1A" />
              <path d="M9 10 h11 c8 0 12 4.4 12 10 s-4 10-12 10H9V10Zm6 5v10h4.5c4 0 6-2 6-5s-2-5-6-5H15Z" fill="#1A1A1A" />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] font-bold leading-none tracking-[0.16em]">DOGHMAL</span>
            </div>
            <div className="mt-1 text-[8px] font-medium tracking-[0.14em] text-white/40">{pick(bi("TRADING CO. LTD · NAJRAN", "شركة دوغمال للتجارة · نجران"))}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-md border border-white/[0.08] bg-white/[0.035] px-2 py-1.5">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.12em] text-white/55">
            <span className="h-1 w-1 rounded-full bg-toyota" />
            {pick(bi("TIER 3 · TELEMETRY", "الطبقة الثالثة · تلمتري"))}
          </span>
          <span className="inline-flex items-center gap-1 text-[8.5px] font-medium text-white/35">
            <Lock size={9} /> {pick(bi("READ-ONLY", "قراءة فقط"))}
          </span>
        </div>
      </div>

      {/* Persona view */}
      <div className="px-3 pb-1 pt-3">
        <div className="mb-1.5 flex items-center justify-between px-1">
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white/30">{pick(bi("View as", "العرض حسب"))}</span>
          <Users size={10} className="text-white/25" />
        </div>
        <Popover
          align="start"
          width="w-[230px]"
          trigger={() => (
            <button className="flex w-full items-center justify-between rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-start transition hover:bg-white/[0.07]">
              <span className="flex items-center gap-2">
                <activePersona.icon size={12} className="text-toyota" />
                <span className="text-[10.5px] font-medium text-white/80">{pick(activePersona.label)}</span>
              </span>
              <ChevronDown size={11} className="text-white/35" />
            </button>
          )}
        >
          {(close) => (
            <div className="!bg-[#1D1E1D] !border-white/10">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onPersona(p.id);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start transition",
                    persona === p.id ? "bg-white/[0.09]" : "hover:bg-white/[0.06]"
                  )}
                >
                  <p.icon size={13} className={persona === p.id ? "text-toyota" : "text-white/40"} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10.5px] font-medium text-white/85">{pick(p.label)}</span>
                    <span className="block text-[9px] text-white/35">{pick(p.desc)}</span>
                  </span>
                  {persona === p.id && <Check size={12} className="text-toyota" />}
                </button>
              ))}
            </div>
          )}
        </Popover>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        <div className="px-2 pb-1.5 pt-1 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white/25">
          {pick(bi("Intelligence", "التحليلات"))}
        </div>
        {navItems.map((item) => {
          const active = item.id === section;
          const recommended = activePersona.recommended.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "group relative flex w-full items-center gap-2.5 rounded-md px-2 py-[7px] text-start transition",
                active ? "bg-white/[0.075] text-white" : "text-white/55 hover:bg-white/[0.045] hover:text-white/85"
              )}
            >
              {active && <span className="absolute inset-y-1.5 start-0 w-[2.5px] rounded-full bg-toyota" />}
              <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border", active ? "border-white/15 bg-white/[0.07] text-white" : "border-transparent text-white/40 group-hover:text-white/70")}>
                <item.icon size={13.5} strokeWidth={active ? 2 : 1.7} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className={cn("block truncate text-[11.5px]", active ? "font-semibold" : "font-medium")}>{pick(item.label)}</span>
                <span className="mt-0.5 block truncate text-[8.5px] text-white/28">{lang === "ar" ? item.label.en : item.label.ar}</span>
              </span>
              {recommended && !active && <span className="h-1 w-1 shrink-0 rounded-full bg-toyota/80" title={pick(bi("Recommended for your role", "مقترح لدورك"))} />}
              <span className={cn("num text-[8.5px]", active ? "text-white/40" : "text-white/20")}>{item.num}</span>
            </button>
          );
        })}

        {/* Branch quick selector */}
        <div className="mt-3 rounded-lg border border-white/[0.07] bg-white/[0.025] p-2">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-white/30">{pick(bi("Branch selector", "محدد الفرع"))}</span>
            <Building2 size={10} className="text-white/25" />
          </div>
          <button
            onClick={() => onBranchIds("all")}
            className={cn(
              "mb-1 flex w-full items-center justify-between rounded px-1.5 py-1 text-[10px] transition",
              branchIds === "all" ? "bg-white/[0.09] text-white" : "text-white/50 hover:bg-white/[0.05]"
            )}
          >
            <span>{pick(bi("All branches", "كل الفروع"))}</span>
            <span className="num text-[8.5px] text-white/30">6</span>
          </button>
          {branches.map((b) => {
            const on = branchIds !== "all" && branchIds.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleBranch(b.id)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded px-1.5 py-[5px] text-[10px] transition",
                  on ? "bg-white/[0.09] text-white" : "text-white/50 hover:bg-white/[0.05]"
                )}
              >
                <span className="h-1 w-1 shrink-0 rounded-full" style={{ background: statusMeta[b.status].hex }} />
                <span className="flex-1 truncate text-start">{pick(b.name)}</span>
                <span className="num text-[8.5px] text-white/30">{pct(b.utilization)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer: compliance + user */}
      <div className="border-t border-white/[0.07] px-3 py-3">
        <div className="mb-2.5 flex items-center justify-between rounded-md border border-[#27AE60]/25 bg-[#27AE60]/[0.07] px-2 py-1.5">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-medium text-[#7FD6A2]">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#27AE60]" />
            {pick(bi("KSA cloud · PDPL", "سحابة السعودية · PDPL"))}
          </span>
          <span className="num text-[8.5px] text-[#7FD6A2]/70">{n(cloudDelayed ? 34 : 3)}{pick(bi("s", "ث"))}</span>
        </div>
        <button
          onClick={() => {
            onNavigate("compliance");
            setMobileOpen(false);
          }}
          className="flex w-full items-center gap-2 rounded-md px-1 py-1 text-start transition hover:bg-white/[0.04]"
        >
          <Avatar name={pick(bi("Abdulaziz Al-Yami", "عبدالعزيز اليامي"))} tone={1} size={28} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[10.5px] font-medium text-white/80">{pick(bi("Abdulaziz Al-Yami", "عبدالعزيز اليامي"))}</span>
            <span className="block truncate text-[8.5px] text-white/35">{pick(bi("Operations director · Najran", "مدير العمليات · نجران"))}</span>
          </span>
          <ShieldCheck size={12} className="text-white/25" />
        </button>
        <div className="mt-2 flex items-center justify-between px-1 text-[8px] text-white/20">
          <span>DOGHMAL TELEMETRY T3</span>
          <span>v0.9 · MIRROR</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 start-0 z-40 hidden w-[258px] border-e border-black/40 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-[280px] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute end-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white"
              aria-label="close menu"
            >
              <X size={15} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:ps-[258px]">
        {/* Top bar */}
        <header className="no-print sticky top-0 z-30 border-b border-line bg-[#FBFBF9]/95 backdrop-blur">
          <div className="flex h-[60px] items-center gap-2 px-3 sm:px-5">
            <button onClick={() => setMobileOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-ink lg:hidden" aria-label="menu">
              <Menu size={16} />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="num flex h-6 min-w-6 items-center justify-center rounded border border-line bg-white px-1 text-[10px] font-bold text-ink">{current.num}</span>
              <div className="leading-tight">
                <div className="text-[12.5px] font-semibold text-ink">{pick(current.label)}</div>
                <div className="text-[8.5px] uppercase tracking-[0.12em] text-steel">Doghmal T3 · {lang === "ar" ? current.label.en : current.label.ar}</div>
              </div>
            </div>
            <div className="flex-1" />

            {/* live state */}
            <div className="hidden items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1.5 md:flex">
              {cloudDelayed ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-warn" />
                  <span className="text-[10px] font-medium text-[#9A6206]">{pick(bi("Data delayed", "بيانات متأخرة"))}</span>
                </>
              ) : (
                <>
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-ok" />
                  <span className="text-[10px] font-medium text-[#1E7A46]">{pick(bi("CDC live", "CDC مباشر"))}</span>
                  <span className="num text-[9px] text-steel">{n(3)}{pick(bi("s", "ث"))}</span>
                </>
              )}
            </div>

            <div className="hidden items-center gap-2 border-s border-line ps-2 md:flex">
              <Avatar name={pick(bi("Abdulaziz Al-Yami", "عبدالعزيز اليامي"))} tone={1} size={26} />
              <div className="hidden leading-tight xl:block">
                <div className="text-[10.5px] font-semibold text-ink">{pick(bi("Abdulaziz Al-Yami", "عبدالعزيز اليامي"))}</div>
                <div className="text-[8.5px] text-steel">{pick(activePersona.label)}</div>
              </div>
            </div>

            {/* language toggle */}
            <div className="flex items-center rounded-md border border-line bg-white p-0.5">
              <Globe2 size={12} className="mx-1 text-steel" />
              {(["ar", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded px-1.5 py-1 text-[10px] font-semibold transition",
                    lang === l ? "bg-ink text-white" : "text-steel hover:text-ink"
                  )}
                >
                  {l === "ar" ? "عربي" : "EN"}
                </button>
              ))}
            </div>

            <ExportMenu onExport={onExport} />
            <button
              onClick={onRefresh}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-ink/25"
              title={pick(bi("Refresh mirror", "تحديث المرآة"))}
            >
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* filter strip */}
          <div className="flex flex-wrap items-center gap-2 border-t border-line/80 px-3 py-2 sm:px-5">
            <Popover
              align="start"
              width="w-[268px]"
              trigger={() => (
                <FilterButton active={branchIds !== "all"}>
                  <Building2 size={12} className="shrink-0 text-steel" />
                  <span className="truncate">{selectedLabels}</span>
                </FilterButton>
              )}
            >
              {(close) => (
                <div>
                  <div className="px-2 pb-1.5 pt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-steel">
                    {pick(bi("Compare up to 3 branches", "قارن حتى ٣ فروع"))}
                  </div>
                  <button
                    onClick={() => {
                      onBranchIds("all");
                      close();
                    }}
                    className={cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] hover:bg-alum", branchIds === "all" ? "font-semibold text-ink" : "text-steel")}
                  >
                    {pick(bi("All branches", "كل الفروع"))}
                    {branchIds === "all" && <Check size={12} className="text-toyota" />}
                  </button>
                  {branches.map((b) => {
                    const on = branchIds !== "all" && branchIds.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBranch(b.id)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] hover:bg-alum"
                      >
                        <span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border", on ? "border-ink bg-ink text-white" : "border-line bg-white")}>
                          {on && <Check size={9} />}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta[b.status].hex }} />
                        <span className="flex-1 text-start text-ink">{pick(b.name)}</span>
                        <span className="num text-[9.5px] text-steel">{pct(b.utilization)}</span>
                      </button>
                    );
                  })}
                  <div className="mt-1 flex items-center justify-between border-t border-line px-2 pb-0.5 pt-1.5">
                    <span className="text-[8.5px] leading-tight text-steel">{pick(bi("T3 mirrors legacy · no writes", "المرآة للقراءة فقط · بدون كتابة"))}</span>
                    <button onClick={close} className="text-[9px] font-semibold text-toyota">{pick(bi("Done", "تم"))}</button>
                  </div>
                </div>
              )}
            </Popover>

            <Popover
              align="start"
              width="w-[240px]"
              trigger={() => (
                <FilterButton active={period !== "7d"}>
                  <CalendarDays size={12} className="shrink-0 text-steel" />
                  <span className="truncate">
                    {pick(periods.find((p) => p.id === period)!.label)}
                    {period === "custom" && (
                      <span className="num ms-1 hidden text-[9px] text-steel sm:inline">
                        {n(custom.from.slice(5))} – {n(custom.to.slice(5))}
                      </span>
                    )}
                  </span>
                </FilterButton>
              )}
            >
              {(close) => (
                <div>
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onPeriod(p.id);
                        if (p.id !== "custom") close();
                      }}
                      className={cn("flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] hover:bg-alum", period === p.id ? "font-semibold text-ink" : "text-steel")}
                    >
                      {pick(p.label)}
                      {period === p.id && <Check size={12} className="text-toyota" />}
                    </button>
                  ))}
                  {period === "custom" && (
                    <div className="mt-1 grid grid-cols-2 gap-1.5 border-t border-line px-1 pt-2">
                      <label className="text-[8.5px] text-steel">
                        {pick(bi("From", "من"))}
                        <input
                          type="date"
                          value={custom.from}
                          onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-line px-1.5 py-1 text-[9.5px] text-ink outline-none focus:border-ink"
                        />
                      </label>
                      <label className="text-[8.5px] text-steel">
                        {pick(bi("To", "إلى"))}
                        <input
                          type="date"
                          value={custom.to}
                          onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-line px-1.5 py-1 text-[9.5px] text-ink outline-none focus:border-ink"
                        />
                      </label>
                      <button onClick={close} className="col-span-2 mt-1 rounded bg-ink py-1 text-[9.5px] font-medium text-white">
                        {pick(bi("Apply range", "تطبيق الفترة"))}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Popover>

            <span className="hidden h-4 w-px bg-line sm:block" />

            <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-steel" title={pick(bi("Auto-refresh every 60s", "تحديث تلقائي كل ٦٠ ثانية"))}>
              <button
                role="switch"
                aria-checked={autoRefresh}
                onClick={() => onAutoRefresh(!autoRefresh)}
                className={cn("relative h-[15px] w-[27px] rounded-full transition", autoRefresh ? "bg-ink" : "bg-[#D5D5D0]")}
              >
                <span className={cn("absolute top-[2px] h-[11px] w-[11px] rounded-full bg-white transition-all", autoRefresh ? "start-[14px]" : "start-[2px]")} />
              </button>
              <span className="hidden sm:inline">{pick(bi("Auto 60s", "تلقائي ٦٠ث"))}</span>
            </label>

            <div className="flex-1" />
            <span className="inline-flex items-center gap-1.5 text-[9.5px] text-steel">
              <Zap size={10} className={cloudDelayed ? "text-warn" : "text-ok"} />
              {pick(bi("Last mirror", "آخر مزامنة"))}
              <span className="num font-medium text-ink">{n(lastSync)}</span>
              <span className="hidden text-[8.5px] text-[#A2A5A6] sm:inline">· {pick(bi("Riyadh region", "منطقة الرياض"))}</span>
            </span>
            {branchIds !== "all" && branchIds.length > 1 && (
              <Badge tone="ink" className="hidden xl:inline-flex">
                {pick(bi("Compare mode", "وضع المقارنة"))} · {n(branchIds.length)}
              </Badge>
            )}
          </div>

          {cloudDelayed && (
            <div className="flex items-center gap-2 border-t border-[#F3DDAE] bg-[#FEF5E4] px-4 py-1.5 text-[10px] text-[#9A6206]">
              <Activity size={11} />
              {pick(
                bi(
                  "Cloud mirror is behind. Showing last known-good values (no estimates, no writes). Last verified event: 14:31.",
                  "المرآة السحابية متأخرة. نعرض آخر قيم مؤكدة فقط (بدون تقديرات أو كتابة). آخر حدث موثّق: ١٤:٣١."
                )
              )}
            </div>
          )}
        </header>

        <main className="mx-auto w-full max-w-[1560px] px-3 py-5 sm:px-5 sm:py-6 lg:px-7">{children}</main>

        <footer className="no-print mx-auto w-full max-w-[1560px] border-t border-line px-4 py-4 text-[9.5px] leading-relaxed text-steel sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5">
              <Lock size={10} />
              {pick(bi("Read-only CDC mirror · legacy ERP/DMS remains system of record for ZATCA stamping & invoicing", "مرآة CDC للقراءة فقط · النظام القديم هو مصدر الحقيقة لختم زاتكا والفواتير"))}
            </span>
            <span className="inline-flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-ok" />{pick(bi("Data in KSA", "البيانات في السعودية"))}</span>
              <span className="num">v0.9</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export { personas };
