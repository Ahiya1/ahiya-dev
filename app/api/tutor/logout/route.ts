import { NextResponse } from "next/server";
import { TUTOR_COOKIE } from "../../../tutor/_lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TUTOR_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
