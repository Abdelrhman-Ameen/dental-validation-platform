import { BrainCircuit, Sigma, Trophy } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import type { LeaderboardEntry } from "@/lib/types";
import { summarizeLeaderboard } from "@/lib/scoring";

export function ComparisonCards({ entries }: { entries: LeaderboardEntry[] }) {
  const summary = summarizeLeaderboard(entries);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Human average"
        value={summary.averageHumanScore.toFixed(1)}
        hint={`${summary.humanCount} doctor attempts`}
        icon={Sigma}
      />
      <StatCard label="AI score" value={String(summary.aiScore)} hint="Reference model participant" icon={BrainCircuit} tone="emerald" />
      <StatCard label="Top doctor score" value={String(summary.topDoctorScore)} hint="Ties sorted by time" icon={Trophy} tone="amber" />
    </div>
  );
}
