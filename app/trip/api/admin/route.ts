import { NextResponse } from 'next/server';
import { PLAYERS, playerById } from '../../content/players';
import { missionById } from '../../content/missions';
import { playerToken } from '../../lib/auth';
import {
  listJson,
  putJson,
  writeConfig,
  type SubmissionRecord,
  type VerdictRecord,
} from '../../lib/store';
import { judgeSubmission } from '../../lib/judge';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BASE_URL = process.env.TRIP_BASE_URL || 'https://ahiya.dev';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      password?: string;
      action?: string;
      day?: number | null;
      frozen?: boolean;
      submissionId?: string;
    };

    const expected = process.env.TRIP_ADMIN_PASSWORD;
    if (!expected || body.password !== expected) {
      return bad('סיסמה שגויה', 401);
    }

    switch (body.action) {
      case 'ping': {
        // Lightweight password check (used by the ceremony unlock screen).
        return NextResponse.json({ ok: true });
      }
      case 'links': {
        const links = PLAYERS.map((p) => ({
          playerId: p.id,
          name: p.name,
          url: `${BASE_URL}/trip?k=${playerToken(p.id)}`,
        }));
        return NextResponse.json({ ok: true, links });
      }
      case 'setDay': {
        const day = body.day;
        if (day !== null && day !== 1 && day !== 2 && day !== 3) {
          return bad('יום לא תקין');
        }
        const config = await writeConfig({ dayOverride: day });
        return NextResponse.json({ ok: true, config });
      }
      case 'freeze': {
        if (typeof body.frozen !== 'boolean') return bad('חסר ערך frozen');
        const config = await writeConfig({ frozen: body.frozen });
        return NextResponse.json({ ok: true, config });
      }
      case 'rejudge': {
        const submissionId = String(body.submissionId ?? '');
        if (!submissionId) return bad('חסר submissionId');
        const submissions = await listJson<SubmissionRecord>(
          'trip/submissions/',
        );
        const submission = submissions.find((s) => s.id === submissionId);
        if (!submission) return bad('הגשה לא נמצאה', 404);
        const player = playerById(submission.playerId);
        const mission = missionById(submission.missionId);
        if (!player || !mission) return bad('הגשה פגומה', 500);
        const result = await judgeSubmission({
          playerName: player.name,
          missionTitle: mission.title,
          missionDescription: mission.description,
          text: submission.text,
          imageUrl: submission.imageUrl,
        });
        const verdict: VerdictRecord = {
          submissionId,
          verdicts: result.verdicts,
          avg: result.avg,
          judgedAt: new Date().toISOString(),
        };
        await putJson(`trip/verdicts/${submissionId}.json`, verdict);
        return NextResponse.json({ ok: true, verdict });
      }
      default:
        return bad('פעולה לא מוכרת');
    }
  } catch (err) {
    console.error('admin error', err);
    return bad('משהו השתבש', 500);
  }
}
