import { useState } from "react";
import { useApp, openWhatsApp } from "../lib/store";
import { digits, fill, isoPlus, fmtDate } from "../lib/i18n";
import { ADVISORS, BRANCHES, MECHANIC_IMG, OFFERS, PROGRAM_TIERS } from "../lib/data";
import { Icon, DoghmalMark, WhatsAppIcon } from "../components/icons";
import { AvailabilityChip, Btn, ConfirmDialog, Money, ProgressBar, ScreenHeader, WaButton } from "../components/ui";

export default function MoreScreen() {
  const app = useApp();
  const { t, lang, setLang } = app;
  const [logoutOpen, setLogoutOpen] = useState(false);

  const rows = [
    { icon: "gift", tone: "text-redhi bg-red/12", label: t("m.offers"), sub: t("m.offersSub"), go: () => app.push({ name: "offers" }) },
    { icon: "calendar", tone: "text-ok bg-ok/12", label: t("m.program"), sub: t("m.programSub"), go: () => app.push({ name: "program" }) },
    { icon: "info", tone: "text-info bg-info/12", label: t("m.about"), sub: t("m.aboutSub"), go: () => app.push({ name: "about" }) },
    { icon: "phone", tone: "text-warn bg-warn/12", label: t("m.contact"), sub: t("m.contactSub"), go: () => app.push({ name: "contact" }) },
  ];

  return (
    <div className="h-full overflow-y-auto pb-28">
      <ScreenHeader title={t("m.title")} />
      <div className="px-4 pt-4 stagger">
        {/* profile */}
        <div className="card-sheen border border-white/8 rounded-[22px] p-4 flex items-center gap-3.5">
          <div className="relative">
            <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3a3a42] to-[#232329] border border-white/10 flex items-center justify-center text-silver">
              <Icon name="user" size={26} />
            </span>
            <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full btn-red flex items-center justify-center text-white border-2 border-card">
              <Icon name="star" size={9} filled />
            </span>
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-extrabold text-alu">{t("h.valued")}</p>
            <p className="text-[10.5px] text-mute font-semibold mt-0.5">{lang === "ar" ? "نجران · عميلنا منذ ٢٠٢٤" : "Najran · with us since 2024"}</p>
          </div>
          <DoghmalMark size={30} />
        </div>

        {/* loyalty club — brushed aluminum tier card */}
        <div className="mt-4 relative overflow-hidden rounded-[22px] border border-white/12 p-4 bg-gradient-to-br from-[#3d3d46] via-[#2b2b32] to-[#1f1f23]">
          <div className="absolute -end-8 -top-10 w-32 h-32 rounded-full bg-alu/8 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl btn-red flex items-center justify-center text-white shadow-lg">
                <Icon name="star" size={18} filled />
              </span>
              <div>
                <p className="text-[13.5px] font-extrabold text-alu">{t("m.loyalty")}</p>
                <p className="text-[9.5px] font-bold text-silver">{t("m.loyaltyTier")}</p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-[20px] font-black metal-text tabular-nums" dir="ltr">{digits((1250).toLocaleString("en-US"), lang)}</p>
              <p className="text-[8.5px] font-bold text-mute -mt-0.5">{t("m.points")}</p>
            </div>
          </div>
          <ProgressBar value={1250 / 2000} className="mt-3.5" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] font-bold text-mute tabular-nums">{digits(750, lang)} {t("m.toGold")}</span>
            <button onClick={() => openWhatsApp(ADVISORS[0].phone, t("m.redeemMsg"))}
              className="press min-h-[36px] inline-flex items-center gap-1.5 text-[10.5px] font-black text-redhi bg-red/10 border border-red/25 rounded-full px-3 py-1.5">
              <Icon name="gift" size={12} /> {t("m.redeem")}
            </button>
          </div>
        </div>

        {/* menu group */}
        <div className="mt-4 card-sheen border border-white/8 rounded-[22px] overflow-hidden divide-y divide-white/5">
          {rows.map((r) => (
            <button key={r.label} onClick={r.go} className="press w-full flex items-center gap-3 px-4 py-3.5 text-start">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.tone}`}>
                <Icon name={r.icon} size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="text-[13px] font-extrabold text-alu block">{r.label}</span>
                <span className="text-[9.5px] text-mute font-semibold block mt-0.5">{r.sub}</span>
              </span>
              <Icon name={app.dir === "rtl" ? "chevL" : "chevR"} size={16} className="text-mute shrink-0" />
            </button>
          ))}
        </div>

        {/* language — mirrors the whole app instantly */}
        <div className="mt-4 card-sheen border border-white/8 rounded-[22px] p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/6 text-alu flex items-center justify-center shrink-0">
              <Icon name="globe" size={18} />
            </span>
            <p className="text-[13px] font-extrabold text-alu flex-1">{t("m.language")}</p>
          </div>
          <div className="flex bg-white/5 border border-white/8 rounded-2xl p-1 gap-1 mt-3">
            <button onClick={() => setLang("ar")}
              className={`press flex-1 py-2.5 rounded-xl text-[12.5px] font-extrabold ${lang === "ar" ? "btn-red text-white" : "text-mute"}`}>
              العربية
            </button>
            <button onClick={() => setLang("en")}
              className={`press flex-1 py-2.5 rounded-xl text-[12.5px] font-extrabold ${lang === "en" ? "btn-red text-white" : "text-mute"}`}>
              English
            </button>
          </div>
        </div>

        {/* logout */}
        <button onClick={() => setLogoutOpen(true)}
          className="press w-full mt-4 flex items-center justify-center gap-2 rounded-[22px] border border-red/25 bg-red/8 py-3.5 text-[13px] font-extrabold text-redhi">
          <Icon name="logout" size={17} /> {t("m.logout")}
        </button>

        <p className="text-center text-[8.5px] text-mute/70 font-bold mt-5">{t("m.version")}</p>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title={t("m.logoutQ")}
        body={t("m.logoutBody")}
        confirmLabel={t("m.logoutYes")}
        cancelLabel={t("m.stay")}
        danger
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => { setLogoutOpen(false); app.logout(); app.toast(t("l.bye")); }}
      />
    </div>
  );
}

/* ——— Offers & Campaigns ——— */
export function OffersScreen() {
  const app = useApp();
  const { t, L, lang } = app;
  const tones = {
    red: "from-[#ff2d3d] via-[#eb0a1a] to-[#8f0410]",
    amber: "from-[#ffc95c] via-[#f5a524] to-[#b26a00]",
    blue: "from-[#6fb0ff] via-[#4c9aff] to-[#1d5fc2]",
  };
  return (
    <div className="h-full overflow-y-auto pb-8 bg-ink">
      <ScreenHeader title={t("m.offers")} sub={t("m.offersSub")} onBack={app.pop} />
      <div className="px-4 pt-4 space-y-4 stagger">
        {OFFERS.map((o) => (
          <div key={o.id} className="card-sheen border border-white/8 rounded-[24px] overflow-hidden">
            <div className={`relative bg-gradient-to-br ${tones[o.tone]} p-4 pb-5`}>
              <div className="absolute -end-8 -top-10 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute end-10 top-6 w-14 h-14 rounded-full bg-white/10" />
              <div className="relative flex items-start justify-between gap-3">
                <span className="w-11 h-11 rounded-2xl bg-white/18 border border-white/25 flex items-center justify-center text-white">
                  <Icon name={o.icon} size={22} />
                </span>
                <span className="bg-white text-coal text-[12px] font-black px-3 py-1.5 rounded-full shadow">{L(o.badge)}</span>
              </div>
              <h3 className="relative text-[18px] font-black text-white mt-3">{L(o.title)}</h3>
              <p className="relative text-[11px] font-bold text-white/90 mt-1 leading-relaxed">{L(o.sub)}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-mute flex items-center gap-1.5">
                  <Icon name="clock" size={12} className="text-warn" />
                  {o.endsInDays <= 1 ? t("m.endsToday") : `${t("m.endsIn")} ${digits(o.endsInDays, lang)} ${t("m.days")}`}
                </span>
                <span className="text-mute">{fmtDate(isoPlus(o.endsInDays), lang)}</span>
              </div>
              <ProgressBar value={1 - o.endsInDays / 45} tone={o.endsInDays < 15 ? "red" : "warn"} className="mt-2" />
              <Btn className="w-full mt-3.5" small onClick={() => openWhatsApp(ADVISORS[0].phone, fill(t("m.offerMsg"), { title: L(o.title) }))}>
                <WhatsAppIcon size={14} /> {t("m.grabOffer")}
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——— Periodic Maintenance Program ——— */
export function ProgramScreen() {
  const app = useApp();
  const { t, L, lang } = app;
  return (
    <div className="h-full overflow-y-auto pb-8 bg-ink">
      <ScreenHeader title={t("m.programTitle")} sub={t("m.programSub")} onBack={app.pop} />
      <div className="px-4 pt-4">
        <div className="rounded-[20px] border border-info/25 bg-info/8 p-3.5 flex items-start gap-2.5">
          <Icon name="info" size={16} className="text-info shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold text-silver leading-relaxed">{t("m.programIntro")}</p>
        </div>
        <div className="space-y-4 mt-4 stagger">
          {PROGRAM_TIERS.map((tier) => {
            const hot = tier.id === "plus";
            return (
              <div key={tier.id} className={`relative card-sheen border rounded-[24px] p-4 ${hot ? "border-red/50 shadow-[0_0_0_1px_rgba(235,10,26,0.35),0_14px_40px_-16px_rgba(235,10,26,0.4)]" : "border-white/8"}`}>
                {hot && (
                  <span className="absolute -top-2.5 start-4 btn-red text-white text-[9px] font-black px-2.5 py-1 rounded-full">
                    {lang === "ar" ? "الأكثر اختيارًا" : "Most popular"}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-black text-alu">{t(tier.nameKey)}</h3>
                    <p className="text-[10px] text-mute font-bold mt-0.5">{t("m.visits4")}</p>
                  </div>
                  <div className="text-end">
                    <Money n={tier.price} className="text-[22px] font-black metal-text" />
                    <p className="text-[8.5px] text-mute font-bold">{lang === "ar" ? "سنويًا · شامل الضريبة" : "per year · incl. VAT"}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {tier.items.map((it, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] font-semibold text-silver">
                      <span className="w-4.5 h-4.5 rounded-full bg-ok/12 text-ok flex items-center justify-center shrink-0">
                        <Icon name="check" size={10} strokeWidth={3.2} />
                      </span>
                      {L(it)}
                    </li>
                  ))}
                </ul>
                <Btn variant={hot ? "primary" : "dark"} small className="w-full mt-4"
                  onClick={() => openWhatsApp(ADVISORS[0].phone, fill(t("m.progMsg"), { tier: t(tier.nameKey) }))}>
                  <WhatsAppIcon size={14} /> {t("m.subscribe")}
                </Btn>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ——— About ——— */
export function AboutScreen() {
  const app = useApp();
  const { t, lang } = app;
  const stats = [
    { n: "6", label: lang === "ar" ? "فروع بنجران" : "Najran branches" },
    { n: "+30", label: lang === "ar" ? "سنة خبرة" : "years of craft" },
    { n: "3", label: lang === "ar" ? "علامات معتمدة" : "authorized brands" },
  ];
  return (
    <div className="h-full overflow-y-auto pb-8 bg-ink">
      <ScreenHeader title={t("m.about")} onBack={app.pop} />
      <div className="px-4 pt-5 stagger">
        <div className="text-center">
          <div className="inline-block float-slow"><DoghmalMark size={72} /></div>
          <h2 className="text-[22px] font-black metal-text mt-4">{t("m.aboutSub")}</h2>
          <p className="text-[10px] font-bold tracking-[0.22em] text-mute mt-1.5">DOGHMAL TRADING CO. LTD</p>
        </div>
        <p className="text-[12.5px] text-silver font-semibold leading-[1.9] mt-5">{t("m.aboutBody")}</p>
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          {stats.map((s) => (
            <div key={s.label} className="card-sheen border border-white/8 rounded-2xl p-3 text-center">
              <p className="text-[20px] font-black metal-text" dir="ltr">{digits(s.n, lang)}</p>
              <p className="text-[9px] font-bold text-mute mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[22px] overflow-hidden border border-white/8">
          <img src={MECHANIC_IMG} alt="Doghmal workshop" loading="lazy" className="w-full h-36 object-cover" />
          <div className="card-sheen p-4">
            <div className="flex items-center gap-2">
              <Icon name="refresh" size={16} className="text-redhi" />
              <h3 className="text-[13.5px] font-extrabold text-alu">{t("m.tier1Title")}</h3>
            </div>
            <p className="text-[11px] text-mute font-semibold leading-[1.9] mt-2">{t("m.tier1Body")}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {[t("s.toyota"), t("s.haval"), t("s.jetour"), "GWM"].map((b) => (
            <span key={b} className="text-[10.5px] font-black text-silver bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— Contact ——— */
export function ContactScreen() {
  const app = useApp();
  const { t, L, lang } = app;
  return (
    <div className="h-full overflow-y-auto pb-8 bg-ink">
      <ScreenHeader title={t("m.contact")} sub={t("m.contactTitle")} onBack={app.pop} />
      <div className="px-4 pt-4 stagger">
        <div className="relative overflow-hidden rounded-[22px] btn-red p-4">
          <div className="absolute -end-6 -top-8 w-28 h-28 rounded-full bg-white/10" />
          <p className="text-[10px] font-bold text-white/85">{t("m.unified")}</p>
          <a href="tel:920001234" className="press block text-[26px] font-black text-white tracking-wide mt-1" dir="ltr">{digits("920 001 234", lang)}</a>
          <p className="text-[9.5px] font-bold text-white/85 mt-1.5">{t("m.workHours")}</p>
        </div>

        <div className="space-y-3 mt-4">
          {BRANCHES.map((b) => (
            <div key={b.id} className="card-sheen border border-white/8 rounded-[20px] p-3.5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 text-redhi flex items-center justify-center shrink-0">
                  <Icon name="pin" size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-extrabold text-alu truncate">{L(b.name)}</p>
                  <p className="text-[9px] text-mute font-semibold mt-0.5">{L(b.kind)} · {digits(b.km, lang)} {t("c.km")}</p>
                </div>
                <AvailabilityChip status={b.status} />
              </div>
              <div className="flex gap-2 mt-3">
                <a href={`tel:+${b.phone}`} className="press flex-1 flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl py-2 text-[11px] font-bold text-silver">
                  <Icon name="phone" size={13} /> {t("m.callBranch")}
                </a>
                <div className="flex-1">
                  <WaButton small full phone={b.phone} label="WhatsApp"
                    text={lang === "ar" ? `هلا دغمل 👋، أبي أستفسر عن خدمات ${b.name.ar}` : `Hi Doghmal 👋, asking about ${b.name.en} branch`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}