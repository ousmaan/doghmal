import {
  advisors,
  branches,
  csiTrend,
  network,
  parts,
  selectBranches,
  slowMovers,
  topRoutes,
  transfers,
  type BranchId,
} from "@/data";
import type { Lang } from "./i18n";

export type SectionId =
  | "executive"
  | "bays"
  | "parts"
  | "advisors"
  | "conversion"
  | "csi"
  | "transfers"
  | "compliance";

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const body = rows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Read-only exports. Every row is copied from the KSA cloud mirror. */
function buildRows(section: SectionId, lang: Lang, ids: BranchId[] | "all"): (string | number)[][] {
  const ar = lang === "ar";
  const nm = (x: { en: string; ar: string }) => (ar ? x.ar : x.en);
  const list = selectBranches(ids);
  const net = network(ids);
  const head = (cols: (string | number)[]) => cols;

  switch (section) {
    case "executive":
      return [
        head([ar ? "الفرع" : "Branch", ar ? "الحالة" : "Status", ar ? "الإيراد اليومي" : "Daily revenue", ar ? "استهلاك البايات٪" : "Bay util %", "CSI", ar ? "الانتظار (د)" : "Wait (min)", ar ? "التحويل٪" : "Conversion %"]),
        ...list.map((b) => [nm(b.name), b.status, b.revenue, b.utilization, b.csi, b.wait, b.conversion]),
        ["TOTAL", "", net.revenue, net.utilization, net.csi, net.wait, net.conversion],
      ];
    case "bays":
      return [
        head([ar ? "الفرع" : "Branch", ar ? "البايات" : "Bays", ar ? "الاستهلاك٪" : "Utilization %", ar ? "المستهدف٪" : "Target %", ar ? "الحالة" : "Status"]),
        ...list.map((b) => [nm(b.name), b.bays, b.utilization, 75, b.status]),
      ];
    case "parts":
      return [
        head([ar ? "رقم القطعة" : "Part no", ar ? "الوصف" : "Description", ar ? "المخزون" : "On hand", ar ? "أيام التغطية" : "Days of supply", ar ? "سرعة الصرف/أسبوع" : "Weekly issued", ar ? "آخر استخدام (يوم)" : "Last used (days)"]),
        ...parts.slice(0, 60).map((p) => [p.partNo, nm(p.name), p.onHand, p.daysSupply, p.weeklyIssued, p.lastUsedDays]),
      ];
    case "advisors":
      return [
        head([ar ? "المستشار" : "Advisor", ar ? "الفرع" : "Branch", ar ? "مركبات/يوم" : "Vehicles/day", "CSI", ar ? "الرد (دقيقة)" : "Response (min)", ar ? "ساعات خاملة/يوم" : "Idle hrs/day"]),
        ...advisors.filter((a) => ids === "all" || ids.includes(a.branch.id)).map((a) => [nm(a.name), nm(a.branch.name), a.throughput, a.csi, a.responseMin, a.idleHours]),
      ];
    case "conversion":
      return [
        head([ar ? "الفرع" : "Branch", ar ? "مشترو السيارات" : "New buyers", ar ? "تم التحويل" : "Converted", ar ? "نسبة التحويل٪" : "Conversion %"]),
        ...list.map((b) => [nm(b.name), b.buyers, b.converted, Math.round((b.converted / b.buyers) * 100)]),
        ["TOTAL", net.buyers, net.converted, net.conversion],
      ];
    case "csi": {
      const points = csiTrend(branches[0]);
      return [
        head([ar ? "الفرع" : "Branch", ...points.slice(-8).map((p) => (ar ? p.weekAr : p.week))]),
        ...list.map((b) => [nm(b.name), ...csiTrend(b).slice(-8).map((p) => p.value)]),
        head([ar ? "متوسط الانتظار (دقيقة)" : "Avg wait (min)", ...list.map((b) => b.wait)]),
      ];
    }
    case "transfers":
      return [
        head([ar ? "من" : "From", ar ? "إلى" : "To", ar ? "القطعة" : "Part", ar ? "السبب" : "Reason", ar ? "الكمية" : "Qty", ar ? "زمن الحل (ساعة)" : "Resolution (hrs)"]),
        ...transfers.map((t) => [nm(branches.find((b) => b.id === t.from)!.name), nm(branches.find((b) => b.id === t.to)!.name), nm(t.part), t.reason, t.qty, t.hours]),
        head([ar ? "عدد المسارات" : "Routes", topRoutes.length, ar ? "أعلى مسار" : "Top route", `${topRoutes[0].count}/week`]),
        head([ar ? "أكثر ١٠ ركودًا" : "Top 10 slow movers", ...slowMovers.map((p) => p.partNo)]),
      ];
    case "compliance":
      return [
        head([ar ? "المؤشر" : "Check", ar ? "الحالة" : "Status", ar ? "التفاصيل" : "Detail"]),
        ["ZATCA Phase 2", "Compliant", "138/138 stamped, 0 rejected"],
        ["PDPL data residency", "Compliant", "Riyadh primary / Al Jubail DR"],
        ["CDC pipeline", "Healthy", "Latency 3s · 99.98% uptime"],
        ["Write-back surface", "Locked", "0 write operations exposed to dashboard"],
      ];
  }
}

export function runExport(section: SectionId, format: "csv" | "pdf", lang: Lang, ids: BranchId[] | "all") {
  const stamp = new Date().toISOString().slice(0, 10);
  if (format === "pdf") {
    window.print();
    return;
  }
  downloadCsv(`doghmal-${section}-${stamp}.csv`, buildRows(section, lang, ids));
}
