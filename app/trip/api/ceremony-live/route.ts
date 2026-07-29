import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import { PREFIX } from '../../lib/store';

export const dynamic = 'force-dynamic';
// Long-poll requests are held up to WAIT_MS; leave headroom above that.
export const maxDuration = 25;

/** Live slide-sync for the ceremonies: the presenter's phone POSTs its
 * position on every tap, every other phone GETs it and follows along.
 *
 * Each POST writes a NEW blob whose pathname sorts after all previous ones
 * (ISO startedAt + zero-padded seq), so reading the position only has to
 * list the prefix and fetch the lexicographically-last blob.
 *
 * GET supports long-polling (?wait=1&since=<cursor>): the request is held
 * until a record newer than `since` exists (or WAIT_MS passes), so a tap on
 * the presenter's phone reaches every follower in well under a second
 * without hammering the store. */

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

const WAIT_MS = 18_000; // how long a ?wait=1 request may be held
const RECHECK_MS = 250; // store re-check cadence while holding

// All held requests in this process share one store reader: at most ~4
// list() calls per second no matter how many phones are connected.
const CACHE_MS = 250;
let cached: {
  at: number;
  cursor: string;
  live: CeremonyLiveRecord | null;
} | null = null;
let inFlight: Promise<{
  cursor: string;
  live: CeremonyLiveRecord | null;
}> | null = null;

async function loadLatest(): Promise<{
  cursor: string;
  live: CeremonyLiveRecord | null;
}> {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) {
    return { cursor: cached.cursor, live: cached.live };
  }
  if (inFlight) return inFlight;
  inFlight = (async () => {
    let bestPath = '';
    let bestUrl: string | null = null;
    let cursor: string | undefined;
    for (;;) {
      const page = await list({ prefix: LIVE_PREFIX(), cursor });
      for (const b of page.blobs) {
        if (b.pathname > bestPath) {
          bestPath = b.pathname;
          bestUrl = b.url;
        }
      }
      if (!page.hasMore || !page.cursor) break;
      cursor = page.cursor;
    }
    // Same newest blob as last time → skip re-fetching its body.
    if (cached && bestPath === cached.cursor) {
      cached = { at: Date.now(), cursor: cached.cursor, live: cached.live };
      return { cursor: cached.cursor, live: cached.live };
    }
    let live: CeremonyLiveRecord | null = null;
    if (bestUrl) {
      const res = await fetch(bestUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`live fetch ${res.status}`);
      live = (await res.json()) as CeremonyLiveRecord;
    }
    cached = { at: Date.now(), cursor: bestPath, live };
    return { cursor: bestPath, live };
  })().finally(() => {
    // Failures are never cached — the next poll retries for real.
    inFlight = null;
  });
  return inFlight;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const wait = url.searchParams.get('wait') === '1';
    const since = url.searchParams.get('since') ?? '';
    let latest = await loadLatest();
    if (wait && latest.cursor === since) {
      const deadline = Date.now() + WAIT_MS;
      while (latest.cursor === since && Date.now() < deadline) {
        await sleep(RECHECK_MS);
        latest = await loadLatest();
      }
    }
    return NextResponse.json(latest);
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
    cached = null; // held GETs in this process see the new position at once
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('ceremony-live post error', err);
    return NextResponse.json({ error: 'משהו השתבש' }, { status: 500 });
  }
}
