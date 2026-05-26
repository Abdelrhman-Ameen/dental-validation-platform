"use client";

import { useEffect, useState } from "react";
import { subscribeLeaderboard } from "@/lib/firestore";
import { demoLeaderboard } from "@/lib/mock-data";
import type { LeaderboardEntry } from "@/lib/types";

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = subscribeLeaderboard(
        (nextEntries) => {
          setEntries(nextEntries.length ? nextEntries : demoLeaderboard);
          setUsingDemoData(!nextEntries.length);
          setLoading(false);
        },
        () => {
          setEntries(demoLeaderboard);
          setUsingDemoData(true);
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch {
      setEntries(demoLeaderboard);
      setUsingDemoData(true);
      setLoading(false);
      return undefined;
    }
  }, []);

  return { entries, loading, usingDemoData };
}
