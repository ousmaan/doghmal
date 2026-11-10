import { useState } from "react";
import { AppProvider, useApp, type Route, type TabId } from "./lib/store";
import { OverlayRoot, Toasts, Btn } from "./components/ui";
import { Icon, DoghmalMark } from "./components/icons";
import ChatSheet from "./components/ChatSheet";
import HomeScreen from "./screens/HomeScreen";
import ShowroomScreen from "./screens/ShowroomScreen";
import VehicleDetailScreen from "./screens/VehicleDetailScreen";
import BookScreen from "./screens/BookScreen";
import GarageScreen from "./screens/GarageScreen";
import GarageDetailScreen from "./screens/GarageDetailScreen";
import MoreScreen, { OffersScreen, ProgramScreen, AboutScreen, ContactScreen } from "./screens/MoreScreen";

export default function App() {
  return (
    <AppProvider>
      <Stage />
    </AppProvider>
  );
}

function Stage() {
  const { lang, dir } = useApp();
  return (
    <div dir={dir}
      className={`${lang === "ar" ? "font-app-ar" : "font-app-en"} relative min-h-dvh stage-bg grain overflow-hidden sm:flex sm:items-center sm:justify-center sm:gap-16 sm:p-6`}>
      <div className="absolute inset-0 stage-grid pointer-events-none hidden sm:block" />
      <SidePanel />
      <Phone />
    </div>
  );
}

/* Desktop presentation stage — the prototype sells itself */
function SidePanel() {
  const { lang } = useApp();
  const ar = lang === "ar";
  const bullets = ar
    ? [
        { icon: "pin", text: "٦ فروع بنجران — الدهدة، الملك عبد العزيز، السنيعة، الغويلة، الفيصلية، الحضن" },
        { icon: "car", text: "تويوتا · هافال · جيتور · GWM — جديد ومستعمل مفحوص" },
        { icon: "refresh", text: "طبقة رقمية (Tier 1) تقرأ من أنظمة الورشة الحالية ولا تستبدلها" },
        { icon: "shield", text: "مستشار حقيقي خلف كل حجز — محادثة داخل التطبيق أو واتساب" },
      ]
    : [
        { icon: "pin", text: "6 branches across Najran — always minutes away" },
        { icon: "car", text: "Toyota · Haval · Jetour · GWM — new & certified pre-owned" },
        { icon: "refresh", text: "A Tier 1 digital layer that reads legacy systems, never replaces them" },
        { icon: "shield", text: "A human advisor behind every booking — in-app chat or WhatsApp" },
      ];
  return (
    <aside className="hidden lg:block relative z-10 w-[360px] shrink-0">
      <div className="flex items-center gap-3">
        <DoghmalMark size={52} />
        <div>
          <p className="text-[20px] font-black text-alu font-app-ar">دغمل التجارية</p>
          <p className="text-[9px] font-bold tracking-[0.24em] text-mute mt-1">DOGHMAL TRADING CO. LTD</p>
        </div>
      </div>
      <h1 className="text-[34px] leading-[1.25] font-black metal-text mt-7">
        {ar ? "وكالتك… بجيبك." : "Your dealership, in your pocket."}
      </h1>
      <p className="text-[13px] text-mute font-semibold leading-relaxed mt-3">
        {ar
          ? "نموذج تفاعلي عالي الدقة لتطبيق عملاء دغمل — وكيل تويوتا الفرعي المعتمد بنجران."
          : "A high-fidelity customer app prototype for Doghmal — Najran's authorized Toyota sub-agent."}
      </p>
      <ul className="mt-6 space-y-3.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-red/10 border border-red/20 text-redhi flex items-center justify-center shrink-0">
              <Icon name={b.icon} size={15} />
            </span>
            <span className="text-[12px] text-silver font-semibold leading-relaxed pt-1">{b.text}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mt-7">
        {["Tier 1 · Non-invasive", "عربي ⇄ English", "RTL / LTR", "WhatsApp-first"].map((c) => (
          <span key={c} className="text-[10px] font-bold text-mute bg-white/4 border border-white/10 rounded-full px-3 py-1.5">{c}</span>
        ))}
      </div>
      <p className="text-[10.5px] text-mute/70 font-bold mt-6 flex items-center gap-1.5">
        <Icon name="refresh" size={12} />
        {ar ? "جرّب: اسحب الرئيسية للتحديث، وبدّل اللغة من فوق" : "Try: pull down on Home, toggle the language up top"}
      </p>
    </aside>
  );
}

function Phone() {
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const { loggedIn } = useApp();
  return (
    <div className="relative z-10 w-full h-dvh pt-[env(safe-area-inset-top)] sm:pt-4 sm:w-[396px] sm:h-[min(860px,calc(100dvh-44px))] sm:rounded-[50px] sm:border-[9px] sm:border-[#232327] sm:ring-1 sm:ring-white/10 bg-ink overflow-hidden flex flex-col sm:shadow-[0_50px_140px_-30px_rgba(0,0,0,0.95),0_0_90px_-40px_rgba(235,10,26,0.4)]">
      <div ref={setRootEl} className="relative flex-1 overflow-hidden text-alu">
        <OverlayRoot.Provider value={rootEl}>
          {loggedIn ? <AppBody /> : <LoginScreen />}
          <ChatSheet />
          <Toasts />
        </OverlayRoot.Provider>
      </div>
    </div>
  );
}

function renderRoute(r: Route) {
  switch (r.name) {
    case "vehicle": return <VehicleDetailScreen id={r.id} />;
    case "garageCar": return <GarageDetailScreen id={r.id} />;
    case "offers": return <OffersScreen />;
    case "program": return <ProgramScreen />;
    case "about": return <AboutScreen />;
    case "contact": return <ContactScreen />;
  }
}

function AppBody() {
  const app = useApp();
  const top = app.stack[app.stack.length - 1];
  const stackKey = top ? `${top.name}-${"id" in top ? top.id : ""}-${app.stack.length}` : "root";
  return (
    <>
      {/* screen viewport — tab bar stays reachable, stacks push above.
          Each tab gets its own stacking context so its sticky header
          can never float above a pushed stack screen. */}
      <div className="absolute inset-x-0 top-0 bottom-[78px]">
        <div className={app.tab === "home" ? "relative z-0 h-full" : "hidden"}><HomeScreen /></div>
        <div className={app.tab === "showroom" ? "relative z-0 h-full" : "hidden"}><ShowroomScreen /></div>
        <div className={app.tab === "book" ? "relative z-0 h-full" : "hidden"}><BookScreen /></div>
        <div className={app.tab === "garage" ? "relative z-0 h-full" : "hidden"}><GarageScreen /></div>
        <div className={app.tab === "more" ? "relative z-0 h-full" : "hidden"}><MoreScreen /></div>
        {top && (
          <div key={stackKey} className={`absolute inset-0 z-20 bg-ink ${app.navAnim === "push" ? "screen-enter" : "screen-back"}`}>
            {renderRoute(top)}
          </div>
        )}
      </div>
      <TabBar />
    </>
  );
}

function TabBar() {
  const app = useApp();
  const { t, lang } = app;
  const tabs: { id: TabId; icon: string; label: string }[] = [
    { id: "home", icon: "home", label: t("nav.home") },
    { id: "showroom", icon: "car", label: t("nav.showroom") },
    { id: "book", icon: "calendar", label: t("nav.book") },
    { id: "garage", icon: "key", label: t("nav.garage") },
    { id: "more", icon: "grid", label: t("nav.more") },
  ];
  return (
    <nav aria-label={lang === "ar" ? "التنقل الرئيسي" : "Main navigation"}
      className="absolute bottom-0 inset-x-0 h-[78px] z-40 bg-[#151517]/95 backdrop-blur-xl border-t border-white/6 flex items-stretch px-1.5 pb-2.5 pt-2">
      {tabs.map((tb) => {
        const active = app.tab === tb.id;
        if (tb.id === "book") {
          return (
            <button key={tb.id} onClick={() => app.switchTab("book")} aria-current={active ? "page" : undefined}
              className="press flex-1 flex flex-col items-center justify-end relative">
              <span className={`absolute -top-7 w-[52px] h-[52px] rounded-full btn-red flex items-center justify-center text-white border-4 border-ink transition-shadow ${active ? "shadow-[0_0_24px_rgba(235,10,26,0.65)]" : "shadow-[0_8px_20px_-6px_rgba(235,10,26,0.55)]"}`}>
                <Icon name="calendar" size={22} strokeWidth={2} />
              </span>
              <span className={`text-[9px] font-extrabold ${active ? "text-redhi" : "text-mute"}`}>{tb.label}</span>
            </button>
          );
        }
        return (
          <button key={tb.id} onClick={() => app.switchTab(tb.id)} aria-current={active ? "page" : undefined}
            className="press flex-1 flex flex-col items-center justify-center gap-1 relative">
            <span className={`absolute top-0 w-7 h-[3px] rounded-full transition-all ${active ? "bg-red opacity-100" : "opacity-0"}`} />
            <Icon name={tb.icon} size={21} strokeWidth={active ? 2.1 : 1.8} className={active ? "text-redhi" : "text-mute"} />
            <span className={`text-[9px] font-extrabold leading-none ${active ? "text-alu" : "text-mute"}`}>{tb.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* Guest-first login (mock Nafath — the Saudi SSO everyone knows) */
function LoginScreen() {
  const app = useApp();
  const { t, lang, setLang } = app;
  return (
    <div className="h-full relative overflow-hidden flex flex-col items-center justify-center px-8 text-center">
      <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-red/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -start-24 w-72 h-72 rounded-full bg-info/8 blur-3xl pointer-events-none" />
      <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label={t("m.language")}
        className="press absolute top-4 right-4 h-11 px-3.5 rounded-xl bg-white/6 border border-white/8 flex items-center gap-1.5 text-[11px] font-extrabold" dir="ltr">
        <Icon name="globe" size={14} className="text-redhi" />
        <span className={lang === "ar" ? "text-alu" : "text-mute"}>ع</span>
        <span className="text-mute/50">|</span>
        <span className={lang === "en" ? "text-alu" : "text-mute"}>EN</span>
      </button>

      <div className="float-slow"><DoghmalMark size={84} /></div>
      <h1 className="text-[26px] font-black metal-text mt-7">{t("l.welcome")}</h1>
      <p className="text-[12.5px] text-mute font-semibold mt-2">{t("l.sub")}</p>

      <div className="w-full space-y-2.5 mt-8">
        <Btn className="w-full" onClick={() => { app.login(); app.toast(t("l.hello")); }}>
          <Icon name="user" size={17} /> {t("l.guest")}
        </Btn>
        <Btn variant="dark" className="w-full" onClick={() => app.toast(t("l.nafathNote"))}>
          <Icon name="shield" size={17} className="text-ok" /> {t("l.nafath")}
        </Btn>
      </div>
      <p className="text-[9.5px] text-mute/70 font-bold mt-6 flex items-center gap-1.5">
        <Icon name="shield" size={11} /> {t("l.demoNote")}
      </p>
    </div>
  );
}
