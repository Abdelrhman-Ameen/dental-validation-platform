import "server-only";

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { DatasetCaseStatus } from "@/lib/types";

const STATUS_FILE = resolve(process.cwd(), "public/dataset/status.json");

type StatusStore = Record<string, DatasetCaseStatus>;

export function loadStatuses(): StatusStore {
  if (!existsSync(STATUS_FILE)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(STATUS_FILE, "utf8")) as StatusStore;
  } catch {
    return {};
  }
}

export function saveStatuses(store: StatusStore): void {
  writeFileSync(STATUS_FILE, JSON.stringify(store, null, 2), "utf8");
}

export function getCaseStatus(questionId: string): DatasetCaseStatus {
  const store = loadStatuses();
  return store[questionId] || "live";
}

export function setCaseStatus(questionId: string, status: DatasetCaseStatus): void {
  const store = loadStatuses();
  if (status === "live") {
    delete store[questionId];
  } else {
    store[questionId] = status;
  }
  saveStatuses(store);
}

export function removeCaseStatus(questionId: string): void {
  const store = loadStatuses();
  delete store[questionId];
  saveStatuses(store);
}

export function getLiveCaseIds(allIds: string[]): string[] {
  const store = loadStatuses();
  return allIds.filter((id) => (store[id] || "live") === "live");
}
