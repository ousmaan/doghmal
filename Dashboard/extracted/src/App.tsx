import { useCallback, useEffect, useRef, useState } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { Shell, type Persona, navItems } from "@/components/Shell";
import { runExport, type SectionId } from "@/lib/export";
import { branches, network, type BranchId, type PeriodId } from "@/data";
import Executive from "@/sections/Executive";
import Bays from "@/sections/Bays";
import Parts from "@/sections/Parts";
import Advisors from "@/sections/Advisors";
import Conversion from "@/sections/Conversion";
import CSI from "@/sections/CSI";
import Transfers from "@/sections/Transfers";
import Compliance from "@/sections/Compliance";

/**
 * Doghmal Trading Co. — Tier 3 executive telemetry prototype.
 *
 * NON-INVASIVE PHILOSOPHY (enforced in this shell):
 *  · The only verbs available are navigate, filter, inspect, export.
 *  · No form, mutation or write RPC exists anywhere in the UI tree.
 *  · Legacy ERP/DMS remains the sole author of invoices, job cards, stock moves
 *    and ZATCA Phase-2 cryptographic stamps.
 *  · All scope filters and drill-downs are pure read projections of the KSA mirror.
 */

const validSections = navItems.map((n) => n.id);

function readHash(): SectionId {
  const hash = window.location.hash.replace("#", "") as SectionId;
  return validSections.includes(hash) ? hash : "executive";
}

function AppInner() {
  const { lang, n } = useI18n();
  const [section, setSection] = useState<SectionId>(() => readHash());
  const [branchIds, setBranchIds] = useState<BranchId[] | "all">("all");
  const [period, setPeriod] = useState<PeriodId>("7d");
  const [persona, setPersona] = useState<Persona>("csuite");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("14:37:12");
  const [cloudDelayed, setCloudDelayed] = useState(false);
  const timer = useRef<number | null>(null);

  /* Real navigation: each section owns a hash so browser back/forward works. */
  useEffect(() => {
    if (window.location.hash !== `#${section}`) {
      window.history.pushState(null, "", `#${section}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  useEffect(() => {
    const onHash = () => setSection(readHash());
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  const refresh = useCallback(() => {
    setSyncing(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const now = new Date();
      const stamp = new Intl.DateTimeFormat("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);
      setLastSync(stamp);
      setSyncing(false);
    }, 850);
  }, []);

  /* Auto-refresh: mirrors the CDC heartbeat every 60 seconds. */
  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, [autoRefresh, refresh]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const handleExport = useCallback(
    (format: "csv" | "pdf") => runExport(section, format, lang, branchIds),
    [section, lang, branchIds]
  );

  const handleDrill = useCallback((branchId: BranchId, target: SectionId) => {
    setBranchIds([branchId]);
    setSection(target);
  }, []);

  const common = {
    branchIds,
    onNavigate: setSection,
    onDrill: handleDrill,
    onExport: handleExport,
  };

  return (
    <Shell
      section={section}
      onNavigate={setSection}
      branchIds={branchIds}
      onBranchIds={setBranchIds}
      period={period}
      onPeriod={setPeriod}
      autoRefresh={autoRefresh}
      onAutoRefresh={setAutoRefresh}
      onRefresh={refresh}
      syncing={syncing}
      lastSync={lastSync}
      cloudDelayed={cloudDelayed}
      onExport={handleExport}
      persona={persona}
      onPersona={setPersona}
    >
      <div key={`${section}-${lang}`} className="fade-up">
        {section === "executive" && <Executive {...common} />}
        {section === "bays" && <Bays {...common} />}
        {section === "parts" && <Parts {...common} />}
        {section === "advisors" && <Advisors {...common} />}
        {section === "conversion" && <Conversion {...common} />}
        {section === "csi" && <CSI {...common} />}
        {section === "transfers" && <Transfers {...common} />}
        {section === "compliance" && (
          <Compliance {...common} cloudDelayed={cloudDelayed} onToggleDelay={() => setCloudDelayed((v) => !v)} />
        )}
      </div>

      {/* Contextual scope summary — visible on print exports */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[9px] text-steel">
        <span>
          {lang === "ar"
            ? `نطاق العرض: ${branchIds === "all" ? "كل الفروع" : branches.filter((b) => branchIds.includes(b.id)).map((b) => b.name.ar).join("، ")} · استهلاك البايات ${n(network(branchIds).utilization)}٪`
            : `View scope: ${branchIds === "all" ? "all branches" : branches.filter((b) => branchIds.includes(b.id)).map((b) => b.name.en).join(", ")} · bay utilisation ${n(network(branchIds).utilization)}%`}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1 w-1 rounded-full ${cloudDelayed ? "bg-warn" : "bg-ok"}`} />
          {lang === "ar" ? "مرآة CDC للقراءة فقط · بدون كتابة عكسية" : "Read-only CDC mirror · zero write-backs"}
        </span>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
