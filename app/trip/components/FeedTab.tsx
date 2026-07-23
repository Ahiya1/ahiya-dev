"use client";

import { useState } from "react";
import { playerById } from "../content/players";
import { missionById } from "../content/missions";
import type { GameState } from "../lib/store";
import VerdictList, { ScoreBadge } from "./VerdictList";

function timeLabel(iso: string): string {
  try {
    return new Intl.DateTimeFormat("he-IL", {
      timeZone: "Asia/Jerusalem",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function FeedTab({ state }: { state: GameState }) {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  type FeedItem =
    | { kind: "submission"; createdAt: string; sub: GameState["submissions"][number] }
    | { kind: "trivia"; createdAt: string; trivia: GameState["trivia"][number] };

  const items: FeedItem[] = [
    ...state.submissions.map((sub) => ({
      kind: "submission" as const,
      createdAt: sub.createdAt,
      sub,
    })),
    ...state.trivia.map((trivia) => ({
      kind: "trivia" as const,
      createdAt: trivia.createdAt,
      trivia,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-white/50 p-8 text-center text-[var(--color-muted)]">
        עוד אין הגשות. מישהו חייב להיות ראשון — למה לא אתם? 📸
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        if (item.kind === "trivia") {
          const p = playerById(item.trivia.playerId);
          return (
            <div
              key={`t-${i}`}
              className="rounded-xl bg-white/40 px-4 py-2.5 text-sm text-[var(--color-ink-soft)]"
            >
              🗣️ {p?.emoji} {p?.name} ענו על הטריוויה של יום {item.trivia.day} —{" "}
              {item.trivia.correct}/5 נכונות, +{item.trivia.points} נק׳
            </div>
          );
        }
        const s = item.sub;
        const p = playerById(s.playerId);
        const m = missionById(s.missionId);
        return (
          <div
            key={s.id}
            className="overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-white/60 shadow-sm"
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p?.emoji}</span>
                <div>
                  <span className="font-bold text-[var(--color-ink)]">
                    {p?.name}
                  </span>
                  <span className="mr-2 text-xs text-[var(--color-muted)]">
                    {timeLabel(s.createdAt)}
                  </span>
                </div>
              </div>
              {s.verdict && <ScoreBadge avg={s.verdict.avg} />}
            </div>
            <p className="px-4 pt-1 text-sm font-medium text-[var(--color-sky-deep)]">
              {m?.title ?? s.missionId}
            </p>
            {s.imageUrl && (
              <button
                onClick={() => setEnlarged(s.imageUrl!)}
                className="mt-2 block w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl}
                  alt={m?.title ?? ""}
                  className="max-h-72 w-full object-cover"
                  loading="lazy"
                />
              </button>
            )}
            {s.text && (
              <p className="whitespace-pre-wrap px-4 pt-2 text-base leading-relaxed text-[var(--color-ink)]">
                {s.text}
              </p>
            )}
            <div className="px-4 py-3">
              {s.verdict ? (
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-[var(--color-sky-deep)]">
                    פסקי הדין של השופטים
                  </summary>
                  <div className="mt-2">
                    <VerdictList verdicts={s.verdict.verdicts} />
                  </div>
                </details>
              ) : (
                <p className="text-xs text-[var(--color-muted)]">
                  ⏳ השופטים עוד מתווכחים...
                </p>
              )}
            </div>
          </div>
        );
      })}

      {enlarged && (
        <button
          onClick={() => setEnlarged(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enlarged}
            alt=""
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </button>
      )}
    </div>
  );
}
