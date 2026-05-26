import { FieldValue } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";
import { auth, db } from "./admin.js";
import type { Role } from "./types.js";

export async function setRole(targetUid: string, role: Role, actorUid: string) {
  if (!targetUid || !["admin", "doctor"].includes(role)) {
    throw new HttpsError("invalid-argument", "A valid uid and role are required.");
  }

  await auth.setCustomUserClaims(targetUid, { role });
  await db.collection("users").doc(targetUid).set(
    {
      uid: targetUid,
      role,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  await db.collection("audit_logs").add({
    actorId: actorUid,
    action: "role_changed",
    targetId: targetUid,
    role,
    createdAt: FieldValue.serverTimestamp()
  });

  return { ok: true };
}
