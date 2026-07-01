"use client";

import Link from "next/link";
import { MessagesSquare, Dumbbell, AlertTriangle } from "lucide-react";
import type { Unit } from "../_lib/coursedata";
import { useProgress, type Confidence } from "../_lib/useProgress";
import Markdown from "./Markdown";

const CONF: { key: Confidence; label: string }[] = [
  { key: "unknown", label: "טרם למדתי" },
  { key: "shaky", label: "צריך חיזוק" },
  { key: "good", label: "שולט/ת" },
];

export default function Lesson({ courseId, unit }: { courseId: string; unit: Unit }) {
  const { progress, setUnitConfidence } = useProgress(courseId);
  const base = `/tutor/${courseId}`;
  const current = progress.units[unit.id] ?? "unknown";
  const kindHe = unit.kind === "lecture" ? "הרצאה" : "תרגול";

  const explainQ = `תסבירי לי לעומק את הנושאים של ${kindHe} ${unit.number} — ${unit.title}. תתחילי מהאינטואיציה ואז דוגמה קונקרטית.`;
  const drillTopic = unit.topics[0] ?? "";

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
      <Link href={`${base}/map`} className="text-sm link" style={{ color: "var(--color-sky-deep)" }}>
        → חזרה למפת הקורס
      </Link>

      <p className="mt-4 text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>
        {kindHe} {unit.number}
      </p>
      <h1 className="mt-1 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
        {unit.title}
      </h1>

      {unit.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {unit.topics.map((t, i) => (
            <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ background: "var(--color-rule)", color: "var(--color-ink-soft)" }}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={`${base}/ask?q=${encodeURIComponent(explainQ)}`} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "var(--color-sky-deep)", color: "var(--color-paper)" }}>
          <MessagesSquare size={16} /> הסבר לי בהרחבה
        </Link>
        <Link href={`${base}/practice${drillTopic ? `?topic=${encodeURIComponent(drillTopic)}` : ""}`} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "transparent", color: "var(--color-ink)", border: "1px solid var(--color-rule)" }}>
          <Dumbbell size={16} /> תרגל נושאים אלו
        </Link>
      </div>

      {/* confidence */}
      <div className="mt-6 rounded-xl border p-4" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
        <p className="text-sm mb-2" style={{ color: "var(--color-muted)" }}>איך את מרגישה עם הנושא?</p>
        <div className="flex gap-2">
          {CONF.map((c) => (
            <button key={c.key} onClick={() => setUnitConfidence(unit.id, c.key)}
              className="rounded-lg px-3 py-1.5 text-sm transition-colors"
              style={current === c.key
                ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" }
                : { background: "transparent", color: "var(--color-ink-soft)", border: "1px solid var(--color-rule)" }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* concepts */}
      {unit.concepts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>מושגי מפתח</h2>
          <div className="flex flex-col gap-3">
            {unit.concepts.map((c, i) => (
              <div key={i} className="rounded-lg border p-4" style={{ borderColor: "var(--color-rule)" }}>
                <p className="font-semibold" style={{ color: "var(--color-ink)" }} dir="auto">{c.term}</p>
                <div className="mt-1 text-[15px]" style={{ color: "var(--color-ink-soft)" }}>
                  <Markdown>{c.definition}</Markdown>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* idioms / cheatsheet */}
      {unit.idioms.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
            {unit.kind === "lecture" ? "תחביר וקטעי קוד חשובים" : "צ׳יטשיט"}
          </h2>
          <ul className="flex flex-col gap-2">
            {unit.idioms.map((it, i) => (
              <li key={i} dir="auto" className="rounded-lg px-3 py-2 text-[13px]" style={{ background: "var(--color-ink)", color: "var(--color-paper)", fontFamily: "var(--font-mono)" }}>
                {it}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* pitfalls */}
      {unit.pitfalls.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
            <AlertTriangle size={18} style={{ color: "#c8894b" }} /> טעויות נפוצות
          </h2>
          <ul className="flex flex-col gap-2">
            {unit.pitfalls.map((p, i) => (
              <li key={i} className="rounded-lg px-4 py-2 text-[15px]" style={{ background: "var(--color-paper-soft)", borderRight: "3px solid #c8894b", color: "var(--color-ink-soft)" }}>
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* worked examples */}
      {unit.examples.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>דוגמאות פתורות</h2>
          <ul className="flex flex-col gap-2 list-disc pr-5">
            {unit.examples.map((e, i) => (
              <li key={i} style={{ color: "var(--color-ink-soft)" }}>{e}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
