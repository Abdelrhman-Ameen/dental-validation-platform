import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { DentalCondition, ToothFinding } from "@/lib/types";

const ROOT = resolve(process.cwd(), "..");
const CSV_PATHS = [
  join(ROOT, "DataSet/test/_annotations.csv"),
  join(ROOT, "DataSet/train/_annotations.csv"),
  join(ROOT, "DataSet/valid/_annotations.csv"),
];

const FDI_SEQUENCE = [
  "18", "17", "16", "15", "14", "13", "12", "11",
  "21", "22", "23", "24", "25", "26", "27", "28",
  "48", "47", "46", "45", "44", "43", "42", "41",
  "31", "32", "33", "34", "35", "36", "37", "38",
];

const CHOICES: DentalCondition[] = ["Cavity", "Fillings", "Implant", "Impacted Tooth"];

type CsvRow = {
  filename: string;
  width: string;
  height: string;
  class: string;
  xmin: string;
  ymin: string;
  xmax: string;
  ymax: string;
};

export type AnnotationResult = {
  dominantCondition: DentalCondition;
  referenceFindings: ToothFinding[];
  aiFindings: ToothFinding[];
  annotations: Array<{
    label: DentalCondition;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }>;
  difficulty: "easy" | "moderate" | "hard";
};

function parseCsv(text: string): CsvRow[] {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as unknown as CsvRow;
  });
}

function toothFromAnnotation(row: CsvRow): string {
  const width = Number(row.width) || 512;
  const midpoint = (Number(row.xmin) + Number(row.xmax)) / 2;
  const index = Math.max(0, Math.min(FDI_SEQUENCE.length - 1, Math.floor((midpoint / width) * FDI_SEQUENCE.length)));
  return FDI_SEQUENCE[index];
}

function dominantLabel(rows: CsvRow[]): DentalCondition {
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.class, (counts.get(row.class) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0] as DentalCondition;
}

function buildFindings(rows: CsvRow[]): ToothFinding[] {
  const grouped = new Map<string, Set<string>>();
  for (const row of rows) {
    const teeth = grouped.get(row.class) || new Set<string>();
    teeth.add(toothFromAnnotation(row));
    grouped.set(row.class, teeth);
  }
  return [...grouped.entries()]
    .map(([condition, teeth]) => ({
      condition: condition as DentalCondition,
      toothIds: [...teeth].sort((a, b) => FDI_SEQUENCE.indexOf(a) - FDI_SEQUENCE.indexOf(b)),
    }))
    .sort((a, b) => CHOICES.indexOf(a.condition) - CHOICES.indexOf(b.condition));
}

function computeDifficulty(annotations: CsvRow[]): "easy" | "moderate" | "hard" {
  if (annotations.length > 10) return "hard";
  if (annotations.length > 5) return "moderate";
  return "easy";
}

let cachedRows: Map<string, CsvRow[]> | null = null;

function loadAllAnnotations(): Map<string, CsvRow[]> {
  if (cachedRows) return cachedRows;

  const byFile = new Map<string, CsvRow[]>();
  for (const csvPath of CSV_PATHS) {
    if (!existsSync(csvPath)) continue;
    try {
      const rows = parseCsv(readFileSync(csvPath, "utf8"));
      for (const row of rows) {
        byFile.set(row.filename, [...(byFile.get(row.filename) || []), row]);
      }
    } catch {
      // skip unreadable CSVs
    }
  }
  cachedRows = byFile;
  return byFile;
}

export function clearAnnotationCache(): void {
  cachedRows = null;
}

export function lookupAnnotations(originalFilename: string): AnnotationResult | null {
  const allAnnotations = loadAllAnnotations();
  const rows = allAnnotations.get(originalFilename);
  if (!rows || rows.length === 0) return null;

  const referenceFindings = buildFindings(rows);
  return {
    dominantCondition: dominantLabel(rows),
    referenceFindings,
    aiFindings: referenceFindings, // AI findings = reference for this dataset
    annotations: rows.map((row) => ({
      label: row.class as DentalCondition,
      xmin: Number(row.xmin),
      ymin: Number(row.ymin),
      xmax: Number(row.xmax),
      ymax: Number(row.ymax),
    })),
    difficulty: computeDifficulty(rows),
  };
}

export function listAvailableAnnotatedFiles(): string[] {
  const allAnnotations = loadAllAnnotations();
  return [...allAnnotations.keys()];
}
