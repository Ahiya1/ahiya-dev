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
  res.cookies.set(TUTOR_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
