import { NextResponse } from 'next/server';
import { getGameState, type GameState } from '../../lib/store';

export const dynamic = 'force-dynamic';

// Assembling the state re-fetches every blob in the log. Eight phones polling
// every 15s would otherwise redo that work eight times over. There is exactly
// one game, so a tiny process-local cache is enough: bursts of polls share one
// assembly, and nobody sees data more than 5s old.
const CACHE_MS = 5_000;

let cached: { at: number; state: GameState } | null = null;
let inFlight: Promise<GameState> | null = null;

async function loadState(): Promise<GameState> {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) return cached.state;
  // Coalesce concurrent misses onto a single assembly.
  if (inFlight) return inFlight;
  inFlight = getGameState()
    .then((state) => {
      cached = { at: Date.now(), state };
      return state;
    })
    .finally(() => {
      // Failures are never cached — the next poll retries for real.
      inFlight = null;
    });
  return inFlight;
}

export async function GET() {
  try {
    const state = await loadState();
    return NextResponse.json(state);
  } catch (err) {
    console.error('state error', err);
    return NextResponse.json({ error: 'state failed' }, { status: 500 });
  }
}
