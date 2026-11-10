import { useState } from "react";
import { ArrowUpRight, Building2, Car, Clock, Gauge, Timer, UserRoundCheck, Wrench } from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import {
  avg,
  bayFloor,
  bayTimeline,
  branches,
  heatValue,
  hours,
  network,
  selectBranches,
  type BaySlot,
  type BayStatus,
  type BranchId,
} from "@/data";
import {
  Badge,
  BranchBars,
  Card,
  Drawer,
  ExportMenu,
  GhostButton,
  HeatCell,
  HeatLegend,
  HealthPill,
  KV,
  KeyMetric,
  KpiTile,
  PageHeader,
  SectionHead,
  SourceNote,
  statusMeta,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

const bayStatusMeta: Record<BayStatus, { label: ReturnType<typeof bi>; fill: string; soft: string }> = {
  occupied: { label: bi("Occupied", "مشغول"), fill: "#1A1A1A", soft: "bg-[#1A1A1A]" },
  idle: { label: bi("Idle", "فاضي"), fill: "#E9E9E3", soft: "bg-[#E9E9E3]" },
  maintenance: { label: bi("Maintenance", "صيانة"), fill: "#F39C12", soft: "bg-[#F39C12]" },
};

/**
 * BAY UTILIZATION
 * Pain point: idle labour hours & bay allocation by phone.
 * The timeline is a snapshot of legacy job-card states; no dispatch actions exist here.
 */
export default function Bays({ branchIds, onNavigate, onExport }: SectionProps) {
  const { pick, n, pct } = useI18n();
  const list = selectBranches(branchIds);
  const net = network(branchIds);
  const first = list[0] ?? branches[0];
  const [focusId, setFocusId] = useState<BranchId>(first.id);
  const focus = list.find((b) => b.id === focusId) ?? first;
  const floor = bayFloor(focus);
  const timeline = bayTimeline(focus);
  const [selectedBay, setSelectedBay] = useState<BaySlot | null>(null);
  const occupied = floor.filter((b) => b.status === "occupied").length;
  const idle = floor.filter((b) => b.status === "idle").length;
  const maintenance = floor.filter((b) => b.status === "maintenance").length;
  const avgCycle = Math.round(avg(floor.map((b) => b.elapsed)));

  const statusLabel = (s: BayStatus) => pick(bayStatusMeta[s].label);

  return (
    <div>
      <PageHeader
        index="02"
        eyebrow={bi("Operations · capacity", "التشغيل · الطاقة")}
        title={bi("Bay floor — where is the pressure?", "أرضية البايات — وين الضغط؟")}
        subtitle={bi(
          "Hour-by-hour consumption of every bay, mirrored from job cards. Target is 75% — below 45% is idle labour, above 85% is a customer wait risk.",
          "استهلاك كل باي ساعة بساعة، ملتقط من كروت الشغل. المستهدف ٧٥٪ — أقل من ٤٥٪ طاقة معطّلة، وأعلى من ٨٥٪ خطر انتظار للعميل."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("advisors")} className="h-8">
              <UserRoundCheck size={13} /> {pick(bi("Advisor load", "حِمل المستشارين"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("Bay utilization (network average)", "استهلاك البايات (متوسط الشبكة)")} value={pct(net.utilization)} icon={<Gauge size={14} />} delta={-3.2} foot={bi("target 75% · gap 13 pts", "المستهدف ٧٥٪ · الفرق ١٣ نقطة")} />
        <KpiTile label={bi("Bays in use now", "بايات مشغولة الآن")} value={`${n(Math.round(net.bays * net.utilization / 100))}`} unit={bi(`of ${net.bays}`, `من ${n(net.bays)}`)} icon={<Wrench size={14} />} foot={bi("live job-card mirror", "مرآة كروت الشغل")} />
        <KpiTile label={bi("Idle bays", "بايات فاضية")} value={`${n(idle)}`} icon={<Timer size={14} />} foot={bi(`approx. ${n(idle * 2.4, 1)} idle labour hrs/day`, `≈ ${n(idle * 2.4, 1)} ساعة عمل معطّلة/يوم`)} />
        <KpiTile label={bi("Avg bay cycle", "متوسط دورة الباي")} value={`${n(avgCycle)}`} unit={bi("min", "دقيقة")} icon={<Clock size={14} />} foot={bi("door-to-door · focus branch", "من الاستلام للتسليم · الفرع المحدد")} />
      </div>

      <div className="mt-3">
        <KeyMetric
          icon={<Gauge size={15} />}
          label={bi("Network weighted rate · read from legacy job cards", "المعدل المرجّح للشبكة · مقروء من كروت الشغل")}
          value={pick(
            bi(
              `Bay utilization rate: ${net.utilization}% (target 75%)`,
              `معدل استهلاك البايات: ${n(net.utilization)}٪ (المستهدف ٧٥٪)`
            )
          )}
          footnote={bi(
            "Gap = 13 points of unused capacity, concentrated in Al Muntazah and Al Jumoom. No dispatcher actions are exposed in T3.",
            "الفجوة = ١٣ نقطة طاقة غير مستغلة، تتركّز في المنتزه والجموم. لا توجد أي أدوات توزيع في الطبقة الثالثة."
          )}
          status="watch"
        />
      </div>

      {/* branch focus chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="me-1 inline-flex items-center gap-1 text-[9.5px] text-steel"><Building2 size={10} /> {pick(bi("Bay floor:", "أرضية:"))}</span>
        {list.map((b) => (
          <button
            key={b.id}
            onClick={() => setFocusId(b.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10.5px] font-medium transition",
              focus.id === b.id ? "border-ink bg-ink text-white" : "border-line bg-white text-steel hover:border-ink/25 hover:text-ink"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta[b.status].hex }} />
            {pick(b.name)}
            <span className={cn("num text-[9px]", focus.id === b.id ? "text-white/50" : "text-steel")}>{pct(b.utilization)}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        {/* Timeline */}
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi(`Today's bay timeline · ${focus.code}`, `خط زمن البايات اليوم · ${focus.code}`)}
            subtitle={bi("08:00 → 18:00 · one row per bay · mirrored every 3 seconds", "٠٨:٠٠ ← ١٨:٠٠ · صف لكل باي · مزامنة كل ٣ ثوانٍ")}
            right={
              <div className="flex flex-wrap items-center gap-2">
                {(Object.keys(bayStatusMeta) as BayStatus[]).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 text-[8.5px] text-steel">
                    <span className={cn("h-2 w-2 rounded-[2px]", bayStatusMeta[s].soft)} /> {statusLabel(s)}
                  </span>
                ))}
              </div>
            }
          />
          <div className="overflow-x-auto p-3 sm:p-4">
            <div className="min-w-[560px]">
              <div className="mb-1 flex items-center gap-1">
                <span className="w-[72px] shrink-0 text-[8px] text-steel">{pick(bi("BAY", "الباي"))}</span>
                <div className="grid flex-1 grid-cols-11 gap-[3px]">
                  {hours.map((h) => (
                    <span key={h} className="num text-center text-[8.5px] text-steel">{n(h)}:00</span>
                  ))}
                </div>
              </div>
              <div className="space-y-[3px]">
                {timeline.map((cells, bayIdx) => (
                  <div key={bayIdx} className="flex items-center gap-1">
                    <div className="flex w-[72px] shrink-0 items-center gap-1">
                      <span className="num rounded border border-line px-1 py-[1px] text-[8px] text-steel">{String(bayIdx + 1).padStart(2, "0")}</span>
                      <span className="truncate text-[8.5px] text-steel">{pick(floor[bayIdx].bayType)}</span>
                    </div>
                    <div className="grid flex-1 grid-cols-11 gap-[3px]">
                      {cells.map((cell) => (
                        <div
                          key={cell.hour}
                          className={cn(
                            "tooltip-host relative h-[19px] cursor-default rounded-[2px] transition hover:ring-1 hover:ring-ink/40",
                            cell.status === "occupied" ? "bg-[#1A1A1A]" : cell.status === "idle" ? "bg-[#ECECE7]" : "bg-[#F39C12]"
                          )}
                          tabIndex={0}
                          title={`Bay ${bayIdx + 1} · ${cell.hour}:00 · ${statusLabel(cell.status)}`}
                        >
                          {cell.status === "maintenance" && (
                            <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full opacity-50">
                              <path d="M0 10 L10 0" stroke="#fff" strokeWidth="1" />
                              <path d="M-3 7 L7 -3" stroke="#fff" strokeWidth="1" />
                              <path d="M3 13 L13 3" stroke="#fff" strokeWidth="1" />
                            </svg>
                          )}
                          <div className="tooltip-body absolute bottom-full start-1/2 z-40 mb-1.5 -translate-x-1/2 rtl:translate-x-1/2">
                            <div className="whitespace-nowrap rounded border border-ink bg-ink px-2 py-1 text-[9.5px] text-white shadow-lg">
                              {pick(bi(`Bay ${n(bayIdx + 1)}`, `باي ${n(bayIdx + 1)}`))} · {n(cell.hour)}:00 · {statusLabel(cell.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-[9px] text-steel">
                <span>{pick(bi("Snapshot 14:37 · legacy DMS event stream", "لقطة ١٤:٣٧ · تدفق أحداث النظام القديم"))}</span>
                <span className="inline-flex items-center gap-1"><Clock size={9} /> {pick(bi("Current hour highlighted by mirror clock", "الساعة الحالية حسب ساعة المرآة"))}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Live assignment panel */}
        <Card className="overflow-hidden">
          <SectionHead
            title={bi("On the floor now", "الآن في الأرضية")}
            subtitle={bi(`${focus.code} · ${n(occupied)} occupied · ${n(idle)} idle · ${n(maintenance)} maintenance`, `${focus.code} · ${n(occupied)} مشغول · ${n(idle)} فاضي · ${n(maintenance)} صيانة`)}
            right={<HealthPill status={focus.status} />}
          />
          <div className="max-h-[404px] space-y-2 overflow-y-auto p-3">
            {floor.filter((b) => b.status === "occupied").slice(0, 6).map((slot) => (
              <button
                key={slot.bay}
                onClick={() => setSelectedBay(slot)}
                className="w-full rounded-lg border border-line bg-[#FAFAF8] p-2.5 text-start transition hover:border-ink/25 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="num flex h-5 min-w-5 items-center justify-center rounded bg-ink px-1 text-[9px] font-bold text-white">{String(slot.bay).padStart(2, "0")}</span>
                    <span className="text-[10.5px] font-semibold text-ink">{pick(slot.vehicle)}</span>
                  </div>
                  <span className="num inline-flex items-center gap-1 text-[8.5px] text-steel"><Clock size={8} /> {n(slot.elapsed)}′</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[9px]">
                  <span className="inline-flex items-center gap-1 text-steel"><UserRoundCheck size={9} /> {pick(slot.technician)}</span>
                  <span className="truncate text-[#A2A5A6]">{pick(slot.job)}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="num rounded bg-white px-1 py-[1px] text-[8px] text-steel ring-1 ring-line">{slot.plate}</span>
                  <span className="text-[8px] text-steel">{pick(bi("ETA", "الانتهاء"))} <span className="num font-medium text-ink">{n(slot.eta)}′</span></span>
                </div>
              </button>
            ))}
            <div className="rounded-lg border border-dashed border-line px-3 py-2 text-center text-[9.5px] text-steel">
              {pick(bi(`${n(idle)} bays idle — ${n(occupied)} active technicians mirrored`, `${n(idle)} باي فاضي — ${n(occupied)} فني مشغول حسب المرآة`))}
            </div>
          </div>
          <SourceNote />
        </Card>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-5">
        {/* Comparison */}
        <Card className="xl:col-span-2">
          <SectionHead
            title={bi("Utilization vs 75% target", "الاستهلاك مقابل المستهدف ٧٥٪")}
            subtitle={bi("Current week · weighted by active bays", "هذا الأسبوع · مرجّح بعدد البايات")}
            right={<Badge tone="neutral">{pick(bi("Click to focus", "اضغط للتركيز"))}</Badge>}
          />
          <div className="p-4">
            <BranchBars
              items={list.map((b) => ({ id: b.id, label: b.name, value: b.utilization, status: b.status, sub: bi(`${n(b.bays)} bays`, `${n(b.bays)} باي`) }))}
              target={75}
              onSelect={(id) => setFocusId(id as BranchId)}
            />
            <div className="mt-3 flex items-center justify-between border-t border-line pt-2 text-[9.5px] text-steel">
              <span>{pick(bi("Target line = 75%", "خط المستهدف = ٧٥٪"))}</span>
              <span className="num">{pick(bi(`network ${net.utilization}%`, `الشبكة ${n(net.utilization)}٪`))}</span>
            </div>
            <SourceNote />
          </div>
        </Card>

        {/* Heat map */}
        <Card className="xl:col-span-3">
          <SectionHead
            title={bi("6 branches × 24 hours · weekly pressure", "٦ فروع × ٢٤ ساعة · ضغط أسبوعي")}
            subtitle={bi("Chronic idle vs bottleneck by hour of day", "الخمول المزمن مقابل الاختناق حسب ساعة اليوم")}
            right={<HeatLegend />}
          />
          <div className="overflow-x-auto p-3 sm:p-4">
            <div className="min-w-[600px]">
              <div className="mb-1 flex gap-1">
                <div className="w-[82px] shrink-0" />
                <div className="grid flex-1 gap-[2px]" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                  {Array.from({ length: 24 }, (_, h) => (
                    <span key={h} className="num text-center text-[7.5px] text-steel">{h % 2 === 0 ? n(h) : ""}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-[3px]">
                {branches.map((b) => (
                  <div key={b.id} className={cn("flex items-center gap-1 rounded px-0.5 py-0.5", list.some((x) => x.id === b.id) ? "" : "opacity-40")}>
                    <div className="flex w-[82px] shrink-0 items-center gap-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: statusMeta[b.status].hex }} />
                      <span className="truncate text-[9px] font-medium text-ink">{pick(b.name)}</span>
                    </div>
                    <div className="grid flex-1 gap-[2px]" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                      {Array.from({ length: 24 }, (_, h) => (
                        <HeatCell key={h} value={heatValue(b, h)} label={`${pick(b.name)} · ${n(String(h).padStart(2, "0"))}:00`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 rounded-md border border-[#F3DDAE] bg-[#FEF8EC] px-2.5 py-2 text-[9.5px] leading-relaxed text-[#7A5A10]">
                <span className="font-semibold">{pick(bi("Chronic pattern:", "النمط المزمن:"))}</span>{" "}
                {pick(bi("13:00–14:00 collapses every day (prayer + handover). 09:00–11:00 and 15:00–17:00 saturate Sanaiya. Spread express work into 12:30–15:00.", "١٣:٠٠–١٤:٠٠ ينخفض كل يوم (صلاة وتسليم ورديات). ٠٩:٠٠–١١:٠٠ و١٥:٠٠–١٧:٠٠ تتشبع الصناعية. وزّع الأعمال السريعة على ١٢:٣٠–١٥:٠٠."))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Full floor table */}
      <Card className="mt-3 overflow-hidden">
        <SectionHead
          title={bi(`Bay floor mirror · ${focus.name.en}`, `مرآة أرضية البايات · ${focus.name.ar}`)}
          subtitle={bi("Technician, vehicle and job card status. Read-only; dispatch stays in the legacy system.", "الفني والمركبة وكارت الشغل. قراءة فقط؛ التوزيع يبقى في النظام القديم.")}
          right={<span className="text-[9px] text-steel">{pick(bi("Click a row for the job mirror", "اضغط على الصف لتفاصيل كرت الشغل"))}</span>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-start">
            <thead>
              <tr className="bg-[#FAFAF8] text-[9px] uppercase tracking-[0.08em] text-steel">
                {[bi("Bay", "الباي"), bi("Status", "الحالة"), bi("Technician", "الفني"), bi("Vehicle", "المركبة"), bi("Plate", "اللوحة"), bi("Job", "العمل"), bi("Elapsed", "المدة"), bi("ETA", "الانتهاء")].map((h) => (
                  <th key={h.en} className="border-b border-line px-3 py-2 text-start font-semibold">{pick(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {floor.map((slot) => (
                <tr key={slot.bay} onClick={() => setSelectedBay(slot)} className="cursor-pointer border-b border-line/60 text-[10.5px] transition last:border-0 hover:bg-[#FAFAF8]">
                  <td className="px-3 py-2"><span className="num rounded border border-line bg-white px-1.5 py-0.5 text-[9px] font-semibold">{String(slot.bay).padStart(2, "0")}</span> <span className="ms-1 text-[9px] text-steel">{pick(slot.bayType)}</span></td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-[9.5px]">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: bayStatusMeta[slot.status].fill }} />
                      {statusLabel(slot.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2">{pick(slot.technician)}</td>
                  <td className="px-3 py-2">{pick(slot.vehicle)}</td>
                  <td className="num px-3 py-2 text-steel">{slot.plate}</td>
                  <td className="px-3 py-2 text-steel">{pick(slot.job)}</td>
                  <td className="num px-3 py-2">{n(slot.elapsed)}′</td>
                  <td className="num px-3 py-2 font-medium">{n(slot.eta)}′</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceNote />
      </Card>

      <Drawer
        open={!!selectedBay}
        onClose={() => setSelectedBay(null)}
        eyebrow={bi("Read-only job mirror", "مرآة كرت الشغل · قراءة فقط")}
        title={bi(`Bay ${n(selectedBay?.bay ?? 0)} · ${focus.code}`, `الباي ${n(selectedBay?.bay ?? 0)} · ${focus.code}`)}
        footer={
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-steel">{pick(bi("Actions happen in the legacy DMS only", "كل الإجراءات في النظام القديم فقط"))}</span>
            <GhostButton onClick={() => onNavigate("advisors")}>{pick(bi("Advisor load", "حِمل المستشار"))} <ArrowUpRight size={12} /></GhostButton>
          </div>
        }
      >
        {selectedBay && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-white"><Car size={17} /></span>
              <div>
                <div className="text-[13px] font-semibold text-ink">{pick(selectedBay.vehicle)}</div>
                <div className="num text-[10px] text-steel">{selectedBay.plate}</div>
              </div>
              <span className="ms-auto"><Badge tone={selectedBay.status === "occupied" ? "ink" : selectedBay.status === "idle" ? "neutral" : "warn"} dot>{statusLabel(selectedBay.status)}</Badge></span>
            </div>
            <div>
              <KV k={bi("Technician on job", "الفني المسؤول")} v={pick(selectedBay.technician)} />
              <KV k={bi("Work requested", "العمل المطلوب")} v={pick(selectedBay.job)} />
              <KV k={bi("Bay type", "نوع الباي")} v={pick(selectedBay.bayType)} />
              <KV k={bi("Elapsed", "المدة المنقضية")} v={`${n(selectedBay.elapsed)} ${pick(bi("min", "دقيقة"))}`} mono />
              <KV k={bi("Estimated remaining", "المتبقي المتوقع")} v={`${n(selectedBay.eta)} ${pick(bi("min", "دقيقة"))}`} mono />
              <KV k={bi("Job card state", "حالة كرت الشغل")} v={pick(bi("Open · mirrored", "مفتوح · مرآة"))} />
              <KV k={bi("Branch", "الفرع")} v={pick(focus.name)} />
            </div>
            <div className="rounded-lg border border-line bg-[#FAFAF8] p-3 text-[10px] leading-relaxed text-steel">
              {pick(bi(
                "This card is a mirror. Status transitions, technician assignment and clocking are blocked by design — zero write-backs keeps ZATCA invoice state and warranty claims inside the audited legacy ledger.",
                "هذا الكرت مرآة. تغيير الحالة أو تعيين الفني أو التوقيت محظور بالتصميم — عدم الكتابة العكسية يحفظ حالة فواتير زاتكا ومطالبات الضمان داخل السجل المدقق للنظام القديم."
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
