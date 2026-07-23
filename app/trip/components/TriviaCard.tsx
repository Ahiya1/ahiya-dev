"use client";

import { useState } from "react";
import { PLAYERS, playerById, type PlayerId } from "../content/players";
import { triviaForDay, POINTS_PER_CORRECT } from "../content/quotes";
import type { GameState } from "../lib/store";

interface TriviaResult {
  correct: number;
  points: number;
  answers: Record<string, PlayerId>;
}

export default function TriviaCard({
  playerId,
  token,
  day,
  state,
  frozen,
  onRefresh,
}: {
  playerId: PlayerId;
  token: string;
  day: 1 | 2 | 3;
  state: GameState;
  frozen: boolean;
  onRefresh: () => void;
}) {
  const quotes = triviaForDay(day);
  const myRecord = state.trivia.find(
    (t) => t.playerId === playerId && t.day === day,
  );

  const [open, setOpen] = useState(false);
  const [picks, setPicks] = useState<Record<string, PlayerId>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TriviaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const correctAnswers: Record<string, PlayerId> = {};
  for (const q of quotes) correctAnswers[q.id] = q.answer;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/trip/api/trivia", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ playerId, token, day, answers: picks }),
      });
      const data = await res.json();
      if (res.ok || res.status === 409) {
        setResult({
          correct: data.correct,
          points: data.points,
          answers: data.answers ?? correctAnswers,
        });
        onRefresh();
      } else {
        setError(data.error ?? "משהו השתבש");
      }
    } catch {
      setError("משהו השתבש, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  };

  // Already played (from server state or just now)
  const done = result
    ? result
    : myRecord
      ? {
          correct: myRecord.correct,
          points: myRecord.points,
          answers: correctAnswers,
        }
      : null;

  const myAnswers = result ? picks : (myRecord?.answers ?? {});

  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--color-sky)] bg-white/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[var(--color-ink)]">
          🗣️ מי אמר את זה — יום {day}
        </h3>
        {done && (
          <span className="rounded-full bg-[var(--color-sky-deep)] px-3 py-1 text-sm font-bold text-white">
            +{done.points} נק׳
          </span>
        )}
      </div>

      {done ? (
        <div className="mt-3">
          <p className="text-sm font-medium text-[var(--color-ink-soft)]">
            קלעתם ל-{done.correct} מתוך {quotes.length} 🎯
          </p>
          <ul className="mt-3 space-y-2">
            {quotes.map((q) => {
              const mine = myAnswers[q.id];
              const right = done.answers[q.id];
              const hit = mine === right;
              return (
                <li key={q.id} className="rounded-lg bg-white/70 p-2 text-sm">
                  <p className="font-medium text-[var(--color-ink)]">
                    ״{q.quote}״
                  </p>
                  <p className="mt-1 text-[var(--color-muted)]">
                    {hit ? "✅" : "❌"} התשובה: {playerById(right)?.name}
                    {!hit && mine && (
                      <span> · ניחשתם: {playerById(mine)?.name}</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : !open ? (
        <div className="mt-3">
          <p className="text-sm text-[var(--color-ink-soft)]">
            {quotes.length} ציטוטים אמיתיים מהקבוצה. {POINTS_PER_CORRECT} נקודות
            על כל קליעה. ניסיון אחד ביום!
          </p>
          <button
            onClick={() => setOpen(true)}
            disabled={frozen}
            className="mt-3 w-full rounded-xl bg-[var(--color-sky-deep)] py-3 text-base font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            {frozen ? "המשחק הוקפא" : "יאללה, משחקים"}
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          {quotes.map((q, i) => (
            <div key={q.id} className="rounded-xl bg-white/70 p-3">
              <p className="mb-2 text-sm font-bold text-[var(--color-ink)]">
                {i + 1}. ״{q.quote}״
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {PLAYERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPicks({ ...picks, [q.id]: p.id })}
                    className={`rounded-lg border px-1 py-2 text-xs font-medium transition-colors ${
                      picks[q.id] === p.id
                        ? "border-[var(--color-sky-deep)] bg-[var(--color-sky-deep)] text-white"
                        : "border-[var(--color-rule)] bg-white text-[var(--color-ink)]"
                    }`}
                  >
                    <span className="block text-base">{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            onClick={submit}
            disabled={
              submitting || Object.keys(picks).length < quotes.length
            }
            className="w-full rounded-xl bg-[var(--color-ink)] py-3 text-base font-bold text-[var(--color-paper)] transition-transform active:scale-95 disabled:opacity-50"
          >
            {submitting
              ? "בודקים..."
              : Object.keys(picks).length < quotes.length
                ? `עניתם על ${Object.keys(picks).length}/${quotes.length}`
                : "שולחים תשובות"}
          </button>
        </div>
      )}
    </div>
  );
}
