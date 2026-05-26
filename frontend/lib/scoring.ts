import type { LeaderboardEntry, QuizAttempt } from "@/lib/types";

export function rankAttempt(attempt: QuizAttempt, entries: LeaderboardEntry[]) {
  const humanEntries = entries.filter((entry) => entry.participantType === "doctor");
  const better = humanEntries.filter((entry) => {
    if (entry.score > attempt.totalScore) {
      return true;
    }
    return entry.score === attempt.totalScore && entry.timeTaken < attempt.timeTaken;
  }).length;
  const rank = better + 1;
  const percentile = humanEntries.length <= 1 ? 100 : Math.round(((humanEntries.length - rank) / (humanEntries.length - 1)) * 100);
  return { rank, percentile };
}

export function summarizeLeaderboard(entries: LeaderboardEntry[]) {
  const doctors = entries.filter((entry) => entry.participantType === "doctor");
  const ai = entries.find((entry) => entry.participantType === "ai");
  const averageHumanScore = doctors.length
    ? doctors.reduce((sum, entry) => sum + entry.score, 0) / doctors.length
    : 0;
  const topDoctorScore = doctors[0]?.score ?? 0;

  return {
    humanCount: doctors.length,
    averageHumanScore,
    topDoctorScore,
    aiScore: ai?.score ?? 0
  };
}
