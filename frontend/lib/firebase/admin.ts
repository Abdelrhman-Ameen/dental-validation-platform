import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function privateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const key = privateKey();

  if (!projectId || !clientEmail || !key) {
    throw new Error("Missing Firebase Admin environment variables.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: key
    })
  });
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  return getFirestore(getAdminApp());
}

export async function verifySession(sessionCookie?: string) {
  if (!sessionCookie) {
    return null;
  }
  try {
    return await adminAuth().verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}
