import { NextResponse, type NextRequest } from "next/server";
import { adminDb, verifySession } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;
  if (!session) {
    return NextResponse.json({ profile: null });
  }

  try {
    const decoded = await verifySession(session);
    if (!decoded) {
      return NextResponse.json({ profile: null }, { status: 401 });
    }
    const snap = await adminDb().collection("users").doc(decoded.uid).get();
    return NextResponse.json({
      profile: snap.exists ? { uid: decoded.uid, ...snap.data() } : null
    });
  } catch {
    return NextResponse.json({ profile: null }, { status: 401 });
  }
}
