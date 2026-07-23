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

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Original submission + up to 2 resubmissions per player+mission.
const MAX_ATTEMPTS = 3;

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
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

    const config = await getConfig();
    if (config.frozen) return bad('המשחק הוקפא — אין הגשות חדשות', 403);

    const existing = await listJson<SubmissionRecord>(`${PREFIX}submissions/`);
    const attempts = existing.filter(
      (s) => s.playerId === player.id && s.missionId === mission.id,
    ).length;
    if (attempts >= MAX_ATTEMPTS) {
      return bad('נגמרו הניסיונות למשימה הזאת (מקסימום 3 הגשות)', 403);
    }

    let imageUrl: string | undefined;
    if (mission.type === 'photo' && photo) {
      imageUrl = await uploadPhoto(photo);
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

    const result = await judgeSubmission({
      playerName: player.name,
      missionTitle: mission.title,
      missionDescription: mission.description,
      text,
      imageUrl,
    });
    const verdict: VerdictRecord = {
      submissionId: id,
      verdicts: result.verdicts,
      avg: result.avg,
      judgedAt: new Date().toISOString(),
    };
    await putJson(`${PREFIX}verdicts/${id}.json`, verdict);

    return NextResponse.json({ submission, verdict });
  } catch (err) {
    console.error('submit error', err);
    return bad('משהו השתבש בהגשה, נסו שוב', 500);
  }
}
