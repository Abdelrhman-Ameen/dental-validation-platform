"use client";

import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { DATASET_VERSION } from "@/lib/constants";
import { db } from "@/lib/firebase/client";
import type { AiModel, LeaderboardEntry, QuizAttempt, UserProfile } from "@/lib/types";

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function upsertDoctorProfile(profile: Omit<UserProfile, "createdAt" | "hasCompletedQuiz">) {
  await setDoc(
    doc(db, "users", profile.uid),
    {
      ...profile,
      role: "doctor",
      hasCompletedQuiz: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function completeOnboarding(
  uid: string,
  input: Pick<
    UserProfile,
    "name" | "university" | "country" | "governorate" | "specialty" | "yearsExperience" | "academicStage"
  >
) {
  await updateDoc(doc(db, "users", uid), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

export function subscribeLeaderboard(callback: (entries: LeaderboardEntry[]) => void, onError?: () => void) {
  const q = query(
    collection(db, "leaderboard"),
    where("datasetVersion", "==", DATASET_VERSION),
    orderBy("rank", "asc"),
    limit(50)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as LeaderboardEntry));
    },
    () => onError?.()
  );
}

export function subscribeMyAttempt(userId: string, callback: (attempt: QuizAttempt | null) => void, onError?: () => void) {
  const q = query(
    collection(db, "quiz_attempts"),
    where("userId", "==", userId),
    where("datasetVersion", "==", DATASET_VERSION),
    orderBy("finishedAt", "desc"),
    limit(1)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const docSnap = snapshot.docs[0];
      callback(docSnap ? ({ attemptId: docSnap.id, ...docSnap.data() } as QuizAttempt) : null);
    },
    () => onError?.()
  );
}

export function subscribeAiModels(callback: (models: AiModel[]) => void) {
  const q = query(collection(db, "ai_models"), where("datasetVersion", "==", DATASET_VERSION));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as AiModel));
    },
    () => callback([])
  );
}
