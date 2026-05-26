import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { adminDb, verifySession } from "@/lib/firebase/admin";
import { lookupAnnotations } from "@/lib/annotation-lookup";
import { setCaseStatus } from "@/lib/dataset-status-store";
import { localSimulationQuestions } from "@/lib/local-simulation-questions";
import { localSimulationAnswerKey } from "@/lib/local-simulation-answer-key";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const QUESTIONS_FILE = resolve(process.cwd(), "lib/local-simulation-questions.ts");
const ANSWER_KEY_FILE = resolve(process.cwd(), "lib/local-simulation-answer-key.ts");

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (!cloudinaryUrl && (!cloudName || !apiKey || !apiSecret)) {
    throw new Error("Cloudinary server environment variables are not configured.");
  }

  cloudinary.config({
    ...(cloudName && apiKey && apiSecret
      ? {
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret
        }
      : {}),
    secure: true
  });
}

async function assertAdmin(request: NextRequest) {
  const decoded = await verifySession(request.cookies.get("__session")?.value);
  if (!decoded) {
    return null;
  }

  const profile = await adminDb().collection("users").doc(decoded.uid).get();
  if (!profile.exists || profile.data()?.role !== "admin") {
    return null;
  }

  return decoded;
}

async function uploadBuffer(buffer: Buffer, originalName: string, mimeType: string) {
  configureCloudinary();

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "dental-ai/datasets",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        quality: "auto:best",
        context: {
          originalName
        },
        format: mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : undefined
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed."));
          return;
        }
        resolve(result);
      }
    );

    upload.end(buffer);
  });
}

function getNextQuestionId(): string {
  const existingIds = localSimulationQuestions.map((q) => q.id);
  const existingAnswerIds = Object.keys(localSimulationAnswerKey);
  const allIds = new Set([...existingIds, ...existingAnswerIds]);

  let maxNum = 0;
  for (const id of allIds) {
    const match = id.match(/^q(\d+)$/);
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  }
  return `q${maxNum + 1}`;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await assertAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
    }

    const formData = await request.formData();
    const upload = formData.get("file");

    if (!(upload instanceof File)) {
      return NextResponse.json({ error: "Upload a valid image file." }, { status: 400 });
    }

    if (!ACCEPTED_IMAGE_TYPES.has(upload.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, and WebP images are allowed." }, { status: 415 });
    }

    if (upload.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be 10MB or smaller." }, { status: 413 });
    }

    if (upload.size === 0) {
      return NextResponse.json({ error: "Image file is empty." }, { status: 400 });
    }

    const buffer = Buffer.from(await upload.arrayBuffer());
    const result = await uploadBuffer(buffer, upload.name, upload.type);
    const imageUrl = result.secure_url;
    const publicId = result.public_id;

    await adminDb().collection("dataset_images").add({
      imageUrl,
      publicId,
      uploadedBy: admin.uid,
      uploadedAt: FieldValue.serverTimestamp(),
      originalName: upload.name,
      bytes: upload.size,
      mimeType: upload.type,
      width: result.width,
      height: result.height
    });

    // Auto-detect annotations from _annotations.csv
    const annotations = lookupAnnotations(upload.name);
    let annotationResponse = {};

    if (annotations) {
      const questionId = getNextQuestionId();

      // Add to local simulation questions
      const newQuestion = {
        id: questionId,
        imageUrl: imageUrl,
        storagePath: `cloudinary:${publicId}`,
        questionText: "Identify the dominant radiographic finding in this dental image.",
        choices: ["Cavity", "Fillings", "Implant", "Impacted Tooth"],
        aiPrediction: annotations.dominantCondition,
        aiConfidence: 0.95,
        difficulty: annotations.difficulty,
        datasetVersion: "dataset_v1",
        annotations: annotations.annotations,
      };

      const updatedQuestions = [...localSimulationQuestions, newQuestion];
      const questionsContent = `import type { QuizQuestion } from "@/lib/types";\n\nexport const localSimulationQuestions: QuizQuestion[] = ${JSON.stringify(updatedQuestions, null, 2)};\n`;

      if (existsSync(QUESTIONS_FILE)) {
        writeFileSync(QUESTIONS_FILE, questionsContent, "utf8");
      }

      // Add to answer key
      const updatedAnswerKey = {
        ...localSimulationAnswerKey,
        [questionId]: {
          dominantCondition: annotations.dominantCondition,
          referenceFindings: annotations.referenceFindings,
          aiFindings: annotations.aiFindings,
        },
      };
      const answerKeyContent = `import "server-only";\n\nimport type { DentalCondition, ToothFinding } from "@/lib/types";\n\ntype LocalSimulationAnswer = {\n  dominantCondition: DentalCondition;\n  referenceFindings: ToothFinding[];\n  aiFindings: ToothFinding[];\n};\n\nexport const localSimulationAnswerKey: Record<string, LocalSimulationAnswer> = ${JSON.stringify(updatedAnswerKey, null, 2)};\n`;

      if (existsSync(ANSWER_KEY_FILE)) {
        writeFileSync(ANSWER_KEY_FILE, answerKeyContent, "utf8");
      }

      // Set status to hidden by default
      setCaseStatus(questionId, "hidden");

      annotationResponse = {
        annotationsFound: true,
        dominantCondition: annotations.dominantCondition,
        annotationCount: annotations.annotations.length,
        questionId,
        referenceFindings: annotations.referenceFindings,
      };
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      publicId,
      ...annotationResponse,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not upload image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await assertAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
    }

    const snapshot = await adminDb()
      .collection("dataset_images")
      .orderBy("uploadedAt", "desc")
      .limit(40)
      .get();

    return NextResponse.json({
      images: snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          imageUrl: data.imageUrl,
          publicId: data.publicId,
          originalName: data.originalName,
          uploadedBy: data.uploadedBy,
          uploadedAt: data.uploadedAt?.toDate?.().toISOString?.() || null,
          bytes: data.bytes,
          mimeType: data.mimeType,
          width: data.width,
          height: data.height
        };
      })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load uploaded images.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
