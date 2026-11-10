import { useMemo, useState } from "react";
import { ArrowUpRight, Clock, MessageCircle, Search, TimerOff, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { advisors, avg, network, selectBranches, type Advisor } from "@/data";
import {
  Avatar,
  Badge,
  BranchBars,
  Card,
  Drawer,
  ExportMenu,
  GhostButton,
  Insight,
  KV,
  KeyMetric,
  KpiTile,
  PageHeader,
  SectionHead,
  SourceNote,
  Sparkline,
  Trend,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

/**
 * ADVISOR PERFORMANCE
 * Pain point: phone-based governance & idle advisors.
 * Response time is measured inside the legacy WhatsApp integration; the dashboard
 * only reads the timestamps. Coaching notes are advisory, never a write to HR/DMS.
 */
export default function Advisors({ branchIds, onNavigate, onExport }: SectionProps) {
  const { pick, n, sar } = useI18n();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"throughput" | "csi" | "idle">("throughput");
  const [selected, setSelected] = useState<Advisor | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = advisors.filter(
      (a) => (branchIds === "all" || branchIds.includes(a.branch.id)) && (!q || a.name.en.toLowerCase().includes(q) || a.name.ar.includes(q))
    );
    return [...base].sort((a, b) =>
      sort === "throughput" ? b.throughput - a.throughput : sort === "csi" ? b.csi - a.csi : b.idleHours - a.idleHours
    );
  }, [branchIds, query, sort]);

  const avgThroughput = Number(avg(filtered.map((a) => a.throughput)).toFixed(1));
  const avgCsi = Math.round(avg(filtered.map((a) => a.csi)));
  const avgResponse = Math.round(avg(filtered.map((a) => a.responseMin)));
  const idleLoss = filtered.filter((a) => a.idleHours > 2).reduce((s, a) => s + a.idleHours * 95, 0);
  const idleAdvisors = filtered.filter((a) => a.idleHours > 2);
  const net = network(branchIds);

  return (
    <div>
      <PageHeader
        index="04"
        eyebrow={bi("People · throughput", "الفريق · الإنتاجية")}
        title={bi("Advisors — capacity is not the problem", "المستشارون — الطاقة مو المشكلة")}
        subtitle={bi(
          "Vehicles closed per advisor, rolling CSI, WhatsApp response time and idle hours. 24 advisors across six branches; every figure is derived from mirrored job cards and message timestamps.",
          "المركبات المنجزة لكل مستشار، ورضا العملاء، وسرعة الرد على الواتساب، والساعات الخاملة. ٢٤ مستشارًا في ستة فروع؛ وكل رقم مشتق من كروت الشغل وأوقات الرسائل."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("csi")} className="h-8">
              <Clock size={13} /> {pick(bi("Wait times", "أوقات الانتظار"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("Vehicles / advisor / day", "مركبة / مستشار / يوم")} value={n(avgThroughput, 1)} unit={bi("target 5.0", "المستهدف ٥.٠")} icon={<UserRoundCheck size={14} />} delta={4.2} foot={bi("completed job cards · 7-day mean", "كروت منجزة · متوسط ٧ أيام")} />
        <KpiTile label={bi("Advisor CSI mean", "متوسط رضا العملاء")} value={`${n(avgCsi)}`} unit={bi("/ 100", "/ ١٠٠")} icon={<TrendingUp size={14} />} delta={2.4} foot={bi("rolling 7-day · verified", "٧ أيام · ردود موثقة")} />
        <KpiTile label={bi("WhatsApp response", "الرد على الواتساب")} value={n(avgResponse)} unit={bi("min", "دقيقة")} icon={<MessageCircle size={14} />} delta={-8} deltaInverse foot={bi("first human reply", "أول رد بشري")} />
        <KpiTile label={bi("Idle labour leakage", "تسريب العمل الخامل")} value={sar(idleLoss, true)} unit={bi("/ day", "/ يوم")} icon={<TimerOff size={14} />} foot={bi(`${n(idleAdvisors.length)} advisors > 2 idle hrs/day`, `${n(idleAdvisors.length)} مستشار > ساعتين خمول/يوم`)} />
      </div>

      <div className="mt-3">
        <KeyMetric
          icon={<UserRoundCheck size={15} />}
          label={bi("Completed job cards per advisor · network mean", "كروت منجزة لكل مستشار · متوسط الشبكة")}
          value={pick(bi(`Advisor throughput: ${avgThroughput.toFixed(1)} vehicles/day (target 5.0)`, `إنتاجية المستشار: ${n(avgThroughput, 1)} مركبة/يوم (المستهدف ٥.٠)`))}
          footnote={bi(
            "The fastest branch advisor closes 5.3/day. Replicating that pattern closes the 1.2 vehicle gap without adding headcount.",
            "أسرع مستشار في الشبكة ينجز ٥.٣ مركبة/يوم. تكرار هالنمط يسد فجوة ١.٢ مركبة بدون توظيف إضافي."
          )}
          status="watch"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("Throughput table · advisors × branches", "جدول الإنتاجية · المستشارون × الفروع")}
            subtitle={bi("Vehicles completed per day and week, CSI and response discipline", "المركبات المنجزة يوميًا وأسبوعيًا، والرضا وسرعة الرد")}
            right={
              <div className="flex items-center gap-1">
                {[
                  { id: "throughput" as const, label: bi("Throughput", "الإنتاجية") },
                  { id: "csi" as const, label: bi("CSI", "الرضا") },
                  { id: "idle" as const, label: bi("Idle", "الخمول") },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSort(s.id)}
                    className={cn("rounded px-1.5 py-1 text-[9px] font-medium transition", sort === s.id ? "bg-ink text-white" : "text-steel hover:text-ink")}
                  >
                    {pick(s.label)}
                  </button>
                ))}
              </div>
            }
          />
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-[#FCFCFA] px-3 py-2">
            <div className="relative">
              <Search size={12} className="absolute start-2 top-1/2 -translate-y-1/2 text-steel" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={pick(bi("Search advisor", "ابحث عن مستشار"))}
                className="h-7 w-[180px] rounded-md border border-line bg-white pe-2 ps-7 text-[10px] text-ink outline-none placeholder:text-[#B0B3B4] focus:border-ink/40"
              />
            </div>
            <Badge tone="neutral">{pick(bi(`${n(filtered.length)} advisors`, `${n(filtered.length)} مستشار`))}</Badge>
            <div className="flex-1" />
            <span className="inline-flex items-center gap-1 text-[9px] text-steel">
              <span className="h-1.5 w-1.5 rounded-full bg-warn" /> {pick(bi("> 2 idle hrs = financial loss", "أكثر من ساعتين خمول = خسارة"))}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-[#FAFAF8] text-[8.5px] uppercase tracking-[0.08em] text-steel">
                  {[bi("Advisor", "المستشار"), bi("Branch", "الفرع"), bi("Vehicles/day", "مركبة/يوم"), bi("Week", "الأسبوع"), bi("CSI · 7d", "الرضا · ٧ أيام"), bi("Reply", "الرد"), bi("Idle/day", "خمول/يوم"), bi("7-week trend", "اتجاه ٧ أسابيع")].map((h) => (
                    <th key={h.en} className="border-b border-line px-2.5 py-2 text-start font-semibold first:ps-3">{pick(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const loss = a.idleHours > 2;
                  const delta = a.trend[a.trend.length - 1] - a.trend[0];
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className={cn("cursor-pointer border-b border-line/60 text-[10px] transition last:border-0", loss ? "bg-[#FFFBF2]" : "hover:bg-[#FAFAF8]")}
                    >
                      <td className="px-2.5 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={pick(a.name)} tone={a.tone} size={24} />
                          <div className="min-w-0">
                            <div className="truncate font-medium text-ink">{pick(a.name)}</div>
                            <div className="num text-[8px] text-steel">{a.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2.5 py-2 text-[9.5px] text-steel">{pick(a.branch.name)}</td>
                      <td className="px-2.5 py-2">
                        <span className="num text-[11px] font-semibold text-ink">{n(a.throughput, 1)}</span>
                        <div className="mt-0.5 w-12"><div className="h-[3px] rounded-full bg-[#EEEEEA]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (a.throughput / 5.5) * 100)}%`, background: a.throughput >= 4.5 ? "#27AE60" : a.throughput >= 3.5 ? "#1A1A1A" : "#F39C12" }} /></div></div>
                      </td>
                      <td className="num px-2.5 py-2 text-[10px]">{n(a.jobsWeek)}</td>
                      <td className="px-2.5 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="num text-[10.5px] font-semibold" style={{ color: a.csi >= 88 ? "#1E7A46" : a.csi >= 80 ? "#9A6206" : "#B0281D" }}>{n(a.csi)}</span>
                          <Trend value={delta} />
                        </div>
                      </td>
                      <td className="px-2.5 py-2">
                        <span className={cn("num inline-flex items-center gap-1 rounded px-1 py-0.5 text-[9px]", a.responseMin <= 15 ? "bg-[#EAF7EF] text-[#1E7A46]" : a.responseMin <= 30 ? "bg-[#FEF5E4] text-[#9A6206]" : "bg-[#FDECEA] text-[#B0281D]")}>
                          <MessageCircle size={8} /> {n(a.responseMin)}′
                        </span>
                      </td>
                      <td className="px-2.5 py-2">
                        {loss ? (
                          <Badge tone="warn" dot>{n(a.idleHours, 1)}h</Badge>
                        ) : (
                          <span className="num text-[9.5px] text-steel">{n(a.idleHours, 1)}h</span>
                        )}
                      </td>
                      <td className="px-2.5 py-2"><Sparkline values={a.trend} color={a.csi >= 85 ? "#27AE60" : "#1A1A1A"} width={66} height={20} strokeWidth={1.5} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line px-3 py-2">
            <span className="text-[9px] text-steel">{pick(bi("Click an advisor for a read-only performance mirror", "اضغط على المستشار لعرض مرآة الأداء"))}</span>
            <span className="num text-[9px] text-steel">{pick(bi(`network CSI ${n(net.csi)}`, `رضا الشبكة ${n(net.csi)}`))}</span>
          </div>
          <SourceNote />
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-ink">{pick(bi("Throughput by branch", "الإنتاجية حسب الفرع"))}</span>
              <Users size={12} className="text-steel" />
            </div>
            <BranchBars
              items={selectBranches(branchIds).map((b) => ({
                id: b.id,
                label: b.name,
                value: Number(avg(advisors.filter((a) => a.branch.id === b.id).map((a) => a.throughput)).toFixed(1)),
                status: b.status,
              }))}
              max={6}
              target={5}
              suffix={pick(bi(" v/d", " م/ي"))}
            />
            <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 text-[9px] text-steel">
              <span>{pick(bi("Target = 5.0 vehicles/day", "المستهدف = ٥.٠ مركبة/يوم"))}</span>
              <span className="num">{pick(bi(`mean ${n(avgThroughput, 1)}`, `المتوسط ${n(avgThroughput, 1)}`))}</span>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <SectionHead title={bi("Idle > 2 hrs/day", "خمول أكثر من ساعتين")} subtitle={bi("Financial loss indicator · SAR 95/hr loaded", "مؤشر خسارة مالية · ٩٥ ر.س/ساعة")} right={<Badge tone="warn">{n(idleAdvisors.length)}</Badge>} />
            <div className="divide-y divide-line">
              {idleAdvisors.slice(0, 5).map((a) => (
                <button key={a.id} onClick={() => setSelected(a)} className="flex w-full items-center gap-2 px-3 py-2 text-start transition hover:bg-[#FAFAF8]">
                  <Avatar name={pick(a.name)} tone={a.tone} size={22} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-medium text-ink">{pick(a.name)}</span>
                    <span className="block truncate text-[8.5px] text-steel">{pick(a.branch.name)} · {pick(bi(`${n(a.responseMin)} min reply`, `${n(a.responseMin)} دقيقة رد`))}</span>
                  </span>
                  <span className="num shrink-0 text-[9.5px] font-semibold text-[#9A6206]">{n(a.idleHours * 95)} <span className="text-[8px] font-normal">{pick(bi("SAR", "ر.س"))}</span></span>
                </button>
              ))}
            </div>
            <div className="border-t border-line bg-[#FAFAF8] px-3 py-2 text-[9px] leading-relaxed text-steel">
              {pick(bi("Advisors wait on phone approvals; the mirror replaces that queue with visibility, not another inbox.", "المستشارون ينتظرون موافقات بالجوال؛ المرآة تستبدل الطابور برؤية واضحة، مو صندوق وارد ثاني."))}
            </div>
          </Card>

          <Insight
            tone="ok"
            title={bi("Best practice is already inside the network", "أفضل ممارسة موجودة أصلًا داخل الشبكة")}
            body={bi(
              "Al Faisaliyah averages 4.6 vehicles/day with the lowest wait (29 min). Its triage script and pre-bay check-in are the cheapest replication path.",
              "الفيصلية تسجل ٤.٦ مركبة/يوم وأقل انتظار (٢٩ دقيقة). سكريبت الفرز والاستلام قبل الباي هو أرخص طريق للتكرار."
            )}
          />
        </div>
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        eyebrow={bi("Advisor performance mirror", "مرآة أداء المستشار")}
        title={selected ? selected.name : bi("", "")}
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-steel">{pick(bi("No HR or DMS write path", "لا يوجد مسار كتابة للموارد البشرية أو النظام"))}</span>
            <GhostButton onClick={() => onNavigate("csi")}>{pick(bi("CSI detail", "تفاصيل الرضا"))} <ArrowUpRight size={12} /></GhostButton>
          </div>
        }
      >
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Avatar name={pick(selected.name)} tone={selected.tone} size={40} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-ink">{pick(selected.name)}</div>
                <div className="text-[10px] text-steel">{pick(selected.branch.name)} · {selected.id}</div>
              </div>
              <Badge tone={selected.csi >= 85 ? "ok" : selected.csi >= 80 ? "warn" : "danger"}>CSI {n(selected.csi)}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: bi("Vehicles/day", "مركبة/يوم"), v: n(selected.throughput, 1), sub: bi("target 5.0", "المستهدف ٥.٠") },
                { l: bi("This week", "هذا الأسبوع"), v: n(selected.jobsWeek), sub: bi("job cards", "كارت شغل") },
                { l: bi("Idle/day", "خمول/يوم"), v: `${n(selected.idleHours, 1)}h`, sub: bi(`${n(selected.idleHours * 95)} SAR`, `${n(selected.idleHours * 95)} ر.س`) },
              ].map((x) => (
                <div key={x.l.en} className="rounded-lg border border-line bg-[#FAFAF8] p-2">
                  <div className="text-[8.5px] text-steel">{pick(x.l)}</div>
                  <div className="num mt-0.5 text-[14px] font-bold text-ink">{x.v}</div>
                  <div className="text-[8px] text-[#A2A5A6]">{pick(x.sub)}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-ink">{pick(bi("7-week completion trend", "اتجاه الإنجاز ٧ أسابيع"))}</span>
                <Trend value={selected.trend[selected.trend.length - 1] - selected.trend[0]} suffix={pick(bi(" jobs", " كارت"))} />
              </div>
              <Sparkline values={selected.trend} color="#EB0A1A" width={360} height={54} />
            </div>
            <div>
              <KV k={bi("WhatsApp first reply", "أول رد واتساب")} v={`${n(selected.responseMin)} ${pick(bi("min", "دقيقة"))}`} mono />
              <KV k={bi("Rolling CSI", "الرضا المتحرك")} v={`${n(selected.csi)}/100`} mono />
              <KV k={bi("Vehicles this week", "مركبات هذا الأسبوع")} v={n(selected.jobsWeek)} mono />
              <KV k={bi("Idle hours today", "ساعات الخمول اليوم")} v={`${n(selected.idleHours, 1)} ${pick(bi("hrs", "ساعة"))}`} mono />
              <KV k={bi("Estimated leakage", "التسريب المقدر")} v={sar(selected.idleHours * 95)} mono />
              <KV k={bi("Branch", "الفرع")} v={pick(selected.branch.name)} />
            </div>
            <div className="rounded-lg border border-line bg-[#FAFAF8] p-3">
              <div className="mb-1 text-[10px] font-semibold text-ink">{pick(bi("Read-only coaching signal", "إشارة تدريب · قراءة فقط"))}</div>
              <p className="text-[10px] leading-relaxed text-steel">
                {pick(bi(
                  selected.idleHours > 2
                    ? "Idle time clusters after 13:00. Pair this advisor with the Al Faisaliyah triage script and route two express jobs from Sanaiya — decision stays with the branch manager."
                    : "Response time and CSI are inside the network's best quartile. Use as a peer-coaching reference; no data is written back to HR.",
                  selected.idleHours > 2
                    ? "الخمول يتركّز بعد ١٣:٠٠. اربط هذا المستشار بسكريبت الفيصلية ووجّه عملين سريعين من الصناعية — القرار يبقى لمدير الفرع."
                    : "سرعة الرد والرضا داخل أفضل ربع في الشبكة. استخدمه كمرجع تدريب بين الزملاء؛ ولا تُكتب أي بيانات للموارد البشرية."
                ))}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
