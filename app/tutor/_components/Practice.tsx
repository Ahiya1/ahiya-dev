"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import type { PracticeQuestion, QuestionType, Difficulty } from "../_lib/content";
import { useProgress } from "../_lib/useProgress";
import { Pill, Button } from "./ui";
import Markdown from "./Markdown";
import Feedback, { type GradeResult } from "./Feedback";

const TYPE_HE: Record<QuestionType, string> = {
  design: "עיצוב מערכת · ש1",
  container: "מבנה גנרי · ש2",
  python: "פייתון · ש3",
  theory: "תיאוריה · קצר",
};
const DIFF_HE: Record<Difficulty, string> = { easy: "קל", medium: "בינוני", hard: "קשה" };

export default function Practice({
  courseId,
  questions,
  initialTopic,
}: {
  courseId: string;
  questions: PracticeQuestion[];
  initialTopic?: string;
}) {
  const { progress, recordPractice } = useProgress(courseId);
  const [type, setType] = useState<QuestionType | "all">("all");
  const [topic, setTopic] = useState<string>(initialTopic ?? "all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (type === "all" || q.type === type) &&
          (topic === "all" || (q.topics ?? []).some((t) => t.includes(topic) || topic.includes(t))),
      ),
    [questions, type, topic],
  );

  const selected = questions.find((q) => q.id === selectedId) ?? null;

  if (selected) {
    return (
      <QuestionView
        q={selected}
        attempted={progress.practice[selected.id]?.score}
        onBack={() => setSelectedId(null)}
        onGraded={(score) => recordPractice(selected.id, score)}
      />
    );
  }

  const topicOptions = ["all", ...new Set(questions.flatMap((q) => q.topics ?? []))].slice(0, 24);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>תרגול</p>
      <h1 className="mt-1 mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
        תרגלי, קבלי משוב, השתפרי
      </h1>
      <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
        {filtered.length} שאלות בסגנון המבחן · כתבי תשובה ואני אבדוק אותה מול המחוון.
      </p>

      {/* filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(["all", "design", "container", "python", "theory"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)} className="rounded-full px-3 py-1.5 text-sm"
            style={type === t ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" } : { background: "var(--color-paper-soft)", color: "var(--color-ink-soft)", border: "1px solid var(--color-rule)" }}>
            {t === "all" ? "הכל" : TYPE_HE[t]}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
          style={{ borderColor: "var(--color-rule)", color: "var(--color-ink)" }}>
          {topicOptions.map((t) => (
            <option key={t} value={t}>{t === "all" ? "כל הנושאים" : t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((q) => {
          const score = progress.practice[q.id]?.score;
          return (
            <button key={q.id} onClick={() => setSelectedId(q.id)} className="group text-right rounded-lg border px-4 py-3 transition-colors"
              style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
              <div className="flex items-center gap-2 flex-wrap">
                <Pill tone={q.type === "python" ? "green" : "muted"}>{TYPE_HE[q.type]}</Pill>
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>{DIFF_HE[q.difficulty]}</span>
                {score != null && (
                  <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--color-sky-deep)" }}>
                    <CheckCircle2 size={13} /> {score}/100
                  </span>
                )}
              </div>
              <p className="mt-1 text-[15px]" style={{ color: "var(--color-ink)" }} dir="auto">{q.title_he}</p>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>אין שאלות בסינון הזה.</p>
        )}
      </div>
    </div>
  );
}

function QuestionView({
  q,
  attempted,
  onBack,
  onGraded,
}: {
  q: PracticeQuestion;
  attempted?: number;
  onBack: () => void;
  onGraded: (score: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [feedback, setFeedback] = useState<GradeResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [error, setError] = useState("");

  async function grade() {
    if (!answer.trim() || grading) return;
    setGrading(true);
    setError("");
    setFeedback(null);
    try {
      const res = await fetch("/api/tutor/grade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: { title: q.title_he, prompt: q.prompt_he, model_solution: q.model_solution, rubric: q.rubric },
          answer,
        }),
      });
      if (!res.ok) throw new Error();
      const fb = (await res.json()) as GradeResult;
      setFeedback(fb);
      onGraded(fb.score);
    } catch {
      setError("הבדיקה נכשלה, נסי שוב.");
    } finally {
      setGrading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm link" style={{ color: "var(--color-sky-deep)" }}>
        <ArrowRight size={15} /> חזרה לרשימה
      </button>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <Pill tone="muted">{TYPE_HE[q.type]}</Pill>
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>{DIFF_HE[q.difficulty]}</span>
        {q.source && <span className="text-xs" style={{ color: "var(--color-muted)" }}>· {q.source}</span>}
        {attempted != null && <span className="text-xs" style={{ color: "var(--color-sky-deep)" }}>· ניסיון קודם {attempted}/100</span>}
      </div>
      <h1 className="mt-2 text-xl sm:text-2xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }} dir="auto">
        {q.title_he}
      </h1>

      <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
        <Markdown>{q.prompt_he}</Markdown>
      </div>

      <label className="block mt-6 mb-2 text-sm" style={{ color: "var(--color-muted)" }}>התשובה שלך</label>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={10}
        dir="auto"
        placeholder="כתבי כאן את הפתרון — קוד ו/או הסבר…"
        className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none resize-y"
        style={{ borderColor: "var(--color-rule)", background: "var(--color-paper)", color: "var(--color-ink)", fontFamily: "var(--font-mono)" }}
      />

      <div className="mt-3 flex flex-wrap gap-3">
        <Button onClick={grade} disabled={grading || !answer.trim()}>
          {grading ? "בודק…" : "בדוק אותי"}
        </Button>
        <Button variant="outline" onClick={() => setShowSolution((s) => !s)}>
          {showSolution ? <><EyeOff size={15} className="inline ml-1" /> הסתר פתרון</> : <><Eye size={15} className="inline ml-1" /> פתרון לדוגמה</>}
        </Button>
      </div>
      {error && <p className="mt-3 text-sm" style={{ color: "#a23b2e" }}>{error}</p>}

      {feedback && <div className="mt-5"><Feedback fb={feedback} /></div>}

      {showSolution && (
        <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
          <p className="text-sm mb-2" style={{ color: "var(--color-muted)" }}>פתרון לדוגמה</p>
          <Markdown>{q.model_solution}</Markdown>
        </div>
      )}
    </div>
  );
}
