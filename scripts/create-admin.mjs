import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), "frontend", ".env.local"));

const [, , email, password, ...nameParts] = process.argv;
const displayName = nameParts.join(" ").trim() || "Research Admin";

if (!email || !password) {
  console.error("Usage: npm run admin:create -- admin@example.com StrongPassword123 \"Admin Name\"");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.");
  console.error("Create a Firebase service account key and add those values to .env.local or your shell environment.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, {
    password,
    displayName,
    emailVerified: true,
    disabled: false
  });
} catch (error) {
  if (error?.code !== "auth/user-not-found") {
    throw error;
  }
  user = await auth.createUser({
    email,
    password,
    displayName,
    emailVerified: true,
    disabled: false
  });
}

await auth.setCustomUserClaims(user.uid, { role: "admin" });
await db.collection("users").doc(user.uid).set(
  {
    uid: user.uid,
    name: displayName,
    email,
    role: "admin",
    university: "Dental AI Validation",
    country: "Research",
    governorate: "Research",
    specialty: "Research administration",
    yearsExperience: 0,
    academicStage: "Admin",
    hasCompletedQuiz: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  },
  { merge: true }
);

console.log(`Admin ready: ${email}`);
console.log(`UID: ${user.uid}`);
