import { useMemo, useState } from "react";
import { ArrowLeftRight, ArrowUpRight, Boxes, Clock, MapPin, Route, Truck, Wrench } from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { branchById, branches, topRoutes, transfers, type BranchId, type Transfer, type TransferReason } from "@/data";
import {
  Badge,
  Card,
  Drawer,
  ExportMenu,
  GhostButton,
  Insight,
  KV,
  KeyMetric,
  KpiTile,
  Meter,
  PageHeader,
  SectionHead,
  SeeAll,
  SourceNote,
  statusMeta,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

const reasonMeta: Record<TransferReason, { label: ReturnType<typeof bi>; color: string; icon: typeof Wrench }> = {
  diagnostic: { label: bi("Diagnostic need", "حاجة تشخيصية"), color: "#1A1A1A", icon: Wrench },
  specialty: { label: bi("Specialty part", "قطعة تخصصية"), color: "#EB0A1A", icon: Boxes },
  overflow: { label: bi("Capacity overflow", "ضغط طاقة"), color: "#F39C12", icon: Truck },
};

const matrixShade = (count: number) => (count === 0 ? "#F5F5F2" : count <= 1 ? "#E7E7E1" : count <= 2 ? "#C9C9C0" : count <= 4 ? "#6E7071" : "#1A1A1A");

/**
 * CROSS-BRANCH PARTS TRANSFERS
 * Pain point: parts bottlenecks + hidden logistics cost.
 * Transfers are executed in the legacy stock module; T3 mirrors the route,
 * reason and cycle time so executives can optimise visibility, not dispatch.
 */
export default function Transfers({ branchIds, onNavigate, onExport }: SectionProps) {
  const { pick, n, sar, lang } = useI18n();
  const [route, setRoute] = useState<{ from: BranchId; to: BranchId } | null>(null);
  const [reasonFilter, setReasonFilter] = useState<TransferReason | "all">("all");

  const inScope = (id: BranchId) => branchIds === "all" || branchIds.includes(id);
  const scoped = transfers.filter((t) => inScope(t.from) && inScope(t.to));
  const routeDetails: Transfer[] = useMemo(
    () => (route ? transfers.filter((t) => t.from === route.from && t.to === route.to) : []),
    [route]
  );
  const matrix = branches.map((from) =>
    branches.map((to) => (from.id === to.id ? 0 : transfers.filter((t) => t.from === from.id && t.to === to.id).length))
  );
  const avgResolution = (transfers.reduce((s, t) => s + t.hours, 0) / transfers.length).toFixed(1);
  const reasonCounts = (["diagnostic", "specialty", "overflow"] as TransferReason[]).map((r) => ({
    id: r,
    count: transfers.filter((t) => t.reason === r).length,
  }));
  const top = topRoutes[0];

  return (
    <div>
      <PageHeader
        index="07"
        eyebrow={bi("Network logistics · availability", "لوجستيات الشبكة · التوفر")}
        title={bi("Parts transfers — shadow inventory", "نقل القطع — المخزون الخفي")}
        subtitle={bi(
          "Every inter-branch movement this week, with reason and resolution time. Transfers are read from the legacy stock ledger; central visibility is the lever, not more stock.",
          "كل حركة بين الفروع هذا الأسبوع مع السبب وزمن الحل. الحركات مقروءة من دفتر المخزون القديم؛ الرؤية المركزية هي الحل، مو زيادة المخزون."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("parts")} className="h-8">
              <Boxes size={13} /> {pick(bi("Inventory velocity", "سرعة المخزون"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("Transfers this week", "النقلات هذا الأسبوع")} value={n(transfers.length)} unit={bi("routes", "حركة")} icon={<ArrowLeftRight size={14} />} delta={-4} deltaInverse foot={bi("target optimize < 15", "المستهدف أقل من ١٥")} />
        <KpiTile label={bi("Avg resolution", "متوسط زمن الحل")} value={n(Number(avgResolution), 1)} unit={bi("hrs", "ساعة")} icon={<Clock size={14} />} foot={bi("create → handover", "إنشاء → تسليم")} />
        <KpiTile label={bi("Logistics cost / week", "تكلفة النقل / أسبوع")} value={sar(transfers.length * 185, true)} icon={<Truck size={14} />} foot={bi("SAR 185 per movement", "١٨٥ ر.س لكل حركة")} />
        <KpiTile label={bi("Top route pressure", "أعلى مسار ضغطًا")} value={n(top.count)} unit={bi("/ week", "/ أسبوع")} icon={<Route size={14} />} foot={bi(`${branchById(top.from).name.en} → ${branchById(top.to).name.en}`, `${branchById(top.from).name.ar} ← ${branchById(top.to).name.ar}`)} />
      </div>

      <div className="mt-3">
        <KeyMetric
          icon={<ArrowLeftRight size={15} />}
          label={bi("All reasons · 6-branch network · this week", "كل الأسباب · شبكة ٦ فروع · هذا الأسبوع")}
          value={pick(bi(`Cross-branch transfers/week: ${transfers.length} (target optimize to <15)`, `نقل القطع بين الفروع/أسبوع: ${n(transfers.length)} (المستهدف أقل من ١٥)`))}
          footnote={bi(
            `Five of ${n(transfers.length)} movements (${Math.round((top.count / transfers.length) * 100)}%) are ${top.from} → ${top.to}. Shared visibility of Sanaiya stock could avoid ~8 movements and SAR 1,480/week.`,
            `${n(top.count)} من ${n(transfers.length)} حركة (${n(Math.round((top.count / transfers.length) * 100))}٪) من ${pick(branchById(top.from).name)} إلى ${pick(branchById(top.to).name)}. رؤية مشتركة لمخزون الصناعية قد تتجنب ≈٨ حركات و١٬٤٨٠ ر.س/أسبوع.`
          )}
          status="watch"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        {/* Matrix */}
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("Transfer matrix · from → to", "مصفوفة النقل · من ← إلى")}
            subtitle={bi("Cell = movements this week · click a route for parts, vehicles and resolution", "الخلية = حركات هذا الأسبوع · اضغط المسار للقطع والمركبات وزمن الحل")}
            right={<Badge tone="ink">{pick(bi(`${n(transfers.length)} total`, `${n(transfers.length)} حركة`))}</Badge>}
          />
          <div className="p-3 sm:p-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="w-[110px] rounded-md bg-[#FAFAF8] px-2 py-1.5 text-start text-[8px] font-medium uppercase tracking-[0.1em] text-steel">{pick(bi("From \\ To", "من \\ إلى"))}</th>
                    {branches.map((b) => (
                      <th key={b.id} className={cn("rounded-md bg-[#FAFAF8] px-1 py-1.5 text-center text-[8.5px] font-medium", inScope(b.id) ? "text-steel" : "text-[#C5C7C8]")}>
                        <span className="mx-auto mb-0.5 block h-1 w-1 rounded-full" style={{ background: statusMeta[b.status].hex }} />
                        {pick(b.name)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {branches.map((from) => (
                    <tr key={from.id}>
                      <td className={cn("rounded-md bg-[#FAFAF8] px-2 py-1.5 text-[9px] font-medium", inScope(from.id) ? "text-ink" : "text-[#C5C7C8]")}>
                        <span className="flex items-center gap-1"><span className="h-1 w-1 shrink-0 rounded-full" style={{ background: statusMeta[from.status].hex }} />{pick(from.name)}</span>
                      </td>
                      {branches.map((to, ci) => {
                        const count = matrix[branches.findIndex((x) => x.id === from.id)][ci];
                        const diag = from.id === to.id;
                        const selected = route?.from === from.id && route?.to === to.id;
                        const dim = !inScope(from.id) || !inScope(to.id);
                        return (
                          <td key={to.id} className="p-0">
                            <button
                              disabled={diag || count === 0}
                              onClick={() => setRoute({ from: from.id, to: to.id })}
                              title={`${pick(from.name)} → ${pick(to.name)} · ${n(count)}`}
                              className={cn(
                                "num relative flex h-[42px] w-full items-center justify-center rounded-md text-[13px] font-bold transition",
                                diag ? "cursor-default border border-dashed border-line bg-transparent text-[#D4D5D2]" : count === 0 ? "cursor-default bg-[#FAFAF8] text-[#CBCCC8]" : "cursor-pointer hover:ring-2 hover:ring-toyota/40",
                                selected && "ring-2 ring-toyota",
                                dim && count > 0 && "opacity-30"
                              )}
                              style={!diag && count > 0 ? { background: matrixShade(count), color: count >= 3 ? "#fff" : "#1A1A1A" } : undefined}
                            >
                              {diag ? "—" : n(count)}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[8.5px] text-steel">{pick(bi("Movements:", "الحركات:"))}</span>
                {[1, 2, 3, 5].map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 text-[8.5px] text-steel">
                    <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: matrixShade(v) }} /> {n(v)}
                  </span>
                ))}
              </div>
              <span className="text-[8.5px] text-steel">{pick(bi("Diagonal = same branch (excluded)", "القطر = نفس الفرع (مستبعد)"))}</span>
            </div>
          </div>
          <SourceNote />
        </Card>

        {/* Top routes + reasons */}
        <div className="space-y-3">
          <Card className="overflow-hidden">
            <SectionHead title={bi("Top transfer routes", "أعلى مسارات النقل")} subtitle={bi("Ranked by weekly volume", "مرتبة حسب الحركة الأسبوعية")} right={<ArrowUpRight size={13} className="text-steel" />} />
            <div className="divide-y divide-line">
              {topRoutes.slice(0, 5).map((r, i) => (
                <button key={`${r.from}-${r.to}`} onClick={() => setRoute({ from: r.from, to: r.to })} className="flex w-full items-center gap-2 px-3 py-2 text-start transition hover:bg-[#FAFAF8]">
                  <span className="num flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#F4F4F1] text-[8px] font-bold text-steel">{n(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 text-[9.5px] font-medium text-ink">
                      <span className="truncate">{pick(branchById(r.from).name)}</span>
                      <span className="text-toyota">{lang === "ar" ? "←" : "→"}</span>
                      <span className="truncate">{pick(branchById(r.to).name)}</span>
                    </span>
                    <span className="block text-[8px] text-steel">{pick(reasonMeta[r.reason].label)} · {n(r.avgHours, 1)}h</span>
                  </span>
                  <span className="num shrink-0 rounded bg-ink px-1.5 py-0.5 text-[9px] font-semibold text-white">{n(r.count)}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-line bg-[#FAFAF8] px-3 py-2">
              <SeeAll onClick={() => setRoute({ from: top.from, to: top.to })} label={bi("Open top route", "افتح أعلى مسار")} />
            </div>
          </Card>

          <Card>
            <SectionHead title={bi("Reason codes", "أسباب النقل")} subtitle={bi("Why inventory moves at all", "ليش المخزون يتحرك أصلًا")} />
            <div className="space-y-2.5 p-4">
              {reasonCounts.map((r) => {
                const Icon = reasonMeta[r.id].icon;
                return (
                  <div key={r.id}>
                    <div className="mb-1 flex items-center gap-1.5 text-[9.5px]">
                      <Icon size={10} style={{ color: reasonMeta[r.id].color }} />
                      <span className="flex-1 text-steel">{pick(reasonMeta[r.id].label)}</span>
                      <span className="num font-semibold text-ink">{n(r.count)}</span>
                      <span className="num text-[8px] text-steel">({n(Math.round((r.count / transfers.length) * 100))}٪)</span>
                    </div>
                    <Meter value={r.count} max={transfers.length} tone={reasonMeta[r.id].color} height={5} showTarget={false} />
                  </div>
                );
              })}
              <div className="rounded-md border border-line bg-[#FAFAF8] p-2 text-[8.5px] leading-relaxed text-steel">
                {pick(bi("Diagnostic + specialty = visibility problems. Overflow = capacity problem.", "التشخيصي + التخصصي = مشكلة رؤية. الضغط = مشكلة طاقة."))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("Transfer ledger · mirrored", "دفتر النقل · مرآة")}
            subtitle={bi("Parts, vehicles, reasons and resolution time", "القطع والمركبات والأسباب وزمن الحل")}
            right={
              <div className="flex flex-wrap gap-1">
                {(["all", "diagnostic", "specialty", "overflow"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setReasonFilter(r)}
                    className={cn("rounded px-1.5 py-1 text-[8.5px] font-medium transition", reasonFilter === r ? "bg-ink text-white" : "text-steel hover:text-ink")}
                  >
                    {r === "all" ? pick(bi("All", "الكل")) : pick(reasonMeta[r].label)}
                  </button>
                ))}
              </div>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="bg-[#FAFAF8] text-[8.5px] uppercase tracking-[0.08em] text-steel">
                  {[bi("Route", "المسار"), bi("Part", "القطعة"), bi("Vehicle", "المركبة"), bi("Reason", "السبب"), bi("Qty", "الكمية"), bi("Resolution", "زمن الحل")].map((h) => (
                    <th key={h.en} className="border-b border-line px-3 py-2 text-start font-semibold first:ps-4">{pick(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoped.filter((t) => reasonFilter === "all" || t.reason === reasonFilter).map((t) => (
                  <tr key={t.id} onClick={() => setRoute({ from: t.from, to: t.to })} className="cursor-pointer border-b border-line/60 text-[9.5px] transition last:border-0 hover:bg-[#FAFAF8]">
                    <td className="px-3 py-2 first:ps-4">
                      <div className="flex items-center gap-1 font-medium text-ink">
                        <span>{pick(branchById(t.from).name)}</span>
                        <span className="text-toyota">{lang === "ar" ? "←" : "→"}</span>
                        <span>{pick(branchById(t.to).name)}</span>
                      </div>
                      <div className="num text-[8px] text-steel">{t.id}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="max-w-[160px] truncate text-ink">{pick(t.part)}</div>
                      <div className="num text-[8px] text-steel">{t.partNo}</div>
                    </td>
                    <td className="px-3 py-2 text-steel">{pick(t.vehicle)}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[8.5px]" style={{ background: `${reasonMeta[t.reason].color}12`, color: reasonMeta[t.reason].color }}>
                        {pick(reasonMeta[t.reason].label)}
                      </span>
                    </td>
                    <td className="num px-3 py-2">{n(t.qty)}</td>
                    <td className="px-3 py-2"><span className={cn("num inline-flex items-center gap-1", t.hours > 5 ? "text-[#B0281D]" : "text-steel")}><Clock size={9} /> {n(t.hours, 1)}h</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote />
        </Card>

        <div className="space-y-3">
          <Insight
            tone="warn"
            title={bi("Redistribute, don't duplicate", "أعد التوزيع، لا تضاعف الشراء")}
            body={bi(
              "Sanaiya is a parts hub but 6 high-velocity filters sit under 7 days while Dahdah holds 34 of the same SKU. One shared availability view removes the transfer and the wait.",
              "الصناعية مركز قطع، لكن ٦ فلاتر سريعة تحت ٧ أيام، ودحضة عندها ٣٤ من نفس الصنف. شاشة توفر مشتركة تلغي النقلة والانتظار."
            )}
          />
          <Card className="overflow-hidden">
            <SectionHead title={bi("Longest resolutions", "أطول أزمنة حل")} subtitle={bi("Above 5 hours risks a missed promise", "فوق ٥ ساعات يهدد موعد التسليم")} right={<Clock size={13} className="text-warn" />} />
            <div className="divide-y divide-line">
              {[...transfers].sort((a, b) => b.hours - a.hours).slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-2 px-3 py-2">
                  <span className="num flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#FEF5E4] text-[8px] font-bold text-[#9A6206]">{n(t.hours, 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[9.5px] font-medium text-ink">{pick(t.part)}</span>
                    <span className="block truncate text-[8px] text-steel">{pick(branchById(t.from).name)} ← {pick(branchById(t.to).name)}</span>
                  </span>
                  <MapPin size={10} className="shrink-0 text-steel" />
                </div>
              ))}
            </div>
          </Card>
          <div className="rounded-lg border border-line bg-white p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-ink"><ArrowLeftRight size={12} className="text-toyota" /> {pick(bi("Read-only logistics mirror", "مرآة لوجستية للقراءة فقط"))}</div>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-steel">
              {pick(bi("T3 records the route and reason. Creating a transfer, reserving a part or editing stock is impossible by design.", "الطبقة الثالثة تسجل المسار والسبب فقط. إنشاء النقل أو حجز القطعة أو تعديل المخزون غير ممكن بالتصميم."))}
            </p>
          </div>
        </div>
      </div>

      <Drawer
        open={!!route}
        onClose={() => setRoute(null)}
        eyebrow={bi("Route drill-down · read-only", "مسار مفصل · قراءة فقط")}
        title={route ? bi(`${branchById(route.from).name.en} → ${branchById(route.to).name.en}`, `${branchById(route.from).name.ar} ← ${branchById(route.to).name.ar}`) : bi("", "")}
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-steel">{pick(bi("Execution stays in legacy stock module", "التنفيذ في وحدة المخزون القديمة"))}</span>
            <GhostButton onClick={() => onNavigate("parts")}>{pick(bi("SKU detail", "تفاصيل الصنف"))} <ArrowUpRight size={12} /></GhostButton>
          </div>
        }
      >
        {route && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: bi("Movements", "الحركات"), v: n(routeDetails.length) },
                { l: bi("Avg resolution", "متوسط الحل"), v: `${n(Number((routeDetails.reduce((s, t) => s + t.hours, 0) / Math.max(routeDetails.length, 1)).toFixed(1)), 1)}h` },
                { l: bi("Units moved", "الوحدات"), v: n(routeDetails.reduce((s, t) => s + t.qty, 0)) },
              ].map((x) => (
                <div key={x.l.en} className="rounded-lg border border-line bg-[#FAFAF8] p-2">
                  <div className="text-[8px] text-steel">{pick(x.l)}</div>
                  <div className="num mt-0.5 text-[14px] font-bold text-ink">{x.v}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {routeDetails.map((t) => (
                <div key={t.id} className="rounded-lg border border-line p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[10.5px] font-medium text-ink">{pick(t.part)}</div>
                      <div className="num text-[8.5px] text-steel">{t.partNo} · {t.id}</div>
                    </div>
                    <Badge tone={t.reason === "diagnostic" ? "ink" : t.reason === "specialty" ? "danger" : "warn"}>{pick(reasonMeta[t.reason].label)}</Badge>
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-[8.5px]">
                    <div className="rounded bg-[#FAFAF8] p-1"><div className="text-steel">{pick(bi("Vehicle", "المركبة"))}</div><div className="mt-0.5 truncate text-ink">{pick(t.vehicle)}</div></div>
                    <div className="rounded bg-[#FAFAF8] p-1"><div className="text-steel">{pick(bi("Qty", "الكمية"))}</div><div className="num mt-0.5 text-ink">{n(t.qty)}</div></div>
                    <div className="rounded bg-[#FAFAF8] p-1"><div className="text-steel">{pick(bi("Resolution", "الحل"))}</div><div className="num mt-0.5 text-ink">{n(t.hours, 1)}h</div></div>
                  </div>
                </div>
              ))}
              {routeDetails.length === 0 && <div className="rounded-lg border border-dashed border-line p-4 text-center text-[10px] text-steel">{pick(bi("No movements on this route this week.", "لا حركات على هذا المسار هذا الأسبوع."))}</div>}
            </div>
            <div className="rounded-lg border border-line bg-[#FAFAF8] p-3">
              <div className="mb-1 text-[10px] font-semibold text-ink">{pick(bi("Resolution cycle (mirror)", "دورة الحل (مرآة)"))}</div>
              <div className="space-y-1">
                <KV k={bi("Request created", "إنشاء الطلب")} v={pick(bi("Legacy parts module", "وحدة القطع القديمة"))} />
                <KV k={bi("Approval", "الموافقة")} v={pick(bi("Branch manager", "مدير الفرع"))} />
                <KV k={bi("Handover", "التسليم")} v={pick(bi("Logged on receipt", "يُسجل عند الاستلام"))} />
                <KV k={bi("T3 involvement", "مشاركة الطبقة الثالثة")} v={pick(bi("Observation only", "مراقبة فقط"))} />
              </div>
            </div>
            <SourceNote />
          </div>
        )}
      </Drawer>
    </div>
  );
}
