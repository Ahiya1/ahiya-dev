"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Timer, ArrowRight } from "lucide-react";
import type { MockExam as Exam, ExamQuestion } from "../_lib/content";
import { useProgress } from "../_lib/useProgress";
import { Card, Button, Pill } from "./ui";
import Markdown from "./Markdown";
import Feedback, { type GradeResult } from "./Feedback";

type Phase = "list" | "running" | "grading" | "results";

function fmt(sec: number) {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function MockExam({ courseId, exams }: { courseId: string; exams: Exam[] }) {
  const { recordMock } = useProgress(courseId);
  const [phase, setPhase] = useState<Phase>("list");
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [active, setActive] = useState(1);
  const [remaining, setRemaining] = useState(0);
  const [gradedCount, setGradedCount] = useState(0);
  const [results, setResults] = useState<{ q: ExamQuestion; fb: GradeResult }[]>([]);
  const submittedRef = useRef(false);

  const start = (e: Exam) => {
    setExam(e);
    setAnswers({});
    setActive(1);
    setRemaining(e.duration_minutes * 60);
    setResults([]);
    setGradedCount(0);
    submittedRef.current = false;
    setPhase("running");
  };

  const submit = useCallback(async () => {
    if (!exam || submittedRef.current) return;
    submittedRef.current = true;
    setPhase("grading");
    const out: { q: ExamQuestion; fb: GradeResult }[] = [];
    for (const q of exam.questions) {
      try {
        const res = await fetch("/api/tutor/grade", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            question: { prompt: q.prompt_he, model_solution: q.model_solution, rubric: q.rubric },
            answer: answers[q.n] ?? "",
            points: q.points,
          }),
        });
        const fb = res.ok
          ? ((await res.json()) as GradeResult)
          : ({ score: 0, awarded: 0, outOf: q.points, verdict: "incorrect", summary_he: "לא נבדק (שגיאה).", correct_points: [], missing_points: [], hint_he: "" } as GradeResult);
        out.push({ q, fb });
      } catch {
        out.push({ q, fb: { score: 0, awarded: 0, outOf: q.points, verdict: "incorrect", summary_he: "לא נבדק (שגיאה).", correct_points: [], missing_points: [], hint_he: "" } });
      }
      setGradedCount(out.length);
    }
    const total = out.reduce((s, r) => s + (r.fb.awarded ?? 0), 0);
    recordMock(exam.id, total, exam.total_points);
    setResults(out);
    setPhase("results");
  }, [exam, answers, recordMock]);

  // countdown
  useEffect(() => {
    if (phase !== "running") return;
    if (remaining <= 0) {
      submit();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, remaining, submit]);

  /* ---------- LIST ---------- */
  if (phase === "list") {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>מבחן דמה</p>
        <h1 className="mt-1 mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
          מבחן מלא בתנאי אמת
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
          3 שאלות · 3 שעות · פורמט המבחן האמיתי. בסוף מקבלים ציון ומשוב לכל שאלה.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {exams.map((e) => (
            <Card key={e.id}>
              <p className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>{e.title_he}</p>
              {e.theme_he && <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>{e.theme_he}</p>}
              <div className="mt-3 flex gap-2 flex-wrap text-xs" style={{ color: "var(--color-muted)" }}>
                <Pill tone="muted">{e.total_points} נק׳</Pill>
                <Pill tone="muted">{Math.round(e.duration_minutes / 60)} שעות</Pill>
                <Pill tone="muted">{e.questions.length} שאלות</Pill>
              </div>
              <div className="mt-4">
                <Button onClick={() => start(e)}>התחל מבחן</Button>
              </div>
            </Card>
          ))}
          {exams.length === 0 && <p className="text-sm" style={{ color: "var(--color-muted)" }}>אין מבחנים זמינים עדיין.</p>}
        </div>
      </div>
    );
  }

  /* ---------- GRADING ---------- */
  if (phase === "grading") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center lift lift-1">
        <p className="text-2xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>בודק את המבחן…</p>
        <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>שאלה {gradedCount}/{exam?.questions.length}</p>
      </div>
    );
  }

  /* ---------- RESULTS ---------- */
  if (phase === "results" && exam) {
    const total = results.reduce((s, r) => s + (r.fb.awarded ?? 0), 0);
    const pass = total >= 55;
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>תוצאות · {exam.title_he}</p>
        <div className="mt-3 rounded-xl border p-6 text-center" style={{ borderColor: pass ? "var(--color-sky-deep)" : "#c8894b", background: "var(--color-paper-soft)" }}>
          <p className="text-5xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>{total}<span className="text-2xl">/{exam.total_points}</span></p>
          <p className="mt-2 text-sm" style={{ color: pass ? "var(--color-sky-deep)" : "#c8894b" }}>
            {pass ? "עברת את רף ה-55 🎉" : "מתחת ל-55 — יש על מה לעבוד, זה בדיוק מה שאנחנו כאן בשבילו"}
          </p>
        </div>
        <div className="mt-6 space-y-6">
          {results.map((r) => (
            <div key={r.q.n}>
              <h2 className="mb-2 text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
                שאלה {r.q.n} · {r.fb.awarded}/{r.q.points}
              </h2>
              <Feedback fb={r.fb} />
              <details className="mt-2">
                <summary className="cursor-pointer text-sm" style={{ color: "var(--color-sky-deep)" }}>פתרון לדוגמה</summary>
                <div className="mt-2 rounded-xl border p-4" style={{ borderColor: "var(--color-rule)" }}>
                  <Markdown>{r.q.model_solution}</Markdown>
                </div>
              </details>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="outline" onClick={() => setPhase("list")}>חזרה למבחנים</Button>
        </div>
      </div>
    );
  }

  /* ---------- RUNNING ---------- */
  if (!exam) return null;
  const q = exam.questions.find((x) => x.n === active) ?? exam.questions[0];
  const low = remaining < 300;
  return (
    <div className="flex flex-col h-[100dvh] md:h-screen">
      {/* exam bar */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3 border-b" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium tabular-nums" style={{ color: low ? "#a23b2e" : "var(--color-ink)", fontFamily: "var(--font-mono)" }}>
            <Timer size={16} /> {fmt(remaining)}
          </span>
          <span className="hidden sm:inline text-sm" style={{ color: "var(--color-muted)" }}>{exam.title_he}</span>
        </div>
        <div className="flex items-center gap-2">
          {exam.questions.map((qq) => (
            <button key={qq.n} onClick={() => setActive(qq.n)} className="h-8 w-8 rounded-full text-sm"
              style={active === qq.n ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" } : { background: "var(--color-paper)", color: "var(--color-ink-soft)", border: "1px solid var(--color-rule)" }}>
              {qq.n}
            </button>
          ))}
          <Button onClick={() => { if (confirm("להגיש את המבחן לבדיקה?")) submit(); }} className="mr-2">הגש</Button>
        </div>
      </div>

      {/* question + answer */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex items-center gap-2 mb-3">
            <Pill tone="green">שאלה {q.n}</Pill>
            <span className="text-sm" style={{ color: "var(--color-muted)" }}>{q.points} נקודות</span>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
            <Markdown>{q.prompt_he}</Markdown>
          </div>
          <label className="block mt-5 mb-2 text-sm" style={{ color: "var(--color-muted)" }}>התשובה שלך לשאלה {q.n}</label>
          <textarea
            value={answers[q.n] ?? ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.n]: e.target.value }))}
            rows={14}
            dir="auto"
            placeholder="כתבי כאן…"
            className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none resize-y"
            style={{ borderColor: "var(--color-rule)", background: "var(--color-paper)", color: "var(--color-ink)", fontFamily: "var(--font-mono)" }}
          />
          <div className="mt-3 flex justify-between">
            <Button variant="ghost" onClick={() => setActive((n) => Math.max(1, n - 1))} disabled={active === 1}>הקודמת</Button>
            {active < exam.questions.length ? (
              <Button variant="outline" onClick={() => setActive((n) => Math.min(exam.questions.length, n + 1))}>
                הבאה <ArrowRight size={15} className="inline mr-1" />
              </Button>
            ) : (
              <Button onClick={() => { if (confirm("להגיש את המבחן לבדיקה?")) submit(); }}>סיום והגשה</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
