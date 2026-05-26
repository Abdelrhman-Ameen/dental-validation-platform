import { z } from "zod";
import { DENTAL_CONDITIONS } from "@/lib/constants";

export const onboardingSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  university: z.string().min(2, "University is required."),
  country: z.string().min(2, "Country is required."),
  governorate: z.string().min(2, "Governorate is required."),
  specialty: z.string().min(2, "Specialty is required."),
  yearsExperience: z.coerce.number().min(0).max(70),
  academicStage: z.string().min(2, "Academic stage is required.")
});

export const questionSchema = z.object({
  imageUrl: z.string().url(),
  questionText: z.string().min(8),
  choices: z.array(z.enum(DENTAL_CONDITIONS as [string, ...string[]])).min(2),
  correctAnswer: z.enum(DENTAL_CONDITIONS as [string, ...string[]]),
  aiPrediction: z.enum(DENTAL_CONDITIONS as [string, ...string[]]),
  aiConfidence: z.coerce.number().min(0).max(1),
  difficulty: z.enum(["easy", "moderate", "hard"]),
  active: z.boolean(),
  datasetVersion: z.string().min(2)
});
