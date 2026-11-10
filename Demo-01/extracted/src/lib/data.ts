import type { Bi } from "./i18n";
import { isoPlus } from "./i18n";

/* ————————————————————————————————————————————————
   MOCK DATA — Tier 1 "non-invasive integration layer".

   PHILOSOPHY: everything below simulates READ-ONLY views over
   Doghmal's existing legacy systems (workshop DMS, ALJ warranty
   registry, parts catalog). The wrapper never writes back into
   those systems: bookings are "requests" that a human advisor
   confirms over WhatsApp, invoices/history/warranties are pulled
   as-is. That's why you'll see sync stamps, invoice numbers and
   "read-only" hints throughout the UI instead of edit buttons
   on legacy records.
———————————————————————————————————————————————— */

const px = (id: number, w = 1200, h = 700) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

export interface Branch {
  id: string;
  name: Bi;
  kind: Bi;
  status: "open" | "busy" | "closed";
  km: number;
  phone: string;
  hours: Bi;
}

/* 6 canonical branches: 1 Dahdah (main), 1 King Abdullah Rd, 3 Sinaiya, 1 Ghawella */
export const BRANCHES: Branch[] = [
  { id: "b1", name: { ar: "فرع الدهدة", en: "Al Dahdah (Main)" }, kind: { ar: "الورشة الرئيسية · سمكرة ودهان", en: "Main workshop · body & paint" }, status: "open", km: 3.2, phone: "966175221001", hours: { ar: "٧ص–١٠م", en: "7AM–10PM" } },
  { id: "b2", name: { ar: "شارع الملك عبد الله", en: "King Abdullah Rd." }, kind: { ar: "المعرض + صيانة سريعة", en: "Showroom + quick service" }, status: "open", km: 4.8, phone: "966175221002", hours: { ar: "٧ص–١٠م", en: "7AM–10PM" } },
  { id: "b3", name: { ar: "فرع السنيعة ١", en: "Al Sinaiya 1" }, kind: { ar: "خدمة ثقيلة · مركز قطع", en: "Heavy service · Parts hub" }, status: "busy", km: 6.1, phone: "966175221003", hours: { ar: "٧ص–١٠م", en: "7AM–10PM" } },
  { id: "b4", name: { ar: "فرع السنيعة ٢", en: "Al Sinaiya 2" }, kind: { ar: "خدمة سريعة · بيع", en: "Express service · Sales" }, status: "open", km: 7.4, phone: "966175221004", hours: { ar: "٧ص–١٠م", en: "7AM–10PM" } },
  { id: "b5", name: { ar: "فرع السنيعة ٣", en: "Al Sinaiya 3" }, kind: { ar: "خدمة · تغيير زيت", en: "Service · Quick lube" }, status: "open", km: 9.0, phone: "966175221005", hours: { ar: "٧ص–١٠م", en: "7AM–10PM" } },
  { id: "b6", name: { ar: "فرع الغويلة", en: "Al Ghuwailah" }, kind: { ar: "خدمة · GWM / هافال", en: "Service · GWM / Haval" }, status: "open", km: 11.6, phone: "966175221006", hours: { ar: "٧ص–١٠م", en: "7AM–10PM" } },
];

export interface Advisor {
  id: string;
  name: Bi;
  tag: Bi;
  photo: string;
  rating: number;
  jobs: number;
  phone: string;
  branchId: string;
}

/* Real Najrani family names — the "human layer" over the DMS */
export const ADVISORS: Advisor[] = [
  { id: "a1", name: { ar: "محمد آل سويلم", en: "Mohammed Al Suwailem" }, tag: { ar: "خبرة ١٢ سنة · كبير المستشارين", en: "12 yrs · senior advisor" }, photo: px(16512966, 500, 500), rating: 4.9, jobs: 1240, phone: "966551110201", branchId: "b2" },
  { id: "a2", name: { ar: "فهد آل مكرمي", en: "Fahad Al Makrami" }, tag: { ar: "دفع رباعي وتجهيز رحلات", en: "4x4 & overland setups" }, photo: px(36274669, 500, 500), rating: 4.8, jobs: 860, phone: "966551110202", branchId: "b1" },
  { id: "a3", name: { ar: "سعد آل حيدرة", en: "Saad Al Haidarah" }, tag: { ar: "كهرباء وهايبرد", en: "Electrical & hybrid" }, photo: px(33853484, 500, 500), rating: 4.9, jobs: 1520, phone: "966551110203", branchId: "b3" },
  { id: "a4", name: { ar: "علي آل ثابت", en: "Ali Al Thabit" }, tag: { ar: "الصيانة السريعة", en: "Quick-lane specialist" }, photo: px(33853481, 500, 500), rating: 4.7, jobs: 640, phone: "966551110204", branchId: "b4" },
  { id: "a5", name: { ar: "خالد علي", en: "Khalid Ali" }, tag: { ar: "صيانة سريعة · زيوت وإطارات", en: "Quick service · oils & tires" }, photo: px(8620587, 500, 500), rating: 4.6, jobs: 520, phone: "966551110205", branchId: "b5" },
  { id: "a6", name: { ar: "يوسف الزهراني", en: "Yousef Al Zahrani" }, tag: { ar: "صيانة دورية · قطع غيار", en: "Routine service · parts" }, photo: px(4151366, 500, 500), rating: 4.8, jobs: 780, phone: "966551110206", branchId: "b6" },
];

export interface ServiceEntry {
  date: string;
  km: number;
  title: Bi;
  items: Bi[];
  cost: number;
  branchId: string;
  inv: string;
}

export interface GarageCar {
  id: string;
  nickname: Bi;
  model: Bi;
  year: number;
  img: string;
  vin: string;
  plate: { letters: Bi; digits: string };
  odo: number;
  nextKm: number;
  warrantyUntil: string | null; // null → expired
  paintUntil: string | null;
  recall: Bi | null;
  status: "service" | "ready" | null;
  history: ServiceEntry[];
}

/* "الكشنة" = Saudi slang for the trusty workhorse pickup.
   "مشوار الدوام" = the daily-commute car. Nicknames customers actually use. */
export const GARAGE: GarageCar[] = [
  {
    id: "g1",
    nickname: { ar: "الكروزر", en: "The Cruiser" },
    model: { ar: "لاندكروزر GXR", en: "Land Cruiser GXR" },
    year: 2023,
    img: px(10658277),
    vin: "JTMAH7BJ0P4021733",
    plate: { letters: { ar: "ح ر ب", en: "H R B" }, digits: "4521" },
    odo: 24680,
    nextKm: 30000,
    warrantyUntil: isoPlus(280),
    paintUntil: isoPlus(280),
    recall: null,
    status: "service",
    history: [
      { date: "2025-12-08", km: 24000, title: { ar: "صيانة ٢٤٬٠٠٠ كم", en: "24,000 km service" }, items: [{ ar: "زيت وفلتر أصلي", en: "Genuine oil & filter" }, { ar: "فحص فرامل شامل", en: "Full brake inspection" }], cost: 410, branchId: "b1", inv: "DG-90412" },
      { date: "2025-04-03", km: 20000, title: { ar: "صيانة ٢٠٬٠٠ كم", en: "20,000 km service" }, items: [{ ar: "فلاتر هواء ومكيّف", en: "Air & cabin filters" }, { ar: "تدوير إطارات", en: "Tire rotation" }], cost: 940, branchId: "b1", inv: "DG-84107" },
      { date: "2024-09-12", km: 10000, title: { ar: "صيانة ١٠٬٠٠٠ كم", en: "10,000 km service" }, items: [{ ar: "زيت وفلتر", en: "Oil & filter" }, { ar: "فحص ٤٠ نقطة", en: "40-point check" }], cost: 620, branchId: "b2", inv: "DG-77265" },
    ],
  },
  {
    id: "g2",
    nickname: { ar: "الكشنة", en: "The Workhorse" },
    model: { ar: "هايلكس GLX دبل", en: "Hilux GLX 4x4" },
    year: 2021,
    img: px(34594185),
    vin: "MR0HA8CD3M0559021",
    plate: { letters: { ar: "أ د م", en: "A D M" }, digits: "7830" },
    odo: 88450,
    nextKm: 90000,
    warrantyUntil: null,
    paintUntil: null,
    recall: { ar: "تبديل وحدة الوسادة الهوائية — حملة الشركة", en: "Airbag module replacement — OEM campaign" },
    status: "ready",
    history: [
      { date: "2026-03-20", km: 88450, title: { ar: "تغيير زيت + فحص شامل", en: "Oil change + full check" }, items: [{ ar: "زيت ١٠W-٤٠ أصلي", en: "Genuine 10W-40" }, { ar: "غسيل وتلميع", en: "Wash & detail" }], cost: 265, branchId: "b3", inv: "DG-91530" },
      { date: "2025-05-19", km: 80000, title: { ar: "صيانة ٨٠٬٠٠ كم", en: "80,000 km service" }, items: [{ ar: "زيوت دفرنس وقراب", en: "Diff & transfer oils" }, { ar: "فلاتر كاملة", en: "All filters" }], cost: 380, branchId: "b1", inv: "DG-85991" },
      { date: "2024-11-05", km: 70000, title: { ar: "صيانة ٧٠٬٠٠ كم", en: "70,000 km service" }, items: [{ ar: "مساعدات خلفية", en: "Rear shocks" }, { ar: "فحمات فرامل", en: "Brake pads" }], cost: 1180, branchId: "b1", inv: "DG-80344" },
    ],
  },
  {
    id: "g3",
    nickname: { ar: "مشوار الدوام", en: "Daily Drive" },
    model: { ar: "كامري GLE هايبرد", en: "Camry GLE Hybrid" },
    year: 2023,
    img: px(11945283),
    vin: "4T1G11AK5PU812467",
    plate: { letters: { ar: "س ن د", en: "S N D" }, digits: "1290" },
    odo: 41200,
    nextKm: 45000,
    warrantyUntil: isoPlus(45),
    paintUntil: isoPlus(45),
    recall: null,
    status: null,
    history: [
      { date: "2025-11-30", km: 40000, title: { ar: "صيانة ٤٠٬٠٠ كم", en: "40,000 km service" }, items: [{ ar: "فحص بطارية الهايبرد", en: "Hybrid battery check" }, { ar: "زيت وفلاتر", en: "Oil & filters" }], cost: 890, branchId: "b3", inv: "DG-90102" },
      { date: "2024-12-15", km: 20000, title: { ar: "صيانة ٢٠٬٠٠٠ كم", en: "20,000 km service" }, items: [{ ar: "فلتر مكيّف", en: "Cabin filter" }, { ar: "ترصيص وموازنة", en: "Wheel balancing" }], cost: 610, branchId: "b2", inv: "DG-81230" },
      { date: "2024-06-10", km: 10000, title: { ar: "صيانة ١٠٬٠٠ كم", en: "10,000 km service" }, items: [{ ar: "زيت وفلتر", en: "Oil & filter" }, { ar: "فحص ٤٠ نقطة", en: "40-point check" }], cost: 520, branchId: "b2", inv: "DG-74418" },
    ],
  },
];

export type Brand = "toyota" | "jetour" | "haval" | "gwm";

export interface ShowCar {
  id: string;
  brand: Brand;
  model: Bi;
  year: number;
  condition: "new" | "used";
  price: number;
  km?: number;
  certified?: boolean;
  tag?: Bi;
  img: string;
  gallery: string[];
  branchId: string;
  vin: string;
  plateReady: boolean;
  specs: { engine: Bi; power: number; trans: Bi; drive: Bi; seats: number; fuel: number; color: Bi };
}

export const SHOWROOM: ShowCar[] = [
  {
    id: "lc25", brand: "toyota", model: { ar: "لاندكروزر GXR توين تيربو", en: "Land Cruiser GXR TT" }, year: 2025, condition: "new", price: 356500,
    tag: { ar: "الأكثر طلبًا", en: "Best seller" }, img: px(20584983),
    gallery: [px(20584983), px(20584984), px(19311694)], branchId: "b2", vin: "JTMAB7BJ5S4100234", plateReady: true,
    specs: { engine: { ar: "3.5L V6 توين تيربو", en: "3.5L V6 twin-turbo" }, power: 409, trans: { ar: "أوتوماتيك ١٠ سرعات", en: "10-speed auto" }, drive: { ar: "دفع رباعي دائم", en: "Full-time 4WD" }, seats: 7, fuel: 12.1, color: { ar: "أبيض لؤلؤي", en: "Pearl white" } },
  },
  {
    id: "camry25", brand: "toyota", model: { ar: "كامري GLE هايبرد", en: "Camry GLE Hybrid" }, year: 2025, condition: "new", price: 133400,
    tag: { ar: "هايبرد", en: "Hybrid" }, img: px(11945283),
    gallery: [px(11945283), px(6706311), px(16350113)], branchId: "b2", vin: "4T1G11AK8SU900112", plateReady: true,
    specs: { engine: { ar: "2.5L هايبرد", en: "2.5L hybrid" }, power: 225, trans: { ar: "eCVT", en: "eCVT" }, drive: { ar: "أمامي", en: "FWD" }, seats: 5, fuel: 27.7, color: { ar: "فضي ألمنيوم", en: "Aluminum silver" } },
  },
  {
    id: "hilux25", brand: "toyota", model: { ar: "هايلكس GLX دبل", en: "Hilux GLX 4x4" }, year: 2025, condition: "new", price: 121900,
    img: px(13080731), gallery: [px(13080731), px(33566025), px(34594185)], branchId: "b1", vin: "MR0HA8CD7S0611940", plateReady: true,
    specs: { engine: { ar: "2.7L بنزين", en: "2.7L petrol" }, power: 164, trans: { ar: "أوتوماتيك ٦ سرعات", en: "6-speed auto" }, drive: { ar: "دفع رباعي جزئي", en: "Part-time 4WD" }, seats: 5, fuel: 13.9, color: { ar: "رمادي غامق", en: "Dark grey" } },
  },
  {
    id: "corolla25", brand: "toyota", model: { ar: "كورولا XLI", en: "Corolla XLI" }, year: 2025, condition: "new", price: 94300,
    img: px(16495911), gallery: [px(16495911), px(6706311), px(11945283)], branchId: "b4", vin: "JTDBR3FE6S3077521", plateReady: false,
    specs: { engine: { ar: "1.5L بنزين", en: "1.5L petrol" }, power: 121, trans: { ar: "CVT", en: "CVT" }, drive: { ar: "أمامي", en: "FWD" }, seats: 5, fuel: 20.4, color: { ar: "أبيض", en: "White" } },
  },
  {
    id: "h625", brand: "haval", model: { ar: "هافال H6 سوبريم", en: "Haval H6 Supreme" }, year: 2025, condition: "new", price: 106900,
    tag: { ar: "جديد وصل", en: "Just arrived" }, img: "/images/haval-h6.jpg",
    gallery: ["/images/haval-h6.jpg", px(27952120), px(39375306)], branchId: "b2", vin: "LGWEF4A57SH220981", plateReady: true,
    specs: { engine: { ar: "2.0L تيربو", en: "2.0L turbo" }, power: 201, trans: { ar: "7DCT مزدوج القابض", en: "7-speed DCT" }, drive: { ar: "أمامي", en: "FWD" }, seats: 5, fuel: 14.5, color: { ar: "رمادي جرافيت", en: "Graphite grey" } },
  },
  {
    id: "jolion25", brand: "haval", model: { ar: "هافال جوليون", en: "Haval Jolion" }, year: 2025, condition: "new", price: 82900,
    img: px(27952120), gallery: [px(27952120), px(39375306), "/images/haval-h6.jpg"], branchId: "b4", vin: "LGWEE4A50SH331206", plateReady: true,
    specs: { engine: { ar: "1.5L تيربو", en: "1.5L turbo" }, power: 147, trans: { ar: "7DCT", en: "7-speed DCT" }, drive: { ar: "أمامي", en: "FWD" }, seats: 5, fuel: 16.7, color: { ar: "أسود ليلي", en: "Midnight black" } },
  },
  {
    id: "t225", brand: "jetour", model: { ar: "جيتور T2 مغامر", en: "Jetour T2 Explorer" }, year: 2025, condition: "new", price: 149900,
    tag: { ar: "روح المغامرة", en: "Adventure spec" }, img: "/images/jetour-t2.jpg",
    gallery: ["/images/jetour-t2.jpg", px(11114270), px(19311694)], branchId: "b2", vin: "LVVDB21B8SD440782", plateReady: true,
    specs: { engine: { ar: "2.0L تيربو", en: "2.0L turbo" }, power: 254, trans: { ar: "7DCT", en: "7-speed DCT" }, drive: { ar: "دفع رباعي ذكي", en: "Smart AWD" }, seats: 5, fuel: 12.8, color: { ar: "أخضر صحراوي", en: "Desert green" } },
  },
  {
    id: "x7025", brand: "jetour", model: { ar: "جيتور X70 بلس", en: "Jetour X70 Plus" }, year: 2025, condition: "new", price: 97500,
    img: px(39375306), gallery: [px(39375306), px(30319949), px(11114270)], branchId: "b4", vin: "LVVDB11B2SD118850", plateReady: false,
    specs: { engine: { ar: "1.6L تيربو", en: "1.6L turbo" }, power: 197, trans: { ar: "7DCT", en: "7-speed DCT" }, drive: { ar: "أمامي", en: "FWD" }, seats: 7, fuel: 13.5, color: { ar: "بيج رملي", en: "Sand beige" } },
  },
  {
    id: "poer25", brand: "gwm", model: { ar: "GWM بوير باور", en: "GWM Poer" }, year: 2025, condition: "new", price: 109900,
    tag: { ar: "بيك أب الشغل", en: "Work & play" }, img: px(33566025),
    gallery: [px(33566025), px(13080731), px(34594185)], branchId: "b1", vin: "LGWDBF1A8SB550217", plateReady: true,
    specs: { engine: { ar: "2.0L تيربو ديزل", en: "2.0L turbo diesel" }, power: 190, trans: { ar: "أوتوماتيك ٨ سرعات", en: "8-speed auto" }, drive: { ar: "دفع رباعي جزئي", en: "Part-time 4WD" }, seats: 5, fuel: 12.9, color: { ar: "رمادي حديدي", en: "Iron grey" } },
  },
  {
    id: "ulc21", brand: "toyota", model: { ar: "لاندكروزر GXR", en: "Land Cruiser GXR" }, year: 2021, condition: "used", price: 289000, km: 76500, certified: true,
    img: px(30319949), gallery: [px(30319949), px(10658277), px(19311694)], branchId: "b2", vin: "JTMCY7AJ1M4295518", plateReady: true,
    specs: { engine: { ar: "5.7L V8", en: "5.7L V8" }, power: 362, trans: { ar: "أوتوماتيك ٨ سرعات", en: "8-speed auto" }, drive: { ar: "دفع رباعي دائم", en: "Full-time 4WD" }, seats: 7, fuel: 9.8, color: { ar: "بيج صحراوي", en: "Desert beige" } },
  },
  {
    id: "uhilux20", brand: "toyota", model: { ar: "هايلكس GLX", en: "Hilux GLX" }, year: 2020, condition: "used", price: 84500, km: 132000, certified: true,
    img: px(13319702), gallery: [px(13319702), px(13080731), px(33566025)], branchId: "b1", vin: "MR0HA8CD1L0480233", plateReady: true,
    specs: { engine: { ar: "2.7L بنزين", en: "2.7L petrol" }, power: 164, trans: { ar: "يداعي ٥ سرعات", en: "5-speed manual" }, drive: { ar: "دفع رباعي جزئي", en: "Part-time 4WD" }, seats: 5, fuel: 13.2, color: { ar: "أبيض", en: "White" } },
  },
  {
    id: "ucamry22", brand: "toyota", model: { ar: "كامري GLE", en: "Camry GLE" }, year: 2022, condition: "used", price: 92900, km: 61000, certified: true,
    img: px(16350113), gallery: [px(16350113), px(11945283), px(6706311)], branchId: "b2", vin: "4T1G11AK0NU712384", plateReady: true,
    specs: { engine: { ar: "2.5L بنزين", en: "2.5L petrol" }, power: 204, trans: { ar: "أوتوماتيك ٨ سرعات", en: "8-speed auto" }, drive: { ar: "أمامي", en: "FWD" }, seats: 5, fuel: 17.2, color: { ar: "فضي", en: "Silver" } },
  },
  {
    id: "uh622", brand: "haval", model: { ar: "هافال H6", en: "Haval H6" }, year: 2022, condition: "used", price: 71900, km: 48200,
    img: "/images/haval-h6.jpg", gallery: ["/images/haval-h6.jpg", px(27952120)], branchId: "b4", vin: "LGWEF4A5XNH102337", plateReady: true,
    specs: { engine: { ar: "2.0L تيربو", en: "2.0L turbo" }, power: 201, trans: { ar: "7DCT", en: "7-speed DCT" }, drive: { ar: "أمامي", en: "FWD" }, seats: 5, fuel: 14.1, color: { ar: "رمادي", en: "Grey" } },
  },
];

export interface ServiceType {
  id: "routine" | "oil" | "elec" | "repair" | "test";
  icon: string;
  price: number;
  durKey: string;
}

export const SERVICES: ServiceType[] = [
  { id: "routine", icon: "gauge", price: 350, durKey: "sv.dur.150" },
  { id: "oil", icon: "drop", price: 150, durKey: "sv.dur.45" },
  { id: "elec", icon: "zap", price: 200, durKey: "sv.dur.60" },
  { id: "repair", icon: "wrench", price: 250, durKey: "sv.dur.vary" },
  { id: "test", icon: "steering", price: 0, durKey: "sv.dur.30" },
];

export interface Appointment {
  id: string;
  serviceId: ServiceType["id"];
  vehicleId: string;
  vehicleLabel?: Bi;
  branchId: string;
  advisorId: string;
  date: string;
  time: string;
}

export const SEED_APPTS: Appointment[] = [
  { id: "apt-seed", serviceId: "oil", vehicleId: "g3", branchId: "b2", advisorId: "a1", date: isoPlus(1), time: "10:00" },
];

export interface Offer {
  id: string;
  title: Bi;
  sub: Bi;
  badge: Bi;
  endsInDays: number;
  icon: string;
  tone: "red" | "amber" | "blue";
}

export const OFFERS: Offer[] = [
  { id: "o1", title: { ar: "حملة الشتاء", en: "Winter Campaign" }, sub: { ar: "خصم ٢٥٪ على أجور الصيانة + فحص ٤٠ نقطة مجانًا بكل الفروع", en: "25% off labor + free 40-point check at every branch" }, badge: { ar: "٢٥٪ خصم", en: "25% OFF" }, endsInDays: 12, icon: "sparkles", tone: "red" },
  { id: "o2", title: { ar: "باقة الزيت الذهبي", en: "Golden Oil Package" }, sub: { ar: "زيت أصلي + فلتر + غسيل خارجي بـ ١٩٩ ر.س بس", en: "Genuine oil + filter + exterior wash for only SAR 199" }, badge: { ar: "١٩٩ ر.س", en: "SAR 199" }, endsInDays: 25, icon: "drop", tone: "amber" },
  { id: "o3", title: { ar: "إطاراتك… تركيبها علينا", en: "Tires? Fitting's on us" }, sub: { ar: "تركيب وموازنة مجاني مع شراء ٤ إطارات من أي فرع", en: "Free fitting & balancing with any 4-tire purchase" }, badge: { ar: "تركيب مجاني", en: "Free fitting" }, endsInDays: 40, icon: "steering", tone: "blue" },
  /* Ramadan awareness — Najran workshops genuinely shift to late nights */
  { id: "o4", title: { ar: "ليالي رمضان عند دغمل", en: "Ramadan Nights at Doghmal" }, sub: { ar: "نستقبلك بعد التراويح لين ٢ الفجر + فحص مجاني قبل سفر العيد", en: "Open after Taraweeh until 2 AM + free pre-Eid road-trip check" }, badge: { ar: "دوام ليلي", en: "Late nights" }, endsInDays: 20, icon: "moon", tone: "red" },
];

export const PROGRAM_TIERS = [
  { id: "basic", price: 690, nameKey: "m.tier.basic" as const, items: [
    { ar: "٤ تغييرات زيت أصلي + فلتر", en: "4 genuine oil + filter changes" },
    { ar: "فحص ٤٠ نقطة كل زيارة", en: "40-point check every visit" },
    { ar: "غسيل خارجي مجاني", en: "Free exterior wash" },
  ]},
  { id: "plus", price: 890, nameKey: "m.tier.plus" as const, items: [
    { ar: "كل مزايا الأساسية", en: "Everything in Basic" },
    { ar: "فلاتر هواء ومكيّف سنويًا", en: "Annual air & cabin filters" },
    { ar: "تدوير إطارات + موازنة", en: "Tire rotation & balancing" },
    { ar: "أولوية بالحجز", en: "Priority booking" },
  ]},
  { id: "full", price: 1290, nameKey: "m.tier.full" as const, items: [
    { ar: "كل مزايا بلس", en: "Everything in Plus" },
    { ar: "فحص كهرباء وهايبرد شامل", en: "Full electrical & hybrid scan" },
    { ar: "سيارة بديلة ليوم واحد", en: "1-day courtesy car" },
    { ar: "خصم ١٥٪ على قطع الغيار", en: "15% off parts" },
  ]},
];

/* New-car picker for the "Add vehicle" sheet */
export const CAR_MODELS: Bi[] = [
  { ar: "لاندكروزر", en: "Land Cruiser" },
  { ar: "هايلكس", en: "Hilux" },
  { ar: "كامري", en: "Camry" },
  { ar: "كورولا", en: "Corolla" },
  { ar: "راف فور", en: "RAV4" },
  { ar: "فورتشنر", en: "Fortuner" },
  { ar: "هافال H6", en: "Haval H6" },
  { ar: "جيتور T2", en: "Jetour T2" },
  { ar: "أخرى", en: "Other" },
];

export const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

/* Tri-state warranty derived from the ALJ registry date (read-only):
   Active → Expiring (<90 days) → Expired. */
export type WarrantyState = "active" | "expiring" | "expired";
export function warrantyState(until: string | null): WarrantyState {
  if (!until) return "expired";
  const days = (new Date(until + "T12:00:00").getTime() - Date.now()) / 864e5;
  if (days <= 0) return "expired";
  return days < 90 ? "expiring" : "active";
}

export const WORKSHOP_IMG = px(33814734);
export const MECHANIC_IMG = px(8986132);