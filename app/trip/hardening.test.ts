/** Regression tests for the pre-launch hardening pass (run: npm test).
 * These cover the server-side rules that cannot be re-tested by hand once the
 * family is in the room: config merging, submit/trivia gating, attempt
 * accounting, and photo-format safety. */
import { describe, expect, it, vi, beforeEach } from 'vitest';

process.env.TRIP_ADMIN_PASSWORD = 'test-pass';

// ---- In-memory stand-in for the Vercel Blob store ----
const store = new Map<string, unknown>();
let seq = 0;

vi.mock('@vercel/blob', () => ({
  list: async ({ prefix }: { prefix: string }) => ({
    blobs: [...store.keys()]
      .filter((k) => k.startsWith(prefix))
      .map((k) => ({ url: k })),
    hasMore: false,
    cursor: undefined,
  }),
  put: async (key: string, body: unknown) => {
    const url = `${key}#${seq++}`;
    store.set(url, typeof body === 'string' ? JSON.parse(body) : body);
    return { url };
  },
  del: async () => undefined,
}));

let judgeShouldFail = false;
vi.mock('./lib/judge', () => ({
  judgeSubmission: async () => {
    if (judgeShouldFail) throw new Error('timeout');
    return {
      verdicts: [
        { judge: 'shofet', score: 8, comment: 'x' },
        { judge: 'doda', score: 8, comment: 'x' },
        { judge: 'meshorer', score: 8, comment: 'x' },
      ],
      avg: 8,
    };
  },
}));

vi.stubGlobal('fetch', async (url: string) => ({
  ok: store.has(url),
  json: async () => store.get(url),
}));

const { getConfig, writeConfig } = await import('./lib/store');
const { sniffImageType, imageTypeFromHeader } = await import('./lib/images');
const { playerToken } = await import('./lib/auth');
const { POST: triviaPost } = await import('./api/trivia/route');
const { POST: submitPost } = await import('./api/submit/route');
const { POST: rejudgePost } = await import('./api/rejudge/route');

const token = playerToken('shir');

const reset = () => {
  store.clear();
  seq = 0;
  judgeShouldFail = false;
};

// ---------------------------------------------------------------- fix 10

describe('config merge', () => {
  beforeEach(reset);

  it('empty store gives an empty config', async () => {
    expect(await getConfig()).toEqual({});
  });

  it('independent fields written from stale snapshots both survive', async () => {
    // Two admins act at once: one releases the ceremony, one freezes.
    await writeConfig({ ceremonyDone: true });
    await writeConfig({ frozen: true });
    const merged = await getConfig();
    expect(merged.ceremonyDone).toBe(true);
    expect(merged.frozen).toBe(true);
  });

  it('a later write to the same field wins', async () => {
    await writeConfig({ frozen: true });
    await new Promise((r) => setTimeout(r, 5));
    await writeConfig({ frozen: false });
    expect((await getConfig()).frozen).toBe(false);
  });

  it('legacy full-snapshot events still apply', async () => {
    store.set('trip-dev/config/legacy.json', {
      dayOverride: 2,
      frozen: true,
      ceremonyDone: true,
      updatedAt: '2020-01-01T00:00:00.000Z',
    });
    expect(await getConfig()).toMatchObject({
      dayOverride: 2,
      frozen: true,
      ceremonyDone: true,
    });
    await writeConfig({ frozen: false });
    expect(await getConfig()).toMatchObject({
      dayOverride: 2,
      frozen: false,
      ceremonyDone: true,
    });
  });

  it('writeConfig returns the merged view, not just the patch', async () => {
    await writeConfig({ ceremonyDone: true });
    const returned = await writeConfig({ dayOverride: 3 });
    expect(returned.ceremonyDone).toBe(true);
    expect(returned.dayOverride).toBe(3);
    expect(returned.frozen).toBe(false);
  });

  it('a null dayOverride patch clears the override', async () => {
    await writeConfig({ dayOverride: 2 });
    await new Promise((r) => setTimeout(r, 5));
    await writeConfig({ dayOverride: null });
    expect((await getConfig()).dayOverride).toBe(null);
  });
});

// ----------------------------------------------------------------- fix 8

describe('image sniffing', () => {
  const bytes = (...b: number[]) => new Uint8Array(b);

  it('accepts JPEG / PNG / WebP magic bytes', () => {
    expect(sniffImageType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg');
    expect(
      sniffImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)),
    ).toBe('image/png');
    expect(
      sniffImageType(
        bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50),
      ),
    ).toBe('image/webp');
  });

  it('rejects HEIC, empty and truncated input', () => {
    const heic = bytes(
      0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63,
    );
    expect(sniffImageType(heic)).toBe(null);
    expect(sniffImageType(bytes())).toBe(null);
    expect(sniffImageType(bytes(0xff, 0xd8))).toBe(null);
  });

  it('normalises content-type headers', () => {
    expect(imageTypeFromHeader('image/jpeg; charset=binary')).toBe('image/jpeg');
    expect(imageTypeFromHeader('IMAGE/JPG')).toBe('image/jpeg');
    expect(imageTypeFromHeader('image/heic')).toBe(null);
    expect(imageTypeFromHeader(null)).toBe(null);
  });
});

// -------------------------------------------------------------- fixes 5+6

const trivia = (body: unknown) =>
  triviaPost(
    new Request('http://x/trip/api/trivia', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );

const DAY1 = ['t1', 't2', 't3', 't4', 't5'];
const DAY2 = ['t6', 't7', 't8', 't9', 't10'];
const answersFor = (ids: string[]) =>
  Object.fromEntries(ids.map((id) => [id, 'abba']));

describe('trivia gating', () => {
  beforeEach(reset);

  it('rejects before the ceremony', async () => {
    await writeConfig({ dayOverride: 1 });
    const res = await trivia({
      playerId: 'shir',
      token,
      day: 1,
      answers: answersFor(DAY1),
    });
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('הטקס טרם נערך');
  });

  it('rejects when frozen', async () => {
    await writeConfig({ ceremonyDone: true, dayOverride: 1 });
    await writeConfig({ frozen: true });
    const res = await trivia({
      playerId: 'shir',
      token,
      day: 1,
      answers: answersFor(DAY1),
    });
    expect(res.status).toBe(403);
  });

  it('ignores the client day and uses the server day', async () => {
    await writeConfig({ ceremonyDone: true, dayOverride: 2 });
    const res = await trivia({
      playerId: 'shir',
      token,
      day: 1,
      answers: answersFor(DAY1),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain('לא תואמות');
  });

  it("accepts exactly the current day's quote ids", async () => {
    await writeConfig({ ceremonyDone: true, dayOverride: 2 });
    const res = await trivia({
      playerId: 'shir',
      token,
      day: 2,
      answers: answersFor(DAY2),
    });
    expect(res.status).toBe(200);
    expect((await res.json()).correct).toBe(1); // only t9 is abba
  });

  it('rejects a partial or padded answer set', async () => {
    await writeConfig({ ceremonyDone: true, dayOverride: 1 });
    const missing = await trivia({
      playerId: 'shir',
      token,
      day: 1,
      answers: answersFor(DAY1.slice(0, 4)),
    });
    expect(missing.status).toBe(400);
    const padded = await trivia({
      playerId: 'shir',
      token,
      day: 1,
      answers: { ...answersFor(DAY1), t6: 'abba' },
    });
    expect(padded.status).toBe(400);
  });

  it('rejects a bad token', async () => {
    await writeConfig({ ceremonyDone: true, dayOverride: 1 });
    const res = await trivia({
      playerId: 'shir',
      token: 'deadbeefcafe',
      day: 1,
      answers: answersFor(DAY1),
    });
    expect(res.status).toBe(401);
  });
});

// ------------------------------------------------------------ fixes 4+5+8

const submitText = (missionId: string, text = 'שלום לכולם') =>
  submitPost(
    new Request('http://x/trip/api/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ playerId: 'shir', token, missionId, text }),
    }),
  );

const submitPhoto = (missionId: string, bytes: Uint8Array) => {
  const form = new FormData();
  form.set('playerId', 'shir');
  form.set('token', token);
  form.set('missionId', missionId);
  form.set('photo', new Blob([bytes], { type: 'image/jpeg' }), 'photo.jpg');
  return submitPost(
    new Request('http://x/trip/api/submit', { method: 'POST', body: form }),
  );
};

const rejudge = (submissionId: string, playerId = 'shir', t = token) =>
  rejudgePost(
    new Request('http://x/trip/api/rejudge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ playerId, token: t, submissionId }),
    }),
  );

const liveOnDay1 = async () => {
  reset();
  await writeConfig({ ceremonyDone: true, dayOverride: 1 });
};

describe('submit gating', () => {
  beforeEach(liveOnDay1);

  it('rejects before the ceremony', async () => {
    reset();
    await writeConfig({ dayOverride: 1 });
    const res = await submitText('d1-nahatnu');
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('הטקס טרם נערך');
  });

  it("rejects a future day's mission", async () => {
    const res = await submitText('d2-forgery');
    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('המשימה הזו תיפתח בהמשך');
  });

  it("allows today's mission", async () => {
    expect((await submitText('d1-nahatnu')).status).toBe(200);
  });

  it('allows a personal mission (exempt from the day gate)', async () => {
    expect((await submitText('p-shir')).status).toBe(200);
  });

  it('rejects when frozen', async () => {
    await writeConfig({ frozen: true });
    expect((await submitText('d1-nahatnu')).status).toBe(403);
  });
});

describe('attempts and pending verdicts', () => {
  beforeEach(liveOnDay1);

  it('a judging failure does not burn an attempt', async () => {
    judgeShouldFail = true;
    const res = await submitText('d1-nahatnu');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.pending).toBe(true);
    expect(data.verdict).toBe(null);

    // Three real attempts remain.
    judgeShouldFail = false;
    expect((await submitText('d1-nahatnu')).status).toBe(200);
    expect((await submitText('d1-nahatnu')).status).toBe(200);
    expect((await submitText('d1-nahatnu')).status).toBe(200);
    expect((await submitText('d1-nahatnu')).status).toBe(403);

    // ...and recovery cannot be used to exceed three verdicts.
    expect((await rejudge(data.submission.id)).status).toBe(403);
  });

  it('rejudge fills in the missing verdict', async () => {
    judgeShouldFail = true;
    const data = await (await submitText('d1-nahatnu')).json();
    judgeShouldFail = false;
    const res = await rejudge(data.submission.id);
    expect(res.status).toBe(200);
    expect((await res.json()).verdict.avg).toBe(8);
  });

  it("rejudge refuses another player's submission", async () => {
    judgeShouldFail = true;
    const data = await (await submitText('d1-nahatnu')).json();
    const res = await rejudge(data.submission.id, 'abba', playerToken('abba'));
    expect(res.status).toBe(403);
  });

  it('caps stored records per player+mission', async () => {
    judgeShouldFail = true;
    for (let i = 0; i < 6; i++) {
      expect((await submitText('d1-nahatnu')).status).toBe(200);
    }
    const res = await submitText('d1-nahatnu');
    expect(res.status).toBe(403);
    expect((await res.json()).error).toContain('יותר מדי הגשות');
  });
});

describe('photo safety', () => {
  beforeEach(liveOnDay1);

  const jpeg = (n: number) => {
    const b = new Uint8Array(n);
    b.set([0xff, 0xd8, 0xff]);
    return b;
  };

  it('accepts a real JPEG', async () => {
    expect((await submitPhoto('d1-family-photo', jpeg(2048))).status).toBe(200);
  });

  it('rejects a non-image payload even when labelled image/jpeg', async () => {
    const heic = new Uint8Array(2048);
    heic.set([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63]);
    const res = await submitPhoto('d1-family-photo', heic);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('פורמט תמונה לא נתמך - נסו לצלם שוב');
  });

  it('rejects an oversized photo', async () => {
    const res = await submitPhoto('d1-family-photo', jpeg(13 * 1024 * 1024));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain('כבדה מדי');
  });

  it('stores the sniffed content type, not a hardcoded jpeg', async () => {
    const png = new Uint8Array(2048);
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const res = await submitPhoto('d1-family-photo', png);
    expect(res.status).toBe(200);
    expect((await res.json()).submission.imageUrl).toContain('.png');
  });
});
