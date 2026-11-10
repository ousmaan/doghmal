import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { GARAGE, type GarageCar } from "./data";

/* ============================================================================
   NAVIGATION + SESSION STORE — mimics React Navigation: 5 bottom tabs, each
   owning its own stack. Detail screens `push` (tab bar slides away, screen
   covers with a direction-aware slide), `pop` reverses. `lastAction` drives
   the animation class so RTL pushes enter from the mirrored edge.

   NON-INVASIVE PHILOSOPHY: all state is local-only. The draft autosaves to
   localStorage so a dropped session never loses a half-built booking; the
   garage and booking history mirror what the Tier-1 sync layer would cache
   from the DMS — reads everywhere, writes only to the wrapper's own store.
   ============================================================================ */

export type TabId = "home" | "showroom" | "book" | "garage" | "more";

export interface ScreenEntry {
  name: string; // 'root' | 'vehicle' | 'car' | 'addcar' | 'chat' | 'offers' | 'program' | 'about' | 'contact'
  params?: Record<string, string>;
}

/** Booking draft — the ONE write-path of the whole app (appointment request) */
export interface BookingDraft {
  serviceType: string | null;   // 'routine' | 'oil' | 'electrical' | 'general' | 'testdrive'
  branchId: string | null;
  advisorId: string | null;
  dayOffset: number | null;     // index into the next-8-days list
  time: string | null;
  vehicleLabel: string | null;  // showroom car or garage car attached to booking
  guestName: string | null;     // required guest identity (validated, Saudi format)
  guestPhone: string | null;
  confirmedRef: string | null;
}

const emptyDraft: BookingDraft = {
  serviceType: null, branchId: null, advisorId: null, dayOffset: null, time: null,
  vehicleLabel: null, guestName: null, guestPhone: null, confirmedRef: null,
};

export interface BookingRecord {
  ref: string;
  serviceKey: string;  // 'routine' | 'oil' | ... — resolved to the active language at render time
  when: string;        // human label e.g. "الأحد · 25 مايو · 9:00 ص"
  branchAr: string;
  branchEn: string;
}

interface NavCtx {
  tab: TabId;
  stack: ScreenEntry[];
  allStacks: Record<TabId, ScreenEntry[]>;
  lastAction: "push" | "pop" | "tab" | null;
  step: number;
  stepDir: "fwd" | "bck";
  draft: BookingDraft;
  garageCars: GarageCar[];      // DMS row + locally-added vehicles (persisted)
  bookings: BookingRecord[];    // confirmed booking history, in-app only
  setTab: (t: TabId) => void;
  push: (name: string, params?: Record<string, string>) => void;
  pushOn: (t: TabId, name: string, params?: Record<string, string>) => void;
  pop: () => void;
  goStep: (n: number) => void;
  patchDraft: (p: Partial<BookingDraft>) => void;
  resetBooking: () => void;
  startBooking: (prefill: Partial<BookingDraft>) => void;
  addCar: (c: GarageCar) => void;
  findCar: (id: string) => GarageCar | undefined;
  addBooking: (b: BookingRecord) => void;
}

const Ctx = createContext<NavCtx | null>(null);

const roots: Record<TabId, ScreenEntry[]> = {
  home: [{ name: "root" }],
  showroom: [{ name: "root" }],
  book: [{ name: "root" }],
  garage: [{ name: "root" }],
  more: [{ name: "root" }],
};

/* ---------- tiny storage helpers (mock of the wrapper's cache layer) ---------- */
function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? { ...fallback, ...JSON.parse(raw) } as T : fallback; }
  catch { return fallback; }
}
function loadArr<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? "[]") as T[]; } catch { return []; }
}
function save(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode */ } }

export function NavProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<TabId>("home");
  const [allStacks, setStacks] = useState(roots);
  const [lastAction, setLastAction] = useState<NavCtx["lastAction"]>(null);

  // Wizard state restores mid-flow if the app was closed (auto-save requirement)
  const [step, setStep] = useState<number>(() => {
    const n = Number(localStorage.getItem("doghmal-book-step") ?? 0);
    return Number.isFinite(n) && n >= 0 && n <= 4 ? n : 0; // never restore into the success view
  });
  const [stepDir, setStepDir] = useState<"fwd" | "bck">("fwd");
  const [draft, setDraft] = useState<BookingDraft>(() => {
    const d = load<BookingDraft>("doghmal-book-draft", emptyDraft);
    return { ...d, confirmedRef: null }; // a stale success ref never survives restart
  });
  const [extraCars, setExtraCars] = useState<GarageCar[]>(() => loadArr<GarageCar>("doghmal-garage-extra"));
  const [bookings, setBookings] = useState<BookingRecord[]>(() => loadArr<BookingRecord>("doghmal-bookings"));

  // Auto-save the draft + step as the user types/taps (non-invasive local mirror)
  useEffect(() => { save("doghmal-book-draft", draft); }, [draft]);
  useEffect(() => { save("doghmal-book-step", step); }, [step]);

  const setTab = useCallback((tTab: TabId) => {
    setLastAction("tab");
    setTabState(tTab);
  }, []);

  const push = useCallback((name: string, params?: Record<string, string>) => {
    setLastAction("push");
    setStacks((s) => ({ ...s, [tab]: [...s[tab], { name, params }] }));
  }, [tab]);

  /** Push onto a specific tab's stack and switch to it (cross-tab deep link) */
  const pushOn = useCallback((tTab: TabId, name: string, params?: Record<string, string>) => {
    setLastAction("push");
    setStacks((s) => ({ ...s, [tTab]: [...s[tTab], { name, params }] }));
    setTabState(tTab);
  }, []);

  const pop = useCallback(() => {
    setLastAction("pop");
    setStacks((s) => ({ ...s, [tab]: s[tab].length > 1 ? s[tab].slice(0, -1) : s[tab] }));
  }, [tab]);

  const goStep = useCallback((n: number) => {
    setStep((prev) => { setStepDir(n >= prev ? "fwd" : "bck"); return n; });
  }, []);

  const patchDraft = useCallback((p: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...p })), []);

  const resetBooking = useCallback(() => {
    setDraft(emptyDraft); setStep(0); setStepDir("fwd");
    try { localStorage.removeItem("doghmal-book-draft"); localStorage.removeItem("doghmal-book-step"); } catch { /* noop */ }
  }, []);

  /** Deep link: prefill the wizard then jump to the Book tab */
  const startBooking = useCallback((prefill: Partial<BookingDraft>) => {
    setDraft((d) => ({ ...emptyDraft, guestName: d.guestName, guestPhone: d.guestPhone, ...prefill }));
    setStep(0); setStepDir("fwd");
    setLastAction("tab");
    setTabState("book");
  }, []);

  const addCar = useCallback((c: GarageCar) => {
    setExtraCars((p) => { const n = [...p, c]; save("doghmal-garage-extra", n); return n; });
  }, []);

  const addBooking = useCallback((b: BookingRecord) => {
    setBookings((p) => { const n = [b, ...p].slice(0, 10); save("doghmal-bookings", n); return n; });
  }, []);

  // DMS rows first, locally-added vehicles appended — index-stable for APPOINTMENT
  const garageCars = useMemo(() => [...GARAGE, ...extraCars], [extraCars]);
  const findCar = useCallback((id: string) => garageCars.find((c) => c.id === id), [garageCars]);

  const stack = allStacks[tab];
  const value = useMemo<NavCtx>(() => ({
    tab, stack, allStacks, lastAction, step, stepDir, draft, garageCars, bookings,
    setTab, push, pushOn, pop, goStep, patchDraft, resetBooking, startBooking, addCar, findCar, addBooking,
  }), [tab, allStacks, lastAction, step, stepDir, draft, garageCars, bookings,
    setTab, push, pushOn, pop, goStep, patchDraft, resetBooking, startBooking, addCar, findCar, addBooking, stack]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNav() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNav outside provider");
  return c;
}

/* ---------- Booking day & slot builders (deterministic, no backend) ---------- */
const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_AR_SHORT = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
// NOTE: month 6 fixed — يونيو ليونيو was a typo; July is يوليو
const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface DayOption {
  offset: number;
  date: Date;
  dayAr: string; dayArShort: string; dayEn: string;
  labelAr: string; labelEn: string;
  dayNum: string;
  closed: boolean;                    // Fridays — Najran branches rest
}

export function nextDays(count = 8): DayOption[] {
  const out: DayOption[] = [];
  const base = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(base); d.setDate(base.getDate() + i);
    const wd = d.getDay();
    out.push({
      offset: i, date: d,
      dayAr: DAYS_AR[wd], dayArShort: DAYS_AR_SHORT[wd], dayEn: DAYS_EN[wd],
      labelAr: `${d.getDate()} ${MONTHS_AR[d.getMonth()]}`, labelEn: `${MONTHS_EN[d.getMonth()]} ${d.getDate()}`,
      dayNum: String(d.getDate()),
      closed: wd === 5,
    });
  }
  return out;
}

export const TIMES = [
  { id: "t1", ar: "٩:٠٠ ص", en: "9:00 AM", taken: false },
  { id: "t2", ar: "١٠:٣٠ ص", en: "10:30 AM", taken: true },
  { id: "t3", ar: "١٢:٠٠ ظ", en: "12:00 PM", taken: false },
  { id: "t4", ar: "٤:٣٠ م", en: "4:30 PM", taken: false },
  { id: "t5", ar: "٦:٠٠ م", en: "6:00 PM", taken: false },
  { id: "t6", ar: "٨:٠٠ م", en: "8:00 PM", taken: true },
];
