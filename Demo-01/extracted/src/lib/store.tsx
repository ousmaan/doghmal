import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { tr, type Bi, type Lang, type TKey } from "./i18n";
import { GARAGE, SEED_APPTS, type Advisor, type Appointment, type GarageCar, type ServiceType } from "./data";

/* ————————————————————————————————————————————————
   APP STORE — the Tier 1 wrapper's local state.

   Non-invasive by design: `garage`, history, warranty and job
   status mirror what the legacy DMS would expose through a
   read-only API. VIN is the natural key of every vehicle record
   (ids are just local handles). The only "writes" are booking
   REQUESTS and locally-added vehicles — a human advisor confirms
   requests in the legacy system (the WhatsApp/chat hand-off).
   Nothing here ever mutates a legacy record.

   PERSISTENCE: session, garage, booking history and form progress
   auto-save to localStorage (mock backend, per Tier 1 brief).
———————————————————————————————————————————————— */

export type TabId = "home" | "showroom" | "book" | "garage" | "more";
export type Route =
  | { name: "vehicle"; id: string }
  | { name: "garageCar"; id: string }
  | { name: "offers" }
  | { name: "program" }
  | { name: "about" }
  | { name: "contact" };

export interface Draft {
  serviceId?: ServiceType["id"];
  vehicleId?: string;
  vehicleLabel?: Bi;
  branchId?: string;
  advisorId?: string;
  date?: string;
  time?: string;
  phone?: string;
}

export interface ToastAction { label: string; onClick: () => void }
interface ToastItem { id: number; msg: string; action?: ToastAction }

interface Store {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  L: (b: Bi) => string;
  dir: "rtl" | "ltr";
  tab: TabId;
  switchTab: (t: TabId) => void;
  stack: Route[];
  push: (r: Route) => void;
  pop: () => void;
  navAnim: "push" | "pop";
  garage: GarageCar[];
  addVehicle: (c: GarageCar) => void;
  refreshGarage: () => void;
  appts: Appointment[];
  cancelAppt: (id: string) => void;
  draft: Draft;
  setDraft: (d: Draft | ((p: Draft) => Draft)) => void;
  step: number;
  setStep: (n: number) => void;
  confirmed: Appointment | null;
  bookingRef: string;
  startBooking: (p: Draft) => void;
  confirmBooking: () => void;
  jobStage: number;
  advanceJob: () => "advanced" | "ready" | "same";
  syncedAt: number;
  markSynced: () => void;
  toast: (msg: string, action?: ToastAction) => void;
  toasts: ToastItem[];
  chatWith: Advisor | null;
  openChat: (a: Advisor) => void;
  closeChat: () => void;
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const Ctx = createContext<Store>(null!);
export const useApp = () => useContext(Ctx);

export function openWhatsApp(phone: string, text: string) {
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

const LS_KEY = "dg_state_v2";
const LS_VERSION = 2;
function loadSaved(): Partial<{ garage: GarageCar[]; appts: Appointment[]; draft: Draft; step: number; loggedIn: boolean }> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data.version === LS_VERSION) {
      return {
        garage: data.garage,
        appts: data.appts,
        draft: data.draft,
        step: data.step,
        loggedIn: data.loggedIn,
      };
    }
    /* migration: older versions stored flat arrays under different keys */
    if (data.version === 1 || (data.garage !== undefined && !data.version)) {
      return {
        garage: Array.isArray(data.garage) ? data.garage : (data.oldGarage ?? []),
        appts: Array.isArray(data.appts) ? data.appts : (data.oldAppointments ?? []),
        draft: data.draft ?? {},
        step: data.step ?? 1,
        loggedIn: data.loggedIn ?? true,
      };
    }
    return {};
  } catch { return {}; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = useRef(loadSaved()).current;
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem("dg_lang") as Lang) || "ar"; } catch { return "ar"; }
  });
  const [tab, setTab] = useState<TabId>("home");
  const [stack, setStack] = useState<Route[]>([]);
  const [navAnim, setNavAnim] = useState<"push" | "pop">("push");
  const [garage, setGarage] = useState<GarageCar[]>(saved.garage?.length ? saved.garage : GARAGE);
  const [appts, setAppts] = useState<Appointment[]>(saved.appts ?? SEED_APPTS);
  const [draft, setDraft] = useState<Draft>(() => {
    if (saved.draft) return saved.draft;
    try { return { phone: localStorage.getItem("dg_phone") ?? "" }; } catch { return {}; }
  });
  const [step, setStep] = useState(saved.step && saved.step < 6 ? saved.step : 1);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const [bookingRef, setBookingRef] = useState("");
  const [jobStage, setJobStage] = useState(2);
  const [syncedAt, setSyncedAt] = useState(Date.now());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [chatWith, setChatWith] = useState<Advisor | null>(null);
  const [loggedIn, setLoggedIn] = useState(saved.loggedIn ?? true);
  const toastId = useRef(0);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    try { localStorage.setItem("dg_lang", lang); } catch { /* private mode */ }
  }, [lang, dir]);

  /* auto-save form progress + session + garage + booking history */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ version: LS_VERSION, garage, appts, draft, step, loggedIn }));
    } catch { /* storage full / private mode */ }
  }, [garage, appts, draft, step, loggedIn]);

  const t = useCallback((k: TKey) => tr(lang, k), [lang]);
  const L = useCallback((b: Bi) => b[lang], [lang]);
  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const toast = useCallback((msg: string, action?: ToastAction) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts.slice(-2), { id, msg, action }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), action ? 5200 : 2600);
  }, []);

  const switchTab = useCallback((tb: TabId) => {
    setTab(tb);
    setStack([]);
    setNavAnim("push");
  }, []);

  const push = useCallback((r: Route) => {
    setNavAnim("push");
    setStack((s) => [...s, r]);
  }, []);

  const pop = useCallback(() => {
    setNavAnim("pop");
    setStack((s) => s.slice(0, -1));
  }, []);

  const addVehicle = useCallback((c: GarageCar) => setGarage((g) => [c, ...g]), []);

  const refreshGarage = useCallback(() => setGarage(GARAGE), []);

  /* destructive action with undo — the appointment request is withdrawn,
     the legacy record itself is untouched (advisor gets notified) */
  const cancelAppt = useCallback((id: string) => {
    const removed = appts.find((a) => a.id === id);
    if (!removed) return;
    setAppts((list) => list.filter((a) => a.id !== id));
    toast(t("h.cancelled"), {
      label: t("c.undo"),
      onClick: () => setAppts((list) => [...list, removed].sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time))),
    });
  }, [appts, t, toast]);

  const startBooking = useCallback((p: Draft) => {
    setConfirmed(null);
    setDraft((d) => ({ phone: d.phone, ...p }));
    setStep(p.serviceId ? 2 : 1);
    setTab("book");
    setStack([]);
    setNavAnim("push");
  }, []);

  const confirmBooking = useCallback(() => {
    const appt: Appointment = {
      id: `apt-${Date.now()}`,
      serviceId: draft.serviceId ?? "routine",
      vehicleId: draft.vehicleId ?? "",
      vehicleLabel: draft.vehicleLabel,
      branchId: draft.branchId ?? "b1",
      advisorId: draft.advisorId ?? "a1",
      date: draft.date ?? "",
      time: draft.time ?? "10:00",
    };
    setAppts((a) => [...a, appt].sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time)));
    setBookingRef(`DG-${String(10000 + (Date.now() % 89999))}`);
    setConfirmed(appt);
    setStep(6);
    try { if (draft.phone) localStorage.setItem("dg_phone", draft.phone); } catch { /* noop */ }
  }, [draft]);

  const advanceJob = useCallback((): "advanced" | "ready" | "same" => {
    if (jobStage >= 4) return "same";
    const next = jobStage + 1;
    setJobStage(next);
    return next === 4 ? "ready" : "advanced";
  }, [jobStage]);

  const markSynced = useCallback(() => setSyncedAt(Date.now()), []);
  const openChat = useCallback((a: Advisor) => setChatWith(a), []);
  const closeChat = useCallback(() => setChatWith(null), []);

  const login = useCallback(() => {
    setLoggedIn(true);
    setTab("home");
    setStack([]);
  }, []);

  const logout = useCallback(() => {
    setLoggedIn(false);
    setTab("home");
    setStack([]);
    setConfirmed(null);
    setDraft((d) => ({ phone: d.phone }));
    setStep(1);
    setChatWith(null);
  }, []);

  return (
    <Ctx.Provider value={{
      lang, setLang, t, L, dir, tab, switchTab, stack, push, pop, navAnim,
      garage, addVehicle, refreshGarage, appts, cancelAppt, draft, setDraft, step, setStep, confirmed, bookingRef,
      startBooking, confirmBooking, jobStage, advanceJob, syncedAt, markSynced,
      toast, toasts, chatWith, openChat, closeChat, loggedIn, login, logout,
    }}>
      {children}
    </Ctx.Provider>
  );
}
