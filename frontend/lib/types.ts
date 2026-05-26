import type { Timestamp } from "firebase/firestore";

export type Role = "admin" | "doctor";

export type DentalCondition = "Cavity" | "Fillings" | "Implant" | "Impacted Tooth";

export type ToothFinding = {
  condition: DentalCondition;
  toothIds: string[];
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  university: string;
  country: string;
  governorate: string;
  specialty: string;
  yearsExperience: number;
  academicStage: string;
  createdAt: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
  hasCompletedQuiz: boolean;
};

export type QuestionDoc = {
  id: string;
  imageUrl: string;
  storagePath?: string;
  questionText: string;
  choices: DentalCondition[];
  correctAnswer: DentalCondition;
  aiPrediction: DentalCondition;
  aiFindings?: ToothFinding[];
  aiConfidence: number;
  difficulty: "easy" | "moderate" | "hard";
  active: boolean;
  datasetVersion: string;
  annotations?: Array<{
    label: DentalCondition;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }>;
};

export type QuizQuestion = Omit<QuestionDoc, "correctAnswer" | "active"> & {
  choices: DentalCondition[];
};

export type QuizAnswerInput = {
  questionId: string;
  selectedAnswer?: DentalCondition | "";
  selectedFindings: ToothFinding[];
  confidence?: number;
  timeSpent: number;
};

export type ScoredAnswer = QuizAnswerInput & {
  selectedAnswer?: DentalCondition;
  referenceFindings?: ToothFinding[];
  matchedAnnotations?: number;
  totalAnnotations?: number;
  correct: boolean;
};

export type QuizAttempt = {
  attemptId: string;
  userId: string;
  userName: string;
  university: string;
  datasetVersion: string;
  startedAt: Timestamp | Date | string;
  finishedAt: Timestamp | Date | string;
  totalScore: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  rank?: number;
  percentile?: number;
  browser?: string;
  device?: string;
  userAgent?: string;
  answers: ScoredAnswer[];
};

export type LeaderboardEntry = {
  id: string;
  participantId: string;
  participantType: "doctor" | "ai";
  name: string;
  university: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  datasetVersion: string;
  rank: number;
  updatedAt?: Timestamp | Date | string;
};

export type AiModel = {
  id?: string;
  modelName: string;
  precision: number;
  recall: number;
  f1: number;
  score: number;
  datasetVersion: string;
  notes?: string;
  createdAt?: Timestamp | Date | string;
};

export type DatasetCaseStatus = "live" | "hidden";

export type DatasetCase = {
  questionId: string;
  imageUrl: string;
  storagePath?: string;
  questionText: string;
  difficulty: "easy" | "moderate" | "hard";
  datasetVersion: string;
  status: DatasetCaseStatus;
  dominantCondition?: DentalCondition;
  annotationCount: number;
  referenceFindings?: ToothFinding[];
  aiFindings?: ToothFinding[];
  sourceFilename?: string;
  addedAt?: string;
  annotations?: Array<{
    label: DentalCondition;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }>;
};

export type AnalyticsSnapshot = {
  datasetVersion: string;
  totalParticipants: number;
  averageHumanScore: number;
  averageAiScore: number;
  topDoctorScore: number;
  hardestQuestion?: {
    questionId: string;
    accuracy: number;
  };
  easiestQuestion?: {
    questionId: string;
    accuracy: number;
  };
  accuracyDistribution: Array<{
    bucket: string;
    count: number;
  }>;
  timeAnalysis: Array<{
    label: string;
    seconds: number;
  }>;
  confusionMatrix: Array<{
    actual: DentalCondition;
    predicted: DentalCondition;
    count: number;
  }>;
};
