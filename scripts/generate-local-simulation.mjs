import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const root = process.cwd();
const datasetVersion = "dataset_v1";
const choices = ["Cavity", "Fillings", "Implant", "Impacted Tooth"];
const testDir = resolve(root, "DataSet/test");
const csvPath = join(testDir, "_annotations.csv");
const datasetPublicDir = resolve(root, "frontend/public/dataset");
const questionOut = resolve(root, "frontend/lib/local-simulation-questions.ts");
const answerOut = resolve(root, "frontend/lib/local-simulation-answer-key.ts");
const fdiSequence = [
  "18", "17", "16", "15", "14", "13", "12", "11",
  "21", "22", "23", "24", "25", "26", "27", "28",
  "48", "47", "46", "45", "44", "43", "42", "41",
  "31", "32", "33", "34", "35", "36", "37", "38"
];

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
}

function dominantLabel(rows) {
  const counts = new Map();
  for (const row of rows) {
    counts.set(row.class, (counts.get(row.class) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function difficulty(index, annotations) {
  if (annotations.length > 10 || index % 5 === 0) {
    return "hard";
  }
  return index % 2 === 0 ? "moderate" : "easy";
}

function toothFromAnnotation(row) {
  const width = Number(row.width) || 512;
  const midpoint = (Number(row.xmin) + Number(row.xmax)) / 2;
  const index = Math.max(0, Math.min(fdiSequence.length - 1, Math.floor((midpoint / width) * fdiSequence.length)));
  return fdiSequence[index];
}

function buildFindings(annotations) {
  const grouped = new Map();
  for (const row of annotations) {
    const teeth = grouped.get(row.class) || new Set();
    teeth.add(toothFromAnnotation(row));
    grouped.set(row.class, teeth);
  }
  return [...grouped.entries()]
    .map(([condition, teeth]) => ({
      condition,
      toothIds: [...teeth].sort((a, b) => fdiSequence.indexOf(a) - fdiSequence.indexOf(b))
    }))
    .sort((a, b) => choices.indexOf(a.condition) - choices.indexOf(b.condition));
}

mkdirSync(datasetPublicDir, { recursive: true });

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const byFile = new Map();
for (const row of rows) {
  byFile.set(row.filename, [...(byFile.get(row.filename) || []), row]);
}

const selected = [...byFile.entries()].slice(0, 20);
const questions = [];
const answerKey = {};

for (const [index, [filename, annotations]] of selected.entries()) {
  const questionId = `q${index + 1}`;
  const extension = extname(filename).toLowerCase() || ".jpg";
  const localFilename = `case${index + 1}${extension}`;
  copyFileSync(join(testDir, filename), join(datasetPublicDir, localFilename));

  const correctAnswer = dominantLabel(annotations);
  const referenceFindings = buildFindings(annotations);
  answerKey[questionId] = {
    referenceFindings,
    aiFindings: referenceFindings,
    dominantCondition: correctAnswer
  };
  questions.push({
    id: questionId,
    imageUrl: `/dataset/${localFilename}`,
    storagePath: `static:/dataset/${localFilename}`,
    questionText: "Identify the dominant radiographic finding in this dental image.",
    choices,
    aiPrediction: correctAnswer,
    aiConfidence: Number((0.94 + (index % 5) * 0.01).toFixed(2)),
    difficulty: difficulty(index, annotations),
    datasetVersion,
    annotations: annotations.map((row) => ({
      label: row.class,
      xmin: Number(row.xmin),
      ymin: Number(row.ymin),
      xmax: Number(row.xmax),
      ymax: Number(row.ymax)
    }))
  });
}

writeFileSync(
  questionOut,
  `import type { QuizQuestion } from "@/lib/types";\n\nexport const localSimulationQuestions: QuizQuestion[] = ${JSON.stringify(questions, null, 2)};\n`
);

writeFileSync(
  answerOut,
  `import "server-only";\n\nimport type { DentalCondition, ToothFinding } from "@/lib/types";\n\ntype LocalSimulationAnswer = {\n  dominantCondition: DentalCondition;\n  referenceFindings: ToothFinding[];\n  aiFindings: ToothFinding[];\n};\n\nexport const localSimulationAnswerKey: Record<string, LocalSimulationAnswer> = ${JSON.stringify(answerKey, null, 2)};\n`
);

console.log(`Generated ${questions.length} static validation cases from DataSet/test into frontend/public/dataset.`);
