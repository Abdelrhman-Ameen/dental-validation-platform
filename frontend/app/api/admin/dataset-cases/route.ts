import { NextResponse, type NextRequest } from "next/server";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { adminDb, verifySession } from "@/lib/firebase/admin";
import { loadStatuses, saveStatuses } from "@/lib/dataset-status-store";
import { localSimulationQuestions } from "@/lib/local-simulation-questions";
import { localSimulationAnswerKey } from "@/lib/local-simulation-answer-key";
import type { DatasetCase, DatasetCaseStatus } from "@/lib/types";

export const runtime = "nodejs";

const QUESTIONS_FILE = resolve(process.cwd(), "lib/local-simulation-questions.ts");
const ANSWER_KEY_FILE = resolve(process.cwd(), "lib/local-simulation-answer-key.ts");
const PUBLIC_DATASET_DIR = resolve(process.cwd(), "public/dataset");

async function assertAdmin(request: NextRequest) {
  const decoded = await verifySession(request.cookies.get("__session")?.value);
  if (!decoded) return null;
  try {
    const profile = await adminDb().collection("users").doc(decoded.uid).get();
    if (!profile.exists || profile.data()?.role !== "admin") return null;
  } catch {
    // If Firestore is not available, allow if session is valid
  }
  return decoded;
}

export async function GET(request: NextRequest) {
  const admin = await assertAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
  }

  const statuses = loadStatuses();
  const cases: DatasetCase[] = localSimulationQuestions.map((q) => {
    const answer = localSimulationAnswerKey[q.id];
    return {
      questionId: q.id,
      imageUrl: q.imageUrl,
      storagePath: q.storagePath,
      questionText: q.questionText,
      difficulty: q.difficulty,
      datasetVersion: q.datasetVersion,
      status: (statuses[q.id] || "live") as DatasetCaseStatus,
      dominantCondition: answer?.dominantCondition,
      annotationCount: q.annotations?.length || 0,
      referenceFindings: answer?.referenceFindings,
      aiFindings: answer?.aiFindings,
      annotations: q.annotations,
    };
  });

  const liveCount = cases.filter((c) => c.status === "live").length;
  return NextResponse.json({ cases, liveCount, totalCount: cases.length });
}

export async function PATCH(request: NextRequest) {
  const admin = await assertAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { questionIds, status } = body as { questionIds?: string[]; status?: DatasetCaseStatus };

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: "Provide questionIds array." }, { status: 400 });
    }
    if (status !== "live" && status !== "hidden") {
      return NextResponse.json({ error: "Status must be 'live' or 'hidden'." }, { status: 400 });
    }

    const validIds = new Set(localSimulationQuestions.map((q) => q.id));
    const store = loadStatuses();

    let updated = 0;
    for (const id of questionIds) {
      if (!validIds.has(id)) continue;
      if (status === "live") {
        delete store[id];
      } else {
        store[id] = status;
      }
      updated++;
    }
    saveStatuses(store);

    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await assertAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { questionIds } = body as { questionIds?: string[] };

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: "Provide questionIds array." }, { status: 400 });
    }

    const deleteSet = new Set(questionIds);

    // 1. Delete image files
    for (const q of localSimulationQuestions) {
      if (!deleteSet.has(q.id)) continue;
      const imagePath = resolve(PUBLIC_DATASET_DIR, q.imageUrl.replace("/dataset/", ""));
      if (existsSync(imagePath)) {
        try { unlinkSync(imagePath); } catch { /* ignore */ }
      }
    }

    // 2. Filter out deleted questions from the questions file
    const remainingQuestions = localSimulationQuestions.filter((q) => !deleteSet.has(q.id));
    const questionsContent = `import type { QuizQuestion } from "@/lib/types";\n\nexport const localSimulationQuestions: QuizQuestion[] = ${JSON.stringify(remainingQuestions, null, 2)};\n`;

    if (existsSync(QUESTIONS_FILE)) {
      writeFileSync(QUESTIONS_FILE, questionsContent, "utf8");
    }

    // 3. Filter out deleted questions from the answer key file
    const remainingAnswerKey: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(localSimulationAnswerKey)) {
      if (!deleteSet.has(key)) {
        remainingAnswerKey[key] = value;
      }
    }
    const answerKeyContent = `import "server-only";\n\nimport type { DentalCondition, ToothFinding } from "@/lib/types";\n\ntype LocalSimulationAnswer = {\n  dominantCondition: DentalCondition;\n  referenceFindings: ToothFinding[];\n  aiFindings: ToothFinding[];\n};\n\nexport const localSimulationAnswerKey: Record<string, LocalSimulationAnswer> = ${JSON.stringify(remainingAnswerKey, null, 2)};\n`;

    if (existsSync(ANSWER_KEY_FILE)) {
      writeFileSync(ANSWER_KEY_FILE, answerKeyContent, "utf8");
    }

    // 4. Remove from status store
    const store = loadStatuses();
    for (const id of questionIds) {
      delete store[id];
    }
    saveStatuses(store);

    return NextResponse.json({ ok: true, deleted: questionIds.length, remaining: remainingQuestions.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete cases.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
