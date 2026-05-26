"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrainCircuit, Clock, Gauge, Percent, Trophy } from "lucide-react";
import { AppShell } from "@/components/common/app-shell";
import { StatCard } from "@/components/common/stat-card";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ComparisonCards } from "@/components/leaderboard/comparison-cards";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { subscribeMyAttempt } from "@/lib/firestore";
import { rankAttempt } from "@/lib/scoring";
import type { QuizAttempt } from "@/lib/types";
import { formatPercent, formatSeconds } from "@/lib/utils";

export function ResultsClient() {
  return (
    <AuthGuard role="doctor">
      <AppShell>
        <ResultsWorkspace />
      </AppShell>
    </AuthGuard>
  );
}

function ResultsWorkspace() {
  const { user } = useAuth();
  const { entries } = useLeaderboard();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (!user) {
      return undefined;
    }
    return subscribeMyAttempt(user.uid, setAttempt, () => setAttempt(null));
  }, [user]);

  if (!attempt) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>No submitted result yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Complete the validation quiz once to generate a scored attempt, rank, percentile, and AI comparison.
          </p>
          <Button asChild>
            <Link href="/quiz">Start quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const derivedRank = rankAttempt(attempt, entries);
  const rank = attempt.rank || derivedRank.rank;
  const percentile = attempt.percentile || derivedRank.percentile;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Validation result</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Your external validation score</h1>
        <p className="mt-2 text-muted-foreground">
          Server-side scoring completed for dataset version {attempt.datasetVersion}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Score" value={`${attempt.totalScore}/${attempt.totalQuestions}`} icon={Gauge} />
        <StatCard label="Accuracy" value={formatPercent(attempt.accuracy)} icon={Percent} tone="emerald" />
        <StatCard label="Rank" value={`#${rank}`} icon={Trophy} tone="amber" />
        <StatCard label="Time" value={formatSeconds(attempt.timeTaken)} icon={Clock} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            AI comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonCards entries={entries} />
          <p className="mt-4 text-sm text-muted-foreground">
            Percentile: {percentile}th among submitted human attempts. AI appears as a fixed participant for direct ranking.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-normal">Leaderboard preview</h2>
        <LeaderboardTable entries={entries.slice(0, 8)} />
      </div>
    </div>
  );
}
