import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { PREFIX } from '../../lib/store';

export const dynamic = 'force-dynamic';

/** Live slide-sync for the ceremonies: the presenter's phone POSTs its
 * position on every tap, every other phone GETs it and follows along.
 *
 * Each POST writes a NEW blob whose pathname sorts after all previous ones
 * (ISO startedAt + zero-padded seq), so GET only has to list the prefix,
 * pick the lexicographically-last pathname, and fetch that single blob. */

export interface CeremonyLiveRecord {
  ceremony: 'opening' | 'podium';
  active: boolean;
  slide: number;
  sub: number;
  seq: number;
  startedAt: string;
  updatedAt: string;
}

const LIVE_PREFIX = () => `${PREFIX}ceremony-live/`;

// Followers poll every ~1.5s from up to 8 phones; one game per deployment,
// so a 1s process-local cache turns that into ~1 blob read per second.
const CACHE_MS = 1_000;
let cached: { at: number; live: CeremonyLiveRecord | null } | null = null;
let inFlight: Promise<CeremonyLiveRecord | null> | null = null;

async function loadLatest(): Promise<CeremonyLiveRecord | null> {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) return cached.live;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    let bestPath: string | null = null;
    let bestUrl: string | null = null;
    let cursor: string | undefined;
    for (;;) {
      const page = await list({ prefix: LIVE_PREFIX(), cursor });
      for (const b of page.blobs) {
        if (bestPath === null || b.pathname > bestPath) {
          bestPath = b.pathname;
          bestUrl = b.url;
        }
      }
      if (!page.hasMore || !page.cursor) break;
      cursor = page.cursor;
    }
    if (!bestUrl) return null;
    const res = await fetch(bestUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`live fetch ${res.status}`);
    return (await res.json()) as CeremonyLiveRecord;
  })()
    .then((live) => {
      cached = { at: Date.now(), live };
      return live;
    })
    .finally(() => {
      // Failures are never cached — the next poll retries for real.
      inFlight = null;
    });
  return inFlight;
}

export async function GET() {
  try {
    return NextResponse.json({ live: await loadLatest() });
  } catch (err) {
    console.error('ceremony-live get error', err);
    return NextResponse.json({ error: 'live failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      password?: string;
      ceremony?: string;
      active?: boolean;
      slide?: number;
      sub?: number;
      seq?: number;
      startedAt?: string;
    };

    const expected = process.env.TRIP_ADMIN_PASSWORD;
    if (!expected || body.password !== expected) {
      return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 });
    }
    if (body.ceremony !== 'opening' && body.ceremony !== 'podium') {
      return NextResponse.json({ error: 'ceremony לא תקין' }, { status: 400 });
    }
    const seq = Number.isInteger(body.seq) ? (body.seq as number) : 0;
    const startedAt = String(body.startedAt ?? '');
    if (!startedAt || seq < 0 || seq > 99_999) {
      return NextResponse.json({ error: 'רצף לא תקין' }, { status: 400 });
    }

    const record: CeremonyLiveRecord = {
      ceremony: body.ceremony,
      active: body.active === true,
      slide: Math.max(0, Math.floor(Number(body.slide) || 0)),
      sub: Math.max(0, Math.floor(Number(body.sub) || 0)),
      seq,
      startedAt,
      updatedAt: new Date().toISOString(),
    };

    // Pathname sorts after every earlier post of this (and any earlier)
    // ceremony run; the random suffix keeps concurrent writes conflict-free.
    const key = `${LIVE_PREFIX()}${startedAt}__${String(seq).padStart(5, '0')}.json`;
    await put(key, JSON.stringify(record), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
    });
    cached = null; // this process serves the fresh position immediately
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('ceremony-live post error', err);
    return NextResponse.json({ error: 'משהו השתבש' }, { status: 500 });
  }
}
