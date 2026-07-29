import { NextResponse } from 'next/server';
import { playerById, type PlayerId } from '../../content/players';
import { triviaForDay, POINTS_PER_CORRECT } from '../../content/quotes';
import {
  getConfig,
  listJson,
  putJson,
  type TriviaRecord,
  PREFIX,
} from '../../lib/store';
import { verifyPlayer } from '../../lib/auth';
import { currentTriviaDay } from '../../lib/day';

export const dynamic = 'force-dynamic';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      playerId?: string;
      token?: string;
      day?: number;
      answers?: Record<string, string>;
    };
    const player = playerById(String(body.playerId ?? ''));
    if (!player) return bad('שחקן לא מוכר');
    if (!verifyPlayer(player.id, String(body.token ?? ''))) {
      return bad('קישור אישי לא תקין — פתחו שוב את הקישור מוואטסאפ', 401);
    }
    const answers = body.answers;
    if (!answers || typeof answers !== 'object') return bad('חסרות תשובות');

    const config = await getConfig();
    if (!config.ceremonyDone) return bad('הטקס טרם נערך', 403);
    if (config.frozen) return bad('המשחק הוקפא', 403);
    // The client-supplied `day` is ignored on purpose: a stale phone (or a
    // curious one) must not be able to play a different day's quiz. The
    // trivia day has a 12h grace window — yesterday's quiz until noon.
    const day = currentTriviaDay(config.dayOverride);

    // One attempt per player per day — first one wins.
    const existing = await listJson<TriviaRecord>(`${PREFIX}trivia/`);
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

    // The answers must be exactly this day's quotes — nothing missing, nothing
    // extra. Guards against a phone that stayed open across a day change and
    // submits yesterday's picks.
    const submittedIds = Object.keys(answers);
    const matchesToday =
      submittedIds.length === quotes.length &&
      quotes.every((q) => {
        const a = answers[q.id];
        return typeof a === 'string' && playerById(a) !== undefined;
      });
    if (!matchesToday) {
      return bad('התשובות לא תואמות את החידון של היום - רעננו את הדף');
    }

    const cleanAnswers: Record<string, PlayerId> = {};
    let correct = 0;
    for (const q of quotes) {
      const a = answers[q.id] as PlayerId;
      cleanAnswers[q.id] = a;
      if (a === q.answer) correct++;
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
    await putJson(`${PREFIX}trivia/${day}__${player.id}.json`, record);

    return NextResponse.json({ correct, points, answers: correctAnswers });
  } catch (err) {
    console.error('trivia error', err);
    return bad('משהו השתבש, נסו שוב', 500);
  }
}
