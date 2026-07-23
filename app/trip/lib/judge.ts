import Anthropic from '@anthropic-ai/sdk';
import {
  JUDGES,
  JUDGE_SYSTEM_PROMPT,
  VERDICT_SCHEMA,
  buildJudgeUserPrompt,
  type JudgeVerdict,
} from '../content/judges';

const FALLBACK_COMMENT = 'השופט יצא להפסקת מים';
const JUDGE_IDS = JUDGES.map((j) => j.id);

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
}): Promise<JudgeResult> {
  const client = new Anthropic();
  const model = process.env.TRIP_MODEL || 'claude-sonnet-5';

  let imageData: string | null = null;
  if (args.imageUrl) {
    try {
      const res = await fetch(args.imageUrl);
      if (res.ok) {
        imageData = Buffer.from(await res.arrayBuffer()).toString('base64');
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
    hasImage: imageData !== null,
  });

  const content: Anthropic.ContentBlockParam[] = [
    { type: 'text', text: prompt },
  ];
  if (imageData) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: imageData },
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
  if (byJudge.size < JUDGES.length) {
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
