import { HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin.js";

export function requireAuth(uid?: string) {
  if (!uid) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  return uid;
}

export async function requireAdmin(uid?: string) {
  const safeUid = requireAuth(uid);
  const snap = await db.collection("users").doc(safeUid).get();
  if (!snap.exists || snap.data()?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin access is required.");
  }
  return safeUid;
}
