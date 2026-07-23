import { NextResponse } from 'next/server';
import { getGameState } from '../../lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await getGameState();
    return NextResponse.json(state);
  } catch (err) {
    console.error('state error', err);
    return NextResponse.json({ error: 'state failed' }, { status: 500 });
  }
}
