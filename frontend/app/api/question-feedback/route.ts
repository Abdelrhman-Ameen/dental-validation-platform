import { NextResponse, type NextRequest } from "next/server";
import { localSimulationAnswerKey } from "@/lib/local-simulation-answer-key";

export async function POST(request: NextRequest) {
  if (!request.cookies.get("__session")?.value) {
    return NextResponse.json({ error: "Please sign in before viewing feedback." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { questionId?: string } | null;
  const questionId = body?.questionId;
  if (!questionId || !localSimulationAnswerKey[questionId]) {
    return NextResponse.json({ error: "Question feedback is not available." }, { status: 404 });
  }

  const answer = localSimulationAnswerKey[questionId];
  return NextResponse.json({
    questionId,
    aiFindings: answer.aiFindings,
    referenceFindings: answer.referenceFindings,
    dominantCondition: answer.dominantCondition
  });
}
