import { CalendarCheck, CarFront, Ellipsis, House, Warehouse } from "lucide-react";
import { cn } from "./utils/cn";
import { LanguageProvider, useLang } from "./i18n";
import { NavProvider, useNav, type TabId } from "./nav";
import { HomeScreen } from "./screens/HomeScreen";
import { ShowroomScreen, VehicleDetailScreen } from "./screens/ShowroomScreen";
import { BookScreen } from "./screens/BookScreen";
import { CarDetailScreen, GarageScreen } from "./screens/GarageScreen";
import { AddVehicleScreen } from "./screens/AddVehicleScreen";
import { AboutScreen, ContactScreen, MoreScreen, OffersScreen, ProgramScreen } from "./screens/MoreScreen";
import { ChatScreen } from "./screens/ChatScreen";

/* ============================================================================
   DOGHMAL — Tier-1 non-invasive digital wrapper (prototype)
   Mobile shell: 5-tab navigation + per-tab stack navigation, Arabic-first
   with instant EN flip, full RTL/LTR mirroring. Device chrome kept minimal
   (slim speaker slit only — no status bar).
   ============================================================================ */

function ScreenRenderer() {
  const nav = useNav();
  const { stack, tab, lastAction } = nav;
  const top = stack[stack.length - 1];

  let screen: React.ReactNode = null;
  if (tab === "home") screen = top.name === "chat" ? <ChatScreen id={top.params!.id} /> : <HomeScreen />;
  else if (tab === "showroom") screen = top.name === "vehicle" ? <VehicleDetailScreen id={top.params!.id} /> : <ShowroomScreen />;
  else if (tab === "book") screen = top.name === "chat" ? <ChatScreen id={top.params!.id} /> : <BookScreen />;
  else if (tab === "garage") {
    screen = top.name === "car" ? <CarDetailScreen id={top.params!.id} />
      : top.name === "addcar" ? <AddVehicleScreen />
      : <GarageScreen />;
  } else if (tab === "more") {
    screen = top.name === "offers" ? <OffersScreen />
      : top.name === "program" ? <ProgramScreen />
      : top.name === "about" ? <AboutScreen />
      : top.name === "contact" ? <ContactScreen />
      : <MoreScreen />;
  }

  const anim = lastAction === "push" ? "nav-push" : lastAction === "pop" ? "nav-pop" : "nav-tab";
  const key = `${tab}:${top.name}:${top.params ? JSON.stringify(top.params) : ""}:${lastAction === "tab" ? "tab" : stack.length}`;

  return (
    <div key={key} className={cn("absolute inset-0", anim)}>
      {screen}
    </div>
  );
}

/* ---------- Bottom tab bar — labels + icons flip language too ---------- */
function TabBar() {
  const nav = useNav();
  const { t } = useLang();
  const tabs: { id: TabId; icon: typeof House; label: string }[] = [
    { id: "home", icon: House, label: t.tabHome },
    { id: "showroom", icon: Warehouse, label: t.tabShowroom },
    { id: "book", icon: CalendarCheck, label: t.tabBook },
    { id: "garage", icon: CarFront, label: t.tabGarage },
    { id: "more", icon: Ellipsis, label: t.tabMore },
  ];
  // Hide on pushed screens (edge-to-edge details), keep on tab roots
  const hidden = nav.stack.length > 1 || (nav.tab === "book" && nav.step === 5);

  return (
    <nav className={cn(
      "absolute inset-x-0 bottom-0 z-40 transition-all duration-300",
      hidden ? "translate-y-[110%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
    )}>
      <div className="border-t border-black/5 bg-white/92 px-1.5 pb-5 pt-2 backdrop-blur-2xl">
        <div className="flex">
          {tabs.map((tb) => {
            const active = nav.tab === tb.id;
            return (
              <button key={tb.id} onClick={() => nav.setTab(tb.id)} aria-label={tb.label} aria-current={active ? "page" : undefined}
                className="press relative flex flex-1 flex-col items-center gap-1 py-1">
                <span className={cn("grid place-items-center rounded-full px-3.5 py-1 transition-all duration-300",
                  active ? "bg-toyota/10" : "bg-transparent")}>
                  <tb.icon className={cn("size-[21px] transition-colors", active ? "text-toyota" : "text-steel/60")} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={cn("text-[9.5px] transition-colors", active ? "font-black text-charcoal" : "font-bold text-steel/60")}>
                  {tb.label}
                </span>
                {active && <span className="absolute -bottom-0.5 size-1 rounded-full bg-toyota" />}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ---------- App shell inside the device ---------- */
function Shell() {
  const { dir, lang } = useLang();
  return (
    <div
      dir={dir}
      lang={lang}
      className={cn("relative size-full overflow-hidden bg-alu text-start", lang === "ar" ? "font-ar" : "font-en")}
    >
      <ScreenRenderer />
      <TabBar />
    </div>
  );
}

/* ---------- Desktop presentation: device floating in the showroom ---------- */
export default function App() {
  return (
    <LanguageProvider>
      <NavProvider>
        <div dir="ltr" className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#0c0c0e] font-en">
          {/* ambient showroom backdrop */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 start-[8%] size-[560px] rounded-full bg-toyota/12 blur-[130px]" />
            <div className="absolute bottom-[-20%] end-[4%] size-[620px] rounded-full bg-[#3a3a3f]/60 blur-[110px]" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(rgb(255 255 255/.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255/.5) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
          </div>

          {/* ambient captions (desktop only) */}
          <aside className="pointer-events-none absolute start-[6%] top-1/2 hidden -translate-y-1/2 xl:block select-none">
            <p className="text-[64px] font-black leading-[0.95] tracking-tight text-white/95">
              DOGH<br />MAL
              <span className="mt-1 block h-1.5 w-16 rounded-full bg-toyota" />
            </p>
            <p className="mt-5 max-w-[230px] text-[12px] font-medium leading-relaxed text-white/40">
              Customer digital wrapper — Toyota · Jetour · Haval sub-agent, Najran KSA.<br />
              Tier 1 · non-invasive · read-only DMS mirror.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {["6 branches — Najran", "Advisor-first WhatsApp flow", "عربي أولاً · English too"].map((s) => (
                <span key={s} className="w-fit rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[10.5px] font-bold text-white/60 backdrop-blur">{s}</span>
              ))}
            </div>
          </aside>

          {/* the device */}
          <div className="relative z-10">
            {/* glow pedestal */}
            <div className="pointer-events-none absolute inset-x-8 -bottom-10 h-24 rounded-full bg-toyota/25 blur-3xl" />
            <div className="relative h-[100svh] w-screen sm:h-[860px] sm:w-[400px] overflow-hidden sm:rounded-[52px] bg-charcoal sm:border-[11px] sm:border-[#2b2b2f] sm:shadow-[0_60px_120px_-30px_rgb(0_0_0/0.85),0_0_0_1px_rgb(255_255_255/0.06)]">
              {/* hardware speaker slit (no status bar) */}
              <div dir="ltr" className="pointer-events-none absolute left-1/2 top-2 z-50 hidden h-[5px] w-16 -translate-x-1/2 rounded-full bg-white/12 sm:block" />
              <Shell />
            </div>
          </div>
        </div>
      </NavProvider>
    </LanguageProvider>
  );
}
