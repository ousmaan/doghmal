import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Doghmal Tier‑3 telemetry shell — i18n layer.
 * Arabic is the default locale (Saudi automotive vernacular), English is the mirror.
 * Every string in the product is authored as a bilingual pair so nothing is machine
 * translated at runtime and mixed-script metrics stay typographically balanced.
 */
export type Lang = "ar" | "en";
export type Bi = { en: string; ar: string };

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export function digits(value: string | number, lang: Lang): string {
  const raw = String(value);
  return lang === "ar" ? toArabicDigits(raw) : raw;
}

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  dir: "rtl" | "ltr";
  pick: (bi: Bi) => string;
  n: (value: number | string, decimals?: number) => string;
  sar: (value: number, compact?: boolean) => string;
  pct: (value: number, decimals?: number) => string;
  time: (label: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    const saved = window.localStorage.getItem("doghmal.lang");
    return saved === "en" ? "en" : "ar";
  });

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem("doghmal.lang", lang);
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === "ar" ? "en" : "ar")),
    []
  );

  const pick = useCallback((bi: Bi) => (lang === "ar" ? bi.ar : bi.en), [lang]);

  const n = useCallback(
    (value: number | string, decimals = 0) => {
      const raw =
        typeof value === "number"
          ? value.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : value;
      return digits(raw, lang);
    },
    [lang]
  );

  const sar = useCallback(
    (value: number, compact = false) => {
      const body = compact
        ? value >= 1_000_000
          ? `${(value / 1_000_000).toFixed(1)}M`
          : value >= 1000
            ? `${(value / 1000).toFixed(value >= 100_000 ? 0 : 1)}K`
            : String(Math.round(value))
        : value.toLocaleString("en-US", { maximumFractionDigits: 0 });
      if (lang === "ar") {
        const arabicBody = body.replace("M", " مليون").replace("K", " ألف");
        return `${digits(arabicBody, lang)} ر.س`;
      }
      return `SAR ${digits(body, lang)}`;
    },
    [lang]
  );

  const pct = useCallback(
    (value: number, decimals = 0) =>
      lang === "ar"
        ? `${digits(value.toFixed(decimals), lang)}٪`
        : `${value.toFixed(decimals)}%`,
    [lang]
  );

  const time = useCallback((label: string) => digits(label, lang), [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, dir, pick, n, sar, pct, time }),
    [lang, setLang, toggleLang, dir, pick, n, sar, pct, time]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export const bi = (en: string, ar: string): Bi => ({ en, ar });
