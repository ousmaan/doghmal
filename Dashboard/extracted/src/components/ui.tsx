import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Download, FileText, Info, TrendingDown, TrendingUp, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { bi, useI18n, type Bi } from "@/lib/i18n";
import type { Health } from "@/data";

/* ── Health + status helpers ──────────────────────────────────────────────── */

export const statusMeta: Record<
  Health,
  { label: Bi; hex: string; soft: string; text: string; border: string; bar: string }
> = {
  healthy: {
    label: bi("Healthy", "مستقر"),
    hex: "#27AE60",
    soft: "bg-[#EAF7EF]",
    text: "text-[#1E7A46]",
    border: "border-[#BFE6CE]",
    bar: "bg-[#27AE60]",
  },
  watch: {
    label: bi("Watch", "تحت المراقبة"),
    hex: "#F39C12",
    soft: "bg-[#FEF5E4]",
    text: "text-[#9A6206]",
    border: "border-[#F3DDAE]",
    bar: "bg-[#F39C12]",
  },
  bottleneck: {
    label: bi("Bottleneck", "اختناق"),
    hex: "#E74C3C",
    soft: "bg-[#FDECEA]",
    text: "text-[#B0281D]",
    border: "border-[#F6C7C2]",
    bar: "bg-[#E74C3C]",
  },
};

export const riskMeta: Record<Health, { label: Bi; hex: string; soft: string; text: string }> = {
  healthy: { label: bi("Optimal", "مثالي"), hex: "#27AE60", soft: "bg-[#EAF7EF]", text: "text-[#1E7A46]" },
  watch: { label: bi("Slow", "بطيء"), hex: "#F39C12", soft: "bg-[#FEF5E4]", text: "text-[#9A6206]" },
  bottleneck: { label: bi("Overstock", "مخزون راكد"), hex: "#E74C3C", soft: "bg-[#FDECEA]", text: "text-[#B0281D]" },
};

/* ── Primitives ───────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-line bg-white shadow-[var(--shadow-card)]",
        onClick && "cursor-pointer transition hover:border-ink/20 hover:shadow-[var(--shadow-lift)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "danger" | "red" | "ink";
  dot?: boolean;
  className?: string;
}) {
  const tones = {
    neutral: "bg-[#F1F1EE] text-[#565A5E] border-[#E1E1DC]",
    ok: "bg-[#EAF7EF] text-[#1E7A46] border-[#BFE6CE]",
    warn: "bg-[#FEF5E4] text-[#9A6206] border-[#F3DDAE]",
    danger: "bg-[#FDECEA] text-[#B0281D] border-[#F6C7C2]",
    red: "bg-toyota text-white border-toyota",
    ink: "bg-ink text-white border-ink",
  } as const;
  const dots = { neutral: "#8A8F94", ok: "#27AE60", warn: "#F39C12", danger: "#E74C3C", red: "#fff", ink: "#27AE60" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-[3px] text-[11px] font-medium leading-none whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dots[tone] }} />}
      {children}
    </span>
  );
}

export function HealthPill({ status, className }: { status: Health; className?: string }) {
  const { pick } = useI18n();
  const meta = statusMeta[status];
  return (
    <Badge tone={status === "healthy" ? "ok" : status === "watch" ? "warn" : "danger"} dot className={className}>
      {pick(meta.label)}
    </Badge>
  );
}

export function Sparkline({
  values,
  color = "#1A1A1A",
  width = 92,
  height = 28,
  fill = true,
  strokeWidth = 1.8,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  strokeWidth?: number;
}) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - min) / range) * (height - 9);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width - 2},${height} L2,${height} Z`;
  const id = `sp-${color.replace("#", "")}-${values.join("x").slice(0, 12)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" style={{ direction: "ltr" }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.4} fill={color} />
    </svg>
  );
}

export function Trend({
  value,
  inverse = false,
  suffix,
}: {
  value: number;
  inverse?: boolean;
  suffix?: string;
}) {
  const good = inverse ? value < 0 : value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold",
        good ? "text-[#1E7A46]" : "text-[#B0281D]"
      )}
    >
      {value > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {value > 0 ? "+" : ""}
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

export function Meter({
  value,
  max = 100,
  target,
  tone = "#1A1A1A",
  height = 6,
  showTarget = true,
}: {
  value: number;
  max?: number;
  target?: number;
  tone?: string;
  height?: number;
  showTarget?: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="relative w-full rounded-full bg-[#EFEFEB]" style={{ height }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: tone }} />
      {showTarget && target !== undefined && (
        <div
          className="absolute -top-[3px] h-[calc(100%+6px)] w-[2px] rounded-full bg-ink/65"
          style={{ insetInlineStart: `${Math.min(100, (target / max) * 100)}%` }}
          title={`${target}`}
        />
      )}
    </div>
  );
}

export function Avatar({ name, tone = 0, size = 30 }: { name: string; tone?: number; size?: number }) {
  const tones = ["#26272A", "#43464A", "#5C4033", "#2F3B41", "#4A3A3F"];
  const initials = name
    .replace(/^م\.\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white/90"
      style={{ width: size, height: size, background: tones[tone % tones.length], fontSize: size * 0.34 }}
    >
      {initials}
    </span>
  );
}

/* ── Page + section headers ──────────────────────────────────────────────── */

export function PageHeader({
  index,
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  index: string;
  eyebrow: Bi;
  title: Bi;
  subtitle: Bi;
  actions?: ReactNode;
}) {
  const { pick, lang } = useI18n();
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-steel">
          <span className="inline-flex items-center gap-1.5 rounded border border-line bg-white px-1.5 py-0.5 text-[10px] text-ink">
            <span className="h-1 w-1 rounded-full bg-toyota" />
            {index}
          </span>
          <span>{pick(eyebrow)}</span>
          <span className="text-line">/</span>
          <span className="normal-case tracking-normal text-[#8A8F94]">
            {lang === "ar" ? "مرآة قراءة فقط" : "read-only mirror"}
          </span>
        </div>
        <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[30px]">
          {pick(title)}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-steel">{pick(subtitle)}</p>
      </div>
      {actions && <div className="no-print flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHead({
  title,
  subtitle,
  right,
  className,
}: {
  title: Bi;
  subtitle?: Bi;
  right?: ReactNode;
  className?: string;
}) {
  const { pick } = useI18n();
  return (
    <div className={cn("flex items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5", className)}>
      <div className="min-w-0">
        <h3 className="text-[13.5px] font-semibold tracking-[-0.01em] text-ink">{pick(title)}</h3>
        {subtitle && <p className="mt-0.5 text-[11px] leading-relaxed text-steel">{pick(subtitle)}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* ── Key metric statement ─────────────────────────────────────────────────── */

/**
 * "Key metric" banner. Every metric maps to a Doghmal critique pain point:
 * idle labour, parts bottlenecks, customer attrition, phone-based governance.
 */
export function KeyMetric({
  label,
  value,
  target,
  footnote,
  status = "watch",
  icon,
}: {
  label: Bi;
  value: string;
  target?: Bi;
  footnote?: Bi;
  status?: Health;
  icon?: ReactNode;
}) {
  const { pick } = useI18n();
  const meta = statusMeta[status];
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#2C2D2C] bg-ink p-4 text-white shadow-[var(--shadow-lift)] sm:p-5">
      <div className="absolute inset-y-0 start-0 w-[3px]" style={{ background: meta.hex }} />
      <div className="absolute end-0 top-0 h-full w-1/2 opacity-[0.08] grid-texture" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/[0.06] text-white/80">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
              {pick(bi("Critical operating metric", "مؤشر تشغيلي حاسم"))}
            </div>
            <div className="text-[15px] font-semibold leading-snug sm:text-[16.5px]">{value}</div>
            <div className="mt-1 text-[11px] text-white/55">{pick(label)}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10.5px] font-semibold"
            style={{ color: meta.hex, borderColor: `${meta.hex}55`, background: `${meta.hex}18` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.hex }} />
            {pick(meta.label)}
          </span>
          {target && <span className="text-[10.5px] text-white/45">{pick(target)}</span>}
        </div>
      </div>
      {footnote && <p className="relative mt-3 border-t border-white/10 pt-2.5 text-[10.5px] text-white/45">{pick(footnote)}</p>}
    </div>
  );
}

/* ── KPI tile ─────────────────────────────────────────────────────────────── */

export function KpiTile({
  label,
  value,
  unit,
  delta,
  deltaInverse,
  foot,
  icon,
  accent = false,
}: {
  label: Bi;
  value: string;
  unit?: Bi;
  delta?: number;
  deltaInverse?: boolean;
  foot?: Bi;
  icon?: ReactNode;
  accent?: boolean;
}) {
  const { pick } = useI18n();
  return (
    <Card className={cn("relative overflow-hidden p-4", accent && "border-[#2C2D2C] bg-ink text-white")}>
      <div className="flex items-start justify-between gap-2">
        <span className={cn("text-[11px] font-medium leading-tight", accent ? "text-white/60" : "text-steel")}>
          {pick(label)}
        </span>
        {icon && (
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
              accent ? "border-white/15 bg-white/[0.06] text-white/75" : "border-line bg-[#FAFAF8] text-ink/70"
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-end gap-1.5">
        <span className={cn("num text-[24px] font-bold leading-none tracking-[-0.03em] sm:text-[27px]", accent ? "text-white" : "text-ink")}>
          {value}
        </span>
        {unit && <span className={cn("pb-0.5 text-[11px]", accent ? "text-white/50" : "text-steel")}>{pick(unit)}</span>}
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        {foot && <span className={cn("truncate text-[10.5px]", accent ? "text-white/45" : "text-steel")}>{pick(foot)}</span>}
        {delta !== undefined && <Trend value={delta} inverse={deltaInverse} suffix={pick(bi("% vs last wk", "٪ عن الأسبوع"))} />}
      </div>
    </Card>
  );
}

/* ── Horizontal branch comparison bars ────────────────────────────────────── */

export function BranchBars({
  items,
  max = 100,
  target,
  unit = "%",
  toneFor,
  suffix,
  onSelect,
}: {
  items: { id: string; label: Bi; value: number; status?: Health; sub?: Bi }[];
  max?: number;
  target?: number;
  unit?: string;
  toneFor?: (status?: Health) => string;
  suffix?: string;
  onSelect?: (id: string) => void;
}) {
  const { pick, n, lang } = useI18n();
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const color = toneFor ? toneFor(item.status) : item.status ? statusMeta[item.status].hex : "#1A1A1A";
        return (
          <div
            key={item.id}
            className={cn("group", onSelect && "cursor-pointer")}
            onClick={() => onSelect?.(item.id)}
            title={`${pick(item.label)} · ${n(item.value)}${suffix ?? unit}`}
          >
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                {item.status && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: statusMeta[item.status].hex }} />}
                <span className="truncate text-[11.5px] font-medium text-ink">{pick(item.label)}</span>
                {item.sub && <span className="hidden truncate text-[10px] text-steel sm:inline">{pick(item.sub)}</span>}
              </div>
              <span className="num shrink-0 text-[11.5px] font-semibold tabular-nums text-ink">
                {n(item.value, item.value % 1 !== 0 && item.value < 10 ? 1 : 0)}
                {suffix ?? (lang === "ar" ? "٪" : "%")}
              </span>
            </div>
            <div className="relative h-[7px] w-full overflow-visible rounded-full bg-[#EEEEEA]">
              <div
                className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                style={{ width: `${Math.min(100, (item.value / max) * 100)}%`, background: color }}
              />
              {target !== undefined && (
                <span
                  className="absolute -top-[3px] h-[13px] w-[2px] rounded bg-ink/70"
                  style={{ insetInlineStart: `${Math.min(100, (target / max) * 100)}%` }}
                  title={`target ${target}`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Line chart ───────────────────────────────────────────────────────────── */

export type Series = { name: Bi; values: number[]; color: string; dashed?: boolean };

export function LineChart({
  labels,
  series,
  yMin,
  yMax,
  target,
  height = 220,
  valueSuffix = "",
}: {
  labels: string[];
  series: Series[];
  yMin: number;
  yMax: number;
  target?: number;
  height?: number;
  valueSuffix?: string;
}) {
  const { n, lang, pick } = useI18n();
  const W = 760;
  const H = height;
  const pad = { top: 16, right: 14, bottom: 26, left: 34 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (i / Math.max(labels.length - 1, 1)) * innerW;
  const y = (v: number) => pad.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => yMin + ((yMax - yMin) / ticks) * i);

  return (
    <div dir="ltr" className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto", maxHeight: H }} role="img">
        {tickVals.map((v, i) => (
          <g key={i}>
            <line x1={pad.left} x2={W - pad.right} y1={y(v)} y2={y(v)} stroke="#ECECE8" strokeWidth={1} strokeDasharray={i === 0 ? "" : "3 4"} />
            <text x={pad.left - 8} y={y(v) + 3.5} textAnchor="end" fontSize={9.5} fill="#8A8F94" className="num">
              {n(Math.round(v))}
            </text>
          </g>
        ))}
        {target !== undefined && (
          <g>
            <line x1={pad.left} x2={W - pad.right} y1={y(target)} y2={y(target)} stroke="#EB0A1A" strokeWidth={1} strokeDasharray="5 5" opacity={0.7} />
            <text x={W - pad.right} y={y(target) - 5} textAnchor="end" fontSize={9} fill="#EB0A1A" fontWeight={600}>
              {lang === "ar" ? `المستهدف ${n(target)}` : `Target ${n(target)}`}
            </text>
          </g>
        )}
        {series.map((s) => {
          const path = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
          return (
            <g key={pick(s.name)}>
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s.dashed ? "5 4" : undefined} />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={i === s.values.length - 1 ? 3.4 : 2.6} fill="#fff" stroke={s.color} strokeWidth={1.8}>
                  <title>{`${pick(s.name)} · ${n(v)}${valueSuffix}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
        {labels.map((l, i) => {
          const step = Math.ceil(labels.length / 7);
          if (i % step !== 0 && i !== labels.length - 1) return null;
          return (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={9} fill="#8A8F94">
              {lang === "ar" ? l.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]) : l}
            </text>
          );
        })}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-4 px-2" dir={lang === "ar" ? "rtl" : "ltr"}>
        {series.map((s) => (
          <span key={pick(s.name)} className="inline-flex items-center gap-1.5 text-[10.5px] text-steel">
            <span className="h-[2px] w-4 rounded" style={{ background: s.color }} />
            {pick(s.name)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Heat map ─────────────────────────────────────────────────────────────── */

const heatBands = [
  { max: 39, color: "#E8EDE9", label: bi("Idle", "خامل") },
  { max: 59, color: "#C7E3D2", label: bi("Light", "خفيف") },
  { max: 74, color: "#F3D48A", label: bi("Near target", "قريب المستهدف") },
  { max: 89, color: "#F0A17D", label: bi("Busy", "مزدحم") },
  { max: 100, color: "#E74C3C", label: bi("Bottleneck", "اختناق") },
];

export function HeatCell({ value, label }: { value: number; label: string }) {
  const { n } = useI18n();
  const band = heatBands.find((b) => value <= b.max) ?? heatBands[heatBands.length - 1];
  return (
    <div className="tooltip-host relative" tabIndex={0} title={`${label} · ${value}%`}>
      <div className="h-[17px] w-full rounded-[2px] transition hover:ring-1 hover:ring-ink/40" style={{ background: band.color }} />
      <div className="tooltip-body absolute bottom-full start-1/2 z-40 mb-1.5 -translate-x-1/2 rtl:translate-x-1/2">
        <div className="whitespace-nowrap rounded border border-ink bg-ink px-2 py-1 text-[10px] font-medium text-white shadow-lg">
          {label} · <span className="num">{n(value)}٪</span>
        </div>
      </div>
    </div>
  );
}

export function HeatLegend() {
  const { pick } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {heatBands.map((b) => (
        <span key={pick(b.label)} className="inline-flex items-center gap-1 text-[9.5px] text-steel">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: b.color }} />
          {pick(b.label)}
        </span>
      ))}
    </div>
  );
}

/* ── Funnel ──────────────────────────────────────────────────────────────── */

export function Funnel({ stages }: { stages: { label: Bi; value: number; note: Bi; color: string }[] }) {
  const { pick, n } = useI18n();
  const max = stages[0]?.value || 1;
  return (
    <div className="space-y-2.5">
      {stages.map((s, i) => {
        const width = Math.max(28, (s.value / max) * 100);
        const prev = i > 0 ? stages[i - 1].value : s.value;
        const conv = Math.round((s.value / Math.max(prev, 1)) * 100);
        return (
          <div key={pick(s.label)} className="group">
            <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
              <span className="font-medium text-ink">{pick(s.label)}</span>
              <span className="num font-semibold text-ink">
                {n(s.value)}
                {i > 0 && <span className="ms-1.5 font-normal text-steel">({n(conv)}٪)</span>}
              </span>
            </div>
            <div className="relative h-[30px] overflow-hidden rounded-md bg-[#F4F4F1]">
              <div
                className="h-full rounded-md transition-all duration-700 group-hover:brightness-105"
                style={{ width: `${width}%`, background: s.color }}
              />
              <span
                className="absolute inset-y-0 end-2 flex items-center text-[9.5px] font-medium"
                style={{ color: width > 88 ? "#fff" : "#565A5E" }}
              >
                {pick(s.note)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Drawer ──────────────────────────────────────────────────────────────── */

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: Bi;
  eyebrow?: Bi;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { pick } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="no-print absolute inset-y-0 end-0 flex w-full max-w-[470px] flex-col border-s border-line bg-white shadow-2xl fade-up">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {eyebrow && <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-toyota">{pick(eyebrow)}</div>}
            <h2 className="text-[16px] font-semibold leading-tight text-ink">{pick(title)}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-steel transition hover:bg-alum hover:text-ink"
            aria-label="close"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-line bg-[#FAFAF8] px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function KV({ k, v, mono }: { k: Bi; v: ReactNode; mono?: boolean }) {
  const { pick } = useI18n();
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line/70 py-2 last:border-0">
      <span className="text-[11px] text-steel">{pick(k)}</span>
      <span className={cn("text-end text-[11.5px] font-medium text-ink", mono && "num")}>{v}</span>
    </div>
  );
}

/* ── Buttons + export ────────────────────────────────────────────────────── */

export function GhostButton({
  children,
  onClick,
  active,
  className,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 text-[11.5px] font-medium transition",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink hover:border-ink/25 hover:bg-[#FAFAF8]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function InfoTip({ text }: { text: Bi }) {
  const { pick } = useI18n();
  return (
    <span className="tooltip-host relative inline-flex" tabIndex={0}>
      <Info size={12} className="text-[#9A9E9F] transition hover:text-ink" />
      <span className="tooltip-body absolute bottom-full start-1/2 z-50 mb-1.5 w-52 -translate-x-1/2 rounded-md border border-ink bg-ink p-2 text-[10px] font-normal leading-relaxed text-white shadow-lg rtl:translate-x-1/2">
        {pick(text)}
      </span>
    </span>
  );
}

export function ExportMenu({ onExport, dark = false }: { onExport: (format: "csv" | "pdf") => void; dark?: boolean }) {
  const { pick } = useI18n();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="relative">
      <GhostButton
        onClick={() => setOpen((v) => !v)}
        className={dark ? "h-8 border-white/15 bg-white/[0.06] text-white hover:bg-white/10" : ""}
        title={pick(bi("Export this section", "تصدير هذا القسم"))}
      >
        <Download size={13} />
        <span className="hidden sm:inline">{pick(bi("Export", "تصدير"))}</span>
      </GhostButton>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-9 z-40 w-40 overflow-hidden rounded-lg border border-line bg-white p-1 shadow-xl fade-up">
            <button
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-[11px] text-ink hover:bg-alum"
              onClick={() => {
                onExport("csv");
                setOpen(false);
                setDone(true);
                window.setTimeout(() => setDone(false), 1800);
              }}
            >
              <Download size={13} /> {pick(bi("Download CSV", "تحميل CSV"))}
            </button>
            <button
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-[11px] text-ink hover:bg-alum"
              onClick={() => {
                onExport("pdf");
                setOpen(false);
                setDone(true);
                window.setTimeout(() => setDone(false), 1800);
              }}
            >
              <FileText size={13} /> {pick(bi("Print / PDF", "طباعة / PDF"))}
            </button>
            <div className="mt-1 border-t border-line px-2 py-1.5 text-[9.5px] text-steel">
              {pick(bi("Mirrored data · no writes", "بيانات مرآة · بدون كتابة"))}
            </div>
          </div>
        </>
      )}
      {done && (
        <span className="absolute end-0 top-10 z-40 inline-flex items-center gap-1 rounded-md border border-[#BFE6CE] bg-[#EAF7EF] px-2 py-1 text-[10px] font-medium text-[#1E7A46]">
          <Check size={11} /> {pick(bi("Ready", "تم"))}
        </span>
      )}
    </div>
  );
}

export function Insight({
  title,
  body,
  tone = "warn",
  action,
}: {
  title: Bi;
  body: Bi;
  tone?: "warn" | "danger" | "ok" | "neutral";
  action?: ReactNode;
}) {
  const { pick } = useI18n();
  const map = {
    warn: { bg: "bg-[#FEF8EC]", border: "border-[#F3DDAE]", dot: "#F39C12" },
    danger: { bg: "bg-[#FDF0EE]", border: "border-[#F6C7C2]", dot: "#E74C3C" },
    ok: { bg: "bg-[#EEF8F2]", border: "border-[#BFE6CE]", dot: "#27AE60" },
    neutral: { bg: "bg-[#FAFAF8]", border: "border-line", dot: "#1A1A1A" },
  } as const;
  const m = map[tone];
  return (
    <div className={cn("rounded-lg border p-3.5", m.bg, m.border)}>
      <div className="flex items-start gap-2.5">
        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: m.dot }} />
        <div className="min-w-0 flex-1">
          <div className="text-[11.5px] font-semibold text-ink">{pick(title)}</div>
          <p className="mt-1 text-[10.5px] leading-relaxed text-[#565A5E]">{pick(body)}</p>
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export function SeeAll({ onClick, label }: { onClick: () => void; label?: Bi }) {
  const { pick } = useI18n();
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[10.5px] font-medium text-ink/70 transition hover:text-toyota"
    >
      {pick(label ?? bi("Drill down", "التفاصيل"))}
      <ArrowUpRight size={12} />
    </button>
  );
}

export function SourceNote({ children }: { children?: ReactNode }) {
  const { pick } = useI18n();
  return (
    <p className="mt-2 flex items-start gap-1.5 text-[9.5px] leading-relaxed text-[#9A9E9F]">
      <Info size={10} className="mt-[1px] shrink-0" />
      {children ?? pick(bi("Mirrored from legacy DMS via read-only CDC · no write-back.", "مرآة من النظام القديم عبر CDC للقراءة فقط · بدون أي كتابة عكسية."))}
    </p>
  );
}
