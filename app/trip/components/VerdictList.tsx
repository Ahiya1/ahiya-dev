"use client";

import { JUDGES, type JudgeVerdict } from "../content/judges";

const judgeMeta = (id: JudgeVerdict["judge"]) =>
  JUDGES.find((j) => j.id === id) ?? { id, name: id, emoji: "⚖️" };

export function ScoreBadge({ avg }: { avg: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] px-3 py-1 text-sm font-bold text-[var(--color-paper)]">
      {avg}
      <span className="text-[10px] font-normal opacity-70">/10</span>
    </span>
  );
}

export default function VerdictList({
  verdicts,
}: {
  verdicts: JudgeVerdict[];
}) {
  return (
    <ul className="space-y-3">
      {verdicts.map((v) => {
        const meta = judgeMeta(v.judge);
        return (
          <li
            key={v.judge}
            className="rounded-xl bg-white/70 p-3 text-sm leading-relaxed"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-bold text-[var(--color-ink)]">
                {meta.emoji} {meta.name}
              </span>
              <span className="font-bold text-[var(--color-sky-deep)]">
                {v.score}/10
              </span>
            </div>
            <p className="text-[var(--color-ink-soft)]">{v.comment}</p>
          </li>
        );
      })}
    </ul>
  );
}
