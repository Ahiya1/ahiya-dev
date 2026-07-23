"use client";

import { playerById } from "../content/players";
import type { GameState } from "../lib/store";

export default function LeaderboardTab({ state }: { state: GameState }) {
  const rows = state.leaderboard;
  const anyPoints = rows.some((r) => r.total > 0);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-white/60 shadow-sm">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-[var(--color-rule)] bg-[var(--color-paper-soft)] text-xs text-[var(--color-muted)]">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-2 py-2 font-medium">מי</th>
              <th className="px-2 py-2 font-medium">משימות</th>
              <th className="px-2 py-2 font-medium">טריוויה</th>
              <th className="px-3 py-2 font-medium">סה״כ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const p = playerById(row.playerId);
              const leader = i === 0 && anyPoints;
              return (
                <tr
                  key={row.playerId}
                  className={`border-b border-[var(--color-rule)] last:border-0 ${
                    leader ? "bg-amber-100/70" : ""
                  }`}
                >
                  <td className="px-3 py-3 font-bold text-[var(--color-muted)]">
                    {leader ? "👑" : i + 1}
                  </td>
                  <td className="px-2 py-3">
                    <span className="text-xl">{p?.emoji}</span>{" "}
                    <span className="font-bold text-[var(--color-ink)]">
                      {p?.name}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-[var(--color-ink-soft)]">
                    {row.judgedPoints}
                  </td>
                  <td className="px-2 py-3 text-[var(--color-ink-soft)]">
                    {row.triviaPoints}
                  </td>
                  <td className="px-3 py-3 text-base font-bold text-[var(--color-ink)]">
                    {row.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
        נקודות משימות = ההגשה הכי טובה שלכם בכל משימה. אין ערעורים. השופט כבר
        החליט.
      </p>
    </div>
  );
}
