import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { DATASET_VERSION, DEFAULT_AI_MODEL, FDI_TOOTH_ORDER } from "@/lib/constants";
import { getLiveCaseIds } from "@/lib/dataset-status-store";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { localSimulationAnswerKey } from "@/lib/local-simulation-answer-key";
import type { DentalCondition, QuizAnswerInput, ScoredAnswer, ToothFinding } from "@/lib/types";

type SubmitQuizBody = {
  token?: string;
  answers?: QuizAnswerInput[];
  startedAt?: string;
  browser?: string;
  device?: string;
  userAgent?: string;
};

type VerifiedDoctor = {
  uid: string;
  email: string;
  name: string;
};

function hasAdminCredentials() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

function isDentalCondition(value: unknown): value is DentalCondition {
  return value === "Cavity" || value === "Fillings" || value === "Implant" || value === "Impacted Tooth";
}

function normalizeFindings(findings: ToothFinding[] | undefined) {
  return (findings || [])
    .filter((finding) => isDentalCondition(finding.condition))
    .map((finding) => ({
      condition: finding.condition,
      toothIds: [...new Set(finding.toothIds || [])]
        .filter((toothId) => FDI_TOOTH_ORDER.includes(toothId))
        .sort((a, b) => FDI_TOOTH_ORDER.indexOf(a) - FDI_TOOTH_ORDER.indexOf(b))
    }))
    .filter((finding) => finding.toothIds.length)
    .sort((a, b) => a.condition.localeCompare(b.condition));
}

function findingsMatch(a: ToothFinding[], b: ToothFinding[]) {
  const left = normalizeFindings(a);
  const right = normalizeFindings(b);
  if (left.length !== right.length) {
    return false;
  }
  return left.every((finding, index) => {
    const other = right[index];
    return finding.condition === other.condition
      && finding.toothIds.length === other.toothIds.length
      && finding.toothIds.every((toothId, toothIndex) => toothId === other.toothIds[toothIndex]);
  });
}

function findingUnits(findings: ToothFinding[]) {
  return normalizeFindings(findings).flatMap((finding) =>
    finding.toothIds.map((toothId) => `${finding.condition}:${toothId}`)
  );
}

function countMatchedAnnotations(selectedFindings: ToothFinding[], referenceFindings: ToothFinding[]) {
  const selected = new Set(findingUnits(selectedFindings));
  return findingUnits(referenceFindings).filter((unit) => selected.has(unit)).length;
}

function countReferenceAnnotations(findings: ToothFinding[]) {
  return findingUnits(findings).length;
}

async function verifyDoctor(token?: string): Promise<VerifiedDoctor> {
  if (!token) {
    throw new Error("Please sign in again before submitting the validation attempt.");
  }
  if (!hasAdminCredentials()) {
    throw new Error("Server scoring requires Firebase Admin SDK environment variables on Vercel.");
  }
  const decoded = await adminAuth().verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email || "",
    name: decoded.name || decoded.email || "Doctor"
  };
}

function scoreAnswers(answers: QuizAnswerInput[]) {
  const liveIds = new Set(getLiveCaseIds(Object.keys(localSimulationAnswerKey)));
  const liveAnswers = answers.filter((a) => liveIds.has(a.questionId));
  const scoredAnswers: ScoredAnswer[] = liveAnswers.map((answer) => {
    const correctAnswer = localSimulationAnswerKey[answer.questionId];
    const selectedFindings = normalizeFindings(answer.selectedFindings);
    const referenceFindings = normalizeFindings(correctAnswer?.referenceFindings);
    const matchedAnnotations = countMatchedAnnotations(selectedFindings, referenceFindings);
    const totalAnnotations = countReferenceAnnotations(referenceFindings);
    return {
      questionId: answer.questionId,
      selectedFindings,
      timeSpent: Math.max(0, Number(answer.timeSpent) || 0),
      referenceFindings,
      matchedAnnotations,
      totalAnnotations,
      correct: Boolean(correctAnswer && findingsMatch(selectedFindings, referenceFindings))
    };
  });
  const totalScore = scoredAnswers.reduce((sum, answer) => sum + (answer.matchedAnnotations || 0), 0);
  const totalQuestions = scoredAnswers.reduce((sum, answer) => sum + (answer.totalAnnotations || 0), 0);
  return {
    scoredAnswers,
    totalScore,
    totalQuestions,
    accuracy: totalQuestions ? totalScore / totalQuestions : 0,
    timeTaken: scoredAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0)
  };
}

function scoreAiModel() {
  const liveIds = new Set(getLiveCaseIds(Object.keys(localSimulationAnswerKey)));
  return Object.entries(localSimulationAnswerKey)
    .filter(([id]) => liveIds.has(id))
    .reduce(
      (summary, [, answer]) => {
        const totalAnnotations = countReferenceAnnotations(answer.referenceFindings);
        return {
          score: summary.score + countMatchedAnnotations(answer.aiFindings, answer.referenceFindings),
          totalQuestions: summary.totalQuestions + totalAnnotations
        };
      },
      { score: 0, totalQuestions: 0 }
    );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as SubmitQuizBody | null;
    const answers = Array.isArray(body?.answers) ? body.answers : [];
    if (!answers.length) {
      return NextResponse.json({ error: "No quiz answers were submitted." }, { status: 400 });
    }

    const doctor = await verifyDoctor(body?.token);
    const now = new Date();
    const startedAt = body?.startedAt || now.toISOString();
    const attemptId = `${doctor.uid}_${DATASET_VERSION}`;
    const scored = scoreAnswers(answers);

    if (hasAdminCredentials()) {
      const userRef = adminDb().collection("users").doc(doctor.uid);
      const userSnap = await userRef.get();
      if (!userSnap.exists || userSnap.data()?.role !== "doctor") {
        return NextResponse.json({ error: "Complete demographics before submitting the validation attempt." }, { status: 409 });
      }
      if (userSnap.data()?.hasCompletedQuiz) {
        return NextResponse.json({ error: "This doctor has already completed the validation quiz." }, { status: 409 });
      }

      const user = userSnap.data();
      const attempt = {
        attemptId,
        userId: doctor.uid,
        userName: user?.name || doctor.name,
        university: user?.university || "Not provided",
        datasetVersion: DATASET_VERSION,
        startedAt: new Date(startedAt),
        finishedAt: now,
        totalScore: scored.totalScore,
        totalQuestions: scored.totalQuestions,
        accuracy: scored.accuracy,
        timeTaken: scored.timeTaken,
        browser: body?.browser || "unknown",
        device: body?.device || "unknown",
        userAgent: body?.userAgent || "unknown",
        answers: scored.scoredAnswers,
        createdAt: FieldValue.serverTimestamp()
      };

      await adminDb().runTransaction(async (transaction) => {
        const attemptRef = adminDb().collection("quiz_attempts").doc(attemptId);
        const existing = await transaction.get(attemptRef);
        if (existing.exists) {
          throw new Error("This doctor has already completed the validation quiz.");
        }
        transaction.set(attemptRef, attempt);
        transaction.update(userRef, {
          hasCompletedQuiz: true,
          updatedAt: FieldValue.serverTimestamp()
        });
      });

      await adminDb().collection("leaderboard").doc(attemptId).set({
        participantId: doctor.uid,
        participantType: "doctor",
        name: attempt.userName,
        university: attempt.university,
        score: attempt.totalScore,
        totalQuestions: attempt.totalQuestions,
        accuracy: attempt.accuracy,
        timeTaken: attempt.timeTaken,
        datasetVersion: DATASET_VERSION,
        rank: 2,
        updatedAt: FieldValue.serverTimestamp()
      });
      const aiScore = scoreAiModel();
      await adminDb().collection("leaderboard").doc("ai-reference").set({
        participantId: "ai-reference",
        participantType: "ai",
        name: DEFAULT_AI_MODEL.modelName,
        university: "AI reference model",
        score: aiScore.score,
        totalQuestions: aiScore.totalQuestions,
        accuracy: aiScore.totalQuestions ? aiScore.score / aiScore.totalQuestions : 0,
        timeTaken: 0.064,
        datasetVersion: DATASET_VERSION,
        rank: 1,
        updatedAt: FieldValue.serverTimestamp()
      });

      return NextResponse.json(attempt);
    }

    return NextResponse.json(
      { error: "Server scoring requires Firebase Admin SDK environment variables on Vercel." },
      { status: 500 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit quiz attempt.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
