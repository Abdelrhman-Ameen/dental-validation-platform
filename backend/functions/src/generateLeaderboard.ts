import { FieldValue } from "firebase-admin/firestore";
import { db } from "./admin.js";
import { DATASET_VERSION, TOTAL_QUESTIONS, type AiModel } from "./types.js";

type LeaderboardCandidate = {
  id: string;
  participantId: string;
  participantType: "doctor" | "ai";
  name: string;
  university: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  datasetVersion: string;
};

export async function rebuildLeaderboard(datasetVersion = DATASET_VERSION) {
  const attemptsSnap = await db
    .collection("quiz_attempts")
    .where("datasetVersion", "==", datasetVersion)
    .get();
  const modelsSnap = await db.collection("ai_models").where("datasetVersion", "==", datasetVersion).get();

  const candidates: LeaderboardCandidate[] = attemptsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      participantId: data.userId,
      participantType: "doctor",
      name: data.userName || "Doctor",
      university: data.university || "Not provided",
      score: data.totalScore || 0,
      totalQuestions: data.totalQuestions || TOTAL_QUESTIONS,
      accuracy: data.accuracy || 0,
      timeTaken: data.timeTaken || 0,
      datasetVersion
    };
  });

  modelsSnap.docs.forEach((doc) => {
    const data = doc.data() as AiModel;
    candidates.push({
      id: `ai_${doc.id}`,
      participantId: doc.id,
      participantType: "ai",
      name: data.modelName,
      university: "AI reference model",
      score: data.score,
      totalQuestions: TOTAL_QUESTIONS,
      accuracy: data.score / TOTAL_QUESTIONS,
      timeTaken: (data.inferenceMs || 64) / 1000,
      datasetVersion
    });
  });

  candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeTaken - b.timeTaken;
  });

  const batch = db.batch();
  const existing = await db.collection("leaderboard").where("datasetVersion", "==", datasetVersion).get();
  existing.docs.forEach((doc) => batch.delete(doc.ref));
  candidates.forEach((candidate, index) => {
    const ref = db.collection("leaderboard").doc(candidate.id);
    batch.set(ref, {
      ...candidate,
      rank: index + 1,
      updatedAt: FieldValue.serverTimestamp()
    });
  });
  await batch.commit();
  return candidates.length;
}
