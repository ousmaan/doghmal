import { bi, type Bi } from "@/lib/i18n";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MOCK TELEMETRY — mirrored, never authored here.
 *
 * Data architecture (see also src/lib/architecture.md):
 *  Legacy ERP / DMS (on-prem, Najran)  →  read-only CDC agent  →  KSA cloud mirror
 *  This file simulates the *mirror* only. No write path is exposed to the UI.
 *  ZATCA Phase‑2 stamping + invoice transmission stay 100% inside the legacy
 *  system of record. PDPL: all payloads (incl. masked PII) remain in-Kingdom.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type BranchId =
  | "dahdah"
  | "abdulaziz"
  | "sinaiya_1"
  | "sinaiya_2"
  | "sinaiya_3"
  | "ghawella";

export type Health = "healthy" | "watch" | "bottleneck";

export interface Branch {
  id: BranchId;
  code: string;
  name: Bi;
  district: Bi;
  role: Bi;
  manager: Bi;
  bays: number;
  utilization: number;
  status: Health;
  revenue: number;
  csi: number;
  wait: number;
  conversion: number;
  buyers: number;
  converted: number;
  callsAvoided: number;
  idleHoursSaved: number;
  partsTurn: number;
  openJobcards: number;
  trend: number[];
}

export const branches: Branch[] = [
  {
    id: "dahdah",
    code: "NAJ-01",
    name: bi("Dahdah (main)", "دحضة (الرئيسي)"),
    district: bi("Dahdah District", "حي دحضة"),
    role: bi("Main workshop · Sales · Service · Parts", "الورشة الرئيسية · بيع · خدمة · قطع غيار"),
    manager: bi("Khalid Al-Shahrani", "م. خالد الشهراني"),
    bays: 14,
    utilization: 78,
    status: "bottleneck",
    revenue: 52800,
    csi: 88,
    wait: 41,
    conversion: 48,
    buyers: 33,
    converted: 16,
    callsAvoided: 61,
    idleHoursSaved: 22,
    partsTurn: 4.8,
    openJobcards: 96,
    trend: [66, 69, 72, 70, 74, 76, 78],
  },
  {
    id: "abdulaziz",
    code: "NAJ-02",
    name: bi("King Abdullah Rd.", "شارع الملك عبد الله"),
    district: bi("King Abdullah Rd.", "شارع الملك عبد الله"),
    role: bi("Showroom · Sales · Quick service", "المعرض · بيع · خدمة سريعة"),
    manager: bi("Abdulaziz Al-Yami", "م. عبدالعزيز اليامي"),
    bays: 9,
    utilization: 58,
    status: "watch",
    revenue: 31200,
    csi: 86,
    wait: 56,
    conversion: 32,
    buyers: 25,
    converted: 8,
    callsAvoided: 38,
    idleHoursSaved: 31,
    partsTurn: 3.9,
    openJobcards: 61,
    trend: [61, 58, 60, 63, 59, 57, 58],
  },
  {
    id: "sinaiya_1",
    code: "NAJ-03",
    name: bi("Sinaiya 1", "الصناعية ١"),
    district: bi("Industrial Area", "المنطقة الصناعية"),
    role: bi("Heavy service · Parts hub", "خدمة ثقيلة · مركز قطع"),
    manager: bi("Mohammed Al-Hakami", "م. محمد الحكمي"),
    bays: 12,
    utilization: 88,
    status: "bottleneck",
    revenue: 44600,
    csi: 79,
    wait: 68,
    conversion: 41,
    buyers: 27,
    converted: 11,
    callsAvoided: 54,
    idleHoursSaved: 48,
    partsTurn: 5.3,
    openJobcards: 118,
    trend: [81, 84, 86, 83, 87, 89, 88],
  },
  {
    id: "sinaiya_2",
    code: "NAJ-04",
    name: bi("Sinaiya 2", "الصناعية ٢"),
    district: bi("Industrial Area", "المنطقة الصناعية"),
    role: bi("Express service · Sales", "خدمة سريعة · بيع"),
    manager: bi("Salem Al-Yami", "م. سالم اليامي"),
    bays: 10,
    utilization: 72,
    status: "healthy",
    revenue: 27900,
    csi: 87,
    wait: 29,
    conversion: 55,
    buyers: 11,
    converted: 6,
    callsAvoided: 42,
    idleHoursSaved: 27,
    partsTurn: 4.5,
    openJobcards: 54,
    trend: [69, 71, 70, 73, 72, 71, 72],
  },
  {
    id: "sinaiya_3",
    code: "NAJ-05",
    name: bi("Sinaiya 3", "الصناعية ٣"),
    district: bi("Industrial Area", "المنطقة الصناعية"),
    role: bi("Service · Quick lube", "خدمة · تغيير زيت"),
    manager: bi("Turki Al-Makrami", "م. تركي المكرمي"),
    bays: 8,
    utilization: 44,
    status: "watch",
    revenue: 18700,
    csi: 83,
    wait: 52,
    conversion: 44,
    buyers: 16,
    converted: 7,
    callsAvoided: 29,
    idleHoursSaved: 34,
    partsTurn: 3.5,
    openJobcards: 37,
    trend: [51, 48, 47, 45, 46, 43, 44],
  },
  {
    id: "ghawella",
    code: "NAJ-06",
    name: bi("Al Ghuwailah", "الغويلة"),
    district: bi("Al Ghuwailah", "حي الغويلة"),
    role: bi("Service · GWM / Haval", "خدمة · GWM / هافال"),
    manager: bi("Fahd Al-Wadai", "م. فهد الوادعي"),
    bays: 6,
    utilization: 31,
    status: "watch",
    revenue: 11200,
    csi: 81,
    wait: 65,
    conversion: 25,
    buyers: 8,
    converted: 2,
    callsAvoided: 23,
    idleHoursSaved: 22,
    partsTurn: 3.2,
    openJobcards: 24,
    trend: [38, 35, 36, 33, 34, 32, 31],
  },
];

export const branchById = (id: BranchId) => branches.find((b) => b.id === id)!;

export function selectBranches(ids: BranchId[] | "all"): Branch[] {
  return ids === "all" ? branches : branches.filter((b) => ids.includes(b.id));
}

export const avg = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export function network(branchIds: BranchId[] | "all") {
  const list = selectBranches(branchIds);
  const bays = sum(list.map((b) => b.bays));
  const revenue = sum(list.map((b) => b.revenue));
  // Network utilisation is the simple mean of branch rates so the executive
  // figure matches the operating target conversation (62% vs 75%).
  const meanUtil = avg(list.map((b) => b.utilization));
  return {
    list,
    bays,
    revenue,
    utilization: Math.round(meanUtil),
    csi: Math.round(avg(list.map((b) => b.csi))),
    wait: Math.round(avg(list.map((b) => b.wait))),
    conversion: Math.round(
      (sum(list.map((b) => b.converted)) / Math.max(sum(list.map((b) => b.buyers)), 1)) * 100
    ),
    buyers: sum(list.map((b) => b.buyers)),
    converted: sum(list.map((b) => b.converted)),
    callsAvoided: sum(list.map((b) => b.callsAvoided)),
    idleHoursSaved: sum(list.map((b) => b.idleHoursSaved)),
    partsTurn: Number(avg(list.map((b) => b.partsTurn)).toFixed(1)),
    openJobcards: sum(list.map((b) => b.openJobcards)),
  };
}

/* ── Bay floor mirror ──────────────────────────────────────────────────────── */

const vehicles = [
  bi("Toyota Camry", "تويوتا كامري"),
  bi("Toyota Hilux", "تويوتا هايلكس"),
  bi("Toyota Land Cruiser", "تويوتا لاندكروزر"),
  bi("Toyota Corolla", "تويوتا كورولا"),
  bi("Toyota RAV4", "تويوتا RAV4"),
  bi("Toyota Fortuner", "تويوتا فورتشنر"),
  bi("Toyota Yaris", "تويوتا ياريس"),
  bi("GWM Haval H6", "جي دبليو إم هافال H6"),
  bi("Haval Jolion", "هافال جوليون"),
  bi("Toyota Prado", "تويوتا برادو"),
];

const jobTypes: Bi[] = [
  bi("Periodic service 20K", "صيانة دورية ٢٠ ألف"),
  bi("Front brake pads", "فحمات فرامل أمامية"),
  bi("A/C diagnostics", "فحص مكيف"),
  bi("Full inspection", "فحص شامل"),
  bi("Warranty repair", "إصلاح ضمان"),
  bi("Pre-delivery check", "فحص قبل التسليم"),
  bi("Alignment & balance", "ترصيص وميزان"),
  bi("Oil & filter change", "تغيير زيت وفلتر"),
];

const techNames: Bi[] = [
  bi("Hassan Al-Yami", "حسن اليامي"),
  bi("Ali Al-Makrami", "علي المكرمي"),
  bi("Waleed Al-Shahrani", "وليد الشهراني"),
  bi("Nasser Al-Qahtani", "ناصر القحطاني"),
  bi("Hadi Al-Wadai", "هادي الوادعي"),
  bi("Ibrahim Al-Hakami", "إبراهيم الحكمي"),
  bi("Sami Al-Amri", "سامي العمري"),
  bi("Rashid Al-Dosari", "راشد الدوسري"),
  bi("Sultan Al-Harthi", "سلطان الحارثي"),
  bi("Bader Al-Najrani", "بدر النجراني"),
  bi("Majed Al-Ajmi", "ماجد العجمي"),
  bi("Yousef Al-Shehri", "يوسف الشهري"),
];

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export type BayStatus = "occupied" | "idle" | "maintenance";

export interface BaySlot {
  bay: number;
  status: BayStatus;
  technician: Bi;
  vehicle: Bi;
  plate: string;
  job: Bi;
  elapsed: number;
  eta: number;
  bayType: Bi;
}

export interface TimelineCell {
  hour: number;
  status: BayStatus;
}

const bayTypes = [
  bi("General service", "خدمة عامة"),
  bi("Express", "سريع"),
  bi("Diagnostics", "فحص فني"),
  bi("Heavy / lift", "رفع ثقيل"),
  bi("Alignment", "ميزان"),
  bi("Body & paint", "سمكرة ودهان"),
];

export function bayFloor(branch: Branch): BaySlot[] {
  return Array.from({ length: branch.bays }, (_, i) => {
    const seed = branch.code.charCodeAt(5) * 97 + i * 31;
    const r = rnd(seed);
    const isMaintenance = i === branch.bays - 2 && branch.id === "sinaiya_1";
    const occupiedBand = branch.utilization / 100;
    const status: BayStatus = isMaintenance
      ? "maintenance"
      : r < occupiedBand - 0.06
        ? "occupied"
        : "idle";
    const elapsed = 20 + Math.floor(rnd(seed + 11) * 165);
    return {
      bay: i + 1,
      status,
      technician: techNames[(i + branch.code.charCodeAt(4)) % techNames.length],
      vehicle: vehicles[(i + branch.code.charCodeAt(5)) % vehicles.length],
      plate: `${branch.id.slice(0, 2).toUpperCase()} ${2400 + i * 137}`,
      job: jobTypes[(i + branch.code.charCodeAt(5)) % jobTypes.length],
      elapsed,
      eta: Math.max(10, 210 - elapsed),
      bayType: bayTypes[i % bayTypes.length],
    };
  }).map((slot, i) =>
    slot.status === "occupied"
      ? { ...slot, plate: `${branch.code.slice(-2)}·${(8200 + i * 613).toString().slice(0, 4)}` }
      : slot
  );
}

export const hours = Array.from({ length: 11 }, (_, i) => 8 + i);

export function bayTimeline(branch: Branch): TimelineCell[][] {
  return Array.from({ length: branch.bays }, (_, bay) =>
    hours.map((hour) => {
      const seed = branch.code.charCodeAt(5) * 13 + bay * 17 + hour * 7;
      const peak =
        (hour >= 9 && hour <= 12) || (hour >= 15 && hour <= 17) ? 18 : hour === 13 ? -22 : 0;
      const r = rnd(seed) * 100 + peak;
      const status: BayStatus =
        r < 36 - (hour === 13 ? 10 : 0)
          ? "idle"
          : r > 91 && bay === branch.bays - 2
            ? "maintenance"
            : "occupied";
      return { hour, status };
    })
  );
}

/** Weekly hour-of-day pressure. Used for the 6 × 24 heat map. */
export function heatValue(branch: Branch, hour: number): number {
  const curve: number[] = [
    10, 8, 6, 5, 5, 7, 18, 34, 62, 78, 84, 76, 42, 30, 58, 86, 92, 80, 52, 36, 28, 22, 16, 12,
  ];
  const offset = (branch.utilization - 62) * 0.55;
  return Math.max(4, Math.min(99, Math.round(curve[hour] + offset + rnd(hour * 19 + branch.bays) * 12 - 6)));
}

/* ── Parts ─────────────────────────────────────────────────────────────────── */

const models = [
  bi("Corolla", "كورولا"),
  bi("Camry", "كامري"),
  bi("Hilux", "هايلكس"),
  bi("Land Cruiser", "لاندكروزر"),
  bi("RAV4", "RAV4"),
  bi("Yaris", "ياريس"),
  bi("Fortuner", "فورتشنر"),
  bi("Prado", "برادو"),
  bi("Haval H6", "هافال H6"),
  bi("Jolion", "جوليون"),
];

const partTypes = [
  { no: "90915-YZZD4", en: "Oil filter", ar: "فلتر زيت", price: 38, cat: bi("Periodic service", "صيانة دورية") },
  { no: "17801-0T030", en: "Air filter", ar: "فلتر هواء", price: 86, cat: bi("Periodic service", "صيانة دورية") },
  { no: "04465-0K090", en: "Front brake pad kit", ar: "طقم فحمات أمامية", price: 340, cat: bi("Brakes", "فرامل") },
  { no: "87139-0N010", en: "Cabin air filter", ar: "فلتر مكيف", price: 74, cat: bi("Climate", "تكييف") },
  { no: "85212-0D060", en: "Wiper blade set", ar: "طقم مساحات", price: 112, cat: bi("Accessories", "كماليات") },
  { no: "90919-01253", en: "Iridium spark plug", ar: "بوجيه إيريديوم", price: 68, cat: bi("Ignition", "نظام إشعال") },
];

export type Part = {
  id: string;
  partNo: string;
  name: Bi;
  model: Bi;
  category: Bi;
  price: number;
  daysSupply: number;
  weeklyIssued: number;
  onHand: number;
  stock: number[];
  lastUsedDays: number;
  lastUsedBranch: BranchId;
  risk: boolean;
  slow: boolean;
};

export const parts: Part[] = models.flatMap((model, mi) =>
  partTypes.map((pt, pi) => {
    const idx = mi * partTypes.length + pi;
    const seed = idx * 37 + 11;
    const days =
      idx === 3 || idx === 17 || idx === 26 || idx === 33 || idx === 41 || idx === 47 || idx === 52 || idx === 7 || idx === 58 || idx === 21
        ? 94 + Math.round(rnd(seed) * 96)
        : idx % 11 === 0
          ? 3 + Math.round(rnd(seed) * 5)
          : 16 + Math.round(rnd(seed) * 54);
    const weekly = Math.max(0.3, Number((34 / days + rnd(seed + 3) * 1.4).toFixed(1)));
    const stock = branches.map((_, bi2) => {
      const stockSeed = seed + bi2 * 13;
      return Math.round(rnd(stockSeed) * 14 + (bi2 === 0 ? 3 : 0));
    });
    const onHand = sum(stock);
    return {
      id: `SKU-${String(idx + 1).padStart(3, "0")}`,
      partNo: `${pt.no}-${String.fromCharCode(65 + mi)}`,
      name: bi(`${pt.en} — ${model.en}`, `${pt.ar} — ${model.ar}`),
      model,
      category: pt.cat,
      price: Math.round(pt.price * (1 + mi * 0.035)),
      daysSupply: days,
      weeklyIssued: weekly,
      onHand,
      stock,
      lastUsedDays: days > 90 ? 12 + Math.round(rnd(seed + 9) * 60) : 1 + Math.round(rnd(seed + 9) * 12),
      lastUsedBranch: branches[Math.floor(rnd(seed + 5) * 6)].id,
      risk: days <= 7,
      slow: days > 90,
    };
  })
);

export const slowMovers = [...parts].filter((p) => p.slow).sort((a, b) => b.daysSupply - a.daysSupply).slice(0, 10);

export const stockoutRisk = [...parts].filter((p) => p.risk).slice(0, 8);

export const riskLevel = (days: number): Health =>
  days < 30 ? "healthy" : days <= 60 ? "watch" : "bottleneck";

/* ── Advisors ──────────────────────────────────────────────────────────────── */

const advisorNames: Bi[] = [
  bi("Faisal Al-Shahrani", "فيصل الشهراني"),
  bi("Abdullah Al-Yami", "عبدالله اليامي"),
  bi("Mohammed Al-Qahtani", "محمد القحطاني"),
  bi("Salem Al-Harthi", "سالم الحارثي"),
  bi("Nawaf Al-Dosari", "نواف الدوسري"),
  bi("Turki Al-Ajmi", "تركي العجمي"),
  bi("Khalid Al-Mutairi", "خالد المطيري"),
  bi("Ahmed Al-Zahrani", "أحمد الزهراني"),
  bi("Omar Al-Shehri", "عمر الشهري"),
  bi("Yousef Al-Makrami", "يوسف المكرمي"),
  bi("Majed Al-Wadai", "ماجد الوادعي"),
  bi("Saud Al-Jaber", "سعود آل جابر"),
  bi("Hadi Al-Saqri", "هادي الصقري"),
  bi("Rashid Al-Hashimi", "راشد الهاشمي"),
  bi("Bandar Al-Najrani", "بندر النجراني"),
  bi("Mubarak Al-Qarni", "مبارك القرني"),
  bi("Sultan Al-Amri", "سلطان العمري"),
  bi("Abdulaziz Al-Hakami", "عبدالعزيز الحكمي"),
  bi("Fahd Al-Asmari", "فهد الأسمري"),
  bi("Nasser Al-Ghamdi", "ناصر الغامدي"),
  bi("Ibrahim Al-Hasani", "إبراهيم الحسني"),
  bi("Waleed Al-Juhani", "وليد الجهني"),
  bi("Sami Al-Aseeri", "سامي العسيري"),
  bi("Ziyad Al-Khalidi", "زياد الخالدي"),
];

export type Advisor = {
  id: string;
  name: Bi;
  branch: Branch;
  throughput: number;
  csi: number;
  responseMin: number;
  idleHours: number;
  jobsWeek: number;
  trend: number[];
  tone: number;
};

export const advisors: Advisor[] = advisorNames.map((name, i) => {
  const branch = branches[i % branches.length];
  const seed = i * 29 + 5;
  const throughput = Number((2.45 + rnd(seed) * 2.9).toFixed(1));
  const csi = Math.round(72 + rnd(seed + 2) * 24);
  const base = Math.round(throughput * 4 + rnd(seed + 4) * 4);
  return {
    id: `ADV-${String(i + 1).padStart(2, "0")}`,
    name,
    branch,
    throughput,
    csi,
    responseMin: Math.round(6 + rnd(seed + 6) * 38),
    idleHours: Number((rnd(seed + 8) * 3.4).toFixed(1)),
    jobsWeek: Math.round(throughput * 5 + rnd(seed + 10) * 3),
    trend: Array.from({ length: 7 }, (_, w) => Math.max(1, Math.round(base - 2 + rnd(seed + w * 3) * 5))),
    tone: i % 4,
  };
});

/* ── Workers ─────────────────────────────────────────────────────────────────
 * 50 employees across 6 canonical branches (Dahdah main, King Abdullah Rd,
 * 3× Sinaiya, Ghawella). Read-only CDC mirror, PDPL in-Kingdom only.
 */
export interface Worker {
  id: string;
  name: Bi;
  branch: BranchId;
  role: Bi;
  status: "active" | "on_leave" | "training";
  hired: string; // ISO date string
}

export const workers: Worker[] = [
  /* Dahdah (main) — 10 employees */
  { id: "w1", name: bi("سعود آل خيران", "Saoud Al Khairan"), branch: "dahdah", role: bi("ورشة رئيسية", "Main workshop"), status: "active", hired: "2023-01-15" },
  { id: "w2", name: bi("عبدالله الصالح", "Abdulllah Al Salih"), branch: "dahdah", role: bi("بائع", "Sales"), status: "active", hired: "2023-03-22" },
  { id: "w3", name: bi("مفيد آل يامي", "Mufaddal Al-Yami"), branch: "dahdah", role: bi("فني senior", "Senior tech"), status: "active", hired: "2022-09-10" },
  { id: "w4", name: bi("نواف الشريف", "Nawaf Al-Sharif"), branch: "dahdah", role: bi("إداري", "Admin"), status: "active", hired: "2024-02-01" },
  { id: "w5", name: bi("خالد الشهراني", "Khalid Al-Shahrani"), branch: "dahdah", role: bi("فني", "Technician"), status: "active", hired: "2022-11-05" },
  { id: "w6", name: bi("عبدالرحمن الحكمي", "Abdulrahman Al-Hakami"), branch: "dahdah", role: bi("فني", "Technician"), status: "active", hired: "2023-07-18" },
  { id: "w7", name: bi("سعيد آل دحيم", "Saeed Al-Dahim"), branch: "dahdah", role: bi("قطع غيار", "Parts"), status: "active", hired: "2024-03-10" },
  { id: "w8", name: bi("محمد القحطاني", "Mohammed Al-Qahhtani"), branch: "dahdah", role: bi("فني", "Technician"), status: "training", hired: "2024-05-22" },
  { id: "w9", name: bi("فواز آل سالم", "Fawaz Al-Salem"), branch: "dahdah", role: bi("فني", "Technician"), status: "active", hired: "2023-12-03" },
  { id: "w10", name: bi("سلطان الزهراني", "Sultan Al-Zahrani"), branch: "dahdah", role: bi("فني", "Technician"), status: "active", hired: "2024-01-20" },

  /* King Abdullah Rd. — 8 employees */
  { id: "w11", name: bi("خالد بن صليح", "Khalid Al-Salih"), branch: "abdulaziz", role: bi("معرض", "Showroom"), status: "active", hired: "2023-05-12" },
  { id: "w12", name: bi("سالم المنيع", "Salah Al-Mani"), branch: "abdulaziz", role: bi("خدمة سريعة", "Quick service"), status: "active", hired: "2023-11-03" },
  { id: "w13", name: bi("فهد القحطاني", "Fahad Al-Qahhtani"), branch: "abdulaziz", role: bi("بائع", "Sales"), status: "active", hired: "2024-01-18" },
  { id: "w14", name: bi("عبدالعزيز اليامي", "Abdulaziz Al-Yami"), branch: "abdulaziz", role: bi("مدير الفرع", "Branch Manager"), status: "active", hired: "2021-08-15" },
  { id: "w15", name: bi("ريان آل محيا", "Rayan Al-Mahya"), branch: "abdulaziz", role: bi("بائع", "Sales"), status: "active", hired: "2023-09-25" },
  { id: "w16", name: bi("ناصر الشهري", "Nasser Al-Shehri"), branch: "abdulaziz", role: bi("فني", "Technician"), status: "active", hired: "2022-10-11" },
  { id: "w17", name: bi("مشاري الدوسري", "Mishari Al-Dosari"), branch: "abdulaziz", role: bi("فني", "Technician"), status: "on_leave", hired: "2023-04-07" },
  { id: "w18", name: bi("علي العتيبي", "Ali Al-Otaibi"), branch: "abdulaziz", role: bi("قطع غيار", "Parts"), status: "active", hired: "2024-02-28" },

  /* Sinaiya 1 — 10 employees */
  { id: "w19", name: bi("محمد الحكمي", "Mohammed Al-Hakami"), branch: "sinaiya_1", role: bi("مدير الفرع", "Branch Manager"), status: "active", hired: "2021-06-01" },
  { id: "w20", name: bi("إبراهيم القحطاني", "Ibrahim Al-Qahhtani"), branch: "sinaiya_1", role: bi("فني ثقيل", "Heavy tech"), status: "active", hired: "2022-03-14" },
  { id: "w21", name: bi("عبدالله آل سالم", "Abdullah Al-Salem"), branch: "sinaiya_1", role: bi("فني ثقيل", "Heavy tech"), status: "active", hired: "2023-02-08" },
  { id: "w22", name: bi("سعد الشهراني", "Saad Al-Shahrani"), branch: "sinaiya_1", role: bi("قطع غيار", "Parts"), status: "active", hired: "2023-08-30" },
  { id: "w23", name: bi("فواز العتيبي", "Fawaz Al-Otaibi"), branch: "sinaiya_1", role: bi("فني", "Technician"), status: "active", hired: "2022-12-19" },
  { id: "w24", name: bi("ماجد الوادعي", "Majed Al-Wadai"), branch: "sinaiya_1", role: bi("فني", "Technician"), status: "active", hired: "2023-06-05" },
  { id: "w25", name: bi("ريان آل يامي", "Rayan Al-Yami"), branch: "sinaiya_1", role: bi("فني", "Technician"), status: "training", hired: "2024-04-12" },
  { id: "w26", name: bi("عبدالرحمن الدوسري", "Abdulrahman Al-Dosari"), branch: "sinaiya_1", role: bi("فني", "Technician"), status: "active", hired: "2023-11-27" },
  { id: "w27", name: bi("سلطان الحكمي", "Sultan Al-Hakami"), branch: "sinaiya_1", role: bi("فني", "Technician"), status: "active", hired: "2024-01-08" },
  { id: "w28", name: bi("نواف القحطاني", "Nawaf Al-Qahhtani"), branch: "sinaiya_1", role: bi("قطع غيار", "Parts"), status: "active", hired: "2023-05-17" },

  /* Sinaiya 2 — 8 employees */
  { id: "w29", name: bi("سالم اليامي", "Salem Al-Yami"), branch: "sinaiya_2", role: bi("مدير الفرع", "Branch Manager"), status: "active", hired: "2021-09-12" },
  { id: "w30", name: bi("تركي المكرمي", "Turki Al-Makrami"), branch: "sinaiya_2", role: bi("خدمة سريعة", "Quick service"), status: "active", hired: "2022-07-23" },
  { id: "w31", name: bi("بندر النجراني", "Bandar Al-Najrani"), branch: "sinaiya_2", role: bi("بائع", "Sales"), status: "active", hired: "2023-01-30" },
  { id: "w32", name: bi("مبارك القرني", "Mubarak Al-Qarni"), branch: "sinaiya_2", role: bi("فني", "Technician"), status: "active", hired: "2022-11-04" },
  { id: "w33", name: bi("سلطان العمري", "Sultan Al-Amri"), branch: "sinaiya_2", role: bi("فني", "Technician"), status: "active", hired: "2023-09-16" },
  { id: "w34", name: bi("عبدالعزيز الحكمي", "Abdulaziz Al-Hakami"), branch: "sinaiya_2", role: bi("فني", "Technician"), status: "active", hired: "2024-03-03" },
  { id: "w35", name: bi("فهد الأسمري", "Fahad Al-Asmari"), branch: "sinaiya_2", role: bi("فني", "Technician"), status: "on_leave", hired: "2023-12-21" },
  { id: "w36", name: bi("ناصر الغامدي", "Nasser Al-Ghamdi"), branch: "sinaiya_2", role: bi("قطع غيار", "Parts"), status: "active", hired: "2024-02-14" },

  /* Sinaiya 3 — 7 employees */
  { id: "w37", name: bi("تركي المكرمي", "Turki Al-Makrami"), branch: "sinaiya_3", role: bi("مدير الفرع", "Branch Manager"), status: "active", hired: "2022-01-10" },
  { id: "w38", name: bi("إبراهيم الحسني", "Ibrahim Al-Hasani"), branch: "sinaiya_3", role: bi("فني", "Technician"), status: "active", hired: "2022-08-25" },
  { id: "w39", name: bi("وليد الجهني", "Waleed Al-Juhani"), branch: "sinaiya_3", role: bi("فني", "Technician"), status: "active", hired: "2023-04-18" },
  { id: "w40", name: bi("سامي العسيري", "Sami Al-Aseeri"), branch: "sinaiya_3", role: bi("فني", "Technician"), status: "active", hired: "2023-10-09" },
  { id: "w41", name: bi("زياد الخالدي", "Ziyad Al-Khalidi"), branch: "sinaiya_3", role: bi("قطع غيار", "Parts"), status: "active", hired: "2024-01-25" },
  { id: "w42", name: bi("فيصل الشهراني", "Faisal Al-Shahrani"), branch: "sinaiya_3", role: bi("فني", "Technician"), status: "training", hired: "2024-06-03" },
  { id: "w43", name: bi("عبدالله اليامي", "Abdullah Al-Yami"), branch: "sinaiya_3", role: bi("فني", "Technician"), status: "active", hired: "2023-07-11" },

  /* Ghawella — 7 employees */
  { id: "w44", name: bi("فهد الوادعي", "Fahd Al-Wadai"), branch: "ghawella", role: bi("مدير الفرع", "Branch Manager"), status: "active", hired: "2021-11-05" },
  { id: "w45", name: bi("هادي الصقري", "Hadi Al-Saqri"), branch: "ghawella", role: bi("فني GWM", "GWM tech"), status: "active", hired: "2022-05-19" },
  { id: "w46", name: bi("راشد الهاشمي", "Rashid Al-Hashimi"), branch: "ghawella", role: bi("فني GWM", "GWM tech"), status: "active", hired: "2023-03-08" },
  { id: "w47", name: bi("بندر النجراني", "Bandar Al-Najrani"), branch: "ghawella", role: bi("قطع غيار", "Parts"), status: "active", hired: "2022-09-27" },
  { id: "w48", name: bi("مبارك القرني", "Mubarak Al-Qarni"), branch: "ghawella", role: bi("فني", "Technician"), status: "active", hired: "2023-08-14" },
  { id: "w49", name: bi("سلطان الحارثي", "Sultan Al-Harthi"), branch: "ghawella", role: bi("فني", "Technician"), status: "training", hired: "2024-05-06" },
  { id: "w50", name: bi("بدر النجراني", "Bader Al-Najrani"), branch: "ghawella", role: bi("فني", "Technician"), status: "active", hired: "2024-02-19" },
];

export const workerBays: Record<string, number> = {
  dahdah: 14,
  abdulaziz: 9,
  sinaiya_1: 12,
  sinaiya_2: 10,
  sinaiya_3: 8,
  ghawella: 6,
};

export const totalWorkers = workers.length;
export const workersByBranch = (branchId: BranchId) =>
  workers.filter((w) => w.branch === branchId).length;

/* ── CSI history, 3+ months ────────────────────────────────────────────────── */

/* ── CSI history, 3+ months ────────────────────────────────────────────────── */

export interface CsiPoint {
  week: string;
  weekAr: string;
  value: number;
}

export function csiTrend(branch: Branch, weeks = 14): CsiPoint[] {
  const start = new Date(2026, 2, 2);
  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date(start.getTime() + i * 7 * 864e5);
    const wobble = Math.sin(i / 1.9 + branch.bays) * 3.4 + rnd(i * 7 + branch.bays) * 2.3;
    const value = Math.min(96, Math.max(68, Math.round(branch.csi - 6 + (i / weeks) * 6 + wobble)));
    return {
      week: `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`,
      weekAr: `${d.getDate()} ${d.toLocaleString("ar", { month: "short" })}`,
      value,
    };
  });
}

/* ── Wait times ────────────────────────────────────────────────────────────── */

export const waitBins: { label: Bi; count: number; tone: string }[] = [
  { label: bi("0–15 min", "٠–١٥ دقيقة"), count: 24, tone: "#27AE60" },
  { label: bi("16–30 min", "١٦–٣٠ دقيقة"), count: 38, tone: "#27AE60" },
  { label: bi("31–45 min", "٣١–٤٥ دقيقة"), count: 44, tone: "#F39C12" },
  { label: bi("46–60 min", "٤٦–٦٠ دقيقة"), count: 52, tone: "#F39C12" },
  { label: bi("61–75 min", "٦١–٧٥ دقيقة"), count: 38, tone: "#E74C3C" },
  { label: bi("76–90 min", "٧٦–٩٠ دقيقة"), count: 26, tone: "#E74C3C" },
  { label: bi("> 90 min", "أكثر من ٩٠ دقيقة"), count: 22, tone: "#B71C1C" },
];

/* ── Cross-branch transfers ────────────────────────────────────────────────── */

export type TransferReason = "diagnostic" | "specialty" | "overflow";

export interface Transfer {
  id: string;
  from: BranchId;
  to: BranchId;
  partNo: string;
  part: Bi;
  reason: TransferReason;
  hours: number;
  vehicle: Bi;
  qty: number;
}

const routeData: { from: BranchId; to: BranchId; reason: TransferReason; count: number; hours: number }[] = [
  { from: "abdulaziz", to: "dahdah", reason: "diagnostic", count: 5, hours: 2.4 },
  { from: "sinaiya_1", to: "sinaiya_2", reason: "specialty", count: 4, hours: 3.1 },
  { from: "dahdah", to: "sinaiya_3", reason: "overflow", count: 3, hours: 4.6 },
  { from: "abdulaziz", to: "ghawella", reason: "diagnostic", count: 3, hours: 6.2 },
  { from: "sinaiya_1", to: "dahdah", reason: "specialty", count: 2, hours: 2.8 },
  { from: "sinaiya_2", to: "abdulaziz", reason: "overflow", count: 2, hours: 1.9 },
  { from: "sinaiya_3", to: "sinaiya_1", reason: "overflow", count: 2, hours: 3.7 },
  { from: "ghawella", to: "dahdah", reason: "diagnostic", count: 1, hours: 5.4 },
  { from: "sinaiya_1", to: "ghawella", reason: "diagnostic", count: 1, hours: 7.1 },
];

export const transfers: Transfer[] = routeData.flatMap((route, ri) =>
  Array.from({ length: route.count }, (_, k) => {
    const part = parts[(ri * 7 + k * 3) % parts.length];
    return {
      id: `TR-${String(ri * 10 + k + 1).padStart(3, "0")}`,
      from: route.from,
      to: route.to,
      partNo: part.partNo,
      part: part.name,
      reason: route.reason,
      hours: Number((route.hours + rnd(ri * 5 + k) * 1.6).toFixed(1)),
      vehicle: vehicles[(ri + k) % vehicles.length],
      qty: 1 + Math.floor(rnd(ri * 11 + k) * 5),
    };
  })
);

export const transferMatrix: number[][] = branches.map((from) =>
  branches.map((to) => (from.id === to.id ? 0 : transfers.filter((t) => t.from === from.id && t.to === to.id).length))
);

export const topRoutes = [...routeData]
  .sort((a, b) => b.count - a.count)
  .map((r) => ({
    ...r,
    avgHours: Number((transfers.filter((t) => t.from === r.from && t.to === r.to).reduce((s, t) => s + t.hours, 0) / r.count).toFixed(1)),
  }));

/* ── Compliance / pipeline ─────────────────────────────────────────────────── */

export const zatcaStats = {
  compliance: 99.4,
  invoicesToday: 138,
  stamped: 138,
  lastStamp: "14:32",
  nextBatch: "14:42",
  clearance: bi("Clearance API · linked", "واجهة الخلاصة · مرتبطة"),
  phase: bi("Phase 2 (Integration)", "المرحلة الثانية (الربط)"),
  rejectionRate: 0,
};

export const cdc = {
  latencySec: 3,
  eventsPerMin: 214,
  uptime: 99.98,
  lastEvent: "14:37:12",
  lagLabel: bi("مزامنة خلال ٣ ثوانٍ", "Synced within 3 seconds"),
  region: bi("Riyadh (KSA) · DR: Al Jubail", "الرياض · نسخة احتياطية: الجبيل"),
  retention: bi("18 months hot · anonymised analytics", "١٨ شهرًا · تحليلات مجهولة الهوية"),
  egress: bi("No cross-border egress", "لا نقل بيانات خارج المملكة"),
  readOnly: bi("Read-only mirror · 0 write-backs", "مرآة للقراءة فقط · صفر كتابة عكسية"),
};

export const pipelineEvents = [
  { time: "14:37:12", event: bi("invoice.created", "invoice.created"), detail: bi("INV-2026-4471 · SAR 1,840", "INV-2026-4471 · ١٬٨٤٠ ر.س"), status: bi("ZATCA stamped", "مختومة زاتكا") },
  { time: "14:36:58", event: bi("jobcard.closed", "jobcard.closed"), detail: bi("JC-8842 · Hilux · bay 07", "JC-8842 · هايلكس · باي ٠٧"), status: bi("Mirrored", "تمت المزامنة") },
  { time: "14:36:40", event: bi("part.issued", "part.issued"), detail: bi("90915-YZZD4 × 4 · Sanaiya", "90915-YZZD4 × ٤ · الصناعية"), status: bi("Mirrored", "تمت المزامنة") },
  { time: "14:36:21", event: bi("csi.response", "csi.response"), detail: bi("Survey · score 4/5 · Dahdah", "استبيان · ٤/٥ · دحضة"), status: bi("Anonymised", "مجهول الهوية") },
  { time: "14:35:47", event: bi("transfer.created", "transfer.created"), detail: bi("TR-014 · Damaged seal", "TR-014 · طلب تشخيص عاجل"), status: bi("Mirrored", "تمت المزامنة") },
];

export const periods = [
  { id: "7d", label: bi("Last 7 days", "آخر ٧ أيام") },
  { id: "30d", label: bi("Last 30 days", "آخر ٣٠ يوم") },
  { id: "ytd", label: bi("Year to date", "من بداية السنة") },
  { id: "custom", label: bi("Custom", "فترة مخصصة") },
] as const;

export type PeriodId = (typeof periods)[number]["id"];
