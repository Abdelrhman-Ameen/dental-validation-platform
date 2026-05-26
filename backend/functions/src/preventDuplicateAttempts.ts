import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";

export function attemptIdFor(userId: string, datasetVersion: string) {
  return `${userId}_${datasetVersion}`;
}

export async function assertNoDuplicateAttempt(userId: string, datasetVersion: string) {
  const attemptRef = db.collection("quiz_attempts").doc(attemptIdFor(userId, datasetVersion));
  const attempt = await attemptRef.get();
  if (attempt.exists) {
    throw new HttpsError("already-exists", "This doctor has already completed the quiz for this dataset version.");
  }
  return attemptRef;
}
