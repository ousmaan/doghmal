import { CalendarCheck, CarFront, CheckCircle2, MessageCircle, Repeat2, ShieldCheck, Sparkles } from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { network, selectBranches, type BranchId } from "@/data";
import {
  Badge,
  BranchBars,
  Card,
  ExportMenu,
  GhostButton,
  Insight,
  KeyMetric,
  KpiTile,
  Meter,
  PageHeader,
  SectionHead,
  SourceNote,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

/**
 * SALES-TO-SERVICE CONVERSION
 * Pain point: customer attrition after delivery.
 * Delivery, booking and repair-order timestamps come from separate legacy modules
 * and are joined inside the KSA mirror. No customer record is mutated from T3.
 */
export default function Conversion({ branchIds, onNavigate, onDrill, onExport }: SectionProps) {
  const { pick, n, pct } = useI18n();
  const net = network(branchIds);
  const list = selectBranches(branchIds);
  const conversion = net.conversion;
  const unseen = net.buyers - net.converted;
  const contacted = Math.round(net.buyers * 0.86);
  const booked = Math.round(net.buyers * 0.68);
  const repeat = Math.round(net.converted * 0.62);

  const convStatus = (rate: number) => (rate >= 55 ? "healthy" : rate >= 45 ? "watch" : "bottleneck");
  const worst = [...list].sort((a, b) => a.converted / a.buyers - b.converted / b.buyers)[0];
  const best = [...list].sort((a, b) => b.converted / b.buyers - a.converted / a.buyers)[0];

  const stages = [
    { label: bi("New vehicles delivered", "مركبات جديدة مُسلّمة"), value: net.buyers, note: bi("this month", "هذا الشهر"), color: "#1A1A1A" },
    { label: bi("Contacted after delivery", "تم التواصل بعد التسليم"), value: contacted, note: bi("86% outreach", "تواصل ٨٦٪"), color: "#45464A" },
    { label: bi("First service booked", "حجز الصيانة الأولى"), value: booked, note: bi("68% booked", "حجز ٦٨٪"), color: "#8A6D63" },
    { label: bi("Serviced within 90 days", "خدمة خلال ٩٠ يومًا"), value: net.converted, note: bi(`${conversion}% conversion`, `تحويل ${n(conversion)}٪`), color: "#EB0A1A" },
    { label: bi("Repeat service · 6 months", "صيانة متكررة · ٦ أشهر"), value: repeat, note: bi("62% of converted", "٦٢٪ من المحوّلين"), color: "#C60714" },
  ];

  const outreach = list
    .flatMap((b) =>
      Array.from({ length: Math.max(2, Math.round((b.buyers - b.converted) / 4)) }, (_, i) => ({
        id: `CUS-${b.code.slice(-2)}-${String(140 + i * 7)}`,
        branch: b,
        model: i % 2 === 0 ? bi("Toyota Hilux", "تويوتا هايلكس") : bi("GWM Haval H6", "جي دبليو إم هافال H6"),
        days: 34 + i * 13 + (b.buyers % 5),
        channel: i % 3 === 0 ? bi("WhatsApp", "واتساب") : i % 3 === 1 ? bi("Phone", "هاتف") : bi("No contact", "بدون تواصل"),
      }))
    )
    .sort((a, b) => b.days - a.days)
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        index="05"
        eyebrow={bi("Retention · lifetime service", "الاحتفاظ · خدمة العمر")}
        title={bi("From delivery to first service", "من التسليم لأول صيانة")}
        subtitle={bi(
          "The 90-day window is where lifetime service value is won or lost. T3 joins sales delivery dates to service job cards read-only, then surfaces the gap branch by branch.",
          "نافذة الـ٩٠ يوم هي اللي تكسب أو تخسر قيمة العميل مدى الحياة. الطبقة الثالثة تربط تواريخ التسليم بكروت الصيانة للقراءة فقط، وتوضح الفجوة لكل فرع."
        )}
        actions={
          <>
            <GhostButton onClick={() => onNavigate("csi")} className="h-8">
              <Sparkles size={13} /> {pick(bi("Customer experience", "تجربة العميل"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("New buyers this month", "مشترو السيارات هذا الشهر")} value={n(net.buyers)} unit={bi("buyers", "مشترٍ")} icon={<CarFront size={14} />} foot={bi("delivered · legacy sales module", "مُسلّمة · وحدة البيع")} />
        <KpiTile label={bi("Serviced within 90 days", "خدمة خلال ٩٠ يومًا")} value={n(net.converted)} unit={bi(`of ${n(net.buyers)}`, `من ${n(net.buyers)}`)} icon={<CalendarCheck size={14} />} foot={bi(`${pct(conversion)} conversion · target 55%`, `${pct(conversion)} تحويل · المستهدف ٥٥٪`)} />
        <KpiTile label={bi("Not yet returned", "لم يعودوا بعد")} value={n(unseen)} unit={bi("buyers", "مشترٍ")} icon={<MessageCircle size={14} />} foot={bi("outreach queue ready", "قائمة التواصل جاهزة")} />
        <KpiTile label={bi("Avg days to first RO", "متوسط الأيام لأول أمر شغل")} value={n(57)} unit={bi("days", "يوم")} icon={<Repeat2 size={14} />} delta={-5} deltaInverse foot={bi("90-day window · mirrored", "نافذة ٩٠ يوم · مرآة")} />
      </div>

      <div className="mt-3">
        <KeyMetric
          icon={<Sparkles size={15} />}
          label={bi("New-vehicle buyers who booked service inside 90 days", "مشترو السيارات الجديدة اللي حجزوا صيانة خلال ٩٠ يوم")}
          value={pick(bi(`Sales-to-service conversion: ${conversion}% (target 55%)`, `التحويل من البيع للخدمة: ${n(conversion)}٪ (المستهدف ٥٥٪)`))}
          footnote={bi(
            `${unseen} buyers have not returned. If each is worth SAR 1,150 in first-year service, the gap is ~${(unseen * 1150 / 1000).toFixed(0)}K SAR.`,
            `${n(unseen)} مشتريًا ما رجعوا. لو قيمة كل عميل ١٬١٥٠ ر.س في أول سنة خدمة، الفجوة ≈ ${n(Math.round(unseen * 1150 / 1000))} ألف ريال.`
          )}
          status="bottleneck"
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <SectionHead
            title={bi("The 90-day conversion funnel", "قمع التحويل خلال ٩٠ يوم")}
            subtitle={bi("Delivered buyers → outreach → booking → completed service → repeat", "المشترون المسلَّمون ← التواصل ← الحجز ← إتمام الصيانة ← التكرار")}
            right={<Badge tone="red">{pick(bi("Attrition risk", "خطر فقدان"))}</Badge>}
          />
          <div className="p-4">
            <FunnelBlock stages={stages} />
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
              {[
                { l: bi("Never contacted", "بدون تواصل"), v: n(net.buyers - contacted), tone: "text-[#B0281D]" },
                { l: bi("Booked, never arrived", "حجز ولم يحضر"), v: n(booked - net.converted), tone: "text-[#9A6206]" },
                { l: bi("Repeat loyalty rate", "نسبة الولاء"), v: pct(Math.round((repeat / Math.max(net.converted, 1)) * 100)), tone: "text-[#1E7A46]" },
              ].map((x) => (
                <div key={x.l.en} className="rounded-md bg-[#FAFAF8] p-2">
                  <div className="text-[8.5px] text-steel">{pick(x.l)}</div>
                  <div className={cn("num mt-0.5 text-[15px] font-bold", x.tone)}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
          <SourceNote />
        </Card>

        <Card>
          <SectionHead title={bi("Conversion by branch", "التحويل حسب الفرع")} subtitle={bi("90-day window · target 55%", "نافذة ٩٠ يوم · المستهدف ٥٥٪")} right={<span className="text-[9px] text-steel">{pick(bi("Click to drill", "اضغط للتفاصيل"))}</span>} />
          <div className="p-4">
            <BranchBars
              items={list.map((b) => ({
                id: b.id,
                label: b.name,
                value: Math.round((b.converted / b.buyers) * 100),
                status: convStatus((b.converted / b.buyers) * 100),
                sub: bi(`${n(b.converted)}/${n(b.buyers)}`, `${n(b.converted)}/${n(b.buyers)}`),
              }))}
              target={55}
              onSelect={(id) => onDrill(id as BranchId, "conversion")}
            />
            <div className="mt-3 flex items-center justify-between border-t border-line pt-2 text-[9px] text-steel">
              <span>{pick(bi("Network", "الشبكة"))} <span className="num font-semibold text-ink">{pct(conversion)}</span></span>
              <span>{pick(bi("Best", "الأفضل"))} <span className="font-medium text-ink">{pick(best.name)}</span></span>
            </div>
            <Insight
              tone="danger"
              title={bi("Targeted outreach recommended", "نوصي بحملة تواصل مستهدفة")}
              body={bi(
                `${pick(worst.name)} converts only ${pct(Math.round((worst.converted / worst.buyers) * 100))} — ${n(worst.buyers - worst.converted)} buyers have not returned for their first service. The mirror has their masked IDs and delivery dates ready for the CRM team.`,
                `${pick(worst.name)} تحوّل فقط ${pct(Math.round((worst.converted / worst.buyers) * 100))} — ${n(worst.buyers - worst.converted)} مشتريًا ما رجعوا للصيانة الأولى. المرآة تجهز للفريق معرفات مقنّعة وتواريخ التسليم.`
              )}
            />
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <SectionHead
            title={bi("Retention matrix · branch by branch", "مصفوفة الاحتفاظ · فرع بفرع")}
            subtitle={bi("Buyers, conversion and unseen customers · anonymised analytics", "المشترون والتحويل وغير العائدين · تحليلات مجهولة الهوية")}
            right={<Badge tone="ok" dot>{pick(bi("PDPL masked", "PDPL مقنّع"))}</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="bg-[#FAFAF8] text-[8.5px] uppercase tracking-[0.08em] text-steel">
                  {[bi("Branch", "الفرع"), bi("Buyers", "المشترون"), bi("Serviced 90d", "خدموا خلال ٩٠ يوم"), bi("Not returned", "لم يعودوا"), bi("Conversion", "التحويل"), bi("Signal", "الإشارة")].map((h) => (
                    <th key={h.en} className="border-b border-line px-3 py-2 text-start font-semibold first:ps-4">{pick(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((b) => {
                  const rate = Math.round((b.converted / b.buyers) * 100);
                  return (
                    <tr key={b.id} onClick={() => onDrill(b.id, "advisors")} className="cursor-pointer border-b border-line/60 text-[10px] transition last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-3 py-2.5 font-medium text-ink first:ps-4">{pick(b.name)}</td>
                      <td className="num px-3 py-2.5">{n(b.buyers)}</td>
                      <td className="num px-3 py-2.5">{n(b.converted)}</td>
                      <td className="num px-3 py-2.5 text-[#B0281D]">{n(b.buyers - b.converted)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="num w-7 font-semibold">{pct(rate)}</span>
                          <div className="w-16"><Meter value={rate} target={55} tone={rate >= 55 ? "#27AE60" : rate >= 45 ? "#F39C12" : "#E74C3C"} height={4} /></div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={rate >= 55 ? "ok" : rate >= 45 ? "warn" : "danger"} dot>
                          {rate >= 55 ? pick(bi("On track", "على المسار")) : rate >= 45 ? pick(bi("Watch", "مراقبة")) : pick(bi("At risk", "خطر"))}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <SourceNote />
        </Card>

        <Card className="overflow-hidden">
          <SectionHead
            title={bi("Outreach queue", "قائمة التواصل")}
            subtitle={bi("Oldest unreturned deliveries · masked IDs", "أقدم التسليمات غير العائدة · معرفات مقنّعة")}
            right={<MessageCircle size={13} className="text-toyota" />}
          />
          <div className="divide-y divide-line">
            {outreach.map((c) => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#F4F4F1] text-[8px] font-semibold text-steel">{n(c.days)}d</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] font-medium text-ink">{pick(c.model)} · {pick(c.branch.name)}</span>
                  <span className="num block truncate text-[8.5px] text-steel">{c.id} · {pick(c.channel)}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded border border-line bg-[#FAFAF8] px-1 py-0.5 text-[8px] text-steel"><ShieldCheck size={8} /> {pick(bi("masked", "مقنّع"))}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line bg-[#FAFAF8] px-3 py-2 text-[9px] leading-relaxed text-steel">
            {pick(bi("Queue is advisory. Messaging consent and CRM updates stay in the legacy owner system; no PII leaves KSA.", "القائمة استشارية. الموافقات وتحديثات CRM تبقى في النظام المالك؛ ولا تخرج أي بيانات شخصية من المملكة."))}
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {[
          { icon: CheckCircle2, title: bi("Zero double-entry", "صفر إدخال مزدوج"), body: bi("Advisors never re-type a delivery or job card. The mirror joins them automatically.", "المستشار ما يعيد كتابة أي تسليم أو كرت شغل. المرآة تربطها تلقائيًا.") },
          { icon: MessageCircle, title: bi("Less phone work", "مكالمات أقل"), body: bi("Service status is visible to the customer; 247 calls avoided this week.", "حالة الخدمة واضحة للعميل؛ ٢٤٧ مكالمة ما احتجناها هذا الأسبوع.") },
          { icon: ShieldCheck, title: bi("Compliant by design", "متوافق بالتصميم"), body: bi("Read-only, in-Kingdom, 18-month retention with anonymised analytics.", "قراءة فقط، داخل المملكة، احتفاظ ١٨ شهرًا وتحليلات مجهولة.") },
        ].map((c) => (
          <div key={c.title.en} className="rounded-lg border border-line bg-white p-3">
            <c.icon size={13} className="text-toyota" />
            <div className="mt-1.5 text-[10.5px] font-semibold text-ink">{pick(c.title)}</div>
            <p className="mt-0.5 text-[9px] leading-relaxed text-steel">{pick(c.body)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelBlock({ stages }: { stages: { label: ReturnType<typeof bi>; value: number; note: ReturnType<typeof bi>; color: string }[] }) {
  const { pick, n } = useI18n();
  const max = stages[0]?.value || 1;
  return (
    <div className="space-y-2">
      {stages.map((s, i) => {
        const width = Math.max(32, (s.value / max) * 100);
        const prev = i > 0 ? stages[i - 1].value : s.value;
        const rate = Math.round((s.value / Math.max(prev, 1)) * 100);
        return (
          <div key={s.label.en}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[10.5px]">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <span className="num flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: `${s.color}18`, color: s.color }}>{n(i + 1)}</span>
                {pick(s.label)}
              </span>
              <span className="flex items-center gap-2">
                <span className="num font-semibold text-ink">{n(s.value)}</span>
                {i > 0 && <span className="num rounded bg-[#F4F4F1] px-1 py-0.5 text-[8.5px] text-steel">{n(rate)}٪</span>}
              </span>
            </div>
            <div className="h-[26px] w-full overflow-hidden rounded-md bg-[#F5F5F2]">
              <div className="flex h-full items-center justify-end rounded-md pe-2 transition-all duration-700" style={{ width: `${width}%`, background: s.color }}>
                <span className="truncate text-[8.5px] font-medium text-white/80">{pick(s.note)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
