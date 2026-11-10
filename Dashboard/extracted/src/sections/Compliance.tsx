import { useState } from "react";
import {
  Activity,
  ArrowLeftRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Cloud,
  CloudOff,
  Database,
  FileCheck2,
  Fingerprint,
  Globe2,
  KeyRound,
  Lock,
  RefreshCw,
  ScanLine,
  Zap,
  Server,
  ShieldCheck,
  Timer,
  XCircle,
} from "lucide-react";
import { bi, useI18n } from "@/lib/i18n";
import { cdc, pipelineEvents, zatcaStats, branches } from "@/data";
import {
  Badge,
  Card,
  ExportMenu,
  GhostButton,
  KV,
  KeyMetric,
  KpiTile,
  PageHeader,
  SectionHead,
  SourceNote,
} from "@/components/ui";
import { cn } from "@/utils/cn";
import type { SectionProps } from "./types";

/**
 * REGULATORY COMPLIANCE
 * Invariants enforced at the architecture level (not just policy):
 *  1. The dashboard's cloud role has SELECT-only credentials on CDC views.
 *  2. No API route, button or form in T3 can emit a legacy write.
 *  3. ZATCA cryptographic stamping + clearance happen inside the legacy ERP.
 *  4. PDPL: KSA-only storage/compute; PII masked; 18-month retention policy.
 *  5. If the mirror pauses, UI degrades to a "data delayed" badge — never estimated values.
 */
export default function Compliance({
  onExport,
  cloudDelayed,
  onToggleDelay,
}: SectionProps & { cloudDelayed: boolean; onToggleDelay: () => void }) {
  const { pick, n, pct } = useI18n();
  const [pdplOpen, setPdplOpen] = useState(false);
  const lastEvent = cloudDelayed ? "14:31:04" : cdc.lastEvent;

  return (
    <div>
      <PageHeader
        index="08"
        eyebrow={bi("Governance · trust", "الحوكمة · الثقة")}
        title={bi("Compliance — the legacy system stays in charge", "التوافق — النظام القديم هو المسؤول")}
        subtitle={bi(
          "ZATCA Phase 2, PDPL data residency and CDC health. T3 observes and mirrors; stamping, clearance and invoicing remain exclusively inside the audited legacy system.",
          "المرحلة الثانية من زاتكا، وإقامة البيانات PDPL، وصحة CDC. الطبقة الثالثة تراقب وتنسخ فقط؛ الختم والخلاصة والفواتير تبقى حصريًا داخل النظام القديم المدقق."
        )}
        actions={
          <>
            <GhostButton onClick={onToggleDelay} className="h-8">
              {cloudDelayed ? <Cloud size={13} className="text-ok" /> : <CloudOff size={13} className="text-warn" />}
              {cloudDelayed ? pick(bi("Restore pipeline", "استعادة التدفق")) : pick(bi("Simulate outage", "محاكاة انقطاع"))}
            </GhostButton>
            <ExportMenu onExport={onExport} />
          </>
        }
      />

      {cloudDelayed && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-[#F3DDAE] bg-[#FEF5E4] px-3.5 py-2.5">
          <CloudOff size={14} className="text-[#9A6206]" />
          <span className="text-[11px] font-semibold text-[#7A5A10]">{pick(bi("Data delayed — not wrong", "البيانات متأخرة — ليست خاطئة"))}</span>
          <span className="text-[10px] leading-relaxed text-[#8A6A1E]">
            {pick(bi(
              "Cloud mirror paused. Last verified event 14:31:04 is shown; no estimates, no interpolation and no write path to legacy.",
              "المرآة السحابية متوقفة. نعرض آخر حدث موثق ١٤:٣١:٠٤؛ بدون تقديرات أو استنتاج أو أي كتابة للنظام القديم."
            ))}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label={bi("ZATCA Phase 2", "زاتكا المرحلة الثانية")} value={pct(zatcaStats.compliance, 1)} icon={<FileCheck2 size={14} />} foot={bi(`${n(zatcaStats.stamped)}/${n(zatcaStats.invoicesToday)} stamped today`, `${n(zatcaStats.stamped)}/${n(zatcaStats.invoicesToday)} مختومة اليوم`)} />
        <KpiTile label={bi("Last stamped invoice", "آخر فاتورة مختومة")} value={n(zatcaStats.lastStamp)} unit={bi("today", "اليوم")} icon={<ScanLine size={14} />} foot={bi("legacy clearance API", "واجهة الخلاصة القديمة")} />
        <KpiTile label={bi("CDC latency", "تأخر CDC")} value={n(cloudDelayed ? 387 : cdc.latencySec)} unit={bi(cloudDelayed ? "sec · delayed" : "sec", cloudDelayed ? "ث · متأخر" : "ثانية")} icon={<Timer size={14} />} foot={bi("events mirrored asynchronously", "أحداث منسوخة بشكل غير متزامن")} />
        <KpiTile label={bi("Legacy uptime", "جاهزية النظام القديم")} value={pct(cdc.uptime, 2)} icon={<Server size={14} />} foot={bi("30-day rolling · on-prem", "٣٠ يومًا · داخل المقر")} />
      </div>

      <div className="mt-3">
        <KeyMetric
          icon={<ShieldCheck size={15} />}
          label={bi("Mirrored evidence · immutable event log", "دليل مرآة · سجل أحداث غير قابل للتعديل")}
          value={
            cloudDelayed
              ? pick(bi("Data delayed: last verified 14:31 today | mirror latency 387 seconds", "البيانات متأخرة: آخر تحقق ١٤:٣١ اليوم | تأخر المرآة ٣٨٧ ثانية"))
              : pick(bi(`Last ZATCA-stamped invoice: ${zatcaStats.lastStamp} today | CDC pipeline latency: 3 seconds`, `آخر فاتورة مختومة زاتكا: ١٤:٣٢ اليوم | تأخر تدفق CDC: ٣ ثوانٍ`))
          }
          footnote={bi(
            "Both statements are read from audit tables. The dashboard cannot stamp, clear, void or resend an invoice.",
            "القراءتان مأخوذتان من جداول التدقيق. اللوحة لا تستطيع ختم أو إخلاء أو إلغاء أو إعادة إرسال أي فاتورة."
          )}
          status={cloudDelayed ? "bottleneck" : "healthy"}
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        {/* ZATCA */}
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("ZATCA Phase 2 · integration compliance", "زاتكا المرحلة الثانية · توافق الربط")}
            subtitle={bi("System of record: legacy ERP · T3 observes only", "مصدر الحقيقة: النظام القديم · الثالثة تراقب فقط")}
            right={<Badge tone={cloudDelayed ? "warn" : "ok"} dot>{cloudDelayed ? pick(bi("Observation paused", "المراقبة متوقفة")) : pick(bi("Compliant", "متوافق"))}</Badge>}
          />
          <div className="p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-steel">{pick(bi("Invoice lifecycle (inside legacy ERP)", "دورة الفاتورة (داخل النظام القديم)"))}</div>
                <div className="space-y-2">
                  {[
                    { t: bi("Invoice generated", "إنشاء الفاتورة"), d: `${n(zatcaStats.invoicesToday)} today`, ar: `${n(zatcaStats.invoicesToday)} اليوم`, done: true },
                    { t: bi("Cryptographic stamp", "الختم التشفيري"), d: `UUID / QR · ${zatcaStats.lastStamp}`, ar: `UUID / QR · ${n("14:32")}`, done: true },
                    { t: bi("Clearance API", "واجهة الخلاصة"), d: pick(zatcaStats.clearance), ar: pick(zatcaStats.clearance), done: true },
                    { t: bi("Next batch window", "دفعة الختم القادمة"), d: `${zatcaStats.nextBatch} · auto`, ar: `${n("14:42")} · تلقائي`, done: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", s.done ? "bg-[#EAF7EF] text-[#1E7A46]" : "border border-dashed border-line bg-white text-steel")}>
                        {s.done ? <CheckCircle2 size={12} /> : <Timer size={11} />}
                      </span>
                      <div className="flex-1 border-b border-line/70 pb-2 last:border-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <span className="text-[10.5px] font-medium text-ink">{pick(s.t)}</span>
                          <span className="num text-[9px] text-steel">{pick(bi(s.d as string, s.ar as string))}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-auto flex flex-col items-center justify-center rounded-lg border border-line bg-[#FAFAF8] p-4 sm:w-[130px]">
                <div className="relative h-[86px] w-[86px]">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#E9E9E4" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={cloudDelayed ? "#F39C12" : "#27AE60"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42 * (zatcaStats.compliance / 100)} ${2 * Math.PI * 42}`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="num text-[19px] font-bold text-ink">{n(zatcaStats.compliance, 1)}</span>
                    <span className="text-[7.5px] text-steel">{pick(bi("compliance", "امتثال"))}</span>
                  </div>
                </div>
                <div className="mt-2 text-center text-[8px] leading-relaxed text-steel">
                  {pick(bi("0 rejected", "٠ مرفوضة"))}<br />
                  {pick(bi("0 late transmissions", "٠ إرسال متأخر"))}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-line">
              <div className="flex items-center justify-between border-b border-line bg-[#FAFAF8] px-3 py-1.5">
                <span className="text-[9.5px] font-semibold text-ink">{pick(bi("Last mirrored invoices", "آخر الفواتير المنسوخة"))}</span>
                <span className="text-[8px] text-steel">{pick(bi("masked · read-only", "مقنّعة · قراءة فقط"))}</span>
              </div>
              <div className="divide-y divide-line">
                {[
                  { no: "INV-2026-4471", br: branches[0], amount: 1840, stamp: "14:32", ok: true },
                  { no: "INV-2026-4470", br: branches[2], amount: 3265, stamp: "14:29", ok: true },
                  { no: "INV-2026-4469", br: branches[1], amount: 780, stamp: "14:27", ok: true },
                ].map((inv) => (
                  <div key={inv.no} className="flex flex-wrap items-center gap-2 px-3 py-1.5 text-[9.5px]">
                    <FileCheck2 size={11} className="text-[#1E7A46]" />
                    <span className="num font-medium text-ink">{inv.no}</span>
                    <span className="text-steel">{pick(inv.br.name)}</span>
                    <span className="num ms-auto font-medium text-ink">{n(inv.amount)} SAR</span>
                    <Badge tone="ok">{pick(bi("stamped", "مختومة"))} · {n(inv.stamp)}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-start gap-1.5 text-[9px] leading-relaxed text-[#9A9E9F]">
              <Lock size={10} className="mt-[2px] shrink-0" />
              {pick(bi("Stamp UUIDs and QR payloads are generated on-prem. T3 stores only invoice totals, timestamps and a compliance status flag.", "معرفات الختم ورموز QR تُنشأ داخل المقر. الطبقة الثالثة تخزن فقط الإجماليات والأوقات وحالة الامتثال."))}
            </div>
          </div>
        </Card>

        {/* PDPL */}
        <Card className="overflow-hidden">
          <SectionHead
            title={bi("PDPL · data residency", "PDPL · إقامة البيانات")}
            subtitle={bi("Personal Data Protection Law controls", "ضوابط نظام حماية البيانات الشخصية")}
            right={<span className="live-dot h-2 w-2 rounded-full bg-ok" />}
          />
          <div className="p-4">
            <div className="rounded-lg border border-[#BFE6CE] bg-[#F1F9F4] p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-[#1E7A46] shadow-sm"><Globe2 size={15} /></span>
                <div>
                  <div className="text-[10.5px] font-semibold text-[#1E7A46]">{pick(bi("All data in Saudi Arabia", "كل البيانات داخل السعودية"))}</div>
                  <div className="text-[8.5px] text-[#3E7A58]">{pick(cdc.region)}</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-[8.5px]">
                <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-1 text-[#1E7A46]"><CheckCircle2 size={9} /> {pick(bi("No egress", "بلا نقل خارجي"))}</span>
                <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-1 text-[#1E7A46]"><CheckCircle2 size={9} /> {pick(bi("PII masked", "البيانات مقنّعة"))}</span>
                <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-1 text-[#1E7A46]"><CheckCircle2 size={9} /> {pick(bi("KSA encryption keys", "مفاتيح تشفير سعودية"))}</span>
                <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-1 text-[#1E7A46]"><CheckCircle2 size={9} /> {pick(bi("18-mo retention", "احتفاظ ١٨ شهرًا"))}</span>
              </div>
            </div>
            <div className="mt-2.5">
              <KV k={bi("Primary region", "المنطقة الأساسية")} v={pick(bi("Riyadh, KSA", "الرياض، السعودية"))} />
              <KV k={bi("DR region", "النسخة الاحتياطية")} v={pick(bi("Al Jubail, KSA", "الجبيل، السعودية"))} />
              <KV k={bi("Egress", "النقل الخارجي")} v={pick(cdc.egress)} />
              <KV k={bi("Retention", "الاحتفاظ")} v={pick(cdc.retention)} />
              <KV k={bi("Access model", "نموذج الوصول")} v={pick(bi("RBAC · 14 named users", "أدوار · ١٤ مستخدمًا"))} />
              <KV k={bi("PII in analytics", "البيانات في التحليلات")} v={pick(bi("Pseudonymised", "مستعارة الهوية"))} />
            </div>
            <button onClick={() => setPdplOpen((v) => !v)} className="mt-2 flex w-full items-center justify-between rounded-md border border-line bg-[#FAFAF8] px-2.5 py-1.5 text-[9.5px] font-medium text-ink transition hover:border-ink/25">
              {pick(bi("Residency evidence", "أدلة إقامة البيانات"))}
              <span className="text-[8px] text-steel">{pdplOpen ? pick(bi("hide", "إخفاء")) : pick(bi("show", "عرض"))}</span>
            </button>
            {pdplOpen && (
              <div className="mt-2 space-y-1 rounded-md border border-line bg-[#FAFAF8] p-2 text-[8.5px]">
                <KV k={bi("Cloud region ID", "معرف المنطقة")} v={<span className="num">me-central-ksa-1</span>} />
                <KV k={bi("Last DPIA review", "آخر مراجعة أثر")} v={pick(bi("Jan 2026 · passed", "يناير ٢٠٢٦ · مجتاز"))} />
                <KV k={bi("Consent source", "مصدر الموافقة")} v={pick(bi("Legacy CRM", "CRM القديم"))} />
                <KV k={bi("Anonymisation", "إخفاء الهوية")} v={pick(bi("k-anonymity ≥ 5", "k ≥ ٥"))} />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Architecture */}
      <Card className="mt-3 overflow-hidden">
        <SectionHead
          title={bi("Non-invasive integration layer", "طبقة التكامل غير التدخلية")}
          subtitle={bi("One-way event flow · cloud role has SELECT only · zero write surface", "تدفق أحداث باتجاه واحد · دور السحابة قراءة فقط · صفر واجهة كتابة")}
          right={<Badge tone="ok" dot>{pick(bi("Architecture enforced", "مفروض معماريًا"))}</Badge>}
        />
        <div className="p-4">
          <div dir="ltr" className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {[
              { icon: Database, title: bi("Legacy ERP / DMS", "النظام القديم"), lines: [bi("On-prem · Najran", "داخل المقر · نجران"), bi("ZATCA stamping & clearance", "ختم زاتكا والخلاصة"), bi("System of record", "مصدر الحقيقة")], tone: "ink" },
              { icon: ScanLine, title: bi("CDC agent", "وكيل CDC"), lines: [bi("SELECT-only views", "قراءة فقط"), bi("Change log, 3s batch", "سجل تغييرات كل ٣ ثوانٍ"), bi("No schema writes", "بلا كتابة هيكلية")], tone: "steel" },
              { icon: Cloud, title: bi("KSA cloud mirror", "المرآة السحابية"), lines: [bi("Riyadh + Al Jubail DR", "الرياض + الجبيل"), bi("Pseudonymised analytics", "تحليلات مستعارة"), bi("18-month retention", "احتفاظ ١٨ شهرًا")], tone: "green" },
            ].map((node, i) => (
              <div key={node.title.en} className="contents">
                <div className={cn("rounded-lg border p-3", node.tone === "ink" ? "border-ink/20 bg-[#FAFAF8]" : node.tone === "green" ? "border-[#BFE6CE] bg-[#F1F9F4]" : "border-line bg-white")}>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded", node.tone === "ink" ? "bg-ink text-white" : node.tone === "green" ? "bg-[#27AE60] text-white" : "bg-[#F0F0EC] text-ink")}><node.icon size={12} /></span>
                    <span className="text-[10.5px] font-semibold text-ink">{pick(node.title)}</span>
                  </div>
                  <div className="mt-1.5 space-y-0.5">
                    {node.lines.map((l) => (
                      <div key={l.en} className="flex items-center gap-1 text-[8.5px] text-steel"><CheckCircle2 size={8} className="text-[#27AE60]" /> {pick(l)}</div>
                    ))}
                  </div>
                </div>
                {i < 2 && (
                  <div className="flex items-center justify-center gap-1 text-[#27AE60]">
                    <span className="hidden h-px w-4 bg-[#27AE60]/40 md:block" />
                    <ArrowLeftRight size={13} className="rotate-90 md:rotate-0" />
                    <span className="text-[8px] font-medium">{pick(bi("events", "أحداث"))}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-md border border-[#F6C7C2] bg-[#FDF0EE] px-3 py-2">
              <XCircle size={13} className="shrink-0 text-[#B0281D]" />
              <div>
                <div className="text-[9.5px] font-semibold text-[#B0281D]">{pick(bi("Write path disabled", "مسار الكتابة معطل"))}</div>
                <div className="text-[8.5px] text-[#8A4A42]">{pick(bi("No invoice, job-card, part or customer mutation is exposed. Ever.", "لا يوجد أي تعديل على فاتورة أو كرت شغل أو قطعة أو عميل. إطلاقًا."))}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[#BFE6CE] bg-[#F1F9F4] px-3 py-2">
              <Zap size={13} className="shrink-0 text-[#1E7A46]" />
              <div>
                <div className="text-[9.5px] font-semibold text-[#1E7A46]">{pick(bi("Zero double data-entry", "صفر إدخال مزدوج"))}</div>
                <div className="text-[8.5px] text-[#3E7A58]">{pick(bi("Advisors keep working in the legacy screen; T3 reads the same events.", "المستشار يكمل في النظام القديم؛ الثالثة تقرأ نفس الأحداث."))}</div>
              </div>
            </div>
          </div>
        </div>
        <SourceNote>{pick(bi("Reference architecture — legacy remains authoritative for ZATCA; read-only CDC mirror in-Kingdom.", "المعمارية المرجعية — النظام القديم مرجع زاتكا؛ مرآة CDC للقراءة فقط داخل المملكة."))}</SourceNote>
      </Card>

      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <SectionHead
            title={bi("CDC event stream · freshness", "تدفق أحداث CDC · الحداثة")}
            subtitle={bi(`Last mirrored event ${lastEvent} · ${n(cdc.eventsPerMin)} events/min`, `آخر حدث منسوخ ${n(lastEvent)} · ${n(cdc.eventsPerMin)} حدث/دقيقة`)}
            right={<Badge tone={cloudDelayed ? "warn" : "ok"} dot>{cloudDelayed ? pick(bi("Delayed", "متأخر")) : pick(bi("Live · 3s", "مباشر · ٣ ث"))}</Badge>}
          />
          <div className="divide-y divide-line">
            {pipelineEvents.map((e) => (
              <div key={e.time} className="flex flex-wrap items-center gap-2 px-3.5 py-2 text-[9.5px]">
                <span className="num w-14 shrink-0 font-medium text-steel">{n(cloudDelayed ? "13:58:xx" : e.time)}</span>
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#F4F4F1]"><Activity size={8} className="text-ink" /></span>
                <span className="num w-28 shrink-0 font-medium text-ink">{pick(e.event)}</span>
                <span className="min-w-0 flex-1 truncate text-steel">{pick(e.detail)}</span>
                <Badge tone={pick(e.status).includes("ZATCA") || pick(e.status).includes("زاتكا") ? "ok" : "neutral"}>{pick(e.status)}</Badge>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-[#FAFAF8] px-3.5 py-2 text-[8.5px] text-steel">
            <span className="inline-flex items-center gap-1"><KeyRound size={9} /> {pick(bi("Cloud identity: SELECT on 11 CDC views", "هوية السحابة: قراءة على ١١ عرضًا"))}</span>
            <span className="inline-flex items-center gap-1"><RefreshCw size={9} /> {pick(bi("Async mirror · no round-trip to legacy", "نسخ غير متزامن · بلا رجوع للنظام"))}</span>
          </div>
          <SourceNote />
        </Card>

        <div className="space-y-3">
          <Card>
            <SectionHead title={bi("System health", "صحة الأنظمة")} subtitle={bi("Observed, never controlled", "مراقبة، غير متحكم بها")} right={<Activity size={13} className="text-steel" />} />
            <div className="p-4">
              {[
                { l: bi("Legacy ERP uptime", "جاهزية النظام القديم"), v: pct(cdc.uptime, 2), ok: true, icon: Server },
                { l: bi("CDC pipeline", "تدفق CDC"), v: cloudDelayed ? pick(bi("delayed", "متأخر")) : pick(bi("healthy", "سليم")), ok: !cloudDelayed, icon: ScanLine },
                { l: bi("KSA mirror storage", "تخزين المرآة"), v: pct(61), ok: true, icon: HardDriveIcon },
                { l: bi("Write-back surface", "واجهة الكتابة العكسية"), v: pick(bi("0 endpoints", "٠ واجهات")), ok: true, icon: Lock },
              ].map((s) => (
                <div key={s.l.en} className="flex items-center gap-2 border-b border-line/70 py-2 last:border-0">
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded", s.ok ? "bg-[#EAF7EF] text-[#1E7A46]" : "bg-[#FEF5E4] text-[#9A6206]")}><s.icon size={11} /></span>
                  <span className="flex-1 text-[9.5px] text-steel">{pick(s.l)}</span>
                  <span className={cn("num text-[9.5px] font-semibold", s.ok ? "text-[#1E7A46]" : "text-[#9A6206]")}>{s.v}</span>
                </div>
              ))}
              <div className="mt-2 rounded-md bg-[#FAFAF8] p-2 text-[8.5px] leading-relaxed text-steel">
                <span className="inline-flex items-center gap-1 font-medium text-ink"><Fingerprint size={9} /> {pick(bi("Immutable audit trail", "سجل تدقيق غير قابل للتعديل"))}</span><br />
                {pick(bi("Every read is attributed to a named T3 role. Legacy audit logs remain the legal record.", "كل قراءة منسوبة لدور مسمى في الطبقة الثالثة. سجلات النظام القديم هي السجل القانوني."))}
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: BadgeCheck, t: bi("ZATCA Phase 2", "زاتكا المرحلة ٢"), s: bi("Linked", "مرتبط") },
              { icon: ShieldCheck, t: bi("PDPL review", "مراجعة PDPL"), s: bi("Passed", "مجتاز") },
              { icon: Building2, t: bi("KSA hosting", "استضافة سعودية"), s: bi("Riyadh", "الرياض") },
              { icon: Lock, t: bi("Read-only", "قراءة فقط"), s: bi("Enforced", "مفروض") },
            ].map((x) => (
              <div key={x.t.en} className="rounded-lg border border-line bg-white p-2.5">
                <x.icon size={13} className="text-[#1E7A46]" />
                <div className="mt-1.5 text-[9px] font-medium text-ink">{pick(x.t)}</div>
                <div className="text-[8px] text-steel">{pick(x.s)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HardDriveIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" x2="2" y1="12" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" x2="6.01" y1="16" y2="16" />
    </svg>
  );
}
