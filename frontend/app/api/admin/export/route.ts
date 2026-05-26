import { NextResponse, type NextRequest } from "next/server";
import { DATASET_VERSION } from "@/lib/constants";
import { adminDb, verifySession } from "@/lib/firebase/admin";
import { toCsv } from "@/lib/utils";

async function isAdmin(uid: string) {
  const snap = await adminDb().collection("users").doc(uid).get();
  return snap.exists && snap.data()?.role === "admin";
}

export async function GET(request: NextRequest) {
  const decoded = await verifySession(request.cookies.get("__session")?.value);
  if (!decoded || !(await isAdmin(decoded.uid))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const datasetVersion = request.nextUrl.searchParams.get("datasetVersion") || DATASET_VERSION;
  const snapshot = await adminDb()
    .collection("quiz_attempts")
    .where("datasetVersion", "==", datasetVersion)
    .orderBy("finishedAt", "desc")
    .get();

  const csv = toCsv(
    snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        attemptId: doc.id,
        userId: data.userId,
        userName: data.userName,
        university: data.university,
        totalScore: data.totalScore,
        totalQuestions: data.totalQuestions,
        accuracy: data.accuracy,
        timeTaken: data.timeTaken,
        startedAt: data.startedAt?.toDate?.().toISOString?.() || "",
        finishedAt: data.finishedAt?.toDate?.().toISOString?.() || ""
      };
    })
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quiz-attempts-${datasetVersion}.csv"`
    }
  });
}
