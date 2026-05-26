import type { AiModel, DatasetCaseStatus, DentalCondition } from "@/lib/types";

export const DATASET_VERSION = "dataset_v1";

/** Default question total — used as a fallback. Actual count is dynamic based on live cases. */
export const QUESTION_TOTAL = 20;

export const QUESTION_TIMER_SECONDS = 90;

export const TOTAL_TIMER_SECONDS = QUESTION_TOTAL * QUESTION_TIMER_SECONDS;

/** Compute the total quiz timer for a given number of questions. */
export function totalTimerFor(questionCount: number) {
  return questionCount * QUESTION_TIMER_SECONDS;
}

export const DATASET_STATUSES: { value: DatasetCaseStatus; label: string; color: string }[] = [
  { value: "live", label: "Live", color: "success" },
  { value: "hidden", label: "Hidden", color: "warning" },
];

export const DENTAL_CONDITIONS: DentalCondition[] = ["Cavity", "Fillings", "Implant", "Impacted Tooth"];

export const FDI_TOOTH_GROUPS = [
  {
    label: "Upper right",
    teeth: ["18", "17", "16", "15", "14", "13", "12", "11"]
  },
  {
    label: "Upper left",
    teeth: ["21", "22", "23", "24", "25", "26", "27", "28"]
  },
  {
    label: "Lower right",
    teeth: ["48", "47", "46", "45", "44", "43", "42", "41"]
  },
  {
    label: "Lower left",
    teeth: ["31", "32", "33", "34", "35", "36", "37", "38"]
  }
];

export const FDI_TOOTH_ORDER = FDI_TOOTH_GROUPS.flatMap((group) => group.teeth);

export const MODEL_METRICS = {
  title: "DeiT + CoAtNet Cross-Attention Fusion",
  shortName: "YOLOv8s + Swin-T",
  accuracy: 0.96,
  precision: 0.965,
  sensitivity: 0.961,
  specificity: 0.964,
  dsc: 0.963,
  auc: 0.979,
  paramsM: 85.3,
  inferenceMs: 64
};

export const DEFAULT_AI_MODEL: AiModel = {
  modelName: "DeiT+CoAtNet Cross-Attention",
  precision: 0.965,
  recall: 0.961,
  f1: 0.9641,
  score: 19,
  datasetVersion: DATASET_VERSION,
  notes: "Reference hybrid model from the research protocol."
};

export const DOCTOR_NAV = [
  { href: "/quiz", label: "Validation Quiz" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/quiz/result", label: "My Result" }
];

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/datasets", label: "Datasets" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/leaderboard", label: "Leaderboard" },
  { href: "/admin/settings", label: "Settings" }
];
