import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import { DoghmalMark } from "./components/icons";

type Lang = "ar" | "en";

const DEMOS = [
  {
    id: "demo-01",
    title: { ar: "العرض الأول", en: "Demo-01" },
    subtitle: { ar: "تطبيق المبيعات للعملاء", en: "Customer Trading App" },
    path: "/demo-01",
  },
  {
    id: "demo-02",
    title: { ar: "العرض الثاني", en: "Demo-02" },
    subtitle: { ar: "تطبيق السيارات (النموذج الأولي)", en: "Mobile Automotive Prototype" },
    path: "/demo-02",
  },
  {
    id: "dashboard",
    title: { ar: "لوحة القيادة", en: "Executive Dashboard" },
    subtitle: { ar: "إنتاجية الموظفين ومقاييس الفروع", en: "Worker productivity & branch telemetry" },
    path: "/dashboard",
  },
];

function Header({ lang, dir, toggle }: { lang: Lang; dir: "rtl" | "ltr"; toggle: () => void }) {
  const isAr = lang === "ar";
  return (
    <header
      dir={dir}
      className="fixed top-0 inset-x-0 z-50 h-16 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6"
    >
      <a href="/" className="flex items-center gap-3 no-underline">
        <DoghmalMark size={36} />
        <div className="flex flex-col leading-tight">
          <span className="metal-text text-lg font-black tracking-tight">
            {isAr ? "الدغمل التجارية" : "Doghmal Trading Co."}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a9099]">
            {isAr ? "عروض النماذج" : "Prototype Demos"}
          </span>
        </div>
      </a>

      <button
        onClick={toggle}
        className="h-9 px-3 rounded-full border border-white/10 bg-[#1f1f23] text-xs font-semibold text-[#b9bec7] hover:text-white hover:border-white/20 transition-colors"
      >
        {isAr ? "EN" : "عربي"}
      </button>
    </header>
  );
}

function HomePage({ lang, dir }: { lang: Lang; dir: "rtl" | "ltr" }) {
  const navigate = useNavigate();
  const isAr = lang === "ar";

  return (
    <main
      dir={dir}
      className={`min-h-screen bg-[#0a0a0c] stage-bg grain pt-20 pb-12 px-4 sm:px-8 ${
        isAr ? "font-app-ar" : "font-app-en"
      }`}
    >
      <div className="absolute inset-0 stage-grid pointer-events-none hidden sm:block" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center sm:text-start mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#eb0a1a] mb-3 font-bold">
            {isAr ? "معرض النماذج" : "Prototype Gallery"}
          </p>
          <h1 className="metal-text text-5xl sm:text-6xl font-black leading-tight">
            {isAr ? "اختر العرض" : "Pick a Demo"}
          </h1>
          <p className="mt-3 text-[#b9bec7] max-w-xl text-base sm:text-lg">
            {isAr
              ? "ثلاثة نماذج أولية لتجربة مستقبل الدغمل التجارية."
              : "Three prototype experiences for the future of Doghmal."}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 stagger">
          {DEMOS.map((d) => (
            <button
              key={d.id}
              onClick={() => navigate(d.path)}
              className="card-sheen group relative text-start rounded-2xl border border-white/5 p-6 hover:border-[#eb0a1a]/60 hover:shadow-[0_0_40px_rgba(235,10,26,0.25)] transition-all active:scale-[0.98] flex flex-col"
            >
              <div className="mb-6 w-12 h-12 rounded-xl bg-[#eb0a1a]/10 border border-[#eb0a1a]/20 flex items-center justify-center">
                <span className="text-[#eb0a1a] font-black text-lg">0{d.id.split("-")[1] ?? d.id}</span>
              </div>
              <h2 className="text-white text-xl font-extrabold">{isAr ? d.title.ar : d.title.en}</h2>
              <p className="text-[#8a9099] text-sm mt-2 leading-relaxed">{isAr ? d.subtitle.ar : d.subtitle.en}</p>
              <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#b9bec7] group-hover:text-[#ff2d3d] transition-colors">
                <span>{isAr ? "افتح العرض ←" : "Open demo →"}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-14 text-center text-[#5a5f67] text-[10px] uppercase tracking-[0.25em]">
          {isAr ? "كل العروض عبارة عن نماذج أولية فقط" : "All demos are interactive prototypes only"}
        </div>
      </div>
    </main>
  );
}

function DemoPage({ demoPath, title, lang, dir, onBack }: { demoPath: string; title: string; lang: Lang; dir: "rtl" | "ltr"; onBack: () => void }) {
  const isAr = lang === "ar";
  return (
    <main
      dir={dir}
      className={`fixed inset-0 sm:static sm:min-h-screen bg-[#0a0a0c] sm:pt-16 sm:p-4 sm:bg-[#0a0a0c] flex flex-col ${
        isAr ? "font-app-ar" : "font-app-en"
      }`}
    >
      {/* Mobile: full-screen demo, back as floating button */}
      <div className="sm:hidden absolute inset-0 z-10">
        <iframe src={demoPath} className="w-full h-full border-0" title={title} />
        <button
          onClick={onBack}
          className="absolute top-2 left-2 z-20 h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white text-lg flex items-center justify-center"
          aria-label={isAr ? "رجوع" : "Back"}
        >
          {isAr ? "→" : "←"}
        </button>
      </div>

      {/* Desktop: framed phone — demo in a centered device-like shell */}
      <div className="hidden sm:flex flex-col items-center justify-center flex-1 relative">
        <div className="absolute inset-0 stage-bg" />
        <div className="absolute inset-0 stage-grid" style={{ maskImage: "radial-gradient(70% 70% at 50% 40%, black, transparent)" }} />
        <div className="relative w-[410px] h-[88vh] rounded-[44px] bg-[#0a0a0c] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-6 flex items-center justify-center">
            <div className="w-28 h-3 rounded-b-xl bg-black/80" />
          </div>
          <iframe src={demoPath} className="w-full h-full border-0" title={title} />
        </div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 h-10 px-4 rounded-full bg-[#1f1f23]/80 backdrop-blur-sm border border-white/10 text-[#b9bec7] hover:text-white text-sm flex items-center gap-2"
        >
          {isAr ? "← رجوع" : "← Back"}
        </button>
      </div>
    </main>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    return localStorage.getItem("lang") === "en" ? "en" : "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";
  const toggle = () => {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <BrowserRouter>
      {lang === "ar" || lang === "en" ? <Header lang={lang} dir={dir} toggle={toggle} /> : null}
      <Routes>
        <Route path="/" element={<HomePage lang={lang} dir={dir} />} />
        <Route path="/demo-01" element={<DemoPage demoPath="/demos/demo-01/index.html" title="Demo-01" lang={lang} dir={dir} onBack={() => window.history.back()} />} />
        <Route path="/demo-02" element={<DemoPage demoPath="/demos/demo-02/index.html" title="Demo-02" lang={lang} dir={dir} onBack={() => window.history.back()} />} />
        <Route path="/dashboard" element={<DemoPage demoPath="/demos/dashboard/index.html" title="Dashboard" lang={lang} dir={dir} onBack={() => window.history.back()} />} />
      </Routes>
    </BrowserRouter>
  );
}
