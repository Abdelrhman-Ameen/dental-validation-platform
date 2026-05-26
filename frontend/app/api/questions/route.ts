import { NextResponse, type NextRequest } from "next/server";
import { DATASET_VERSION } from "@/lib/constants";
import { adminDb, verifySession } from "@/lib/firebase/admin";
import { localSimulationQuestions } from "@/lib/local-simulation-questions";
import { getLiveCaseIds } from "@/lib/dataset-status-store";
import type { QuestionDoc, QuizQuestion } from "@/lib/types";
import { shuffle } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  const decoded = await verifySession(session);

  // Get live case IDs for filtering
  const allIds = localSimulationQuestions.map((q) => q.id);
  const liveIds = new Set(getLiveCaseIds(allIds));
  const liveLocalQuestions = localSimulationQuestions.filter((q) => liveIds.has(q.id));

  if (!decoded) {
    return NextResponse.json({ questions: shuffle(liveLocalQuestions) });
  }

  const datasetVersion = request.nextUrl.searchParams.get("datasetVersion") || DATASET_VERSION;
  const snapshot = await adminDb()
    .collection("questions")
    .where("datasetVersion", "==", datasetVersion)
    .where("active", "==", true)
    .get();

  const questions = shuffle(
    snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as QuestionDoc;
      const sanitized: QuizQuestion = {
        id: docSnap.id,
        imageUrl: data.imageUrl,
        storagePath: data.storagePath,
        questionText: data.questionText,
        choices: data.choices,
        aiPrediction: data.aiPrediction,
        aiConfidence: data.aiConfidence,
        difficulty: data.difficulty,
        datasetVersion: data.datasetVersion,
        annotations: data.annotations
      };
      return sanitized;
    })
  );

  return NextResponse.json({
    questions: questions.length ? questions : shuffle(liveLocalQuestions),
  });
}
