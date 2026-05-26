"use client";

import { httpsCallable } from "firebase/functions";
import { auth } from "@/lib/firebase/client";
import { functions } from "@/lib/firebase/client";
import { localSimulationQuestions } from "@/lib/local-simulation-questions";
import type { AnalyticsSnapshot, QuizAnswerInput, QuizAttempt, QuizQuestion } from "@/lib/types";

export async function getQuizQuestions() {
  const callable = httpsCallable<{ datasetVersion?: string }, { questions: QuizQuestion[] }>(functions, "getQuizQuestions");
  try {
    const result = await callable({});
    return result.data.questions.length ? result.data.questions : localSimulationQuestions;
  } catch {
    return localSimulationQuestions;
  }
}

export async function submitQuizAttempt(input: {
  answers: QuizAnswerInput[];
  startedAt: string;
  browser: string;
  device: string;
  userAgent: string;
}) {
  const response = await fetch("/api/submit-quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...input,
      token: await auth.currentUser?.getIdToken(true)
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not submit quiz attempt.");
  }
  return data as QuizAttempt;
}

export async function getAnalyticsSnapshot(datasetVersion?: string) {
  const callable = httpsCallable<{ datasetVersion?: string }, AnalyticsSnapshot>(functions, "getAnalytics");
  const result = await callable({ datasetVersion });
  return result.data;
}

export async function assignUserRole(input: { uid: string; role: "admin" | "doctor" }) {
  const callable = httpsCallable<typeof input, { ok: boolean }>(functions, "setUserRole");
  const result = await callable(input);
  return result.data;
}
