import { NextResponse } from 'next/server';
import { PLAYERS } from '../../content/players';
import { verifyPlayer } from '../../lib/auth';

export const dynamic = 'force-dynamic';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

/** Exchange a magic-link token (?k=...) for the player identity it encodes. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { k?: string };
    const k = String(body.k ?? '');
    if (k) {
      for (const p of PLAYERS) {
        if (verifyPlayer(p.id, k)) {
          return NextResponse.json({ playerId: p.id, token: k });
        }
      }
    }
    return bad('קישור לא מוכר', 404);
  } catch (err) {
    console.error('claim error', err);
    return bad('משהו השתבש', 500);
  }
}
