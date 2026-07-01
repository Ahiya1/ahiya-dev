import { NextResponse } from "next/server";
import { TUTOR_COOKIE, computeToken } from "../../../tutor/_lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const password = process.env.TUTOR_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "Tutor gate not configured." },
      { status: 500 },
    );
  }
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!body.password || body.password !== password) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }
  const token = await computeToken(password);
  const res = NextResponse.json({ ok: true });
  // Scope the cookie to the registrable domain so it is valid on both the apex
  // and www hosts (host-only on preview *.vercel.app deployments).
  const host = (req.headers.get("host") || "").split(":")[0];
  const domain = host.endsWith("ahiya.dev") ? ".ahiya.dev" : undefined;
  res.cookies.set(TUTOR_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
