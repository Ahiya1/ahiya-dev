import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { del, list } from '@vercel/blob';
import { PLAYERS, playerById } from '../../content/players';
import { missionById } from '../../content/missions';
import { playerToken } from '../../lib/auth';
import {
  listJson,
  putJson,
  writeConfig,
  type SubmissionRecord,
  type VerdictRecord,
  PREFIX,
} from '../../lib/store';
import { FALLBACK_COMMENT, judgeSubmission } from '../../lib/judge';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BASE_URL = process.env.TRIP_BASE_URL || 'https://ahiya.dev';

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  const startedAt = Date.now();
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
      case 'diagnose': {
        // Live check of the judge pipeline: is the key there, does the model
        // answer. Returns the real error so it can be read from a phone.
        const model = process.env.TRIP_MODEL || 'claude-sonnet-5';
        const hasKey = !!process.env.ANTHROPIC_API_KEY;
        if (!hasKey) {
          return NextResponse.json({
            ok: false,
            hasKey,
            model,
            error: 'ANTHROPIC_API_KEY חסר בסביבת הריצה של Vercel',
          });
        }
        try {
          const client = new Anthropic({ timeout: 15_000, maxRetries: 0 });
          const r = await client.messages.create({
            model,
            max_tokens: 32,
            messages: [{ role: 'user', content: 'ענה במילה אחת בלבד: שלום' }],
          });
          const text =
            r.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
              ?.text ?? '';
          return NextResponse.json({ ok: true, hasKey, model, reply: text });
        } catch (err) {
          const e = err as { status?: number; message?: string };
          return NextResponse.json({
            ok: false,
            hasKey,
            model,
            status: e?.status ?? null,
            error: String(e?.message ?? err).slice(0, 300),
          });
        }
      }
      case 'wipe': {
        // Delete ALL game data in this environment's namespace (PREFIX).
        // Photos, submissions, verdicts, trivia, config — a factory reset.
        const urls: string[] = [];
        let cursor: string | undefined;
        for (;;) {
          const page = await list({ prefix: PREFIX, cursor });
          for (const b of page.blobs) urls.push(b.url);
          if (!page.hasMore || !page.cursor) break;
          cursor = page.cursor;
        }
        if (urls.length > 0) await del(urls);
        return NextResponse.json({ ok: true, deleted: urls.length });
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
      case 'rejudgeFallbacks': {
        // One submission per call (each judging run can take ~30s and the
        // route budget is 60s); the admin page loops until remaining is 0.
        // Targets: submissions whose LATEST verdict is all water-break
        // fallbacks — the outage-era fakes.
        const [submissions, verdicts] = await Promise.all([
          listJson<SubmissionRecord>(`${PREFIX}submissions/`),
          listJson<VerdictRecord>(`${PREFIX}verdicts/`),
        ]);
        const latest = new Map<string, VerdictRecord>();
        for (const v of verdicts) {
          const prev = latest.get(v.submissionId);
          if (!prev || v.judgedAt > prev.judgedAt) latest.set(v.submissionId, v);
        }
        const canned = submissions
          .filter((s) => {
            const v = latest.get(s.id);
            return (
              v &&
              v.verdicts.length > 0 &&
              v.verdicts.every((x) => x.comment === FALLBACK_COMMENT)
            );
          })
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        if (canned.length === 0) {
          return NextResponse.json({ ok: true, remaining: 0 });
        }
        const target = canned[0];
        const player = playerById(target.playerId);
        const mission = missionById(target.missionId);
        if (!player || !mission) {
          return NextResponse.json({ ok: false, remaining: canned.length });
        }
        try {
          const result = await judgeSubmission({
            playerName: player.name,
            missionTitle: mission.title,
            missionDescription: mission.description,
            text: target.text,
            imageUrl: target.imageUrl,
            startedAt,
          });
          const verdict: VerdictRecord = {
            submissionId: target.id,
            verdicts: result.verdicts,
            avg: result.avg,
            judgedAt: new Date().toISOString(),
          };
          await putJson(`${PREFIX}verdicts/${target.id}.json`, verdict);
          return NextResponse.json({
            ok: true,
            remaining: canned.length - 1,
            judged: target.id,
          });
        } catch {
          // Still no connection — leave the canned verdict in place.
          return NextResponse.json({
            ok: false,
            stillDown: true,
            remaining: canned.length,
          });
        }
      }
      case 'rejudge': {
        const submissionId = String(body.submissionId ?? '');
        if (!submissionId) return bad('חסר submissionId');
        const submissions = await listJson<SubmissionRecord>(
          `${PREFIX}submissions/`,
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
          startedAt,
        });
        const verdict: VerdictRecord = {
          submissionId,
          verdicts: result.verdicts,
          avg: result.avg,
          judgedAt: new Date().toISOString(),
        };
        await putJson(`${PREFIX}verdicts/${submissionId}.json`, verdict);
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
