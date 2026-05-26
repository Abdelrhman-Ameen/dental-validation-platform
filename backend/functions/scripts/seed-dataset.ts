import { readFileSync } from "fs";
import { extname, join, resolve } from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

type Row = {
  filename: string;
  width: string;
  height: string;
  class: string;
  xmin: string;
  ymin: string;
  xmax: string;
  ymax: string;
};

const datasetVersion = "dataset_v1";
const choices = ["Cavity", "Fillings", "Implant", "Impacted Tooth"];
const testDir = resolve(process.cwd(), "../../DataSet/test");
const csvPath = join(testDir, "_annotations.csv");

function init() {
  if (getApps().length) {
    return;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp();
    return;
  }
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    })
  });
}

function parseCsv(text: string): Row[] {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as Row;
  });
}

function dominantLabel(rows: Row[]) {
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.class, (counts.get(row.class) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

async function main() {
  init();
  const db = getFirestore();
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  const byFile = new Map<string, Row[]>();
  rows.forEach((row) => {
    byFile.set(row.filename, [...(byFile.get(row.filename) || []), row]);
  });

  const selected = [...byFile.entries()].slice(0, 20);
  for (const [index, [filename, annotations]] of selected.entries()) {
    const questionId = `q${index + 1}`;
    const extension = extname(filename).toLowerCase() || ".jpg";
    const localFilename = `case${index + 1}${extension}`;
    const imageUrl = `/dataset/${localFilename}`;
    const storagePath = `static:${imageUrl}`;
    const correctAnswer = dominantLabel(annotations);

    await db.collection("questions").doc(questionId).set({
      imageUrl,
      storagePath,
      questionText: "Identify the dominant radiographic finding in this dental image.",
      choices,
      correctAnswer,
      aiPrediction: correctAnswer,
      aiConfidence: 0.94 + (index % 5) * 0.01,
      difficulty: index % 5 === 0 ? "hard" : index % 2 === 0 ? "moderate" : "easy",
      active: true,
      datasetVersion,
      annotations: annotations.map((row) => ({
        label: row.class,
        xmin: Number(row.xmin),
        ymin: Number(row.ymin),
        xmax: Number(row.xmax),
        ymax: Number(row.ymax)
      })),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  await db.collection("ai_models").doc("deit-coatnet-cross-attention").set({
    modelName: "DeiT+CoAtNet Cross-Attention",
    precision: 0.965,
    recall: 0.961,
    f1: 0.9641,
    score: 19,
    inferenceMs: 64,
    datasetVersion,
    createdAt: FieldValue.serverTimestamp()
  });

  console.log(`Seeded ${selected.length} validation questions and the reference AI model.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
