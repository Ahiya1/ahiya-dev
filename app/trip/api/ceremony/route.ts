import { NextResponse } from 'next/server';
import { writeConfig } from '../../lib/store';

export const dynamic = 'force-dynamic';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { done?: boolean; password?: string };

    // Opening AND resetting the ceremony are admin-only.
    const expected = process.env.TRIP_ADMIN_PASSWORD;
    if (!expected || body.password !== expected) {
      return bad('סיסמה שגויה', 401);
    }

    if (typeof body.done !== 'boolean') return bad('חסר ערך done');
    const config = await writeConfig({ ceremonyDone: body.done });
    return NextResponse.json({ ok: true, config });
  } catch (err) {
    console.error('ceremony error', err);
    return bad('משהו השתבש', 500);
  }
}
