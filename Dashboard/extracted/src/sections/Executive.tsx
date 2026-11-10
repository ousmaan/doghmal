import {
  ArrowUpRight,
  Banknote,
  Building2,
  ChevronLeft,
  Gauge,
  PackageSearch,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Star,
  TimerOff,
  Users,
} from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { branches, network, selectBranches } from "@/data";
import {
  BranchBars,
  Card,
  ExportMenu,
  GhostButton,
  HealthPill,
  KeyMetric,
  KpiTile,
  Meter,
  PageHeader,
  SectionHead,
  SeeAll,
  SourceNote,
  Sparkline,
  statusMeta,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

/**
 * EXECUTIVE SUMMARY
 * Pain-point mapping (Doghmal critique):
 *  · phone-based governance → "calls avoided" + idle-labour dividend
 *  · idle labour            → saved hours, utilisation gap vs 75%
 *  · customer attrition     → branch CSI + conversion watchlist
 *  · parts bottlenecks      → turnover tile + transfer pressure
 */
export default function Executive({ branchIds, onNavigate, onDrill, onExport }: SectionProps) {
  const { pick, sar, n, pct, lang } = useI18n();
  const net = network(branchIds);
  const list = selectBranches(branchIds);
  const laborValue = net.idleHoursSaved * 95;

  const quickLinks = [
    { id: "bays" as const, icon: Gauge, label: bi("Bay utilization", "استهلاك البايات"), stat: pct(net.utilization), sub: bi("target 75%", "المستهدف ٧٥٪") },
    { id: "parts" as const, icon: PackageSearch, label: bi("Parts turnover", "دوران المخزون"), stat: `${n(4.2, 1)}×`, sub: bi("per year", "في السنة") },
    { id: "csi" as const, icon: Star, label: bi("CSI & wait", "الرضا والانتظار"), stat: `${n(net.csi)}`, sub: bi(`wait ${n(net.wait)} min`, `انتظار ${n(net.wait)} د`) },
    { id: "conversion" as const, icon: Sparkles, label: bi("Sales-to-service", "التحويل للخدمة"), stat: pct(net.conversion), sub: bi("90-day window", "خلال ٩٠ يومًا") },
  ];

  return (
    <div>
      <PageHeader
        index="01"
        eyebrow={bi("Executive intelligence · Najran", "الذكاء التنفيذي · نجران")}
        title={bi("Command room — Najran network", "غرفة القيادة — شبكة نجران")}
        subtitle={bi(
          "A live mirror of Toyota, GWM and Haval operations across six branches. Values are captured from the legacy ERP/DMS by CDC — this dashboard never writes back.",
          "مرآة حيّة لعمليات تويوتا وGWM وهافال عبر ستة فروع. القيم تُلتقط من النظام القديم عبر CDC — هذي اللوحة ما تكتب ولا حرف في النظام."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("compliance")} className="h-8">
              <ShieldCheck size={13} className="text-ok" />
              {pick(bi("ZATCA · PDPL verified", "زاتكا · PDPL موثّق"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          accent
          label={bi("Daily revenue (mirrored)", "الإيراد اليومي (مرآة)")}
          value={sar(net.revenue, true)}
          icon={<Banknote size={14} />}
          delta={6.4}
          foot={bi("invoiced today · all channels", "مفوتر اليوم · كل القنوات")}
        />
        <KpiTile
          label={bi("Active bays", "البايات العاملة")}
          value={n(net.bays)}
          unit={bi("bays", "باي")}
          icon={<Gauge size={14} />}
          foot={bi(`${n(net.utilization)}% utilisation · target 75%`, `${pct(net.utilization)} استهلاك · المستهدف ٧٥٪`)}
        />
        <KpiTile
          label={bi("Parts turnover this week", "دوران القطع هذا الأسبوع")}
          value={`${n(4.2, 1)}×`}
          icon={<PackageSearch size={14} />}
          delta={-2.1}
          deltaInverse
          foot={bi("annualised · target 6.0×", "سنوي · المستهدف ٦.٠×")}
        />
        <KpiTile
          label={bi("CSI score", "مؤشر رضا العملاء")}
          value={`${n(net.csi)}`}
          unit={bi("/ 100", "/ ١٠٠")}
          icon={<Star size={14} />}
          delta={1.8}
          foot={bi("rolling 7-day · verified responses", "متوسط ٧ أيام · ردود موثقة")}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Governance dividend */}
        <div className="relative overflow-hidden rounded-xl bg-ink p-4 text-white shadow-[var(--shadow-lift)] sm:p-5 lg:col-span-2">
          <div className="grid-texture absolute inset-0 opacity-60" />
          <div className="absolute -end-10 -top-16 h-52 w-52 rounded-full bg-toyota/15 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  <span className="h-1 w-1 rounded-full bg-toyota" />
                  {pick(bi("Governance dividend", "عائد الحوكمة"))}
                </div>
                <h2 className="mt-1.5 text-[17px] font-semibold leading-tight sm:text-[19px]">
                  {pick(bi("What the mirror saved this week", "اللي وفّرته المرآة هذا الأسبوع"))}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#27AE60]/30 bg-[#27AE60]/10 px-2 py-1 text-[9.5px] font-medium text-[#7FD6A2]">
                <ShieldCheck size={11} /> {pick(bi("legacy unchanged", "النظام القديم كما هو"))}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-toyota/15 text-toyota">
                    <PhoneOff size={14} />
                  </span>
                  <span className="text-[9px] font-medium text-[#7FD6A2]">{pick(bi("+18% vs last week", "+١٨٪ عن الأسبوع"))}</span>
                </div>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="num text-[30px] font-bold leading-none tracking-[-0.04em] sm:text-[34px]">{n(net.callsAvoided)}</span>
                  <span className="pb-1 text-[10px] text-white/45">{pick(bi("calls", "مكالمة"))}</span>
                </div>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/55">
                  {pick(bi("calls avoided this week via self-serve dashboard", "مكالمة ما احتجناها هذا الأسبوع — العميل شافها بنفسه"))}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3.5">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F39C12]/15 text-[#F3B24A]">
                    <TimerOff size={14} />
                  </span>
                  <span className="num text-[9px] font-medium text-white/40">{sar(laborValue, true)}</span>
                </div>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="num text-[30px] font-bold leading-none tracking-[-0.04em] sm:text-[34px]">{n(net.idleHoursSaved)}</span>
                  <span className="pb-1 text-[10px] text-white/45">{pick(bi("idle hrs saved", "ساعة خاملة موفّرة"))}</span>
                </div>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/55">
                  {pick(bi("re-allocated from phone duty to bay-facing work", "أُعيد توزيعها من الرد على الجوال لخدمة العملاء ميدانيًا"))}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-3 text-[9.5px] text-white/40">
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-ok" /> {pick(bi("Zero double data-entry", "صفر إدخال مزدوج"))}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-ok" /> {pick(bi("0 write-backs to legacy", "صفر كتابة عكسية للنظام"))}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-ok" /> {pick(bi("Read-only API surface", "واجهة قراءة فقط"))}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <KeyMetric
            icon={<Gauge size={15} />}
            label={bi("Network average across selected branches", "متوسط الشبكة للفروع المختارة")}
            value={pick(
              bi(
                `Bay utilization rate: ${net.utilization}% (target 75%)`,
                `معدل استهلاك البايات: ${n(net.utilization)}٪ (المستهدف ٧٥٪)`
              )
            )}
            footnote={bi("Two branches are absorbing overflow; two are under-fed.", "فرعان يستوعبان الضغط، وفرعان طاقتهما غير مستغلة.")}
            status="watch"
          />
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-ink">{pick(bi("Network pulse", "نبض الشبكة"))}</span>
              <HealthPill status={net.utilization > 85 ? "bottleneck" : "healthy"} />
            </div>
            <div className="space-y-2.5">
              {[
                { l: bi("Bottlenecked branches", "فروع مختنقة"), v: n(list.filter((b) => b.status === "bottleneck").length), tone: "#E74C3C" },
                { l: bi("On watch", "تحت المراقبة"), v: n(list.filter((b) => b.status === "watch").length), tone: "#F39C12" },
                { l: bi("Healthy", "مستقرة"), v: n(list.filter((b) => b.status === "healthy").length), tone: "#27AE60" },
              ].map((row) => (
                <div key={row.l.en} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: row.tone }} />
                  <span className="flex-1 text-[10.5px] text-steel">{pick(row.l)}</span>
                  <span className="num text-[14px] font-bold text-ink" style={{ color: row.tone }}>{row.v}</span>
                  <span className="text-[9px] text-steel">/ {n(list.length)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("bays")} className="mt-3 flex w-full items-center justify-between rounded-md border border-line bg-[#FAFAF8] px-2.5 py-1.5 text-[10px] font-medium text-ink transition hover:border-ink/20">
              {pick(bi("Open network heat map", "افتح خريطة الضغط"))}
              <ArrowUpRight size={12} />
            </button>
          </Card>
        </div>
      </div>

      {/* Branch traffic lights */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-ink">{pick(bi("Branch traffic lights", "إشارات الفروع"))}</h2>
          <p className="mt-0.5 text-[10.5px] text-steel">
            {pick(bi("Click a branch to drill into its live bay floor and advisors.", "اضغط على الفرع للدخول على البايات والمستشارين لحظيًا."))}
          </p>
        </div>
        <SeeAll onClick={() => onNavigate("bays")} label={bi("Network detail", "تفاصيل الشبكة")} />
      </div>
      <div className="mt-2.5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => {
          const meta = statusMeta[b.status];
          return (
            <Card key={b.id} className="group relative overflow-hidden" onClick={() => onDrill(b.id, "bays")}>
              <div className="h-[3px] w-full" style={{ background: meta.hex }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-ink">{pick(b.name)}</span>
                      <span className="num rounded border border-line bg-[#FAFAF8] px-1 py-0.5 text-[8px] text-steel">{b.code}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[9.5px] text-steel">
                      <Building2 size={9} />
                      {pick(b.district)} · {pick(b.role)}
                    </div>
                  </div>
                  <HealthPill status={b.status} />
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="flex items-end gap-1">
                      <span className="num text-[27px] font-bold leading-none tracking-[-0.04em] text-ink">{pct(b.utilization)}</span>
                      <span className="pb-0.5 text-[9px] text-steel">/ 75</span>
                    </div>
                    <div className="mt-1 text-[9.5px] text-steel">
                      {pick(bi(`${n(Math.round(b.bays * b.utilization / 100))} of ${n(b.bays)} bays in use`, `${n(Math.round(b.bays * b.utilization / 100))} من ${n(b.bays)} باي مشغول`))}
                    </div>
                  </div>
                  <Sparkline values={b.trend} color={meta.hex} width={86} height={30} />
                </div>
                <div className="mt-2">
                  <Meter value={b.utilization} target={75} tone={meta.hex} height={5} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-2.5">
                  <div>
                    <div className="text-[8.5px] text-steel">{pick(bi("Revenue", "الإيراد"))}</div>
                    <div className="num mt-0.5 text-[11px] font-semibold text-ink">{sar(b.revenue, true)}</div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-steel">{pick(bi("CSI", "الرضا"))}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-ink">
                      <span className="num">{n(b.csi)}</span>
                      <span className="text-[8px] text-steel">/100</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[8.5px] text-steel">{pick(bi("Wait", "الانتظار"))}</div>
                    <div className="num mt-0.5 text-[11px] font-semibold text-ink">{n(b.wait)} <span className="text-[8px] font-normal text-steel">{pick(bi("min", "د"))}</span></div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 text-[9.5px] text-steel">
                  <span className="inline-flex items-center gap-1">
                    <Users size={9} /> {pick(bi("4 advisors", "٤ مستشارين"))}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-ink/70 transition group-hover:text-toyota">
                    {pick(bi("Drill into bay floor", "ادخل أرضية البايات"))}
                    <ChevronLeft size={11} className="rtl:rotate-0 ltr:rotate-180" />
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Watchlist + quick links */}
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHead
            title={bi("Executive watchlist", "قائمة المتابعة التنفيذية")}
            subtitle={bi("Signals ranked by SAR-at-risk and customer impact", "الإشارات مرتبة حسب المخاطر المالية وتأثير العميل")}
            right={<span className="text-[9px] text-steel">{pick(bi("updated 14:37", "محدثة ١٤:٣٧"))}</span>}
          />
          <div className="divide-y divide-line">
            {[
              {
                tone: "danger" as const,
                title: bi("Sanaiya is running at 88% — Friday overflow", "الصناعية على ٨٨٪ — ضغط الجمعة"),
                body: bi("Six job cards are waiting for lifts. Mirror suggests shifting 3 express jobs to Al Faisaliyah (72%).", "٦ كروت شغل تنتظر الرفع. المرآة تقترح تحويل ٣ أعمال سريعة للفيصلية (٧٢٪)."),
                action: bi("Bays", "البايات"),
                target: "bays" as const,
              },
              {
                tone: "warn" as const,
                title: bi("Dahdah conversion is 32% vs 55% target", "تحويل دحضة ٣٢٪ مقابل مستهدف ٥٥٪"),
                body: bi("17 new buyers have not booked a first service. WhatsApp outreach list is ready in the mirror.", "١٧ مشتريًا جديدًا ما حجزوا الصيانة الأولى. قائمة تواصل واتساب جاهزة في المرآة."),
                action: bi("Conversion", "التحويل"),
                target: "conversion" as const,
              },
              {
                tone: "neutral" as const,
                title: bi("23 transfers/week — visibility gap", "٢٣ نقلة/أسبوع — فجوة رؤية"),
                body: bi("83% are diagnostic or specialty needs; central visibility could cut 8 transfers.", "٨٣٪ احتياجات تشخيصية أو تخصصية؛ الرؤية المركزية قد تقللها بـ ٨ نقلات."),
                action: bi("Transfers", "النقل"),
                target: "transfers" as const,
              },
              {
                tone: "ok" as const,
                title: bi("ZATCA + PDPL fully green", "زاتكا وPDPL خضراء بالكامل"),
                body: bi("138/138 invoices stamped by the legacy system today. CDC latency 3s.", "١٣٨/١٣٨ فاتورة مختومة اليوم بالنظام القديم. تأخر CDC ٣ ثوانٍ."),
                action: bi("Compliance", "التوافق"),
                target: "compliance" as const,
              },
            ].map((item, i) => (
              <button key={i} onClick={() => onNavigate(item.target)} className="flex w-full items-start gap-2.5 px-4 py-3 text-start transition hover:bg-[#FAFAF8]">
                <span className={cn("mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full", item.tone === "danger" ? "bg-danger" : item.tone === "warn" ? "bg-warn" : item.tone === "ok" ? "bg-ok" : "bg-ink")} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-semibold leading-snug text-ink">{pick(item.title)}</span>
                  <span className="mt-0.5 block text-[10px] leading-relaxed text-steel">{pick(item.body)}</span>
                </span>
                <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 text-[9.5px] font-medium text-ink/50">{pick(item.action)} <ArrowUpRight size={10} /></span>
              </button>
            ))}
          </div>
          <SourceNote />
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-ink">{pick(bi("Quick drill-down", "وصول سريع"))}</span>
              <Sparkles size={12} className="text-toyota" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((q) => (
                <button
                  key={q.id}
                  onClick={() => onNavigate(q.id)}
                  className="group rounded-lg border border-line bg-[#FAFAF8] p-2.5 text-start transition hover:border-ink/20 hover:bg-white"
                >
                  <q.icon size={13} className="text-steel transition group-hover:text-toyota" />
                  <div className="num mt-2 text-[15px] font-bold leading-none text-ink">{q.stat}</div>
                  <div className="mt-1 truncate text-[9px] text-steel">{pick(q.label)}</div>
                  <div className="truncate text-[8px] text-[#A2A5A6]">{pick(q.sub)}</div>
                </button>
              ))}
            </div>
          </Card>
          <Card className="overflow-hidden">
            <SectionHead title={bi("Revenue by branch", "الإيراد حسب الفرع")} subtitle={bi("Today, mirrored invoice totals", "اليوم، إجمالي الفواتير الملتقطة")} />
            <div className="p-4">
              <BranchBars
                items={list.map((b) => ({ id: b.id, label: b.name, value: Math.round(b.revenue / 1000), status: b.status }))}
                max={60}
                target={undefined}
                suffix={lang === "ar" ? " ألف" : "K"}
                onSelect={(id) => onDrill(id as typeof branches[number]["id"], "bays")}
              />
              <SourceNote />
            </div>
          </Card>
          <div className="rounded-lg border border-line bg-white px-3.5 py-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="inline-flex items-center gap-1.5 font-medium text-ink"><ShieldCheck size={12} className="text-ok" /> {pick(bi("Non-invasive layer", "طبقة غير تدخلية"))}</span>
              <span className="num rounded bg-[#F4F4F1] px-1.5 py-0.5 text-[8.5px] text-steel">T3</span>
            </div>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-steel">
              {pick(bi("Dashboard → legacy: read only. Invoices, job cards and stamps are authored exclusively in the core system.", "اللوحة ← النظام القديم: قراءة فقط. الفواتير وكروت الشغل والأختام تُنشأ حصريًا في النظام الأساسي."))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
