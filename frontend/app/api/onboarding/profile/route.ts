import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

type OnboardingInput = {
  token?: string;
  name?: string;
  university?: string;
  country?: string;
  governorate?: string;
  specialty?: string;
  yearsExperience?: number;
  academicStage?: string;
};

type VerifiedUser = {
  uid: string;
  email: string;
  name: string;
};

function hasAdminCredentials() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

function cleanText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function cleanYears(value: unknown) {
  const years = Number(value);
  if (!Number.isFinite(years) || years < 0 || years > 70) {
    throw new Error("Years of experience must be between 0 and 70.");
  }
  return years;
}

async function verifyWithFirebaseAuthRest(token: string): Promise<VerifiedUser> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Firebase web API key.");
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idToken: token })
  });
  const data = (await response.json()) as {
    error?: { message?: string };
    users?: Array<{
      localId: string;
      email?: string;
      displayName?: string;
    }>;
  };

  if (!response.ok || !data.users?.[0]) {
    throw new Error(data.error?.message || "Unable to verify Firebase user.");
  }

  const user = data.users[0];
  return {
    uid: user.localId,
    email: user.email || "",
    name: user.displayName || user.email || "Doctor"
  };
}

async function verifyUser(token: string): Promise<VerifiedUser> {
  if (hasAdminCredentials()) {
    const decoded = await adminAuth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name || decoded.email || "Doctor"
    };
  }

  return verifyWithFirebaseAuthRest(token);
}

function firestoreValue(value: string | number | boolean) {
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  return { booleanValue: value };
}

async function fetchFirestoreDocument(uid: string, token: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing Firebase project ID.");
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 404) {
    return { exists: false };
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(data?.error?.message || "Unable to read your existing demographic profile.");
  }

  return { exists: true };
}

async function saveWithFirestoreRest(uid: string, token: string, fields: Record<string, string | number | boolean>) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing Firebase project ID.");
  }

  const existing = await fetchFirestoreDocument(uid, token);
  const now = new Date().toISOString();
  const writableFields = existing.exists
    ? {
        name: fields.name,
        university: fields.university,
        country: fields.country,
        governorate: fields.governorate,
        specialty: fields.specialty,
        yearsExperience: fields.yearsExperience,
        academicStage: fields.academicStage
      }
    : {
        ...fields,
        uid,
        role: "doctor",
        hasCompletedQuiz: false,
        createdAt: now
      };

  const bodyFields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries({
    ...writableFields,
    updatedAt: now
  })) {
    bodyFields[key] = key === "createdAt" || key === "updatedAt" ? { timestampValue: String(value) } : firestoreValue(value);
  }

  const mask = Object.keys(bodyFields)
    .map((key) => `updateMask.fieldPaths=${encodeURIComponent(key)}`)
    .join("&");
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${encodeURIComponent(uid)}?${mask}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: bodyFields })
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(data?.error?.message || "Firestore rejected the demographic profile save.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as OnboardingInput;
    if (!input.token) {
      return NextResponse.json({ error: "Please sign in again before saving demographics." }, { status: 401 });
    }

    const verifiedUser = await verifyUser(input.token);
    const yearsExperience = cleanYears(input.yearsExperience);
    const profileFields = {
      name: cleanText(input.name || verifiedUser.name, "Full name"),
      email: verifiedUser.email,
      university: cleanText(input.university, "University"),
      country: cleanText(input.country, "Country"),
      governorate: cleanText(input.governorate, "Governorate"),
      specialty: cleanText(input.specialty, "Specialty"),
      yearsExperience,
      academicStage: cleanText(input.academicStage, "Student or graduate")
    };

    if (!verifiedUser.email) {
      return NextResponse.json({ error: "Your Firebase account must have an email address." }, { status: 400 });
    }

    if (hasAdminCredentials()) {
      const ref = adminDb().collection("users").doc(verifiedUser.uid);
      const snap = await ref.get();
      await ref.set(
        {
          ...profileFields,
          uid: verifiedUser.uid,
          role: "doctor",
          hasCompletedQuiz: false,
          ...(snap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    } else {
      await saveWithFirestoreRest(verifiedUser.uid, input.token, profileFields);
    }

    const savedProfile = {
      ...profileFields,
      uid: verifiedUser.uid,
      role: "doctor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasCompletedQuiz: false
    };
    const response = NextResponse.json({
      profile: {
        ...savedProfile
      }
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save demographic profile.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
