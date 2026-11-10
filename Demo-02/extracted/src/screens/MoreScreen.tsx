import { useState } from "react";
import {
  BadgePercent, CalendarRange, ChevronRight, Clock, Globe, Info, LogOut,
  Mail, MapPin, Phone, Sparkles,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useLang, fmtNum } from "../i18n";
import { useNav } from "../nav";
import { BRANCHES, IMG, OFFERS, PACKAGES, waLink } from "../data";
import { DoghmalMark, SubHeader } from "../components";

/* ============================================================================
   MORE — settings hub. Language lives here too (AR↔EN), offers, the periodic
   maintenance program, about, contact, and logout. All read-only mirrors.
   ============================================================================ */

export function MoreScreen() {
  const { t, lang, setLang } = useLang();
  const nav = useNav();
  const [confirmOut, setConfirmOut] = useState(false);

  const rows = [
    { icon: BadgePercent, label: t.offers, sub: t.offersSub, tint: "bg-toyota/10 text-toyota", act: () => nav.push("offers") },
    { icon: CalendarRange, label: t.program, sub: lang === "ar" ? "باقات صيانة مدفوعة مقدماً" : "Prepaid maintenance packages", tint: "bg-charcoal/8 text-charcoal", act: () => nav.push("program") },
    { icon: Info, label: t.about, sub: lang === "ar" ? "قصتنا من 1998" : "Our story since 1998", tint: "bg-charcoal/8 text-charcoal", act: () => nav.push("about") },
    { icon: Phone, label: t.contact, sub: lang === "ar" ? "الرقم الموحد والواتساب" : "Unified number & WhatsApp", tint: "bg-charcoal/8 text-charcoal", act: () => nav.push("contact") },
  ];

  return (
    <div className="absolute inset-0 bg-alu">
    <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-28">
      <header className="carbon relative overflow-hidden rounded-b-[30px] px-4 pt-10 pb-6 text-white">
        <div className="pointer-events-none absolute -top-12 -end-8 size-44 rounded-full bg-toyota/25 blur-2xl" />
        <h1 className="text-start text-[21px] font-black rise">{t.more}</h1>
        {/* profile + loyalty card */}
        <div className="mt-4 rounded-[22px] bg-white/8 border border-white/10 p-3.5 backdrop-blur rise rise-1">
          <div className="flex items-center gap-3">
            <div className="relative">
              <DoghmalMark dark size={46} />
              <span className="absolute -bottom-1 -end-1 grid size-4 place-items-center rounded-full bg-emerald-500 text-[8px] font-black">✓</span>
            </div>
            <div className="text-start">
              <p className="text-[14.5px] font-extrabold">{t.guest}</p>
              <p className="text-[10.5px] font-medium text-white/55">{t.memberSince}</p>
            </div>
            <Sparkles className="ms-auto size-4 text-toyota" />
          </div>
          {/* loyalty: Doghmal Points — silver tier, 760 short of gold */}
          <div className="mt-3.5 rounded-2xl bg-black/25 p-3">
            <div className="flex items-center justify-between text-start">
              <p className="text-[10px] font-bold text-white/60">{t.loyaltyTitle} · {t.loyaltyTier}</p>
              <p className="text-[11.5px] font-black text-white tabular">1,240 <span className="text-[8.5px] font-bold text-white/55">{t.loyaltyUnit}</span></p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-toyota to-[#ff5a66]" />
            </div>
            <p className="mt-1.5 text-[9px] font-bold text-white/50 tabular">760 {t.loyaltyToGold}</p>
          </div>
        </div>
      </header>

      {/* session booking history — in-app only, no backend */}
      {nav.bookings.length > 0 && (
        <section className="mt-4 px-4 rise rise-1">
          <div className="rounded-[22px] bg-white p-3.5 shadow-card">
            <p className="text-start text-[10px] font-black tracking-wide text-steel/55">{t.lastBookings}</p>
            {nav.bookings.slice(0, 2).map((b) => {
              const svcLabels: Record<string, string> = {
                routine: t.svcRoutine, oil: t.svcOil, electrical: t.svcElectrical,
                general: t.svcGeneral, testdrive: t.svcTestDrive,
              };
              return (
                <div key={b.ref} className="mt-2 flex items-center gap-2.5 rounded-2xl bg-alu px-3 py-2 text-start">
                  <span className="rounded-full bg-charcoal px-2 py-0.5 font-en text-[9.5px] font-black tracking-wider text-white">{b.ref}</span>
                  <span className="min-w-0 flex-1 truncate text-[10.5px] font-bold text-charcoal">
                    {svcLabels[b.serviceKey] ?? b.serviceKey} · {lang === "ar" ? b.branchAr : b.branchEn}
                  </span>
                  <span className="shrink-0 text-[9px] font-bold text-steel/55 tabular">{b.when}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Language toggle row */}
      <section className="mt-4 px-4 rise rise-1">
        <div className="flex items-center gap-3 rounded-[22px] bg-white p-3.5 shadow-card">
          <span className="grid size-10 place-items-center rounded-2xl bg-charcoal text-white"><Globe className="size-4.5" /></span>
          <p className="text-start text-[13px] font-extrabold text-charcoal">{t.language}</p>
          {/* segmented AR / EN — flips direction app-wide instantly */}
          <div className="ms-auto flex rounded-full bg-alu-deep p-1">
            {(["ar", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={cn("press rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-all",
                  lang === l ? "bg-charcoal text-white shadow-card" : "text-steel/60")}>
                {l === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu rows */}
      <section className="mt-4 flex flex-col gap-2.5 px-4">
        {rows.map((r, i) => (
          <button key={r.label} onClick={r.act}
            className={cn("press-soft flex items-center gap-3 rounded-[22px] bg-white p-3.5 text-start shadow-card", i === 0 ? "rise rise-2" : i === 1 ? "rise rise-3" : "rise rise-4")}>
            <span className={cn("grid size-10 place-items-center rounded-2xl", r.tint)}><r.icon className="size-4.5" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-extrabold text-charcoal">{r.label}</span>
              <span className="block truncate text-[10px] font-semibold text-steel/55">{r.sub}</span>
            </span>
            <ChevronRight className="size-4 text-steel/35 rtl-mirror" />
          </button>
        ))}

        {/* Logout */}
        <button onClick={() => setConfirmOut(true)}
          className="press-soft flex items-center gap-3 rounded-[22px] border border-toyota/20 bg-toyota/5 p-3.5 text-start">
          <span className="grid size-10 place-items-center rounded-2xl bg-toyota/12 text-toyota"><LogOut className="size-4.5 rtl-mirror" /></span>
          <span className="text-[13px] font-extrabold text-toyota">{t.logout}</span>
        </button>
      </section>

      {/* non-invasive layer footer note */}
      <p className="mx-6 mt-6 text-center text-[9.5px] font-semibold leading-relaxed text-steel/45">
        {t.layerNote} · v1.0 Tier-1
      </p>
    </div>

    {/* logout confirm sheet — anchored to the screen, above the tab bar */}
    {confirmOut && (
      <div className="absolute inset-0 z-40 flex items-end justify-center bg-charcoal/50 backdrop-blur-sm" onClick={() => setConfirmOut(false)}>
        <div className="mx-4 mb-24 w-full max-w-[340px] rounded-[26px] bg-white p-5 shadow-pop rise" onClick={(e) => e.stopPropagation()}>
          <p className="text-center text-[14.5px] font-extrabold text-charcoal">{t.logoutConfirm}</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button onClick={() => setConfirmOut(false)} className="press rounded-[16px] bg-alu py-3 text-[12.5px] font-extrabold text-charcoal">{t.cancel}</button>
            <button onClick={() => { setConfirmOut(false); nav.setTab("home"); }}
              className="press rounded-[16px] bg-toyota py-3 text-[12.5px] font-extrabold text-white shadow-red">{t.exit}</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

/* ============================================================================
   OFFERS & CAMPAIGNS (pushed)
   ============================================================================ */
export function OffersScreen() {
  const { t, lang } = useLang();
  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader title={t.offers} sub={t.offersSub} />
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-28">
        <div className="flex flex-col gap-3.5">
          {OFFERS.map((o, i) => (
            <article key={o.id} className={cn("overflow-hidden rounded-[24px] bg-white shadow-card", i === 0 ? "rise" : i === 1 ? "rise rise-2" : "rise rise-3")}>
              <div className="relative h-[132px]">
                <img src={o.img} alt={o.titleEn} className="size-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10" />
                <span className={cn("absolute start-3 top-3 rounded-full px-2.5 py-1 text-[9.5px] font-black text-white", o.red ? "bg-toyota" : "bg-charcoal/85 backdrop-blur")}>
                  {lang === "ar" ? o.tagAr : o.tagEn}
                </span>
                {/* expiry countdown chip — campaign urgency */}
                <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9.5px] font-black text-charcoal backdrop-blur tabular">
                  <Clock className="size-3 text-toyota" />
                  {t.expiresIn} {o.daysLeft} {t.days}
                </span>
                <p className="absolute bottom-2.5 start-3 end-3 text-start text-[14.5px] font-black leading-snug text-white">
                  {lang === "ar" ? o.titleAr : o.titleEn}
                </p>
              </div>
              <div className="p-3.5 text-start">
                <p className="text-[11px] font-semibold leading-relaxed text-steel/70">{lang === "ar" ? o.descAr : o.descEn}</p>
                <a target="_blank" rel="noreferrer"
                  href={waLink("966551112233", lang === "ar" ? `أبغى أستفيد من عرض: ${o.titleAr}` : `I'd like the offer: ${o.titleEn}`)}
                  className="press mt-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-[11px] font-extrabold text-white">
                  {lang === "ar" ? "اطلب العرض بالواتساب" : "Claim on WhatsApp"} <ChevronRight className="size-3.5 rtl-mirror" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   PERIODIC MAINTENANCE PROGRAM (pushed)
   ============================================================================ */
export function ProgramScreen() {
  const { t, lang } = useLang();
  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader title={t.program} sub={t.programSub} />
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-28">
        <div className="relative mb-4 overflow-hidden rounded-[24px] shadow-card">
          <img src={IMG.workshop1} alt="workshop" className="h-[130px] w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20" />
          <p className="absolute bottom-3 start-4 end-4 text-start text-[15px] font-black text-white">{t.programTitle}</p>
        </div>
        <div className="flex flex-col gap-3.5">
          {PACKAGES.map((p, i) => (
            <article key={p.id} className={cn("rounded-[24px] bg-white p-4 shadow-card", i === 0 ? "rise" : i === 1 ? "rise rise-2" : "rise rise-3")}>
              <div className="flex items-start justify-between gap-3">
                <div className="text-start">
                  <p className="text-[14.5px] font-black text-charcoal">{lang === "ar" ? p.nameAr : p.nameEn}</p>
                  <p className="mt-0.5 text-[10.5px] font-bold text-steel/55">{p.visits} {t.visits}</p>
                </div>
                <div className="text-end">
                  <p className="text-[17px] font-black text-toyota tabular">{fmtNum(p.price)}</p>
                  <p className="text-[9.5px] font-bold text-steel/55">{t.sar}</p>
                </div>
              </div>
              <p className="mt-3 text-[10.5px] font-black text-steel/50">{t.includes}:</p>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {(lang === "ar" ? p.itemsAr : p.itemsEn).map((it) => (
                  <li key={it} className="flex items-center gap-2 text-[11.5px] font-semibold text-charcoal/80">
                    <span className="grid size-4 place-items-center rounded-full bg-emerald-500/12 text-[8px] font-black text-emerald-700">✓</span>
                    {it}
                  </li>
                ))}
              </ul>
              <a target="_blank" rel="noreferrer"
                href={waLink("966551112233", lang === "ar" ? `أبي أشترك في ${p.nameAr}` : `I want the ${p.nameEn}`)}
                className="press mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-[16px] bg-charcoal py-3 text-[12px] font-extrabold text-white">
                {t.subscribe} <ChevronRight className="size-4 rtl-mirror" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ABOUT (pushed)
   ============================================================================ */
export function AboutScreen() {
  const { t, lang } = useLang();
  const stats = [
    { v: "6", k: t.statBranches },
    { v: "28+", k: t.statYears },
    { v: "40K+", k: t.statCustomers },
  ];
  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader title={t.about} sub={t.najran} />
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-28">
        <div className="relative overflow-hidden rounded-[26px] shadow-card rise">
          <img src={IMG.showroomHall} alt="Doghmal showroom" className="h-[170px] w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/15" />
          <div className="absolute bottom-3 start-4 flex items-center gap-2.5">
            <DoghmalMark size={38} />
            <div className="text-start text-white">
              <p className="text-[14px] font-black">{t.aboutTitle}</p>
              <p className="text-[9.5px] font-semibold text-white/70">{t.brandLine}</p>
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-[22px] bg-white p-4 text-start text-[12px] font-semibold leading-[1.9] text-charcoal/85 shadow-card rise rise-1">
          {t.aboutBody}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5 rise rise-2">
          {stats.map((s) => (
            <div key={s.k} className="rounded-[20px] carbon p-3.5 text-center text-white shadow-card">
              <p className="font-en text-[19px] font-black text-toyota tabular">{s.v}</p>
              <p className="mt-0.5 text-[9.5px] font-bold text-white/70">{s.k}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-white p-4 shadow-card rise rise-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-charcoal text-white"><MapPin className="size-4.5" /></span>
          <div className="text-start">
            <p className="text-[12px] font-extrabold text-charcoal">{t.hq}</p>
            <p className="text-[10.5px] font-semibold text-steel/60">
              {lang === "ar" ? "نجران — حي الدهدة، طريق الملك خالد" : "Najran — Al-Dahdah, King Khalid Rd."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   CONTACT (pushed)
   ============================================================================ */
export function ContactScreen() {
  const { t, lang } = useLang();
  const items = [
    { icon: Phone, label: t.unified, value: "9200 01 234", href: "tel:920001234", tint: "bg-charcoal text-white" },
    { icon: Mail, label: t.email, value: "care@doghmal.sa", href: "mailto:care@doghmal.sa", tint: "bg-charcoal/8 text-charcoal" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col bg-alu">
      <SubHeader title={t.contact} sub={t.contactTitle} />
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-28">
        <div className="flex flex-col gap-2.5">
          <a target="_blank" rel="noreferrer"
            href={waLink("966551112233", lang === "ar" ? "السلام عليكم، عندي استفسار" : "Hi, I have a question")}
            className="press flex items-center gap-3 rounded-[22px] bg-wa/10 border border-wa/25 p-4 text-start rise">
            <span className="grid size-11 place-items-center rounded-2xl bg-wa text-white">
              <svg viewBox="0 0 24 24" className="size-5 fill-current"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1c0 1.3.9 2.5 1 2.6s1.9 3 4.7 4.1c1.7.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.2-.2-.2-.6-.4Z"/></svg>
            </span>
            <span className="flex-1">
              <span className="block text-[13px] font-extrabold text-charcoal">{lang === "ar" ? "واتساب دغمل" : "Doghmal WhatsApp"}</span>
              <span className="block text-[10.5px] font-bold text-emerald-700">{t.repliesIn}</span>
            </span>
            <ChevronRight className="size-4 text-steel/35 rtl-mirror" />
          </a>

          {items.map((it, i) => (
            <a key={it.label} href={it.href}
              className={cn("press flex items-center gap-3 rounded-[22px] bg-white p-4 text-start shadow-card", i === 0 ? "rise rise-1" : "rise rise-2")}>
              <span className={cn("grid size-11 place-items-center rounded-2xl", it.tint)}><it.icon className="size-4.5" /></span>
              <span className="flex-1">
                <span className="block text-[10.5px] font-bold text-steel/55">{it.label}</span>
                <span className="block text-[13.5px] font-extrabold text-charcoal tabular">{it.value}</span>
              </span>
              <ChevronRight className="size-4 text-steel/35 rtl-mirror" />
            </a>
          ))}

          <div className="flex items-center gap-3 rounded-[22px] bg-white p-4 text-start shadow-card rise rise-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-charcoal/8 text-charcoal"><Clock className="size-4.5" /></span>
            <span>
              <span className="block text-[10.5px] font-bold text-steel/55">{t.workingHours}</span>
              <span className="block text-[12.5px] font-extrabold text-charcoal">{t.workingHoursV}</span>
            </span>
          </div>

          {/* the six Najran branches with real addresses + drive ETAs */}
          <div className="rounded-[22px] bg-white p-4 shadow-card rise rise-4">
            <p className="text-start text-[11px] font-black text-charcoal">{t.branchesTitle}</p>
            <div className="mt-2 flex flex-col divide-y divide-black/5">
              {BRANCHES.map((b) => (
                <div key={b.id} className="flex items-center gap-2.5 py-2.5 text-start">
                  <MapPin className="size-3.5 shrink-0 text-toyota" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-extrabold text-charcoal">{lang === "ar" ? b.nameAr : b.nameEn}</span>
                    <span className="block text-[9px] font-semibold text-steel/55">{lang === "ar" ? b.addrAr : b.addrEn}</span>
                  </span>
                  <span className="shrink-0 text-[9px] font-bold text-steel/50 tabular">
                    {b.distKm} {t.kmAway} · ≈{Math.round(b.distKm * 2.4)} {t.driveMin}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* map placeholder — stylized, charcoal */}
          <div className="relative mt-1 h-[120px] overflow-hidden rounded-[22px] carbon shadow-card rise rise-4">
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "linear-gradient(rgb(255 255 255/.12) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255/.12) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-2 rounded-full bg-toyota px-3.5 py-2 text-[11px] font-extrabold text-white shadow-red">
                <MapPin className="size-3.5" /> {t.najran}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
