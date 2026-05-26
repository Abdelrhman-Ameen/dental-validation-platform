import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/quiz", "/leaderboard", "/onboarding", "/admin"];
const publicAuthPages = ["/login", "/register"];

function clearSession(response: NextResponse) {
  for (const name of ["__session", "role"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    });
  }
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("__session")?.value;
  const role = request.cookies.get("role")?.value;

  if (pathname.startsWith("/onboarding") && role === "admin") {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", "/onboarding");
    return clearSession(NextResponse.redirect(login));
  }

  if (publicAuthPages.some((prefix) => pathname.startsWith(prefix)) && session) {
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/quiz", request.url));
  }

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(role === "doctor" ? "/quiz" : "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|static|logos|icons).*)"]
};
