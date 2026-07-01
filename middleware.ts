// Password gate for the tutor.
// Public:  /tutor (landing), /tutor/login, and the login/logout API.
// Gated:   /tutor/<courseId> and the chat API.
// Everything else on the site is untouched.

import { NextResponse, type NextRequest } from "next/server";
import { TUTOR_COOKIE, expectedToken, safeEqual } from "./app/tutor/_lib/auth";

export const config = {
  // Only run on tutor paths so the rest of the site is unaffected.
  matcher: ["/tutor/:path*", "/api/tutor/:path*"],
};

function isPublic(pathname: string): boolean {
  return (
    pathname === "/tutor" ||
    pathname === "/tutor/" ||
    pathname === "/tutor/login" ||
    pathname === "/api/tutor/login" ||
    pathname === "/api/tutor/logout"
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const expected = await expectedToken();
  const cookie = req.cookies.get(TUTOR_COOKIE)?.value;
  const authed = !!expected && !!cookie && safeEqual(cookie, expected);
  if (authed) return NextResponse.next();

  // API -> 401 JSON; pages -> redirect to login with a return path.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/tutor/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
