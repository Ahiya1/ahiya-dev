import { NextResponse } from 'next/server';
import { playerById } from '../../content/players';
import { missionById } from '../../content/missions';
import {
  getConfig,
  listJson,
  putJson,
  type SubmissionRecord,
  type VerdictRecord,
  PREFIX,
} from '../../lib/store';
import { judgeSubmission } from '../../lib/judge';
import { verifyPlayer } from '../../lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Must match the submit route: only judged submissions count as attempts. */
const MAX_ATTEMPTS = 3;

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

/** Player-facing recovery for a submission whose judging timed out.
 * Judges an EXISTING submission the player owns and writes its verdict.
 * It creates no new submission, so it can never cost an attempt. */
export async function POST(req: Request) {
  const startedAt = Date.now();
  try {
    const body = (await req.json()) as {
      playerId?: string;
      token?: string;
      submissionId?: string;
    };

    const player = playerById(String(body.playerId ?? ''));
    if (!player) return bad('שחקן לא מוכר');
    if (!verifyPlayer(player.id, String(body.token ?? ''))) {
      return bad('קישור אישי לא תקין — פתחו שוב את הקישור מוואטסאפ', 401);
    }
    const submissionId = String(body.submissionId ?? '');
    if (!submissionId) return bad('חסר מזהה הגשה');

    const config = await getConfig();
    if (!config.ceremonyDone) return bad('הטקס טרם נערך', 403);
    if (config.frozen) return bad('המשחק הוקפא', 403);

    const [submissions, verdicts] = await Promise.all([
      listJson<SubmissionRecord>(`${PREFIX}submissions/`),
      listJson<VerdictRecord>(`${PREFIX}verdicts/`),
    ]);
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return bad('ההגשה לא נמצאה', 404);
    // Ownership check: a token only unlocks its own player's submissions.
    if (submission.playerId !== player.id) {
      return bad('זו לא ההגשה שלכם', 403);
    }

    // Already judged (e.g. two taps in a row) — just hand back the verdict.
    const existing = verdicts
      .filter((v) => v.submissionId === submissionId)
      .sort((a, b) => a.judgedAt.localeCompare(b.judgedAt))
      .pop();
    if (existing) {
      return NextResponse.json({ ok: true, submission, verdict: existing });
    }

    const mission = missionById(submission.missionId);
    if (!mission) return bad('הגשה פגומה', 500);

    // Recovering a pending submission must not become a way past the 3-attempt
    // limit: if three of this player's submissions for this mission already
    // have verdicts, they have had their three tries.
    const judgedIds = new Set(verdicts.map((v) => v.submissionId));
    const judgedForMission = submissions.filter(
      (s) =>
        s.playerId === player.id &&
        s.missionId === submission.missionId &&
        judgedIds.has(s.id),
    ).length;
    if (judgedForMission >= MAX_ATTEMPTS) {
      return bad('כבר יש לכם שלושה פסקי דין למשימה הזאת', 403);
    }

    const result = await judgeSubmission({
      playerName: player.name,
      missionTitle: mission.title,
      missionDescription: mission.description,
      text: submission.text,
      imageUrl: submission.imageUrl,
      startedAt,
    });
    const verdict: VerdictRecord = {
      submissionId,
      verdicts: result.verdicts,
      avg: result.avg,
      judgedAt: new Date().toISOString(),
    };
    await putJson(`${PREFIX}verdicts/${submissionId}.json`, verdict);

    return NextResponse.json({ ok: true, submission, verdict });
  } catch (err) {
    console.error('rejudge error', err);
    return bad('השופטים עדיין לא זמינים, נסו שוב עוד רגע', 500);
  }
}
