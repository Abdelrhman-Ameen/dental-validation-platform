"use client";

import { AppShell } from "@/components/common/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ComparisonCards } from "@/components/leaderboard/comparison-cards";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Badge } from "@/components/ui/badge";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export function LeaderboardClient() {
  return (
    <AuthGuard role="doctor">
      <AppShell>
        <LeaderboardWorkspace />
      </AppShell>
    </AuthGuard>
  );
}

export function LeaderboardWorkspace() {
  const { entries, usingDemoData } = useLeaderboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Live benchmark</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Leaderboard</h1>
          <p className="mt-2 text-muted-foreground">
            Doctors are ranked by score, then completion time. The AI model is included as a participant.
          </p>
        </div>
        {usingDemoData ? <Badge variant="warning">Demo data</Badge> : <Badge variant="success">Realtime</Badge>}
      </div>
      <ComparisonCards entries={entries} />
      <LeaderboardTable entries={entries} />
    </div>
  );
}
