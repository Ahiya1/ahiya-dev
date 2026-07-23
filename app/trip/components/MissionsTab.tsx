"use client";

import { useRef, useState } from "react";
import type { PlayerId } from "../content/players";
import { missionsFor, type Mission } from "../content/missions";
import type {
  GameState,
  SubmissionRecord,
  SubmissionWithVerdict,
  VerdictRecord,
} from "../lib/store";
import VerdictList, { ScoreBadge } from "./VerdictList";
import TriviaCard from "./TriviaCard";
import { downscaleImage } from "./downscale";

const MAX_ATTEMPTS = 3;

const LOADING_LINES = [
  "השופטים מתווכחים...",
  "המשורר מחפש חרוז...",
  "הדודה מהצפון כבר מתה מזה...",
  "השופט בודק שגיאות כתיב...",
  "מודדים את מדד הכמיהה...",
];

function MissionCard({
  mission,
  playerId,
  mySubs,
  frozen,
  onRefresh,
}: {
  mission: Mission;
  playerId: PlayerId;
  mySubs: SubmissionWithVerdict[];
  frozen: boolean;
  onRefresh: () => void;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const [fresh, setFresh] = useState<{
    submission: SubmissionRecord;
    verdict: VerdictRecord;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const freshCounted =
    fresh !== null && !mySubs.some((s) => s.id === fresh.submission.id);
  const attempts = mySubs.length + (freshCounted ? 1 : 0);
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);
  const best = mySubs.reduce<SubmissionWithVerdict | null>(
    (acc, s) =>
      s.verdict && (!acc?.verdict || s.verdict.avg > acc.verdict.avg) ? s : acc,
    null,
  );
  const judged = fresh?.verdict ?? best?.verdict ?? null;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const spin = setInterval(() => {
      setLoadingLine(
        LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)],
      );
    }, 2500);
    try {
      const form = new FormData();
      form.set("playerId", playerId);
      form.set("missionId", mission.id);
      if (text.trim()) form.set("text", text.trim());
      if (mission.type === "photo" && file) {
        const blob = await downscaleImage(file);
        form.set("photo", blob, "photo.jpg");
      }
      const res = await fetch("/trip/api/submit", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "משהו השתבש");
      } else {
        setFresh(data);
        setText("");
        setFile(null);
        setFormOpen(false);
        onRefresh();
      }
    } catch {
      setError("משהו השתבש, נסו שוב");
    } finally {
      clearInterval(spin);
      setSubmitting(false);
    }
  };

  const canSubmit =
    mission.type === "photo" ? file !== null : text.trim().length > 0;

  return (
    <div className="rounded-2xl border border-[var(--color-rule)] bg-white/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-ink)]">
            {mission.type === "photo" ? "📸" : "✍️"} {mission.title}
            {mission.personalFor && (
              <span className="mr-2 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-900">
                אישית
              </span>
            )}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {mission.description}
          </p>
        </div>
        {judged && <ScoreBadge avg={judged.avg} />}
      </div>

      {judged && (
        <details className="mt-3" open={fresh !== null}>
          <summary className="cursor-pointer text-sm font-medium text-[var(--color-sky-deep)]">
            פסקי הדין של השופטים
          </summary>
          <div className="mt-2">
            <VerdictList verdicts={judged.verdicts} />
          </div>
        </details>
      )}

      {submitting ? (
        <div className="mt-4 rounded-xl bg-[var(--color-paper-soft)] p-4 text-center">
          <div className="animate-pulse text-2xl">⚖️🧡🪶</div>
          <p className="mt-2 text-sm font-medium text-[var(--color-ink-soft)]">
            {loadingLine}
          </p>
        </div>
      ) : frozen ? null : attemptsLeft === 0 ? (
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          נגמרו הניסיונות למשימה הזאת ({MAX_ATTEMPTS}/{MAX_ATTEMPTS})
        </p>
      ) : !formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="mt-4 w-full rounded-xl border-2 border-[var(--color-ink)] py-2.5 text-base font-bold text-[var(--color-ink)] transition-transform active:scale-95"
        >
          {attempts > 0 ? `הגשה מחדש (נשארו ${attemptsLeft})` : "להגשה"}
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          {mission.type === "photo" ? (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-[var(--color-muted)] py-4 text-base font-medium text-[var(--color-ink-soft)]"
              >
                {file ? `📷 ${file.name}` : "📷 לצלם או לבחור תמונה"}
              </button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="מילה טובה לשופטים? (לא חובה)"
                rows={2}
                className="mt-2 w-full rounded-xl border border-[var(--color-rule)] bg-white p-3 text-base"
              />
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="כתבו כאן..."
              rows={4}
              className="w-full rounded-xl border border-[var(--color-rule)] bg-white p-3 text-base"
            />
          )}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="flex-1 rounded-xl bg-[var(--color-ink)] py-3 text-base font-bold text-[var(--color-paper)] transition-transform active:scale-95 disabled:opacity-50"
            >
              שולחים לשופטים 🚀
            </button>
            <button
              onClick={() => {
                setFormOpen(false);
                setError(null);
              }}
              className="rounded-xl border border-[var(--color-rule)] px-4 text-sm text-[var(--color-muted)]"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MissionsTab({
  playerId,
  state,
  onRefresh,
}: {
  playerId: PlayerId;
  state: GameState;
  onRefresh: () => void;
}) {
  const missions = missionsFor(playerId, state.currentDay);
  const todays = missions.filter(
    (m) => m.day === state.currentDay || m.personalFor,
  );
  const earlier = missions.filter(
    (m) => m.day < state.currentDay && !m.personalFor,
  );

  return (
    <div className="space-y-4">
      {!state.isLive && (
        <p className="rounded-xl bg-amber-100 p-3 text-center text-sm font-medium text-amber-900">
          🔭 מצב תצוגה מקדימה — הטיול מתחיל ב-29.7. אפשר להציץ, אבל אל תשרפו את
          המשימות!
        </p>
      )}

      <TriviaCard
        playerId={playerId}
        day={state.currentDay}
        state={state}
        frozen={state.frozen}
        onRefresh={onRefresh}
      />

      {todays.map((m) => (
        <MissionCard
          key={m.id}
          mission={m}
          playerId={playerId}
          mySubs={state.submissions.filter(
            (s) => s.playerId === playerId && s.missionId === m.id,
          )}
          frozen={state.frozen}
          onRefresh={onRefresh}
        />
      ))}

      {earlier.length > 0 && (
        <>
          <h2 className="pt-2 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
            השלמות מימים קודמים
          </h2>
          {earlier.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              playerId={playerId}
              mySubs={state.submissions.filter(
                (s) => s.playerId === playerId && s.missionId === m.id,
              )}
              frozen={state.frozen}
              onRefresh={onRefresh}
            />
          ))}
        </>
      )}
    </div>
  );
}
