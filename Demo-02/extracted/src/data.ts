/* ============================================================================
   MOCK DATA — "NON-INVASIVE INTEGRATION LAYER" (Tier 1)
   ----------------------------------------------------------------------------
   Doghmal runs legacy dealer-management systems (DMS) on-premise. This app is
   a READ-ONLY customer wrapper: it mirrors DMS records (vehicles, service
   history, warranty, advisor rosters) into a local cache, and only ever
   WRITES one thing — appointment requests — which land as inbox tickets for
   staff to confirm. No legacy workflows are modified; zero risk to operations.
   Everything below simulates that cached mirror.
   ============================================================================ */

/* ---------- Shared photo pool (Pexels CDN) ---------- */
const P = "https://images.pexels.com/photos";
export const IMG = {
  lcDesert: `${P}/20584983/pexels-photo-20584983.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  lcDunes: `${P}/10658277/pexels-photo-10658277.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  lcSand: `${P}/19311694/pexels-photo-19311694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  prado: `${P}/11114270/pexels-photo-11114270.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  camryPark: `${P}/11285174/pexels-photo-11285174.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  camryRoad: `${P}/28688908/pexels-photo-28688908.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  corolla: `${P}/34562588/pexels-photo-34562588.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  hiluxDesert: `${P}/33566025/pexels-photo-33566025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  hiluxRocks: `${P}/13080731/pexels-photo-13080731.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  hiluxDust: `${P}/13319702/pexels-photo-13319702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  jetourT2: `${P}/30173513/pexels-photo-30173513.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  jetourDash: `${P}/11589801/pexels-photo-11589801.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  havalH6: `${P}/2920064/pexels-photo-2920064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  havalJolion: `${P}/11808155/pexels-photo-11808155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  havalH9: `${P}/19067088/pexels-photo-19067088.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  workshop1: `${P}/4116221/pexels-photo-4116221.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  workshop2: `${P}/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  workshop3: `${P}/8478259/pexels-photo-8478259.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  showroomHall: `${P}/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`,
  adv1: `${P}/34171710/pexels-photo-34171710.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400`,
  adv2: `${P}/34171675/pexels-photo-34171675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400`,
  adv3: `${P}/8939103/pexels-photo-8939103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400`,
  adv4: `${P}/34171662/pexels-photo-34171662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400`,
};

/* ---------- Types ---------- */
export type Brand = "toyota" | "jetour" | "haval";
export type Condition = "new" | "used";

export interface ShowroomCar {
  id: string;
  brand: Brand;
  cond: Condition;
  nameAr: string;
  nameEn: string;
  year: number;
  price: number;        // SAR
  km: number | null;    // null = new
  branchId: string;
  images: string[];
  vin: string;
  platesReady: boolean;
  specs: { engine: string; hp: number; gearAr: string; gearEn: string; driveAr: string; driveEn: string; seats: number };
}

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  addrAr: string;
  addrEn: string;
  distKm: number;
  status: "today" | "tomorrow" | "limited" | "full";
  bays: number;
}

export interface Advisor {
  id: string;
  nameAr: string;
  nameEn: string;
  photo: string;
  wa: string;          // wa.me number
  online: boolean;
  rating: number;
  deals: number;
  spec: "maintenance" | "electrical" | "sales" | "bodyshop"; // workshop specialty badge
}

export interface HistoryEntry {
  id: string;
  dateAr: string;
  dateEn: string;
  typeAr: string;
  typeEn: string;
  branchIdx: number;
  km: number;
  cost: number;
}

export interface GarageCar {
  id: string;
  nickAr: string;
  nickEn: string;
  modelAr: string;
  modelEn: string;
  year: number;
  plate: string;
  vin: string;
  odo: number;
  nextKm: number;
  nextCost: number;   // live price estimate for the next milestone (SAR)
  img: string;
  status: "in-service" | "ready" | null;
  agentYearsLeft: number;
  paintYearsLeft: number;
  lastServiceAr: string;
  lastServiceEn: string;
  history: HistoryEntry[];
}

export interface Offer {
  id: string;
  tagAr: string;
  tagEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  daysLeft: number;
  img: string;
  red?: boolean;
}

/* ---------- Branches — the real 6 Doghmal points across Najran ---------- */
export const BRANCHES: Branch[] = [
  { id: "b1", nameAr: "فرع الدهدة", nameEn: "Al-Dahdah Branch", addrAr: "حي الدهدة — طريق الملك خالد", addrEn: "Al-Dahdah — King Khalid Rd.", distKm: 2.1, status: "today", bays: 8 },
  { id: "b2", nameAr: "فرع شارع الملك عبدالعزيز", nameEn: "King Abdulaziz St. Branch", addrAr: "شارع الملك عبدالعزيز — حي البلد", addrEn: "King Abdulaziz St. — Al-Balad", distKm: 3.4, status: "today", bays: 12 },
  { id: "b3", nameAr: "فرع السنيعة", nameEn: "Al-Sunay'ah Branch", addrAr: "حي السنيعة — طريق الأمير مشعل", addrEn: "Al-Sunay'ah — Prince Mishaal Rd.", distKm: 5.8, status: "tomorrow", bays: 6 },
  { id: "b4", nameAr: "فرع الغويلة", nameEn: "Al-Ghwailah Branch", addrAr: "حي الغويلة — الدائري الثاني", addrEn: "Al-Ghwailah — Second Ring Rd.", distKm: 7.2, status: "limited", bays: 5 },
  { id: "b5", nameAr: "فرع الفيصلية", nameEn: "Al-Faisaliyah Branch", addrAr: "حي الفيصلية — شارع الأمير سلطان", addrEn: "Al-Faisaliyah — Prince Sultan St.", distKm: 9.5, status: "tomorrow", bays: 6 },
  { id: "b6", nameAr: "فرع طريق المطار", nameEn: "Airport Rd. Branch", addrAr: "طريق المطار القديم — حي الظباط", addrEn: "Old Airport Rd. — Al-Dhabbat", distKm: 12.3, status: "limited", bays: 4 },
];

/* ---------- Advisors — humanized Tier-1 contact points ---------- */
export const ADVISORS: Advisor[] = [
  { id: "a1", nameAr: "أبو فهد الدوسري", nameEn: "Abu Fahad Al-Dossary", photo: IMG.adv1, wa: "966551112233", online: true, rating: 4.9, deals: 1240, spec: "maintenance" },
  { id: "a2", nameAr: "محمد الشهري", nameEn: "Mohammed Al-Shehri", photo: IMG.adv2, wa: "966552223344", online: true, rating: 4.8, deals: 987, spec: "electrical" },
  { id: "a3", nameAr: "خالد آل دغمل", nameEn: "Khalid Al Doghmal", photo: IMG.adv3, wa: "966553334455", online: false, rating: 5.0, deals: 2130, spec: "bodyshop" },
  { id: "a4", nameAr: "سعود يامي", nameEn: "Saud Yami", photo: IMG.adv4, wa: "966554445566", online: true, rating: 4.7, deals: 764, spec: "sales" },
];

/* ---------- Showroom inventory (mirror of DMS stock table) ---------- */
export const SHOWROOM: ShowroomCar[] = [
  {
    id: "v1", brand: "toyota", cond: "new", nameAr: "لاندكروزر GXR", nameEn: "Land Cruiser GXR", year: 2025,
    price: 289900, km: null, branchId: "b2", vin: "JTMCB3FV2P4018821", platesReady: true,
    images: [IMG.lcDesert, IMG.lcSand, IMG.lcDunes],
    specs: { engine: "V6 3.5L Twin-Turbo", hp: 409, gearAr: "أوتوماتيك 10 سرعات", gearEn: "10-speed automatic", driveAr: "دفع رباعي", driveEn: "4WD", seats: 7 },
  },
  {
    id: "v2", brand: "toyota", cond: "new", nameAr: "برادو TXL", nameEn: "Prado TXL", year: 2024,
    price: 198500, km: null, branchId: "b1", vin: "JTEBU9JR7R5093314", platesReady: true,
    images: [IMG.prado, IMG.lcDesert, IMG.lcSand],
    specs: { engine: "2.4L Turbo", hp: 267, gearAr: "أوتوماتيك 8 سرعات", gearEn: "8-speed automatic", driveAr: "دفع رباعي", driveEn: "4WD", seats: 7 },
  },
  {
    id: "v3", brand: "toyota", cond: "new", nameAr: "كامري GLE", nameEn: "Camry GLE", year: 2025,
    price: 119900, km: null, branchId: "b2", vin: "JTNB13HK9R3077442", platesReady: false,
    images: [IMG.camryPark, IMG.camryRoad, IMG.corolla],
    specs: { engine: "2.5L Hybrid", hp: 225, gearAr: "CVT كهربائي", gearEn: "e-CVT", driveAr: "دفع أمامي", driveEn: "FWD", seats: 5 },
  },
  {
    id: "v4", brand: "toyota", cond: "new", nameAr: "هايلوكس SR5", nameEn: "Hilux SR5", year: 2025,
    price: 131500, km: null, branchId: "b6", vin: "MR0BA3CD7P1125530", platesReady: true,
    images: [IMG.hiluxDesert, IMG.hiluxRocks, IMG.hiluxDust],
    specs: { engine: "2.8L Diesel", hp: 201, gearAr: "أوتوماتيك 6 سرعات", gearEn: "6-speed automatic", driveAr: "دفع رباعي", driveEn: "4WD", seats: 5 },
  },
  {
    id: "v5", brand: "jetour", cond: "new", nameAr: "جيتور T2", nameEn: "Jetour T2", year: 2025,
    price: 114900, km: null, branchId: "b3", vin: "LVGBB87K5PG220188", platesReady: true,
    images: [IMG.jetourT2, IMG.havalH9, IMG.lcSand],
    specs: { engine: "2.0L Turbo", hp: 254, gearAr: "دبل كلاتش 7 سرعات", gearEn: "7-speed DCT", driveAr: "دفع رباعي", driveEn: "4WD", seats: 5 },
  },
  {
    id: "v6", brand: "jetour", cond: "new", nameAr: "جيتور داشنغ", nameEn: "Jetour Dashing", year: 2024,
    price: 82500, km: null, branchId: "b4", vin: "LVGDC21A8PG664209", platesReady: false,
    images: [IMG.jetourDash, IMG.jetourT2, IMG.havalH6],
    specs: { engine: "1.6L Turbo", hp: 197, gearAr: "دبل كلاتش 7 سرعات", gearEn: "7-speed DCT", driveAr: "دفع أمامي", driveEn: "FWD", seats: 5 },
  },
  {
    id: "v7", brand: "haval", cond: "new", nameAr: "هافال H6", nameEn: "Haval H6", year: 2025,
    price: 95900, km: null, branchId: "b5", vin: "LGWEF4A53PH771204", platesReady: true,
    images: [IMG.havalH6, IMG.havalJolion, IMG.jetourDash],
    specs: { engine: "2.0L Turbo", hp: 201, gearAr: "أوتوماتيك 7 سرعات", gearEn: "7-speed automatic", driveAr: "دفع رباعي", driveEn: "AWD", seats: 5 },
  },
  {
    id: "v8", brand: "haval", cond: "new", nameAr: "هافال جوليان", nameEn: "Haval Jolion", year: 2024,
    price: 74900, km: null, branchId: "b1", vin: "LGWED2A17PH330815", platesReady: true,
    images: [IMG.havalJolion, IMG.havalH6, IMG.corolla],
    specs: { engine: "1.5L Turbo", hp: 148, gearAr: "دبل كلاتش 7 سرعات", gearEn: "7-speed DCT", driveAr: "دفع أمامي", driveEn: "FWD", seats: 5 },
  },
  {
    id: "v9", brand: "toyota", cond: "used", nameAr: "كامري GLX", nameEn: "Camry GLX", year: 2022,
    price: 84500, km: 38200, branchId: "b2", vin: "JTNB13HK4N3011557", platesReady: true,
    images: [IMG.camryRoad, IMG.camryPark, IMG.corolla],
    specs: { engine: "2.5L", hp: 204, gearAr: "أوتوماتيك 8 سرعات", gearEn: "8-speed automatic", driveAr: "دفع أمامي", driveEn: "FWD", seats: 5 },
  },
  {
    id: "v10", brand: "toyota", cond: "used", nameAr: "لاندكروزر VXR", nameEn: "Land Cruiser VXR", year: 2021,
    price: 229000, km: 61400, branchId: "b1", vin: "JTMCB3FV1M4087763", platesReady: true,
    images: [IMG.lcDunes, IMG.lcDesert, IMG.lcSand],
    specs: { engine: "V8 5.7L", hp: 362, gearAr: "أوتوماتيك 8 سرعات", gearEn: "8-speed automatic", driveAr: "دفع رباعي", driveEn: "4WD", seats: 8 },
  },
  {
    id: "v11", brand: "toyota", cond: "used", nameAr: "هايلوكس غمارتين", nameEn: "Hilux Double Cab", year: 2022,
    price: 98200, km: 44800, branchId: "b6", vin: "MR0BA3CD3N1109928", platesReady: true,
    images: [IMG.hiluxDust, IMG.hiluxDesert, IMG.hiluxRocks],
    specs: { engine: "2.7L", hp: 164, gearAr: "أوتوماتيك 6 سرعات", gearEn: "6-speed automatic", driveAr: "دفع رباعي", driveEn: "4WD", seats: 5 },
  },
  {
    id: "v12", brand: "haval", cond: "used", nameAr: "هافال H9", nameEn: "Haval H9", year: 2023,
    price: 104500, km: 22100, branchId: "b3", vin: "LGWFFUA58PH554120", platesReady: false,
    images: [IMG.havalH9, IMG.jetourT2, IMG.havalH6],
    specs: { engine: "2.0L Turbo", hp: 218, gearAr: "أوتوماتيك 8 سرعات", gearEn: "8-speed automatic", driveAr: "دفع رباعي", driveEn: "4WD", seats: 7 },
  },
];

/* ---------- Digital garage (customer's registered vehicles) ---------- */
export const GARAGE: GarageCar[] = [
  {
    id: "g1", nickAr: "اللاند", nickEn: "The Cruiser", modelAr: "لاندكروزر GXR", modelEn: "Land Cruiser GXR", year: 2023,
    plate: "ن ص ر 4417", vin: "JTMCB3FV5P4012244", odo: 24350, nextKm: 30000, nextCost: 1150, img: IMG.lcSand, status: null,
    agentYearsLeft: 2, paintYearsLeft: 4, lastServiceAr: "12 مارس — 20,000 كم", lastServiceEn: "Mar 12 — 20,000 km",
    history: [
      { id: "h1", dateAr: "12 مارس 2025", dateEn: "Mar 12, 2025", typeAr: "صيانة 20,000 كم", typeEn: "20,000 km service", branchIdx: 1, km: 20310, cost: 1150 },
      { id: "h2", dateAr: "2 نوفمبر 2024", dateEn: "Nov 2, 2024", typeAr: "استبدال زيت وفلتر", typeEn: "Oil & filter change", branchIdx: 0, km: 15120, cost: 380 },
      { id: "h3", dateAr: "18 يونيو 2024", dateEn: "Jun 18, 2024", typeAr: "صيانة 10,000 كم", typeEn: "10,000 km service", branchIdx: 1, km: 10080, cost: 920 },
    ],
  },
  {
    id: "g2", nickAr: "كامري الدوام", nickEn: "Daily Camry", modelAr: "كامري GLX", modelEn: "Camry GLX", year: 2022,
    plate: "س م ح 8820", vin: "JTNB13HK4N3009871", odo: 55210, nextKm: 60000, nextCost: 980, img: IMG.camryRoad, status: null,
    agentYearsLeft: 0, paintYearsLeft: 1, lastServiceAr: "28 أبريل — 55,000 كم", lastServiceEn: "Apr 28 — 55,000 km",
    history: [
      { id: "h4", dateAr: "28 أبريل 2025", dateEn: "Apr 28, 2025", typeAr: "صيانة 55,000 كم", typeEn: "55,000 km service", branchIdx: 2, km: 55040, cost: 740 },
      { id: "h5", dateAr: "9 يناير 2025", dateEn: "Jan 9, 2025", typeAr: "فحص كهربائي + بطارية", typeEn: "Electrical diag + battery", branchIdx: 0, km: 52300, cost: 520 },
      { id: "h6", dateAr: "14 سبتمبر 2024", dateEn: "Sep 14, 2024", typeAr: "استبدال زيت وفلتر", typeEn: "Oil & filter change", branchIdx: 3, km: 48900, cost: 340 },
    ],
  },
  {
    id: "g3", nickAr: "هايلوكس المزرعة", nickEn: "Farm Hilux", modelAr: "هايلوكس غمارتين", modelEn: "Hilux Double Cab", year: 2021,
    plate: "ع ب د 1203", vin: "MR0BA3CD1M1117702", odo: 88400, nextKm: 90000, nextCost: 380, img: IMG.hiluxDust, status: "in-service",
    agentYearsLeft: 0, paintYearsLeft: 0, lastServiceAr: "اليوم — داخل الورشة", lastServiceEn: "Today — in workshop",
    history: [
      { id: "h7", dateAr: "اليوم", dateEn: "Today", typeAr: "صيانة 88,000 كم — جارية", typeEn: "88,000 km service — ongoing", branchIdx: 0, km: 88410, cost: 0 },
      { id: "h8", dateAr: "3 مارس 2025", dateEn: "Mar 3, 2025", typeAr: "تغيير كلتش وفرامل", typeEn: "Clutch & brake job", branchIdx: 0, km: 86200, cost: 1890 },
      { id: "h9", dateAr: "20 ديسمبر 2024", dateEn: "Dec 20, 2024", typeAr: "استبدال زيت وفلتر", typeEn: "Oil & filter change", branchIdx: 5, km: 81150, cost: 320 },
    ],
  },
];

/* ---------- Upcoming appointment (mirrored from DMS service calendar) ---------- */
export const APPOINTMENT = {
  dayAr: "الأحد", dayEn: "Sunday",
  dateAr: "٢٥ مايو", dateEn: "May 25",
  timeAr: "٩:٠٠ صباحاً", timeEn: "9:00 AM",
  branchIdx: 0,
  advisorIdx: 0,
  serviceAr: "صيانة 88,000 كم", serviceEn: "88,000 km service",
  vehicleIdx: 2,
  status: "in-service" as const,
};

/* ---------- Offers & campaigns ---------- */
export const OFFERS: Offer[] = [
  {
    id: "o1", tagAr: "حملة الصيف", tagEn: "Summer Campaign", red: true,
    titleAr: "فحص مكيف مجاني مع كل صيانة", titleEn: "Free A/C check with any service",
    descAr: "تعبئة فريون + فحص كمبروسر — قبل لا يحما الجو", descEn: "Freon top-up + compressor check before the heat peaks",
    daysLeft: 5, img: IMG.workshop2,
  },
  {
    id: "o2", tagAr: "اليوم الوطني 95", tagEn: "National Day 95", red: true,
    titleAr: "خصم 25% على قطع الغيار الأصلية", titleEn: "25% off genuine parts",
    descAr: "فرامل، فلاتر، وبطاريات — بضمان الوكيل العام، بكل فروعنا بنجران", descEn: "Brakes, filters & batteries — agent warranty included, at all Najran branches",
    daysLeft: 12, img: IMG.workshop1,
  },
  {
    id: "o3", tagAr: "استبدال", tagEn: "Trade-in",
    titleAr: "بدّل سيارتك القديمة بلاندكروزر 2025", titleEn: "Trade your old car for a 2025 Land Cruiser",
    descAr: "تقييم مجاني بفرع الملك عبدالعزيز وسيارتك تحسب دفعة أولى", descEn: "Free valuation at King Abdulaziz branch — your car counts as the down payment",
    daysLeft: 20, img: IMG.lcDesert,
  },
];

/* ---------- Periodic maintenance packages ---------- */
export const PACKAGES = [
  { id: "p1", nameAr: "باقة 5 آلاف", nameEn: "5K Package", visits: 4, price: 1299, img: IMG.workshop3,
    itemsAr: ["زيت وفلتر أصلي", "فحص 21 نقطة", "غسيل مجاني كل زيارة"], itemsEn: ["Genuine oil & filter", "21-point inspection", "Free wash every visit"] },
  { id: "p2", nameAr: "باقة 10 آلاف", nameEn: "10K Package", visits: 4, price: 2299, img: IMG.workshop1,
    itemsAr: ["كل اللي في باقة 5 آلاف", "فلتر مكيف وبنزين", "شحن مجاني للسيارة"], itemsEn: ["Everything in 5K", "A/C & fuel filters", "Free car pickup"] },
  { id: "p3", nameAr: "باقة 20 ألف", nameEn: "20K Package", visits: 2, price: 3199, img: IMG.workshop2,
    itemsAr: ["صيانة شاملة كبرى", "فرامل + بواجي", "ضمان إصلاح 6 شهور"], itemsEn: ["Full major service", "Brakes + spark plugs", "6-month repair warranty"] },
];

/* ---------- Helpers ---------- */
export const branchOf = (id: string) => BRANCHES.find((b) => b.id === id)!;
export const advisorOf = (id: string) => ADVISORS.find((a) => a.id === id)!;
export const carOf = (id: string) => SHOWROOM.find((c) => c.id === id)!;
export const garageOf = (id: string) => GARAGE.find((c) => c.id === id)!;
export const waLink = (num: string, msg: string) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
