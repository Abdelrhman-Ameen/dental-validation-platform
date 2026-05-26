import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";
import { rebuildLeaderboard } from "./generateLeaderboard.js";
import { assertNoDuplicateAttempt, attemptIdFor } from "./preventDuplicateAttempts.js";
import { DATASET_VERSION, TOTAL_QUESTIONS, type QuestionDoc, type QuizAnswerInput } from "./types.js";

type SubmitQuizPayload = {
  answers: QuizAnswerInput[];
  startedAt: string;
  browser?: string;
  device?: string;
  userAgent?: string;
};

export async function calculateScore(userId: string, payload: SubmitQuizPayload) {
  const datasetVersion = DATASET_VERSION;
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new HttpsError("failed-precondition", "Complete onboarding before submitting a quiz.");
  }
  const user = userSnap.data();
  if (user?.role !== "doctor") {
    throw new HttpsError("permission-denied", "Only doctors can submit quiz attempts.");
  }
  if (user.hasCompletedQuiz) {
    throw new HttpsError("already-exists", "This doctor has already completed the validation quiz.");
  }

  await assertNoDuplicateAttempt(userId, datasetVersion);

  const questionSnap = await db
    .collection("questions")
    .where("datasetVersion", "==", datasetVersion)
    .where("active", "==", true)
    .get();
  const answerKey = new Map<string, QuestionDoc>();
  questionSnap.docs.forEach((doc) => answerKey.set(doc.id, doc.data() as QuestionDoc));
  if (answerKey.size < TOTAL_QUESTIONS) {
    throw new HttpsError("failed-precondition", "The active validation set must contain at least 20 questions.");
  }

  const now = Timestamp.now();
  const startedAt = payload.startedAt ? Timestamp.fromDate(new Date(payload.startedAt)) : now;
  const scoredAnswers = payload.answers.slice(0, TOTAL_QUESTIONS).map((answer) => {
    const question = answerKey.get(answer.questionId);
    const correct = Boolean(question && answer.selectedAnswer && answer.selectedAnswer === question.correctAnswer);
    return {
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: question?.correctAnswer,
      correct,
      timeSpent: Math.max(0, Number(answer.timeSpent) || 0),
      confidence: Math.max(0, Math.min(100, Number(answer.confidence) || 0))
    };
  });

  const totalScore = scoredAnswers.filter((answer) => answer.correct).length;
  const totalQuestions = Math.min(TOTAL_QUESTIONS, scoredAnswers.length);
  const timeTaken = scoredAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0);
  const attemptId = attemptIdFor(userId, datasetVersion);
  const attemptRef = db.collection("quiz_attempts").doc(attemptId);

  const attempt = {
    attemptId,
    userId,
    userName: user?.name || "Doctor",
    university: user?.university || "Not provided",
    datasetVersion,
    startedAt,
    finishedAt: now,
    totalScore,
    totalQuestions,
    accuracy: totalQuestions ? totalScore / totalQuestions : 0,
    timeTaken,
    answers: scoredAnswers,
    browser: payload.browser || "unknown",
    device: payload.device || "unknown",
    userAgent: payload.userAgent || "unknown",
    createdAt: FieldValue.serverTimestamp()
  };

  await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(attemptRef);
    if (existing.exists) {
      throw new HttpsError("already-exists", "Duplicate attempt prevented.");
    }
    transaction.set(attemptRef, attempt);
    transaction.update(userRef, {
      hasCompletedQuiz: true,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  await db.collection("audit_logs").add({
    actorId: userId,
    action: "quiz_submitted",
    targetId: attemptId,
    datasetVersion,
    createdAt: FieldValue.serverTimestamp()
  });

  await rebuildLeaderboard(datasetVersion);
  return attempt;
}
