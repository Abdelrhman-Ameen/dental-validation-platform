"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, type FirestoreError } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { DATASET_VERSION } from "@/lib/constants";
import { demoAnalytics } from "@/lib/mock-data";
import type { AiModel, AnalyticsSnapshot, LeaderboardEntry, QuizAttempt, UserProfile } from "@/lib/types";

export function useAdminCollections() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [models, setModels] = useState<AiModel[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [analytics] = useState<AnalyticsSnapshot>(demoAnalytics);

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];
    const handleError = (collectionName: string, error?: FirestoreError) => {
      if (error?.code === "permission-denied") {
        setError(`You do not have permission to monitor ${collectionName}.`);
        return;
      }
      setError(error?.message || `Could not monitor ${collectionName}.`);
    };
    try {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "users"), orderBy("createdAt", "desc"), limit(200)),
          (snapshot) => {
            setError("");
            setUsers(snapshot.docs.map((doc) => doc.data() as UserProfile));
          },
          (listenerError) => {
            setUsers([]);
            handleError("users", listenerError);
          }
        )
      );
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "quiz_attempts"), orderBy("finishedAt", "desc"), limit(200)),
          (snapshot) => {
            setError("");
            setAttempts(snapshot.docs.map((doc) => ({ attemptId: doc.id, ...doc.data() }) as QuizAttempt));
          },
          (listenerError) => {
            setAttempts([]);
            handleError("quiz attempts", listenerError);
          }
        )
      );
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "ai_models"), orderBy("createdAt", "desc"), limit(20)),
          (snapshot) => {
            setError("");
            setModels(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AiModel));
          },
          (listenerError) => {
            setModels([]);
            handleError("AI models", listenerError);
          }
        )
      );
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "leaderboard"), orderBy("rank", "asc"), limit(50)),
          (snapshot) => {
            setError("");
            setLeaderboard(
              snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }) as LeaderboardEntry)
                .filter((entry) => entry.datasetVersion === DATASET_VERSION)
            );
          },
          (listenerError) => {
            setLeaderboard([]);
            handleError("leaderboard", listenerError);
          }
        )
      );
    } catch {
      setUsers([]);
      setAttempts([]);
      setModels([]);
      setLeaderboard([]);
      handleError("admin collections");
    }

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  return { users, attempts, models, analytics, leaderboard, activeUsers: users.length, error };
}
