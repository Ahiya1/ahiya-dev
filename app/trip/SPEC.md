# הבוטמניאדה — Build Spec

AI-judged family trip contest at `/trip` on ahiya.dev. Hebrew, RTL, mobile-first.
Trip: אמירי הגליל, Wed-Fri 2026-07-29..31. 8 players, no accounts.

## Already written (DO NOT MODIFY, import from them)
- `app/trip/content/players.ts` — PLAYERS, playerById
- `app/trip/content/missions.ts` — MISSIONS, TRIP_DATES, missionById, missionsFor
- `app/trip/content/quotes.ts` — TRIVIA, triviaForDay, POINTS_PER_CORRECT
- `app/trip/content/judges.ts` — JUDGES, JUDGE_SYSTEM_PROMPT, VERDICT_SCHEMA, buildJudgeUserPrompt, JudgeVerdict

## Storage: Vercel Blob as append-only event log (no DB)
Uses `@vercel/blob` (installed; BLOB_READ_WRITE_TOKEN present in env).
Every write is a NEW blob with a unique key — no overwrites, no concurrency conflicts.
State is computed by `list({ prefix })` + fetching JSON blobs.

Layout:
- `trip/photos/<uuid>.jpg` — uploaded photos (public access URLs are fine; keys unguessable)
- `trip/submissions/<submissionId>.json` — `{ id, playerId, missionId, type: 'photo'|'text', text?, imageUrl?, createdAt }`
  - submissionId = `${missionId}__${playerId}__${shortRandom}`
- `trip/verdicts/<submissionId>.json` — `{ submissionId, verdicts: JudgeVerdict[], avg: number, judgedAt }`
  - avg = mean of scores, each capped at 10, rounded to 1 decimal
- `trip/trivia/<day>__<playerId>.json` — `{ playerId, day, answers: Record<quoteId, PlayerId>, correct: number, points: number, createdAt }` (one per player per day; if duplicate exists, first one wins — ignore later ones when computing state)
- `trip/config/state.json` — admin overrides; LATEST by uploadedAt wins if multiple: `{ dayOverride?: 1|2|3|null, frozen?: boolean }`

Implement `app/trip/lib/store.ts` with: `putJson(key, data)`, `listJson<T>(prefix): Promise<T[]>` (list + fetch in parallel, tolerate fetch failures), `uploadPhoto(file): Promise<url>`, `getGameState()` (assembles submissions + verdicts + trivia + leaderboard in one pass). Cache nothing server-side; routes are dynamic (`export const dynamic = 'force-dynamic'`).

Current day logic (`app/trip/lib/day.ts`): from Asia/Jerusalem date vs TRIP_DATES; before trip → day 1 preview mode flag `{ day, isLive }`; admin dayOverride wins.

## Judging: `app/trip/lib/judge.ts`
- `@anthropic-ai/sdk` (installed). Model: `process.env.TRIP_MODEL || 'claude-sonnet-5'`. Env: `ANTHROPIC_API_KEY` (exists in Vercel project env from the tutor feature).
- One `client.messages.create` per submission: system = JUDGE_SYSTEM_PROMPT (with `cache_control: {type: 'ephemeral'}` as a system content block), user content = buildJudgeUserPrompt(...) text block + optional image block (base64 fetched from the Blob URL, media_type image/jpeg).
- Structured output: `output_config: { format: { type: 'json_schema', schema: VERDICT_SCHEMA } }`. `max_tokens: 2000`. Do NOT pass temperature/top_p (rejected on sonnet-5). Omit `thinking` entirely.
- Parse response text as JSON → validate 3 verdicts (one per judge; if a judge is missing, retry once, then fall back to a canned verdict "השופט יצא להפסקת מים" with score 7).
- Cap score at 10 when averaging (11 is a meshorer bit, counts as 10).

## API routes (`app/trip/api/*/route.ts` — note: nested under app/trip, so URL paths are /trip/api/...)
- `POST /trip/api/submit` — multipart or JSON: `{ playerId, missionId, text? }` + optional photo file. Validates player+mission exist, mission type matches payload, uploads photo, writes submission, runs judging inline (await), writes verdict, returns `{ submission, verdict }`. Reject if game frozen. Limit: same player+mission resubmission allowed up to 2 times (list existing, count).
- `POST /trip/api/trivia` — `{ playerId, day, answers }` → score against TRIVIA, write result, return `{ correct, points, answers: correctAnswers }`. One attempt per player per day (check existing).
- `GET /trip/api/state` — full game state: submissions (with verdicts, sorted new→old), leaderboard (per player: judged points = sum of avg per mission counting BEST scored submission per mission only, trivia points, total), currentDay, frozen. Poll target — keep it one round trip.
- `POST /trip/api/admin` — `{ password, action }`; password === `process.env.TRIP_ADMIN_PASSWORD`. Actions: `setDay {day|null}`, `freeze {frozen}`, `rejudge {submissionId}` (re-run judging, write new verdict — latest verdict by judgedAt wins in state assembly).

## Pages (client components; Tailwind 4 which is already set up; RTL via `dir="rtl"` on the root of each page)
- `/trip` — landing: name picker (8 big buttons with emoji), stores choice in localStorage (`trip_player`). After pick → main game screen with 3 tabs:
  1. **משימות** — missions for current day for this player (via missionsFor), each with status (not submitted / judged with avg + expandable 3 verdicts), submit UI: photo missions → file input with `accept="image/*" capture="environment"`, client-side downscale to max 1600px JPEG before upload (canvas), text missions → textarea. Submitting shows a fun loading state ("השופטים מתווכחים...") then reveals the 3 verdicts with judge names/emoji.
  2. **פיד** — all submissions newest first: player name+emoji, mission title, photo thumbnail (tap to enlarge) or text, avg score badge, expandable verdicts. Trivia results appear as compact entries.
  3. **טבלה** — leaderboard: rank, player, judged points, trivia points, total. Playful crown on leader.
  - Trivia entry point: on the missions tab, a daily card "מי אמר את זה — יום X" → 5 questions, each quote with 8 name buttons; after submitting all → score reveal + correct answers. If already played today, show result.
  - Poll `/trip/api/state` every 15s when tab visible.
- `/trip/admin` — password input (stored in sessionStorage), then: current day + override buttons, freeze toggle, list of submissions with rejudge buttons.
- Design: warm, playful, family-photo-album vibe. Big touch targets (parents' phones). Hebrew system font stack. Header: "🏆 הבוטמניאדה" + subtitle "אמירי הגליל 2026". Keep it one shared layout `app/trip/layout.tsx` with metadata title "הבוטמניאדה" and `<html dir>` NOT modified (site-wide layout exists; set dir on page containers).

## Constraints
- Next.js 16 App Router, TypeScript, no new deps beyond @anthropic-ai/sdk + @vercel/blob (already installed). lucide-react available for icons.
- Don't touch anything outside `app/trip/**`.
- `npm run build` must pass. Write minimal, clean code; match repo style (2-space, single quotes ok).
- Photos and family data are private: no indexing (`robots: noindex` metadata on the trip layout).
