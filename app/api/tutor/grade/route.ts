import { structured } from "../../../tutor/_lib/inference";

export const runtime = "nodejs";
export const maxDuration = 60;

const GRADE_TOOL = {
  name: "grade",
  description: "Return a fair, encouraging grade and feedback for the student's answer, in Hebrew.",
  input_schema: {
    type: "object",
    properties: {
      score: { type: "number", description: "0-100 overall correctness" },
      verdict: { type: "string", enum: ["correct", "partial", "incorrect"] },
      summary_he: { type: "string", description: "1-2 sentence Hebrew summary of how they did" },
      correct_points: { type: "array", items: { type: "string" }, description: "what the student got right (Hebrew)" },
      missing_points: { type: "array", items: { type: "string" }, description: "what's wrong or missing, per rubric (Hebrew)" },
      hint_he: { type: "string", description: "one concrete next-step hint (Hebrew), not the full solution" },
    },
    required: ["score", "verdict", "summary_he", "correct_points", "missing_points", "hint_he"],
  },
} as const;

export async function POST(req: Request) {
  let body: {
    question?: { title?: string; prompt?: string; model_solution?: string; rubric?: string[] };
    answer?: string;
    points?: number;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const q = body.question;
  const answer = (body.answer ?? "").slice(0, 12000).trim();
  if (!q?.prompt || !answer) {
    return Response.json({ error: "missing question or answer" }, { status: 400 });
  }

  const system = `אתה בודק/ת מבחנים הוגן ומעודד של קורס 234124 (C++/Python). דרג/י את תשובת הסטודנט מול המחוון והפתרון לדוגמה. היה/י מדויק/ת אך אדיב/ה: ציין/י מה נכון, מה חסר או שגוי לפי המחוון, ותן/י רמז ממוקד להמשך (בלי לחשוף את כל הפתרון). קוד ומונחים באנגלית, הסברים בעברית. שים/י לב במיוחד ל-const-correctness, ניהול זיכרון, ו-exception safety ב-C++, ולסגנון comprehensions (בלי לולאות מפורשות) ב-Python.`;

  const user = `שאלה:
${q.prompt}

מחוון (קריטריונים):
${(q.rubric ?? []).map((r) => `- ${r}`).join("\n")}

פתרון לדוגמה:
${q.model_solution ?? "(אין)"}

תשובת הסטודנט:
${answer}

הערך/י את התשובה וקרא/י ל-grade.`;

  try {
    const result = await structured<any>({
      system,
      messages: [{ role: "user", content: user }],
      tool: GRADE_TOOL,
      maxTokens: 1200,
    });
    if (typeof body.points === "number") {
      result.awarded = Math.round(((result.score ?? 0) / 100) * body.points);
      result.outOf = body.points;
    }
    return Response.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "grading error";
    return Response.json({ error: msg }, { status: 502 });
  }
}
