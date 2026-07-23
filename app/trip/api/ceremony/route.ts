import { NextResponse } from 'next/server';
import { writeConfig } from '../../lib/store';

export const dynamic = 'force-dynamic';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { done?: boolean; password?: string };

    if (body.done === true) {
      // Family-trust: anyone in the room may open the games.
      const config = await writeConfig({ ceremonyDone: true });
      return NextResponse.json({ ok: true, config });
    }

    if (body.done === false) {
      // Resetting the ceremony is admin-only.
      const expected = process.env.TRIP_ADMIN_PASSWORD;
      if (!expected || body.password !== expected) {
        return bad('סיסמה שגויה', 401);
      }
      const config = await writeConfig({ ceremonyDone: false });
      return NextResponse.json({ ok: true, config });
    }

    return bad('חסר ערך done');
  } catch (err) {
    console.error('ceremony error', err);
    return bad('משהו השתבש', 500);
  }
}
