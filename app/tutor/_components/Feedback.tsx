"use client";

import { Check, X, Lightbulb } from "lucide-react";

export interface GradeResult {
  score: number;
  verdict: "correct" | "partial" | "incorrect";
  summary_he: string;
  correct_points: string[];
  missing_points: string[];
  hint_he: string;
  awarded?: number;
  outOf?: number;
}

const VERDICT: Record<string, { label: string; color: string }> = {
  correct: { label: "מצוין", color: "var(--color-sky-deep)" },
  partial: { label: "כמעט", color: "#c8894b" },
  incorrect: { label: "עוד לא", color: "#a23b2e" },
};

export default function Feedback({ fb }: { fb: GradeResult }) {
  const v = VERDICT[fb.verdict] ?? VERDICT.partial;
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: v.color, background: "var(--color-paper-soft)" }}>
      <div className="flex items-center justify-between">
        <span className="text-lg" style={{ fontFamily: "var(--font-display)", color: v.color }}>
          {v.label}
        </span>
        <span className="text-2xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
          {fb.outOf != null ? `${fb.awarded}/${fb.outOf}` : `${fb.score}/100`}
        </span>
      </div>
      <p className="mt-2 text-[15px]" style={{ color: "var(--color-ink-soft)" }}>{fb.summary_he}</p>

      {fb.correct_points?.length > 0 && (
        <ul className="mt-3 space-y-1">
          {fb.correct_points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-ink)" }}>
              <Check size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-sky-deep)" }} /> <span dir="auto">{p}</span>
            </li>
          ))}
        </ul>
      )}
      {fb.missing_points?.length > 0 && (
        <ul className="mt-2 space-y-1">
          {fb.missing_points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-ink)" }}>
              <X size={16} className="mt-0.5 shrink-0" style={{ color: "#a23b2e" }} /> <span dir="auto">{p}</span>
            </li>
          ))}
        </ul>
      )}
      {fb.hint_he && (
        <div className="mt-3 flex gap-2 rounded-lg px-3 py-2 text-sm" style={{ background: "var(--color-paper)", color: "var(--color-ink-soft)" }}>
          <Lightbulb size={16} className="mt-0.5 shrink-0" style={{ color: "#c8894b" }} />
          <span dir="auto">{fb.hint_he}</span>
        </div>
      )}
    </div>
  );
}
