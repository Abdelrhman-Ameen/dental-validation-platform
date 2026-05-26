import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const sessionDuration = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { token } = (await request.json()) as { token?: string };
    if (!token) {
      return NextResponse.json({ error: "Missing Firebase ID token." }, { status: 400 });
    }

    const decoded = await adminAuth().verifyIdToken(token);
    const userSnap = await adminDb().collection("users").doc(decoded.uid).get();
    const role = userSnap.exists ? userSnap.data()?.role || "doctor" : decoded.role || "doctor";
    const sessionCookie = await adminAuth().createSessionCookie(token, { expiresIn: sessionDuration });

    const response = NextResponse.json({ ok: true, role });
    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionDuration / 1000,
      path: "/"
    });
    response.cookies.set("role", String(role), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionDuration / 1000,
      path: "/"
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create session.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
