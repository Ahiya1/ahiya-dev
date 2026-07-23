import { list, put } from '@vercel/blob';
import { PLAYERS, type PlayerId } from '../content/players';

/** Key namespace: production writes to trip/, every other environment
 * (preview deploys, local dev) to trip-dev/ — same Blob store, zero mixing. */
export const PREFIX =
  process.env.VERCEL_ENV === 'production' ? 'trip/' : 'trip-dev/';
import type { MissionType } from '../content/missions';
import type { JudgeVerdict } from '../content/judges';
import { currentDay } from './day';

// ---------- Records stored as JSON blobs ----------

export interface SubmissionRecord {
  id: string;
  playerId: PlayerId;
  missionId: string;
  type: MissionType;
  text?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface VerdictRecord {
  submissionId: string;
  verdicts: JudgeVerdict[];
  avg: number;
  judgedAt: string;
}

export interface TriviaRecord {
  playerId: PlayerId;
  day: 1 | 2 | 3;
  answers: Record<string, PlayerId>;
  correct: number;
  points: number;
  createdAt: string;
}

export interface AdminConfig {
  dayOverride?: 1 | 2 | 3 | null;
  frozen?: boolean;
  ceremonyDone?: boolean;
  updatedAt?: string;
}

// ---------- Assembled state ----------

export interface SubmissionWithVerdict extends SubmissionRecord {
  verdict: VerdictRecord | null;
}

export interface LeaderboardRow {
  playerId: PlayerId;
  judgedPoints: number;
  triviaPoints: number;
  total: number;
}

export interface GameState {
  submissions: SubmissionWithVerdict[];
  trivia: TriviaRecord[];
  leaderboard: LeaderboardRow[];
  currentDay: 1 | 2 | 3;
  isLive: boolean;
  frozen: boolean;
  ceremonyDone: boolean;
}

// ---------- Blob primitives (append-only event log) ----------

/** Write JSON as a NEW blob. addRandomSuffix guarantees a unique key per
 * write, so there are never overwrites or concurrency conflicts. */
export async function putJson(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
}

/** List all blobs under a prefix and fetch them as JSON in parallel.
 * Individual fetch failures are tolerated (dropped). */
export async function listJson<T>(prefix: string): Promise<T[]> {
  const urls: string[] = [];
  let cursor: string | undefined;
  for (;;) {
    const page = await list({ prefix, cursor });
    for (const blob of page.blobs) urls.push(blob.url);
    if (!page.hasMore || !page.cursor) break;
    cursor = page.cursor;
  }
  const settled = await Promise.allSettled(
    urls.map(async (url) => {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      return (await res.json()) as T;
    }),
  );
  const out: T[] = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') out.push(r.value as T);
  }
  return out;
}

/** Upload a photo under an unguessable key; returns the public URL. */
export async function uploadPhoto(file: Blob): Promise<string> {
  const { url } = await put(`${PREFIX}photos/${crypto.randomUUID()}.jpg`, file, {
    access: 'public',
    contentType: 'image/jpeg',
  });
  return url;
}

/** Latest admin config (latest updatedAt wins if multiple blobs exist). */
export async function getConfig(): Promise<AdminConfig> {
  const configs = await listJson<AdminConfig>(`${PREFIX}config/`);
  if (configs.length === 0) return {};
  configs.sort((a, b) => (a.updatedAt ?? '').localeCompare(b.updatedAt ?? ''));
  return configs[configs.length - 1];
}

/** Write a config patch on top of the latest config (latest-wins log). */
export async function writeConfig(
  patch: Partial<AdminConfig>,
): Promise<AdminConfig> {
  const current = await getConfig();
  const next: AdminConfig = {
    dayOverride: current.dayOverride ?? null,
    frozen: current.frozen ?? false,
    ceremonyDone: current.ceremonyDone ?? false,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await putJson(`${PREFIX}config/state.json`, next);
  return next;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

/** Assemble the full game state in one pass. */
export async function getGameState(): Promise<GameState> {
  const [subs, verdicts, triviaRaw, config] = await Promise.all([
    listJson<SubmissionRecord>(`${PREFIX}submissions/`),
    listJson<VerdictRecord>(`${PREFIX}verdicts/`),
    listJson<TriviaRecord>(`${PREFIX}trivia/`),
    getConfig(),
  ]);

  // Latest verdict per submission wins (rejudge writes a newer one).
  const verdictBySubmission = new Map<string, VerdictRecord>();
  for (const v of verdicts) {
    const prev = verdictBySubmission.get(v.submissionId);
    if (!prev || v.judgedAt > prev.judgedAt) {
      verdictBySubmission.set(v.submissionId, v);
    }
  }

  const submissions: SubmissionWithVerdict[] = subs
    .map((s) => ({ ...s, verdict: verdictBySubmission.get(s.id) ?? null }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // One trivia result per player per day — the FIRST one wins.
  const triviaByKey = new Map<string, TriviaRecord>();
  for (const t of triviaRaw) {
    const key = `${t.day}__${t.playerId}`;
    const prev = triviaByKey.get(key);
    if (!prev || t.createdAt < prev.createdAt) triviaByKey.set(key, t);
  }
  const trivia = [...triviaByKey.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  // Leaderboard: judged points count the BEST scored submission per mission.
  const leaderboard: LeaderboardRow[] = PLAYERS.map((p) => {
    const bestPerMission = new Map<string, number>();
    for (const s of submissions) {
      if (s.playerId !== p.id || !s.verdict) continue;
      const prev = bestPerMission.get(s.missionId);
      if (prev === undefined || s.verdict.avg > prev) {
        bestPerMission.set(s.missionId, s.verdict.avg);
      }
    }
    const judgedPoints = round1(
      [...bestPerMission.values()].reduce((sum, avg) => sum + avg, 0),
    );
    const triviaPoints = trivia
      .filter((t) => t.playerId === p.id)
      .reduce((sum, t) => sum + t.points, 0);
    return {
      playerId: p.id,
      judgedPoints,
      triviaPoints,
      total: round1(judgedPoints + triviaPoints),
    };
  }).sort((a, b) => b.total - a.total);

  const { day, isLive } = currentDay(config.dayOverride);

  return {
    submissions,
    trivia,
    leaderboard,
    currentDay: day,
    isLive,
    frozen: config.frozen ?? false,
    ceremonyDone: config.ceremonyDone ?? false,
  };
}
