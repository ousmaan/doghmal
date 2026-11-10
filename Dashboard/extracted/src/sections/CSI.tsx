import { useState } from "react";
import { ArrowUpRight, Clock, MessageSquareText, Star, TimerOff, TrendingDown, Users } from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { branches, csiTrend, network, selectBranches, waitBins, type BranchId, type Health } from "@/data";
import {
  Badge,
  BranchBars,
  Card,
  ExportMenu,
  GhostButton,
  HealthPill,
  Insight,
  KeyMetric,
  KpiTile,
  LineChart,
  Meter,
  type Series,
  PageHeader,
  SectionHead,
  SourceNote,
  Sparkline,
  statusMeta,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

const waitStatus = (wait: number): Health => (wait < 30 ? "healthy" : wait <= 60 ? "watch" : "bottleneck");
const csiColor = (csi: number) => (csi >= 88 ? "#1A1A1A" : csi >= 84 ? "#27AE60" : "#EB0A1A");

/**
 * CSI & WAIT TIMES
 * Pain point: customer attrition + Friday overload.
 * CSI responses arrive through the legacy survey webhook; T3 stores rolling
 * aggregates only (PDPL), and cannot alter a score or contact a customer.
 */
export default function CSI({ branchIds, onNavigate, onDrill, onExport }: SectionProps) {
  const { pick, n, pct, lang } = useI18n();
  const [range, setRange] = useState<"7d" | "13w">("13w");
  const net = network(branchIds);
  const list = selectBranches(branchIds);
  const sample = list[0] ?? branches[0];
  const labels = csiTrend(sample).map((p) => (lang === "ar" ? p.weekAr : p.week));

  const shown = list.length > 3 ? [branches[2], branches[3]] : list;
  const series: Series[] = shown.map((b) => ({
    name: b.name,
    values: csiTrend(b).slice(range === "7d" ? -7 : -13).map((p) => p.value),
    color: b.id === "sinaiya_1" ? "#EB0A1A" : "#1A1A1A",
  }));
  if (list.length > 1) {
    const netSeries = Array.from({ length: 13 }, (_, i) =>
      Math.round(list.reduce((s, b) => s + csiTrend(b).slice(-13)[i].value, 0) / list.length)
    );
    series.unshift({
      name: bi("Selected network average", "متوسط الفروع المختارة"),
      values: range === "7d" ? netSeries.slice(-7) : netSeries,
      color: "#8A8F94",
      dashed: true,
    });
  }

  const totalTickets = waitBins.reduce((s, b) => s + b.count, 0);
  const maxBin = Math.max(...waitBins.map((b) => b.count));
  const wait90 = waitBins[waitBins.length - 1].count;

  return (
    <div>
      <PageHeader
        index="06"
        eyebrow={bi("Experience · waiting", "التجربة · الانتظار")}
        title={bi("CSI & waiting — the quiet leak", "الرضا والانتظار — التسريب الهادي")}
        subtitle={bi(
          "Rolling satisfaction, arrival-to-bay wait and the hours that push customers away. Responses are aggregated and anonymised; no customer name or mobile number is displayed.",
          "الرضا المتحرك، والانتظار من الوصول للباي، والساعات اللي تطرد العميل. الردود مجمّعة ومجهولة؛ ولا يظهر اسم عميل أو جوال."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("advisors")} className="h-8">
              <Users size={13} /> {pick(bi("Advisor response", "رد المستشار"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("CSI score · 7-day", "رضا العملاء · ٧ أيام")} value={n(net.csi)} unit={bi("/ 100", "/ ١٠٠")} icon={<Star size={14} />} delta={1.8} foot={bi("verified responses only", "ردود موثقة فقط")} />
        <KpiTile label={bi("Avg wait time", "متوسط الانتظار")} value={n(net.wait)} unit={bi("min", "دقيقة")} icon={<Clock size={14} />} delta={4} deltaInverse foot={bi("target < 45 min · p90 96 min", "المستهدف < ٤٥ د · p90 ٩٦ د")} />
        <KpiTile label={bi("Served under 45 min", "خُدموا خلال ٤٥ دقيقة")} value={pct(Math.round((waitBins.slice(0, 3).reduce((s, b) => s + b.count, 0) / totalTickets) * 100))} icon={<TimerOff size={14} />} foot={bi(`${n(totalTickets)} arrivals sampled`, `${n(totalTickets)} وصول في العينة`)} />
        <KpiTile label={bi("Waited > 90 minutes", "انتظروا أكثر من ٩٠ دقيقة")} value={n(wait90)} unit={bi("customers", "عميل")} icon={<TrendingDown size={14} />} foot={bi("Friday spike · Sanaiya", "ذروة الجمعة · الصناعية")} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <KeyMetric
          icon={<Star size={15} />}
          label={bi("Rolling 7-day customer satisfaction · anonymised survey mirror", "رضا العملاء لسبعة أيام · مرآة استبيانات مجهولة")}
          value={pick(bi(`CSI score: ${net.csi}/100 (rolling 7-day)`, `مؤشر رضا العملاء: ${n(net.csi)}/١٠٠ (متوسط ٧ أيام)`))}
          footnote={bi(
            "Scores below 80 trigger a service-manager review inside the legacy workflow — T3 never edits the response.",
            "أي نتيجة أقل من ٨٠ تفتح مراجعة مدير الخدمة داخل النظام القديم — الثالثة لا تعدّل الرد إطلاقًا."
          )}
          status="healthy"
        />
        <KeyMetric
          icon={<Clock size={15} />}
          label={bi("Arrival → bay assignment · long tail matters", "من الوصول → تعيين الباي · الذيل الطويل يهم")}
          value={pick(bi(`Avg wait time: ${net.wait} min (target <45 min)`, `متوسط الانتظار: ${n(net.wait)} دقيقة (المستهدف أقل من ٤٥ دقيقة)`))}
          footnote={bi(
            "The gap is concentrated in two branches and one day-part: Sanaiya on Fridays and Dahdah at 09:00–11:00.",
            "الفجوة تتركّز في فرعين وفترة واحدة: الصناعية أيام الجمعة، ودحضة من ٠٩:٠٠ إلى ١١:٠٠."
          )}
          status="watch"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("CSI trend · rolling satisfaction", "اتجاه الرضا · متوسط متحرك")}
            subtitle={bi("3+ months of mirrored survey history · scale 0–100", "أكثر من ٣ أشهر من تاريخ الاستبيانات · مقياس ٠–١٠٠")}
            right={
              <div className="flex items-center gap-1">
                {[
                  { id: "7d" as const, label: bi("7 days", "٧ أيام") },
                  { id: "13w" as const, label: bi("13 weeks", "١٣ أسبوع") },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRange(r.id)}
                    className={cn("rounded px-1.5 py-1 text-[9px] font-medium transition", range === r.id ? "bg-ink text-white" : "text-steel hover:text-ink")}
                  >
                    {pick(r.label)}
                  </button>
                ))}
              </div>
            }
          />
          <div className="px-2 pb-2 pt-3 sm:px-3">
            <LineChart labels={range === "7d" ? labels.slice(-7) : labels.slice(-13)} series={series} yMin={68} yMax={96} target={90} height={218} valueSuffix={pick(bi(" / 100", " / ١٠٠"))} />
          </div>
          <div className="grid grid-cols-2 divide-x divide-line border-t border-line text-center sm:grid-cols-4 rtl:divide-x-reverse">
            {[
              { l: bi("Network CSI", "رضا الشبكة"), v: `${n(net.csi)}`, sub: pick(bi("rolling 7d", "٧ أيام")) },
              { l: bi("Best branch", "أفضل فرع"), v: `${n([...list].sort((a, b) => b.csi - a.csi)[0].csi)}`, sub: pick([...list].sort((a, b) => b.csi - a.csi)[0].name) },
              { l: bi("Weakest", "الأضعف"), v: `${n([...list].sort((a, b) => a.csi - b.csi)[0].csi)}`, sub: pick([...list].sort((a, b) => a.csi - b.csi)[0].name) },
              { l: bi("Responses", "الردود"), v: n(1248), sub: pick(bi("last 90 days", "آخر ٩٠ يومًا")) },
            ].map((x) => (
              <div key={x.l.en} className="px-2 py-2.5">
                <div className="text-[8.5px] text-steel">{pick(x.l)}</div>
                <div className="num mt-0.5 text-[15px] font-bold text-ink">{x.v}</div>
                <div className="truncate text-[8px] text-steel">{x.sub}</div>
              </div>
            ))}
          </div>
          <SourceNote />
        </Card>

        <Card>
          <SectionHead title={bi("Wait-time distribution", "توزيع وقت الانتظار")} subtitle={bi("Arrival → bay assignment · 306 arrivals", "من الوصول → تعيين الباي · ٣٠٦ وصول")} right={<Badge tone="warn">{pick(bi("long tail", "ذيول طويلة"))}</Badge>} />
          <div className="p-4">
            <div className="flex items-end gap-2 border-b border-line pb-1" style={{ height: 150 }}>
              {waitBins.map((b) => (
                <div key={b.label.en} className="group relative flex h-full flex-1 flex-col justify-end" title={`${pick(b.label)} · ${n(b.count)}`}>
                  <span className="num mb-1 text-center text-[8.5px] font-semibold text-ink">{n(b.count)}</span>
                  <div className="w-full rounded-t-[3px] transition group-hover:opacity-80" style={{ height: `${Math.max(6, (b.count / maxBin) * 112)}px`, background: b.tone }} />
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-2">
              {waitBins.map((b) => (
                <div key={b.label.en} className="num flex-1 text-center text-[7px] leading-tight text-steel">
                  {pick(b.label).replace(" دقيقة", "").replace(" min", "")}
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
              {[
                { l: bi("Mean", "المتوسط"), v: n(52), u: bi("min", "د") },
                { l: bi("Median", "الوسيط"), v: n(47), u: bi("min", "د") },
                { l: bi("p90", "p90"), v: n(96), u: bi("min", "د") },
              ].map((x) => (
                <div key={x.l.en} className="rounded-md bg-[#FAFAF8] p-2 text-center">
                  <div className="text-[8px] text-steel">{pick(x.l)}</div>
                  <div className="num mt-0.5 text-[13px] font-bold text-ink">{x.v} <span className="text-[8px] font-normal text-steel">{pick(x.u)}</span></div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[8.5px] leading-relaxed text-[#9A9E9F]">
              {pick(bi("Long tail is not volume — it is rework and parts waiting. Each >90 min visit costs a repeat call.", "الذيل الطويل مو حجم — هو إعادة عمل وانتظار قطع. كل زيارة فوق ٩٠ دقيقة تكلف مكالمة أخرى."))}
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <SectionHead title={bi("Average wait by branch", "متوسط الانتظار حسب الفرع")} subtitle={bi("Green <30 min · amber 31–60 · red >60 · target line <45", "أخضر <٣٠ · أصفر ٣١–٦٠ · أحمر >٦٠ · المستهدف <٤٥")} right={<span className="text-[9px] text-steel">{pick(bi("click to drill", "اضغط للتفاصيل"))}</span>} />
          <div className="p-4">
            <BranchBars
              items={list.map((b) => ({ id: b.id, label: b.name, value: b.wait, status: waitStatus(b.wait), sub: bi(`CSI ${n(b.csi)}`, `رضا ${n(b.csi)}`) }))}
              max={80}
              target={45}
              suffix={pick(bi(" min", " د"))}
              onSelect={(id) => onDrill(id as BranchId, "advisors")}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-[9px] text-steel">
              <span>{pick(bi("Target <45 minutes", "المستهدف أقل من ٤٥ دقيقة"))}</span>
              <span className="num">{pick(bi(`network mean ${n(net.wait)} min`, `متوسط الشبكة ${n(net.wait)} دقيقة`))}</span>
            </div>
            <SourceNote />
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="overflow-hidden">
            <SectionHead title={bi("Traffic light per branch", "إشارة المرور لكل فرع")} subtitle={bi("Wait status vs <45 min", "حالة الانتظار مقابل <٤٥ دقيقة")} />
            <div className="grid grid-cols-2 gap-2 p-3">
              {list.map((b) => (
                <button key={b.id} onClick={() => onDrill(b.id, "advisors")} className="rounded-lg border border-line p-2 text-start transition hover:border-ink/25">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-[9.5px] font-medium text-ink">{pick(b.name)}</span>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: statusMeta[waitStatus(b.wait)].hex }} />
                  </div>
                  <div className="num mt-1 text-[15px] font-bold text-ink">{n(b.wait)} <span className="text-[8px] font-normal text-steel">{pick(bi("min", "د"))}</span></div>
                  <div className="mt-1 text-[8px] text-steel">{pick(bi(waitStatus(b.wait) === "healthy" ? "under 30 · on target" : waitStatus(b.wait) === "watch" ? "31–60 · watch" : "over 60 · urgent", waitStatus(b.wait) === "healthy" ? "أقل من ٣٠ · ممتاز" : waitStatus(b.wait) === "watch" ? "٣١–٦٠ · مراقبة" : "فوق ٦٠ · عاجل"))}</div>
                </button>
              ))}
            </div>
          </Card>
          <Insight
            tone="warn"
            title={bi("Friday spike at Sanaiya", "ذروة الجمعة في الصناعية")}
            body={bi(
              "Sanaiya wait jumps to 94 min on Fridays — 31 pts above its weekday mean. Two express bays are idle at Al Faisaliyah at the same hour. Load-balancing two job cards would recover ~47 waiting minutes per customer.",
              "انتظار الصناعية يقفز لـ٩٤ دقيقة يوم الجمعة — أعلى بـ٣١ نقطة من أيام الأسبوع. في نفس الساعة بايين سريعين فاضيين بالفيصلية. موازنة عملين توفر ≈٤٧ دقيقة انتظار للعميل."
            )}
          />
          <Card className="p-3.5">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-ink"><MessageSquareText size={12} className="text-toyota" /> {pick(bi("What customers mention", "اللي يذكره العملاء"))}</div>
            <div className="space-y-2">
              {[
                { l: bi("Waiting without updates", "الانتظار بدون تحديث"), v: 38 },
                { l: bi("Parts availability", "توفر القطع"), v: 24 },
                { l: bi("Greeting / reception", "الاستقبال"), v: 14 },
                { l: bi("Advisor response time", "سرعة رد المستشار"), v: 12 },
                { l: bi("Other", "أخرى"), v: 12 },
              ].map((r) => (
                <div key={r.l.en}>
                  <div className="mb-0.5 flex items-center justify-between text-[9px]">
                    <span className="text-steel">{pick(r.l)}</span>
                    <span className="num font-semibold text-ink">{pct(r.v)}</span>
                  </div>
                  <Meter value={r.v} max={40} tone={r.v >= 30 ? "#E74C3C" : "#8A8F94"} height={4} showTarget={false} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[8px] text-[#9A9E9F]">{pick(bi("Themes are AI-categorised from anonymised comments, inside KSA.", "المواضيع مصنّفة آليًا من تعليقات مجهولة داخل المملكة."))}</p>
          </Card>
        </div>
      </div>

      <Card className="mt-3 overflow-hidden">
        <SectionHead title={bi("Branch experience scorecard", "بطاقة تجربة الفروع")} subtitle={bi("CSI trend, wait and traffic signal in one read", "اتجاه الرضا والانتظار والإشارة في قراءة واحدة")} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse">
            <thead>
              <tr className="bg-[#FAFAF8] text-[8.5px] uppercase tracking-[0.08em] text-steel">
                {[bi("Branch", "الفرع"), bi("CSI now", "الرضا الآن"), bi("Trend 13w", "اتجاه ١٣ أسبوع"), bi("Avg wait", "الانتظار"), bi("Traffic", "الإشارة")].map((h) => (
                  <th key={h.en} className="border-b border-line px-3 py-2 text-start font-semibold first:ps-4">{pick(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} onClick={() => onDrill(b.id, "advisors")} className="cursor-pointer border-b border-line/60 text-[10px] transition last:border-0 hover:bg-[#FAFAF8]">
                  <td className="px-3 py-2 first:ps-4"><span className="font-medium text-ink">{pick(b.name)}</span><span className="num ms-1.5 text-[8px] text-steel">{b.code}</span></td>
                  <td className="num px-3 py-2 font-semibold">{n(b.csi)}</td>
                  <td className="px-3 py-2"><Sparkline values={csiTrend(b).map((p) => p.value)} color={csiColor(b.csi)} width={88} height={22} /></td>
                  <td className="num px-3 py-2">{n(b.wait)}′</td>
                  <td className="px-3 py-2"><HealthPill status={waitStatus(b.wait)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-line px-3 py-2">
          <span className="text-[9px] text-steel">{pick(bi("Scores below 80 trigger a service-manager review in the legacy workflow.", "أي نتيجة أقل من ٨٠ تفتح مراجعة مدير الخدمة في النظام القديم."))}</span>
          <button onClick={() => onNavigate("conversion")} className="inline-flex items-center gap-1 text-[9.5px] font-medium text-ink hover:text-toyota">{pick(bi("Retention funnel", "قمع الاحتفاظ"))} <ArrowUpRight size={11} /></button>
        </div>
      </Card>
    </div>
  );
}
