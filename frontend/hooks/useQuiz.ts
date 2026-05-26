"use client";

import { useEffect, useState } from "react";
import { getQuizQuestions } from "@/lib/functions";
import { demoQuestions } from "@/lib/mock-data";
import type { QuizQuestion } from "@/lib/types";

export function useQuizQuestions() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const nextQuestions = await getQuizQuestions();
        if (!cancelled) {
          setQuestions(nextQuestions);
          setUsingDemoData(false);
        }
      } catch (err) {
        if (!cancelled) {
          setQuestions(demoQuestions);
          setUsingDemoData(true);
          setError(err instanceof Error ? err.message : "Using local demo images because Firebase is not configured.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, loading, error, usingDemoData };
}
