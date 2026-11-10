import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store";
import { digits, fmtDate, fmtTime, isoPlus } from "../lib/i18n";
import { ADVISORS, SERVICES } from "../lib/data";
import { Icon, DoghmalMark } from "../components/icons";
import { AdvisorCard, ConfirmDialog, Money, SectionHead, StatusPill, branchById } from "../components/ui";

/* HOME — the wrapper's "single glance" over the legacy DMS:
   job status, vehicles, next appointment. Pull-to-refresh simulates
   re-reading the workshop system (read-only, never writing). */
export default function HomeScreen() {
  const app = useApp();
  const { t, L, lang, setLang, garage, appts, jobStage } = app;
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pullRef = useRef(0);
  const busyRef = useRef(false);
  pullRef.current = pull;

  const triggerRefresh = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setRefreshing(true);
    setPull(56);
    window.setTimeout(() => {
      const res = app.advanceJob();
      app.markSynced();
      app.refreshGarage();
      app.toast(res === "ready" ? t("h.refreshReady") : res === "advanced" ? t("h.refreshNew") : t("h.refreshSame"));
      setRefreshing(false);
      setPull(0);
      busyRef.current = false;
    }, 1400);
  };
  const triggerRef = useRef(triggerRefresh);
  triggerRef.current = triggerRefresh;

  /* pull-to-refresh: touch (non-passive so we can preventDefault) + mouse drag */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let startY = 0, startX = 0, active = false, mouse = false;

    const begin = (y: number, x: number) => {
      if (el.scrollTop <= 0 && !busyRef.current) { startY = y; startX = x; active = false; return true; }
      return false;
    };
    const move = (y: number, x: number, ev?: TouchEvent) => {
      const dy = y - startY, dx = x - startX;
      if (!active && dy > 10 && dy > Math.abs(dx) && el.scrollTop <= 0) active = true;
      if (active) {
        ev?.preventDefault();
        setPull(Math.min(92, dy * 0.45));
      }
    };
    const end = () => {
      if (active) {
        if (pullRef.current > 52) triggerRef.current();
        else setPull(0);
      }
      active = false; mouse = false;
    };

    let armed = false;
    const ts = (e: TouchEvent) => { armed = begin(e.touches[0].clientY, e.touches[0].clientX); };
    const tm = (e: TouchEvent) => { if (armed) move(e.touches[0].clientY, e.touches[0].clientX, e); };
    const te = () => { if (armed) end(); armed = false; };
    const md = (e: MouseEvent) => { if (e.button === 0) { mouse = begin(e.clientY, e.clientX); } };
    const mm = (e: MouseEvent) => { if (mouse) move(e.clientY, e.clientX); };
    const mu = () => { if (mouse) end(); };

    el.addEventListener("touchstart", ts, { passive: false });
    el.addEventListener("touchmove", tm, { passive: false });
    el.addEventListener("touchend", te);
    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", te);
      el.removeEventListener("mousedown", md);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
    };
  }, []);

  const heroCar = garage.find((g) => g.id === "g1") ?? garage[0];
  const appt = appts[0];
  const apptAdvisor = appt ? ADVISORS.find((a) => a.id === appt.advisorId) ?? ADVISORS[0] : null;
  const apptService = appt ? SERVICES.find((s) => s.id === appt.serviceId) : null;
  const done = jobStage >= 4;
  const hour = new Date().getHours();
  const dayGreeting = hour >= 5 && hour < 12 ? t("h.morning") : t("h.evening");

  const quick = [
    { icon: "wrench", tone: "text-redhi bg-red/12 border-red/20", title: t("h.q.book"), sub: t("h.q.bookSub"), go: () => app.startBooking({ serviceId: "routine" }) },
    { icon: "drop", tone: "text-warn bg-warn/12 border-warn/20", title: t("h.q.oil"), sub: t("h.q.oilSub"), go: () => app.startBooking({ serviceId: "oil" }) },
    { icon: "steering", tone: "text-info bg-info/12 border-info/20", title: t("h.q.test"), sub: t("h.q.testSub"), go: () => app.switchTab("showroom") },
    { icon: "gift", tone: "text-ok bg-ok/12 border-ok/20", title: t("h.q.offer"), sub: t("h.q.offerSub"), go: () => app.push({ name: "offers" }) },
  ];

  const dateLabel = (iso: string) =>
    iso === isoPlus(0) ? t("c.today") : iso === isoPlus(1) ? t("c.tomorrow") : fmtDate(iso, lang, { year: undefined, weekday: "long" });

  return (
    <div className="h-full relative overflow-hidden">
      {/* pull indicator */}
      <div className="absolute top-0 inset-x-0 z-10 flex flex-col items-center justify-end pointer-events-none transition-[height] duration-200"
        style={{ height: pull }}>
        {pull > 8 && (
          <div className="flex items-center gap-2 pb-2 text-mute">
            <Icon name="refresh" size={16} className={refreshing ? "spin text-redhi" : "text-silver"} strokeWidth={2.2} />
            <span className="text-[10.5px] font-bold">
              {refreshing ? t("h.refreshing") : pull > 52 ? t("h.release") : t("h.pull")}
            </span>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain select-none" style={{ overscrollBehaviorY: "contain" }}>
        <div style={{ transform: `translateY(${pull}px)`, transition: pull === 0 || refreshing ? "transform .3s cubic-bezier(.22,1,.36,1)" : "none" }}>

          {/* top bar — brand lockup + physical top-right language toggle */}
          <div dir="ltr" className="flex items-center justify-between px-4 pt-3 pb-1">
            <div className="flex items-center gap-2.5">
              <DoghmalMark size={38} />
              <div className="leading-none">
                <p className="text-[14px] font-black text-alu font-app-ar">دغمل التجارية</p>
                <p className="text-[7.5px] font-bold tracking-[0.18em] text-mute mt-1">DOGHMAL TRADING CO.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => app.push({ name: "offers" })} aria-label={t("m.offers")}
                className="press relative w-11 h-11 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-silver">
                <Icon name="bell" size={17} />
                <span className="absolute top-2.5 end-2.5 w-1.5 h-1.5 rounded-full bg-red" />
              </button>
              <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label={t("m.language")}
                className="press h-11 px-3.5 rounded-xl bg-white/6 border border-white/8 flex items-center gap-1.5 text-[11px] font-extrabold">
                <Icon name="globe" size={14} className="text-redhi" />
                <span className={lang === "ar" ? "text-alu" : "text-mute"}>ع</span>
                <span className="text-mute/50">|</span>
                <span className={lang === "en" ? "text-alu" : "text-mute"}>EN</span>
              </button>
            </div>
          </div>

          <div className="px-4 pb-30 stagger">
            {/* greeting — time-of-day + the required welcome, Saudi warmth */}
            <div className="pt-3 pb-4">
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 mb-2.5">
                <Icon name="user" size={12} className="text-redhi" />
                <span className="text-[10.5px] font-bold text-silver">{t("h.valued")}</span>
                <Icon name="star" size={10} filled className="text-warn" />
              </div>
              <p className="text-[11.5px] font-bold text-silver mb-1">{dayGreeting}</p>
              <h1 className="text-[26px] leading-tight font-black metal-text">{t("h.welcome")}</h1>
              <p className="text-[12px] text-mute font-semibold mt-1">{t("h.sub")}</p>
            </div>

            {/* live workshop job — read-only mirror of the DMS */}
            {heroCar && (
              <button onClick={() => app.push({ name: "garageCar", id: heroCar.id })}
                className="press w-full text-start relative overflow-hidden rounded-[24px] border border-white/10 mb-5 block">
                <img src={heroCar.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c20]/70 via-[#1c1c20]/88 to-[#17171a]" />
                <div className="relative p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12.5px] font-extrabold text-alu">{done ? t("h.jobDone") : t("h.jobTitle")}</p>
                    <StatusPill status={done ? "ready" : "service"} />
                  </div>
                  <p className="text-[10.5px] text-mute font-semibold mt-1">{L(heroCar.model)} {digits(heroCar.year, lang)} · {t("h.jobBranch")}</p>

                  {/* stage tracker */}
                  <div className="mt-4">
                    <div className="relative h-1 rounded-full bg-white/10">
                      <div className="absolute inset-y-0 start-0 rounded-full transition-all duration-700"
                        style={{ width: `${(jobStage / 4) * 100}%`, background: done ? "linear-gradient(90deg,#3ee6a4,#2ecc8f)" : "linear-gradient(90deg,#ff2d3d,#eb0a1a)" }} />
                    </div>
                    <div className="flex justify-between mt-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1 w-12">
                          <span className={`w-4 h-4 -mt-[26px] rounded-full border-2 flex items-center justify-center text-[8px] transition-colors duration-500 ${i <= jobStage ? (done ? "bg-ok border-ok text-ink" : "bg-red border-red text-white") : "bg-panel border-white/20 text-transparent"}`}>
                            <Icon name="check" size={8} strokeWidth={4} />
                          </span>
                          <span className={`text-[8.5px] font-bold ${i <= jobStage ? "text-alu" : "text-mute/70"}`}>{t(`h.stage${i}` as "h.stage0")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-silver">
                      <Icon name="clock" size={13} className={done ? "text-ok" : "text-redhi"} />
                      {t("h.eta")}: {done ? t("h.etaDone") : t("h.etaVal")}
                    </span>
                    <Icon name={app.dir === "rtl" ? "chevL" : "chevR"} size={15} className="text-mute" />
                  </div>
                </div>
              </button>
            )}

            {/* quick actions */}
            <div>
              <SectionHead title={t("h.quick")} />
              <div className="flex gap-2.5 overflow-x-auto no-sb -mx-4 px-4 pb-1">
                {quick.map((q) => (
                  <button key={q.title} onClick={q.go}
                    className="press shrink-0 w-[128px] card-sheen border border-white/8 rounded-[20px] p-3.5 text-start">
                    <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${q.tone}`}>
                      <Icon name={q.icon} size={19} />
                    </span>
                    <p className="text-[12.5px] font-extrabold text-alu mt-2.5">{q.title}</p>
                    <p className="text-[9.5px] text-mute font-semibold mt-0.5 leading-snug">{q.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* my vehicles carousel */}
            <div className="mt-5">
              <SectionHead title={t("h.myVehicles")} action={t("c.seeAll")} onAction={() => app.switchTab("garage")} />
              <div className="flex gap-3 overflow-x-auto no-sb -mx-4 px-4 pb-1 snap-x snap-mandatory">
                {garage.map((g) => (
                  <button key={g.id} onClick={() => app.push({ name: "garageCar", id: g.id })}
                    className="press shrink-0 w-[248px] snap-start card-sheen border border-white/8 rounded-[22px] overflow-hidden text-start">
                    <div className="relative h-28">
                      <img src={g.img} alt={L(g.model)} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      {(g.id === "g1" || g.status) && (
                        <span className="absolute top-2.5 start-2.5">
                          <StatusPill small status={g.id === "g1" ? (done ? "ready" : "service") : (g.status as "service" | "ready")} />
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13.5px] font-extrabold text-alu truncate">{L(g.nickname)}</p>
                        <span className="text-[10px] font-bold text-mute shrink-0">{digits(g.year, lang)}</span>
                      </div>
                      <p className="text-[10.5px] text-mute font-semibold">{L(g.model)}</p>
                      <p className="text-[8.5px] font-mono text-mute/70 mt-1 tracking-wide" dir="ltr">VIN ···{g.vin ? g.vin.slice(-6) : "——————"}</p>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/6">
                        <div>
                          <p className="text-[8.5px] text-mute font-bold">{t("h.lastService")}</p>
                          <p className="text-[10.5px] font-extrabold text-silver mt-0.5">{fmtDate(g.history[0]?.date ?? isoPlus(-30), lang, { year: undefined })}</p>
                        </div>
                        <div className="text-end">
                          <p className="text-[8.5px] text-mute font-bold">{t("h.nextMaint")}</p>
                          <p className="text-[10.5px] font-extrabold text-redhi mt-0.5" dir="ltr">{digits(g.nextKm.toLocaleString("en-US"), lang)} {t("c.km")}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* upcoming appointment + advisor humanization */}
            <div className="mt-5">
              <SectionHead title={t("h.upcoming")} />
              {appt && apptAdvisor && apptService ? (
                <div className="card-sheen border border-white/8 rounded-[22px] p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 shrink-0 rounded-2xl btn-red text-white text-center py-2 shadow-lg">
                      <p className="text-[20px] font-black leading-none tabular-nums">{digits(Number(appt.date.slice(8, 10)), lang)}</p>
                      <p className="text-[8.5px] font-bold mt-1 opacity-90">{fmtDate(appt.date, lang, { day: undefined, year: undefined, month: "short" })}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-extrabold text-alu">{t(`sv.${appt.serviceId}` as "sv.oil")} · {dateLabel(appt.date)}</p>
                      <p className="text-[11px] text-silver font-bold mt-0.5">{fmtTime(appt.time, lang)} · {L(branchById(appt.branchId).name)}</p>
                      <p className="text-[9.5px] text-mute font-semibold mt-0.5 truncate">
                        {appt.vehicleLabel ? L(appt.vehicleLabel) : L(garage.find((g) => g.id === appt.vehicleId)?.nickname ?? { ar: "سيارتك", en: "Your car" })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3.5">
                    <p className="text-[9.5px] font-bold text-mute mb-2">{t("h.advisorAssigned")}</p>
                    <AdvisorCard advisor={apptAdvisor} compact />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => app.switchTab("book")}
                      className="press flex-1 min-h-[40px] text-[11px] font-bold text-silver bg-white/5 border border-white/10 rounded-xl">
                      {t("c.edit")}
                    </button>
                    <button onClick={() => setCancelOpen(true)}
                      className="press flex-1 min-h-[40px] text-[11px] font-bold text-redhi bg-red/8 border border-red/25 rounded-xl">
                      {t("h.cancelAppt")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card-sheen border border-white/8 rounded-[22px] p-5 text-center fade-up">
                  <span className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-mute">
                    <Icon name="calendar" size={22} />
                  </span>
                  <p className="text-[13px] font-extrabold text-alu mt-3">{t("h.noAppt")}</p>
                  <p className="text-[11px] text-mute font-semibold mt-1">{t("h.noApptSub")}</p>
                  <button onClick={() => app.startBooking({})} className="press btn-red text-white text-[12px] font-bold rounded-xl px-4 py-2.5 min-h-[44px] mt-3">{t("h.bookNow")}</button>
                </div>
              )}
            </div>

            {/* campaign banner */}
            <button onClick={() => app.push({ name: "offers" })}
              className="press w-full mt-5 relative overflow-hidden rounded-[22px] text-start btn-red p-4 block">
              <div className="absolute -end-6 -top-8 w-36 h-36 rounded-full bg-white/10" />
              <div className="absolute -end-2 top-8 w-20 h-20 rounded-full bg-white/10" />
              <div className="relative flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0">
                  <Icon name="sparkles" size={22} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-white">{t("h.offerTitle")}</p>
                  <p className="text-[10.5px] font-bold text-white/85 mt-0.5 leading-snug">{t("h.offerSub")}</p>
                </div>
                <span className="shrink-0 bg-white text-red text-[10.5px] font-black rounded-full px-3 py-1.5">{t("h.offerCta")}</span>
              </div>
            </button>

            {/* sync stamp — the non-invasive promise, visible */}
            <div className="flex items-center justify-center gap-1.5 mt-6 text-mute/80">
              <Icon name="refresh" size={11} />
              <span className="text-[9px] font-bold">{t("h.sync")} · {t("h.syncNow")}</span>
            </div>

            {/* financing teaser to keep the money story present */}
            <div className="mt-4 flex items-center justify-between card-sheen border border-white/8 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Icon name="card" size={17} className="text-info" />
                <div>
                  <p className="text-[11px] font-extrabold text-alu">{t("v.finance")}</p>
                  <p className="text-[9px] text-mute font-semibold">{t("v.financeSub")}</p>
                </div>
              </div>
              <Money n={1240} className="text-[13px] font-black text-alu" />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        icon="calendar"
        title={t("h.cancelQ")}
        body={t("h.cancelBody")}
        confirmLabel={t("h.cancelAppt")}
        cancelLabel={t("m.stay")}
        danger
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => { setCancelOpen(false); if (appt) app.cancelAppt(appt.id); }}
      />
    </div>
  );
}
