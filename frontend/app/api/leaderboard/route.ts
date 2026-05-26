import { NextResponse, type NextRequest } from "next/server";
import { DATASET_VERSION } from "@/lib/constants";
import { adminDb, verifySession } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  const decoded = await verifySession(request.cookies.get("__session")?.value);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const datasetVersion = request.nextUrl.searchParams.get("datasetVersion") || DATASET_VERSION;
  const snapshot = await adminDb()
    .collection("leaderboard")
    .where("datasetVersion", "==", datasetVersion)
    .orderBy("rank", "asc")
    .limit(100)
    .get();

  return NextResponse.json({
    entries: snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  });
}
