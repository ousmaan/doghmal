import type { BranchId } from "@/data";
import type { SectionId } from "@/lib/export";

export type SectionProps = {
  branchIds: BranchId[] | "all";
  onNavigate: (s: SectionId) => void;
  onDrill: (branchId: BranchId, section: SectionId) => void;
  onExport: (f: "csv" | "pdf") => void;
};
