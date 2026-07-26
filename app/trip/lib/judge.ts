import Anthropic from '@anthropic-ai/sdk';
import {
  JUDGES,
  JUDGE_SYSTEM_PROMPT,
  VERDICT_SCHEMA,
  buildJudgeUserPrompt,
  type JudgeVerdict,
} from '../content/judges';
import {
  imageTypeFromHeader,
  sniffImageType,
  type SupportedImageType,
} from './images';

const FALLBACK_COMMENT = 'השופט יצא להפסקת מים';
const JUDGE_IDS = JUDGES.map((j) => j.id);

// The calling routes declare maxDuration = 60. Keep the worst case well under
// that: at most one image fetch (8s) + one model call with a single retry
// (2 x 20s), and only attempt the second (top-up) call when there is still
// real budget left. A platform kill mid-flight is what leaves a submission
// stuck without a verdict, so bounding this is the whole point.
const REQUEST_TIMEOUT_MS = 20_000;
const IMAGE_FETCH_TIMEOUT_MS = 8_000;
/** Past this much elapsed time, skip the second call and use canned verdicts. */
const SECOND_CALL_CUTOFF_MS = 35_000;

export interface JudgeResult {
  verdicts: JudgeVerdict[];
  avg: number;
}

function isValidVerdict(v: unknown): v is JudgeVerdict {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  return (
    typeof c.judge === 'string' &&
    (JUDGE_IDS as string[]).includes(c.judge) &&
    typeof c.score === 'number' &&
    typeof c.comment === 'string'
  );
}

/** Judge one submission: one messages.create call returns all three verdicts.
 * If a judge is missing, retry once, then fall back to a canned verdict. */
export async function judgeSubmission(args: {
  playerName: string;
  missionTitle: string;
  missionDescription: string;
  text?: string;
  imageUrl?: string;
  /** When the HTTP handler started, so we can respect its 60s budget.
   * Defaults to "now" for callers that judge outside a request. */
  startedAt?: number;
}): Promise<JudgeResult> {
  const startedAt = args.startedAt ?? Date.now();
  const elapsed = () => Date.now() - startedAt;

  const client = new Anthropic({
    timeout: REQUEST_TIMEOUT_MS,
    maxRetries: 1,
  });
  const model = process.env.TRIP_MODEL || 'claude-sonnet-5';

  let image: { data: string; mediaType: SupportedImageType } | null = null;
  if (args.imageUrl) {
    try {
      const res = await fetch(args.imageUrl, {
        signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        // Trust the bytes over any label: sending Anthropic image/jpeg for a
        // HEIC/PNG payload either errors or produces a garbage verdict.
        const mediaType =
          sniffImageType(new Uint8Array(buf.subarray(0, 16))) ??
          imageTypeFromHeader(res.headers.get('content-type'));
        if (mediaType) {
          image = { data: buf.toString('base64'), mediaType };
        }
      }
    } catch {
      // judge from the text description alone
    }
  }

  const prompt = buildJudgeUserPrompt({
    playerName: args.playerName,
    missionTitle: args.missionTitle,
    missionDescription: args.missionDescription,
    text: args.text,
    hasImage: image !== null,
  });

  const content: Anthropic.ContentBlockParam[] = [
    { type: 'text', text: prompt },
  ];
  if (image) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: image.mediaType,
        data: image.data,
      },
    });
  }

  const callOnce = async (): Promise<JudgeVerdict[]> => {
    const response = await client.messages.create({
      model,
      max_tokens: 4000,
      system: [
        {
          type: 'text',
          text: JUDGE_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: VERDICT_SCHEMA as unknown as Record<string, unknown>,
        },
      },
    });
    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );
    if (!textBlock) return [];
    try {
      const parsed = JSON.parse(textBlock.text) as { verdicts?: unknown[] };
      if (!Array.isArray(parsed.verdicts)) return [];
      return parsed.verdicts.filter(isValidVerdict);
    } catch {
      return [];
    }
  };

  const byJudge = new Map<JudgeVerdict['judge'], JudgeVerdict>();
  const absorb = (verdicts: JudgeVerdict[]) => {
    for (const v of verdicts) {
      if (!byJudge.has(v.judge)) byJudge.set(v.judge, v);
    }
  };

  try {
    absorb(await callOnce());
  } catch {
    // retried below
  }
  // Only top up a partial answer while there is budget left — otherwise the
  // platform kills the request and the submission ends up with no verdict at
  // all, which is far worse than a canned comment from one judge.
  if (byJudge.size < JUDGES.length && elapsed() < SECOND_CALL_CUTOFF_MS) {
    try {
      absorb(await callOnce());
    } catch {
      // canned fallback below
    }
  }

  const verdicts: JudgeVerdict[] = JUDGES.map(
    (j) =>
      byJudge.get(j.id) ?? {
        judge: j.id,
        score: 7,
        comment: FALLBACK_COMMENT,
      },
  );

  // Cap each score at 10 when averaging (11 is a meshorer bit → counts as 10).
  const avg =
    Math.round(
      (verdicts.reduce((sum, v) => sum + Math.min(v.score, 10), 0) /
        verdicts.length) *
        10,
    ) / 10;

  return { verdicts, avg };
}
