import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./admin.js";
import { buildAnalytics } from "./analytics.js";
import { calculateScore } from "./calculateScore.js";
import { rebuildLeaderboard } from "./generateLeaderboard.js";
import { requireAdmin, requireAuth } from "./security.js";
import { setRole } from "./setAdminRole.js";
import { DATASET_VERSION, TOTAL_QUESTIONS, type QuestionDoc } from "./types.js";

function shuffle<T>(items: T[]) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export const getQuizQuestions = onCall({ region: "us-central1" }, async (request) => {
  requireAuth(request.auth?.uid);
  const datasetVersion = request.data?.datasetVersion || DATASET_VERSION;
  const snapshot = await db
    .collection("questions")
    .where("datasetVersion", "==", datasetVersion)
    .where("active", "==", true)
    .get();

  const questions = shuffle(
    snapshot.docs.map((doc) => {
      const data = doc.data() as QuestionDoc;
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        storagePath: data.storagePath,
        questionText: data.questionText,
        choices: data.choices,
        aiPrediction: data.aiPrediction,
        aiConfidence: data.aiConfidence,
        difficulty: data.difficulty,
        datasetVersion: data.datasetVersion,
        annotations: data.annotations || []
      };
    })
  ).slice(0, TOTAL_QUESTIONS);

  return { questions };
});

export const submitQuiz = onCall({ region: "us-central1" }, async (request) => {
  const uid = requireAuth(request.auth?.uid);
  const attempt = await calculateScore(uid, request.data);
  const leaderboardSnap = await db
    .collection("leaderboard")
    .where("datasetVersion", "==", attempt.datasetVersion)
    .orderBy("rank", "asc")
    .get();
  const entry = leaderboardSnap.docs.find((doc) => doc.data().participantId === uid)?.data();
  return {
    ...attempt,
    rank: entry?.rank,
    percentile: leaderboardSnap.size > 1 && entry?.rank
      ? Math.round(((leaderboardSnap.size - entry.rank) / (leaderboardSnap.size - 1)) * 100)
      : 100
  };
});

export const refreshLeaderboard = onCall({ region: "us-central1" }, async (request) => {
  await requireAdmin(request.auth?.uid);
  const count = await rebuildLeaderboard(request.data?.datasetVersion || DATASET_VERSION);
  return { ok: true, count };
});

export const getAnalytics = onCall({ region: "us-central1" }, async (request) => {
  await requireAdmin(request.auth?.uid);
  return buildAnalytics(request.data?.datasetVersion || DATASET_VERSION);
});

export const setUserRole = onCall({ region: "us-central1" }, async (request) => {
  const actorUid = await requireAdmin(request.auth?.uid);
  return setRole(request.data?.uid, request.data?.role, actorUid);
});

export const exportAttemptsCsv = onCall({ region: "us-central1" }, async (request) => {
  await requireAdmin(request.auth?.uid);
  const datasetVersion = request.data?.datasetVersion || DATASET_VERSION;
  const snapshot = await db
    .collection("quiz_attempts")
    .where("datasetVersion", "==", datasetVersion)
    .orderBy("finishedAt", "desc")
    .get();
  const headers = ["attemptId", "userId", "userName", "university", "totalScore", "totalQuestions", "accuracy", "timeTaken"];
  const rows = snapshot.docs.map((doc) => {
    const data = doc.data();
    return headers.map((header) => JSON.stringify(data[header] ?? doc.id)).join(",");
  });
  return [headers.join(","), ...rows].join("\n");
});

export const auditAdminNote = onCall({ region: "us-central1" }, async (request) => {
  const uid = await requireAdmin(request.auth?.uid);
  const note = String(request.data?.note || "").trim();
  if (!note) {
    throw new HttpsError("invalid-argument", "Audit note cannot be empty.");
  }
  await db.collection("audit_logs").add({
    actorId: uid,
    action: "admin_note",
    note,
    createdAt: FieldValue.serverTimestamp()
  });
  return { ok: true };
});
