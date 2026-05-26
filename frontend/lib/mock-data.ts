import { DATASET_VERSION } from "@/lib/constants";
import { localSimulationQuestions } from "@/lib/local-simulation-questions";
import type { AnalyticsSnapshot, LeaderboardEntry, QuizQuestion } from "@/lib/types";

export const demoQuestions: QuizQuestion[] = localSimulationQuestions;

export const demoLeaderboard: LeaderboardEntry[] = [
  {
    id: "ai-reference",
    participantId: "ai-reference",
    participantType: "ai",
    name: "DeiT+CoAtNet Cross-Attention",
    university: "AI reference model",
    score: 19,
    totalQuestions: 20,
    accuracy: 0.95,
    timeTaken: 64,
    datasetVersion: DATASET_VERSION,
    rank: 1
  },
  {
    id: "demo-1",
    participantId: "demo-1",
    participantType: "doctor",
    name: "Dr. Sarah Jenkins",
    university: "Stanford Medicine",
    score: 18,
    totalQuestions: 20,
    accuracy: 0.9,
    timeTaken: 1374,
    datasetVersion: DATASET_VERSION,
    rank: 2
  },
  {
    id: "demo-2",
    participantId: "demo-2",
    participantType: "doctor",
    name: "Dr. Michael Chen",
    university: "General Hospital",
    score: 16,
    totalQuestions: 20,
    accuracy: 0.8,
    timeTaken: 1548,
    datasetVersion: DATASET_VERSION,
    rank: 3
  }
];

export const demoAnalytics: AnalyticsSnapshot = {
  datasetVersion: DATASET_VERSION,
  totalParticipants: 45,
  averageHumanScore: 15.8,
  averageAiScore: 19,
  topDoctorScore: 18,
  hardestQuestion: { questionId: "q7", accuracy: 0.42 },
  easiestQuestion: { questionId: "q15", accuracy: 0.93 },
  accuracyDistribution: [
    { bucket: "0-25%", count: 1 },
    { bucket: "26-50%", count: 4 },
    { bucket: "51-75%", count: 16 },
    { bucket: "76-90%", count: 20 },
    { bucket: "91-100%", count: 4 }
  ],
  timeAnalysis: [
    { label: "Q1-Q5", seconds: 62 },
    { label: "Q6-Q10", seconds: 71 },
    { label: "Q11-Q15", seconds: 68 },
    { label: "Q16-Q20", seconds: 75 }
  ],
  confusionMatrix: [
    { actual: "Cavity", predicted: "Cavity", count: 31 },
    { actual: "Cavity", predicted: "Fillings", count: 5 },
    { actual: "Fillings", predicted: "Fillings", count: 130 },
    { actual: "Implant", predicted: "Implant", count: 48 },
    { actual: "Impacted Tooth", predicted: "Impacted Tooth", count: 22 }
  ]
};
