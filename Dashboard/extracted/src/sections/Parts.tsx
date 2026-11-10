import { useMemo, useState } from "react";
import { ArrowLeftRight, ArrowUpRight, Boxes, PackageSearch, Search, TriangleAlert, TrendingDown, Warehouse } from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { branchById, branches, network, parts, riskLevel, slowMovers, stockoutRisk, topRoutes, transfers, type Part } from "@/data";
import {
  Badge,
  Card,
  Drawer,
  ExportMenu,
  GhostButton,
  HealthPill,
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

type PartFilter = "all" | "fast" | "watch" | "slow" | "risk";

/**
 * PARTS INVENTORY
 * Pain point: parts bottlenecks + invisible inter-branch demand.
 * Days-of-supply is computed by the mirror from legacy issue history. No reorder,
 * reservation or transfer execution is possible from this layer.
 */
export default function Parts({ branchIds, onNavigate, onExport }: SectionProps) {
  const { pick, n, pct, sar } = useI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PartFilter>("all");
  const [shown, setShown] = useState(14);
  const [selected, setSelected] = useState<Part | null>(null);

  const indices = branchIds === "all" ? branches.map((_, i) => i) : branches.map((b, i) => (branchIds.includes(b.id) ? i : -1)).filter((i) => i >= 0);

  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((p) => {
      const matchQuery = !q || p.partNo.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q) || p.name.ar.includes(q);
      const matchFilter =
        filter === "all"
          ? true
          : filter === "fast"
            ? p.daysSupply < 30
            : filter === "watch"
              ? p.daysSupply >= 30 && p.daysSupply <= 60
              : filter === "risk"
                ? p.risk
                : p.daysSupply > 60;
      return matchQuery && matchFilter;
    });
  }, [query, filter]);

  const scopedStock = (p: Part) => indices.reduce((s, i) => s + p.stock[i], 0);
  const inventoryValue = parts.reduce((s, p) => s + p.onHand * p.price, 0);
  const slowCount = parts.filter((p) => p.daysSupply > 90).length;
  const net = network(branchIds);

  const recommended = (p: Part) => {
    const ranked = branches.map((b, i) => ({ b, stock: p.stock[i] })).sort((a, b) => b.stock - a.stock);
    const source = ranked[0];
    const target = [...ranked].reverse().find((r) => r.stock < source.stock - 1) ?? ranked[ranked.length - 1];
    const qty = Math.max(1, Math.floor((source.stock - target.stock) / 2));
    return { source: source.b, sourceStock: source.stock, target: target.b, targetStock: target.stock, qty };
  };

  const filterChips: { id: PartFilter; label: ReturnType<typeof bi>; count: number }[] = [
    { id: "all", label: bi("All SKUs", "كل الأصناف"), count: parts.length },
    { id: "fast", label: bi("Fast <30d", "سريع <٣٠ يوم"), count: parts.filter((p) => p.daysSupply < 30).length },
    { id: "watch", label: bi("31–60d", "٣١–٦٠ يوم"), count: parts.filter((p) => p.daysSupply >= 30 && p.daysSupply <= 60).length },
    { id: "slow", label: bi("Slow >60d", "راكد >٦٠ يوم"), count: parts.filter((p) => p.daysSupply > 60).length },
    { id: "risk", label: bi("Stockout ≤7d", "نفاد ≤٧ أيام"), count: parts.filter((p) => p.risk).length },
  ];

  return (
    <div>
      <PageHeader
        index="03"
        eyebrow={bi("Supply chain · inventory velocity", "سلسلة الإمداد · سرعة المخزون")}
        title={bi("Parts — velocity beats quantity", "القطع — السرعة أهم من الكمية")}
        subtitle={bi(
          "Days of supply per SKU, week-by-week issue velocity, and cross-branch demand. Inventory is mirrored from the parts ledger; recommendations are advisory only.",
          "تغطية كل صنف بالأيام، وسرعة الصرف أسبوعيًا، والطلب بين الفروع. المخزون مرآة من دفتر القطع؛ والتوصيات للاستئناس فقط."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("transfers")} className="h-8">
              <ArrowLeftRight size={13} /> {pick(bi("Transfer matrix", "مصفوفة النقل"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("Inventory value (mirror)", "قيمة المخزون (مرآة)")} value={sar(inventoryValue, true)} icon={<Warehouse size={14} />} foot={bi("at legacy landed cost", "بتكلفة النظام القديم")} />
        <KpiTile label={bi("Active SKUs", "أصناف نشطة")} value={n(parts.length)} unit={bi("SKUs", "صنف")} icon={<Boxes size={14} />} foot={bi(`${n(slowCount)} over 90 days · ${pct(Math.round((slowCount / parts.length) * 100))} of catalogue`, `${n(slowCount)} فوق ٩٠ يومًا · ${pct(Math.round((slowCount / parts.length) * 100))} من الكتالوج`)} />
        <KpiTile label={bi("Stockout risk ≤7d", "خطر نفاد ≤٧ أيام")} value={n(stockoutRisk.length)} unit={bi("SKUs", "صنف")} icon={<TriangleAlert size={14} />} foot={bi("across selected branches", "عبر الفروع المختارة")} />
        <KpiTile label={bi("Inventory turnover", "دوران المخزون")} value={`${n(net.partsTurn, 1)}×`} unit={bi("/ year", "/ سنة")} icon={<PackageSearch size={14} />} delta={-2.1} deltaInverse foot={bi("target 6.0× · gap 1.8×", "المستهدف ٦.٠× · الفجوة ١.٨×")} />
      </div>

      <div className="mt-3">
        <KeyMetric
          icon={<PackageSearch size={15} />}
          label={bi("Annualised across the six-branch ledger · legacy costing", "سنوي على دفتر الفروع الستة · تكلفة النظام القديم")}
          value={pick(bi("Parts inventory turnover: 4.2x/year (target 6.0x)", "دوران المخزون: ٤.٢ مرة/سنة (المستهدف ٦.٠ مرة)"))}
          footnote={bi(
            "SAR 148K is parked in >90-day stock while 6 fast movers sit under 7 days. Visibility, not capital, is the constraint.",
            "١٤٨ ألف ريال مجمّدة في مخزون فوق ٩٠ يومًا، بينما ٦ أصناف سريعة تحت ٧ أيام. القيد هو الرؤية مو رأس المال."
          )}
          status="watch"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        {/* Velocity table */}
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("Days of supply · SKU velocity", "تغطية الأيام · سرعة الصنف")}
            subtitle={bi("Green <30d · amber 31–60d · red >60d. Mirrored from issue history.", "أخضر <٣٠ يوم · أصفر ٣١–٦٠ · أحمر >٦٠. ملتقط من سجل الصرف.")}
            right={<Badge tone="neutral">{pick(bi(`${n(scoped.length)} results`, `${n(scoped.length)} نتيجة`))}</Badge>}
          />
          <div className="flex flex-wrap items-center gap-1.5 border-b border-line bg-[#FCFCFA] px-3 py-2">
            <div className="relative">
              <Search size={12} className="absolute start-2 top-1/2 -translate-y-1/2 text-steel" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShown(14);
                }}
                placeholder={pick(bi("Search part no. or description", "ابحث برقم القطعة أو الوصف"))}
                className="h-7 w-[190px] rounded-md border border-line bg-white pe-2 ps-7 text-[10px] text-ink outline-none placeholder:text-[#B0B3B4] focus:border-ink/40"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {filterChips.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    setShown(14);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-1.5 py-1 text-[9.5px] font-medium transition",
                    filter === f.id ? "border-ink bg-ink text-white" : "border-line bg-white text-steel hover:border-ink/25 hover:text-ink"
                  )}
                >
                  {pick(f.label)}
                  <span className={cn("num text-[8px]", filter === f.id ? "text-white/50" : "text-[#B0B3B4]")}>{n(f.count)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="bg-[#FAFAF8] text-[8.5px] uppercase tracking-[0.08em] text-steel">
                  {[bi("Part", "القطعة"), bi("Category", "الفئة"), bi("On hand", "المخزون"), bi("Days supply", "أيام التغطية"), bi("Issued / wk", "صرف/أسبوع"), bi("Value", "القيمة")].map((h) => (
                    <th key={h.en} className="border-b border-line px-3 py-2 text-start font-semibold first:ps-3">{pick(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoped.slice(0, shown).map((p) => {
                  const level = riskLevel(p.daysSupply);
                  return (
                    <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-line/60 text-[10px] transition last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-3 py-2">
                        <div className="font-medium text-ink">{pick(p.name)}</div>
                        <div className="num text-[8.5px] text-steel">{p.partNo}</div>
                      </td>
                      <td className="px-3 py-2 text-[9px] text-steel">{pick(p.category)}</td>
                      <td className="num px-3 py-2 font-medium">{n(scopedStock(p))}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="num w-7 text-[10px] font-semibold" style={{ color: statusMeta[level].hex }}>{n(p.daysSupply)}</span>
                          <div className="w-14"><Meter value={Math.min(p.daysSupply, 120)} max={120} tone={statusMeta[level].hex} height={4} showTarget={false} /></div>
                        </div>
                      </td>
                      <td className="num px-3 py-2">{n(p.weeklyIssued, 1)}</td>
                      <td className="num px-3 py-2 text-steel">{sar(scopedStock(p) * p.price, true)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line px-3 py-2">
            <span className="text-[9px] text-steel">{pick(bi(`Showing ${n(Math.min(shown, scoped.length))} of ${n(scoped.length)} active SKUs`, `عرض ${n(Math.min(shown, scoped.length))} من ${n(scoped.length)} صنف نشط`))}</span>
            {shown < scoped.length ? (
              <button onClick={() => setShown((s) => s + 14)} className="rounded-md border border-line bg-white px-2 py-1 text-[9.5px] font-medium text-ink hover:border-ink/25">{pick(bi("Load more", "عرض المزيد"))}</button>
            ) : (
              <SeeAll onClick={() => onNavigate("transfers")} label={bi("Transfer tracker", "متتبع النقل")} />
            )}
          </div>
          <SourceNote />
        </Card>

        {/* Right column */}
        <div className="space-y-3">
          <Card className="overflow-hidden">
            <SectionHead
              title={bi("Slow movers · >90 days", "أصناف راكدة · +٩٠ يوم")}
              subtitle={bi("Redistribution candidates, ranked by frozen capital", "مرشحة لإعادة التوزيع حسب رأس المال المجمّد")}
              right={<Badge tone="danger">{n(slowMovers.length)}</Badge>}
            />
            <div className="max-h-[300px] divide-y divide-line overflow-y-auto">
              {slowMovers.map((p) => {
                const rec = recommended(p);
                return (
                  <button key={p.id} onClick={() => setSelected(p)} className="w-full px-3 py-2 text-start transition hover:bg-[#FAFAF8]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[10px] font-medium text-ink">{pick(p.name)}</span>
                        <span className="num block text-[8px] text-steel">{p.partNo}</span>
                      </span>
                      <span className="num shrink-0 rounded bg-[#FDECEA] px-1.5 py-0.5 text-[9px] font-semibold text-[#B0281D]">{n(p.daysSupply)}d</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[8.5px] text-[#1E7A46]">
                      <ArrowLeftRight size={8} />
                      {pick(bi(`Move ${n(rec.qty)} to ${rec.target.name.en}`, `حوّل ${n(rec.qty)} إلى ${rec.target.name.ar}`))}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-line bg-[#FAFAF8] px-3 py-2 text-[9px] leading-relaxed text-steel">
              {pick(bi("Recommendation is advisory — execution happens in the legacy stock-transfer module.", "التوصية للاستئناس — التنفيذ في وحدة تحويل المخزون بالنظام القديم."))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <SectionHead title={bi("Stockout risk · next 7 days", "خطر النفاد · ٧ أيام")} subtitle={bi("High velocity + thin cover", "صرف عالي + تغطية ضعيفة")} right={<TriangleAlert size={13} className="text-[#B0281D]" />} />
            <div className="divide-y divide-line">
              {stockoutRisk.slice(0, 5).map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className="flex w-full items-center gap-2 px-3 py-2 text-start transition hover:bg-[#FAFAF8]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-medium text-ink">{pick(p.name)}</span>
                    <span className="num block text-[8px] text-steel">{p.partNo} · {pick(bi(`${n(scopedStock(p))} on hand`, `${n(scopedStock(p))} بالمخزون`))}</span>
                  </span>
                  <span className="num shrink-0 text-[9.5px] font-semibold text-[#B0281D]">{n(p.daysSupply)}d</span>
                </button>
              ))}
            </div>
            <div className="border-t border-line px-3 py-2">
              <SeeAll onClick={() => { setFilter("risk"); setShown(14); }} label={bi("Filter full table", "تصفية الجدول كامل")} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <SectionHead title={bi("Cross-branch transfer tracker", "متتبع النقل بين الفروع")} subtitle={bi("This week · advisory visibility only", "هذا الأسبوع · رؤية استشارية فقط")} right={<Badge tone="ink">{n(transfers.length)}</Badge>} />
            <div className="space-y-2 p-3">
              {topRoutes.slice(0, 3).map((r) => (
                <button key={`${r.from}-${r.to}`} onClick={() => onNavigate("transfers")} className="w-full rounded-lg border border-line bg-[#FAFAF8] p-2 text-start transition hover:border-ink/25 hover:bg-white">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink">
                    <span className="truncate">{pick(branchById(r.from).name)}</span>
                    <ArrowUpRight size={10} className="shrink-0 text-toyota rtl:-scale-x-100" />
                    <span className="truncate">{pick(branchById(r.to).name)}</span>
                    <span className="num ms-auto shrink-0 rounded bg-ink px-1 py-0.5 text-[8.5px] text-white">{n(r.count)}</span>
                  </div>
                  <div className="mt-0.5 text-[8.5px] text-steel">
                    {pick(bi(`${n(r.count)} transfers this week · avg ${n(r.avgHours, 1)}h resolution`, `${n(r.count)} نقلات هذا الأسبوع · متوسط ${n(r.avgHours, 1)} ساعة`))}
                  </div>
                </button>
              ))}
            </div>
            <SourceNote />
          </Card>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-ink">{pick(bi("Capital trapped, by branch", "رأس المال المجمّد حسب الفرع"))}</span>
            <Badge tone="warn">{pick(bi("> 90 days", "> ٩٠ يومًا"))}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {branches.map((b, i) => {
              const value = parts.reduce((s, p) => s + (p.daysSupply > 90 ? p.stock[i] * p.price : 0), 0);
              return (
                <div key={b.id} className="rounded-lg border border-line p-2.5">
                  <div className="truncate text-[10px] text-steel">{pick(b.name)}</div>
                  <div className="num mt-1 text-[13px] font-bold text-ink">{sar(value, true)}</div>
                  <div className="mt-1.5"><Meter value={value} max={60000} tone="#E74C3C" height={4} showTarget={false} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Insight
          tone="warn"
          title={bi("The visibility gap is the bottleneck, not the cash", "الفجوة هي الرؤية مو الكاش")}
          body={bi(
            "23 transfers a week exist because advisors cannot see neighbouring stock. Al Jumoom holds 6 slow HVAC filters while Dahdah quotes 9-day lead times on the same SKU.",
            "٢٣ نقلة بالأسبوع لأن المستشار ما يشوف مخزون الفرع المجاور. الجموم عندها ٦ فلاتر مكيف راكدة، ودحضة تعطي العميل ٩ أيام انتظار لنفس الصنف."
          )}
        />
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        eyebrow={bi("SKU mirror · advisory only", "مرآة الصنف · استشاري فقط")}
        title={selected ? selected.name : bi("", "")}
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-steel">{pick(bi("No reorder / reservation write path", "لا يوجد مسار إعادة طلب أو حجز"))}</span>
            <GhostButton onClick={() => onNavigate("transfers")}>{pick(bi("Transfer routes", "مسارات النقل"))} <ArrowUpRight size={12} /></GhostButton>
          </div>
        }
      >
        {selected && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="neutral">{selected.partNo}</Badge>
              <HealthPill status={riskLevel(selected.daysSupply)} />
              <Badge tone={selected.risk ? "danger" : "ink"}>{pick(bi(`${n(selected.daysSupply)} days of supply`, `${n(selected.daysSupply)} يوم تغطية`))}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: bi("On hand", "المخزون"), v: n(selected.onHand) },
                { l: bi("Issued/week", "صرف/أسبوع"), v: n(selected.weeklyIssued, 1) },
                { l: bi("Unit price", "سعر الوحدة"), v: sar(selected.price, true) },
              ].map((x) => (
                <div key={x.l.en} className="rounded-lg border border-line bg-[#FAFAF8] p-2">
                  <div className="text-[8.5px] text-steel">{pick(x.l)}</div>
                  <div className="num mt-0.5 text-[13px] font-bold text-ink">{x.v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1.5 text-[10px] font-semibold text-ink">{pick(bi("Availability by branch", "التوفر حسب الفرع"))}</div>
              <div className="space-y-1.5">
                {branches.map((b, i) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <span className="w-[86px] shrink-0 truncate text-[9.5px] text-steel">{pick(b.name)}</span>
                    <div className="flex-1"><Meter value={selected.stock[i]} max={16} tone={selected.stock[i] ? "#1A1A1A" : "#E74C3C"} height={5} showTarget={false} /></div>
                    <span className={cn("num w-6 text-end text-[9.5px] font-semibold", selected.stock[i] ? "text-ink" : "text-danger")}>{n(selected.stock[i])}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <KV k={bi("Category", "الفئة")} v={pick(selected.category)} />
              <KV k={bi("Model fitment", "الموديل")} v={pick(selected.model)} />
              <KV k={bi("Last issued", "آخر صرف")} v={pick(bi(`${n(selected.lastUsedDays)} days ago · ${branchById(selected.lastUsedBranch).name.en}`, `قبل ${n(selected.lastUsedDays)} يوم · ${branchById(selected.lastUsedBranch).name.ar}`))} />
              <KV k={bi("Tied-up value", "القيمة المجمّدة")} v={sar(selected.onHand * selected.price)} mono />
            </div>
            <div className="rounded-lg border border-line bg-[#FAFAF8] p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold text-ink"><TrendingDown size={12} className="text-toyota" /> {pick(bi("Recommended action", "الإجراء المقترح"))}</div>
              <p className="text-[10px] leading-relaxed text-steel">
                {(() => {
                  const rec = recommended(selected);
                  return pick(
                    bi(
                      `Redistribute ${rec.qty} units from ${rec.source.name.en} (${rec.sourceStock} on hand) to ${rec.target.name.en} (${rec.targetStock} on hand). This reduces frozen capital and services the highest-velocity demand without a purchase.`,
                      `أعد توزيع ${n(rec.qty)} وحدات من ${rec.source.name.ar} (${n(rec.sourceStock)} بالمخزون) إلى ${rec.target.name.ar} (${n(rec.targetStock)} بالمخزون). هذا يقلل رأس المال المجمّد ويخدم أعلى طلب دون شراء جديد.`
                    )
                  );
                })()}
              </p>
            </div>
            <SourceNote />
          </div>
        )}
      </Drawer>
    </div>
  );
}
