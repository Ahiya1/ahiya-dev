import { NextResponse } from 'next/server';
import { playerById } from '../../content/players';
import { missionById } from '../../content/missions';
import {
  getConfig,
  listJson,
  putJson,
  uploadPhoto,
  type SubmissionRecord,
  type VerdictRecord,
  PREFIX,
} from '../../lib/store';
import { judgeSubmission } from '../../lib/judge';
import { verifyPlayer } from '../../lib/auth';
import { currentDay } from '../../lib/day';
import { MAX_PHOTO_BYTES, sniffImageType } from '../../lib/images';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Original submission + up to 2 resubmissions per player+mission.
// Only submissions that actually got a verdict count: a judging timeout must
// never burn an attempt (see the pending path below).
const MAX_ATTEMPTS = 3;
// Absolute cap on stored records per player+mission, verdict or not, so a
// repeatedly failing judge cannot be used to spam the blob store.
const MAX_RECORDS = 6;

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  const startedAt = Date.now();
  try {
    let playerId = '';
    let missionId = '';
    let token = '';
    let text: string | undefined;
    let photo: File | null = null;

    const contentType = req.headers.get('content-type') ?? '';
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      playerId = String(form.get('playerId') ?? '');
      missionId = String(form.get('missionId') ?? '');
      token = String(form.get('token') ?? '');
      const t = form.get('text');
      if (typeof t === 'string' && t.trim()) text = t.trim();
      const p = form.get('photo');
      if (p instanceof File && p.size > 0) photo = p;
    } else {
      const body = (await req.json()) as {
        playerId?: string;
        missionId?: string;
        token?: string;
        text?: string;
      };
      playerId = String(body.playerId ?? '');
      missionId = String(body.missionId ?? '');
      token = String(body.token ?? '');
      if (typeof body.text === 'string' && body.text.trim()) {
        text = body.text.trim();
      }
    }

    const player = playerById(playerId);
    if (!player) return bad('שחקן לא מוכר');
    if (!verifyPlayer(player.id, token)) {
      return bad('קישור אישי לא תקין — פתחו שוב את הקישור מוואטסאפ', 401);
    }
    const mission = missionById(missionId);
    if (!mission) return bad('משימה לא מוכרת');
    if (mission.personalFor && mission.personalFor !== player.id) {
      return bad('זו משימה אישית של מישהו אחר');
    }
    if (mission.type === 'photo' && !photo) return bad('חסרה תמונה');
    if (mission.type === 'text' && !text) return bad('חסר טקסט');

    // A valid token is not enough: the ceremony must have happened, the game
    // must not be frozen, and the mission's day must already be open.
    const config = await getConfig();
    if (!config.ceremonyDone) return bad('הטקס טרם נערך', 403);
    if (config.frozen) return bad('המשחק הוקפא — אין הגשות חדשות', 403);
    const { day: today } = currentDay(config.dayOverride);
    // Every mission — personal ones included — opens on its day; late
    // submissions for earlier days stay allowed.
    if (mission.day > today) {
      return bad('המשימה הזו תיפתח בהמשך', 403);
    }

    const [existing, allVerdicts] = await Promise.all([
      listJson<SubmissionRecord>(`${PREFIX}submissions/`),
      listJson<VerdictRecord>(`${PREFIX}verdicts/`),
    ]);
    const judgedIds = new Set(allVerdicts.map((v) => v.submissionId));
    const mine = existing.filter(
      (s) => s.playerId === player.id && s.missionId === mission.id,
    );
    const attempts = mine.filter((s) => judgedIds.has(s.id)).length;
    if (attempts >= MAX_ATTEMPTS) {
      return bad('נגמרו הניסיונות למשימה הזאת (מקסימום 3 הגשות)', 403);
    }
    if (mine.length >= MAX_RECORDS) {
      return bad('יותר מדי הגשות למשימה הזאת, קראו לאחיה', 403);
    }

    let imageUrl: string | undefined;
    if (mission.type === 'photo' && photo) {
      if (photo.size > MAX_PHOTO_BYTES) {
        return bad('התמונה כבדה מדי (עד 12MB) - נסו לצלם שוב');
      }
      const buf = await photo.arrayBuffer();
      const imageType = sniffImageType(new Uint8Array(buf.slice(0, 16)));
      if (!imageType) {
        return bad('פורמט תמונה לא נתמך - נסו לצלם שוב');
      }
      imageUrl = await uploadPhoto(new Blob([buf], { type: imageType }), imageType);
    }

    const shortRandom = Math.random().toString(36).slice(2, 8);
    const id = `${mission.id}__${player.id}__${shortRandom}`;
    const submission: SubmissionRecord = {
      id,
      playerId: player.id,
      missionId: mission.id,
      type: mission.type,
      text,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    await putJson(`${PREFIX}submissions/${id}.json`, submission);

    // Judging is the one step that can time out. If it does, keep the stored
    // submission and hand the phone a "pending" answer it can retry from
    // (/trip/api/rejudge) — never a dead record that ate an attempt.
    try {
      const result = await judgeSubmission({
        playerName: player.name,
        missionTitle: mission.title,
        missionDescription: mission.description,
        text,
        imageUrl,
        startedAt,
      });
      const verdict: VerdictRecord = {
        submissionId: id,
        verdicts: result.verdicts,
        avg: result.avg,
        judgedAt: new Date().toISOString(),
      };
      await putJson(`${PREFIX}verdicts/${id}.json`, verdict);
      return NextResponse.json({ submission, verdict, pending: false });
    } catch (err) {
      console.error('judging failed, submission left pending', id, err);
      return NextResponse.json({ submission, verdict: null, pending: true });
    }
  } catch (err) {
    console.error('submit error', err);
    return bad('משהו השתבש בהגשה, נסו שוב', 500);
  }
}
