// Course registry. Each course bundles a distilled knowledge base (produced by
// the exploration pass) into text sections the tutor is grounded on.
//
// The whole of a single course is only tens of thousands of tokens, so we load
// it entirely into context (no vector DB / RAG needed) and let prompt caching
// keep it cheap across turns.

import metaData from "../_courses/234124/meta.json";
import lecturesData from "../_courses/234124/lectures.json";
import tutorialsData from "../_courses/234124/tutorials.json";
import examsData from "../_courses/234124/exams.json";

export interface CourseSummary {
  id: string;
  number: string;
  nameEn: string;
  nameHe: string;
  descEn: string;
  descHe: string;
  language: string;
  available: boolean;
}

export interface Course extends CourseSummary {
  meta: string;
  lectures: string;
  tutorials: string;
  exams: string;
}

/* ---------- formatters: JSON KB -> compact readable text ---------- */

function fmtMeta(m: any): string {
  const lines: string[] = [];
  if (m.summary_en) lines.push(`EN: ${m.summary_en}`);
  if (m.summary_he) lines.push(`HE: ${m.summary_he}`);
  if (Array.isArray(m.weekly_topics) && m.weekly_topics.length)
    lines.push(`Weekly topics: ${m.weekly_topics.join("; ")}`);
  if (Array.isArray(m.grading) && m.grading.length)
    lines.push(
      `Grading: ${m.grading
        .map((g: any) => `${g.component} ${g.weight}`)
        .join(", ")}`,
    );
  if (Array.isArray(m.policies) && m.policies.length)
    lines.push(`Policies: ${m.policies.join("; ")}`);
  return lines.join("\n");
}

function fmtLectures(arr: any[]): string {
  return arr
    .map((l) => {
      const parts = [`### Lecture ${l.number}: ${l.title}`];
      if (l.topics?.length) parts.push(`Topics: ${l.topics.join(", ")}`);
      if (l.key_concepts?.length)
        parts.push(
          l.key_concepts
            .map((c: any) => `- ${c.term}: ${c.definition}`)
            .join("\n"),
        );
      if (l.code_idioms?.length)
        parts.push(`Idioms: ${l.code_idioms.join(" | ")}`);
      if (l.common_pitfalls?.length)
        parts.push(`Pitfalls: ${l.common_pitfalls.join(" | ")}`);
      return parts.join("\n");
    })
    .join("\n\n");
}

function fmtTutorials(arr: any[]): string {
  return arr
    .map((t) => {
      const parts = [`### Tutorial ${t.number}: ${t.title}`];
      if (t.topics?.length) parts.push(`Topics: ${t.topics.join(", ")}`);
      if (t.key_concepts?.length)
        parts.push(
          t.key_concepts
            .map((c: any) => `- ${c.term}: ${c.definition}`)
            .join("\n"),
        );
      if (t.cheatsheet?.length)
        parts.push(`Cheatsheet: ${t.cheatsheet.join(" | ")}`);
      if (t.worked_examples?.length)
        parts.push(`Worked examples: ${t.worked_examples.join(" | ")}`);
      return parts.join("\n");
    })
    .join("\n\n");
}

function fmtExams(e: any): string {
  const parts: string[] = [];
  if (e.topic_frequency?.length)
    parts.push(
      "Topic frequency:\n" +
        e.topic_frequency
          .map((t: any) => `- ${t.topic} (×${t.appearances}): ${t.notes ?? ""}`)
          .join("\n"),
    );
  if (e.question_archetypes?.length)
    parts.push(
      "Question archetypes:\n" +
        e.question_archetypes
          .map((a: any) => `- ${a.archetype}: ${a.description}. Approach: ${a.how_to_approach ?? ""}`)
          .join("\n"),
    );
  if (e.exam_structure)
    parts.push(`Exam structure: ${JSON.stringify(e.exam_structure)}`);
  if (e.practice_bank?.length)
    parts.push(
      "Practice bank (use these as models for drills):\n" +
        e.practice_bank
          .map(
            (q: any) =>
              `[${q.id} · ${q.topic} · ${q.difficulty}] Q: ${q.question}\nSolution: ${q.solution}\nTeaches: ${q.teaching_note ?? ""}`,
          )
          .join("\n\n"),
    );
  return parts.join("\n\n");
}

/* ---------- registry ---------- */

const meta: any = metaData;

const course234124: Course = {
  id: "234124",
  number: "234124",
  nameEn: meta.course_name_en || "Introduction to Systems Programming",
  nameHe: meta.course_name_he || "מבוא לתכנות מערכות",
  descEn:
    meta.summary_en ||
    "First-year C++ systems programming: OOP, templates, exceptions, STL, and more.",
  descHe:
    meta.summary_he ||
    "קורס תכנות מערכות ב-C++: מחלקות, תבניות, חריגות, STL ועוד.",
  language: "he",
  available: true,
  meta: fmtMeta(meta),
  lectures: fmtLectures(lecturesData as any[]),
  tutorials: fmtTutorials(tutorialsData as any[]),
  exams: fmtExams(examsData as any),
};

const COURSES: Record<string, Course> = {
  "234124": course234124,
};

export function getCourse(id: string): Course | null {
  return COURSES[id] ?? null;
}

export function listCourses(): CourseSummary[] {
  return Object.values(COURSES).map(
    ({ meta, lectures, tutorials, exams, ...summary }) => summary,
  );
}
