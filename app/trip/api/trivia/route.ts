import { NextResponse } from 'next/server';
import { playerById, type PlayerId } from '../../content/players';
import { triviaForDay, POINTS_PER_CORRECT } from '../../content/quotes';
import {
  getConfig,
  listJson,
  putJson,
  type TriviaRecord,
} from '../../lib/store';

export const dynamic = 'force-dynamic';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      playerId?: string;
      day?: number;
      answers?: Record<string, string>;
    };
    const player = playerById(String(body.playerId ?? ''));
    if (!player) return bad('שחקן לא מוכר');
    const day = body.day;
    if (day !== 1 && day !== 2 && day !== 3) return bad('יום לא תקין');
    const answers = body.answers;
    if (!answers || typeof answers !== 'object') return bad('חסרות תשובות');

    const config = await getConfig();
    if (config.frozen) return bad('המשחק הוקפא', 403);

    // One attempt per player per day — first one wins.
    const existing = await listJson<TriviaRecord>('trip/trivia/');
    const prior = existing
      .filter((t) => t.playerId === player.id && t.day === day)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];

    const quotes = triviaForDay(day);
    const correctAnswers: Record<string, PlayerId> = {};
    for (const q of quotes) correctAnswers[q.id] = q.answer;

    if (prior) {
      return NextResponse.json(
        {
          error: 'כבר שיחקת היום',
          correct: prior.correct,
          points: prior.points,
          answers: correctAnswers,
        },
        { status: 409 },
      );
    }

    const cleanAnswers: Record<string, PlayerId> = {};
    let correct = 0;
    for (const q of quotes) {
      const a = answers[q.id];
      if (typeof a === 'string' && playerById(a)) {
        cleanAnswers[q.id] = a as PlayerId;
        if (a === q.answer) correct++;
      }
    }
    const points = correct * POINTS_PER_CORRECT;

    const record: TriviaRecord = {
      playerId: player.id,
      day,
      answers: cleanAnswers,
      correct,
      points,
      createdAt: new Date().toISOString(),
    };
    await putJson(`trip/trivia/${day}__${player.id}.json`, record);

    return NextResponse.json({ correct, points, answers: correctAnswers });
  } catch (err) {
    console.error('trivia error', err);
    return bad('משהו השתבש, נסו שוב', 500);
  }
}
