export type Role = "admin" | "doctor";

export type DentalCondition = "Cavity" | "Fillings" | "Implant" | "Impacted Tooth";

export type ToothFinding = {
  condition: DentalCondition;
  toothIds: string[];
};

export type QuestionDoc = {
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

export type QuizAnswerInput = {
  questionId: string;
  selectedAnswer?: DentalCondition | "";
  selectedFindings?: ToothFinding[];
  timeSpent: number;
  confidence?: number;
};

export type AiModel = {
  modelName: string;
  precision: number;
  recall: number;
  f1: number;
  score: number;
  datasetVersion: string;
  inferenceMs?: number;
};

export const DATASET_VERSION = "dataset_v1";
export const TOTAL_QUESTIONS = 20;
export const DENTAL_CONDITIONS: DentalCondition[] = ["Cavity", "Fillings", "Implant", "Impacted Tooth"];
