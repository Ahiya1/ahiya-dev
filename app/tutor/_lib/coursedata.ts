// Structured course data for the workspace UI (distinct from courses.ts, which
// builds the tutor's in-context grounding string). Reads the distilled KB JSON.

import meta from "../_courses/234124/meta.json";
import lecturesJson from "../_courses/234124/lectures.json";
import tutorialsJson from "../_courses/234124/tutorials.json";
import examsJson from "../_courses/234124/exams.json";

export type UnitKind = "lecture" | "tutorial";

export interface Concept {
  term: string;
  definition: string;
}

export interface Unit {
  id: string; // "L05" | "T06"
  kind: UnitKind;
  number: number;
  title: string;
  topics: string[];
  concepts: Concept[];
  idioms: string[];
  pitfalls: string[];
  examples: string[];
}

export interface CourseMeta {
  number: string;
  nameHe: string;
  nameEn: string;
  summaryHe: string;
  summaryEn: string;
  grading: { component: string; weight: string }[];
  policies: string[];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function getMeta(): CourseMeta {
  const m: any = meta;
  return {
    number: m.course_number ?? "234124",
    nameHe: m.course_name_he ?? "מבוא לתכנות מערכות",
    nameEn: m.course_name_en ?? "Introduction to Systems Programming",
    summaryHe: m.summary_he ?? "",
    summaryEn: m.summary_en ?? "",
    grading: Array.isArray(m.grading) ? m.grading : [],
    policies: Array.isArray(m.policies) ? m.policies : [],
  };
}

let unitsCache: Unit[] | null = null;

export function getUnits(): Unit[] {
  if (unitsCache) return unitsCache;
  const lectures: Unit[] = (lecturesJson as any[]).map((l) => ({
    id: `L${pad(l.number)}`,
    kind: "lecture" as const,
    number: l.number,
    title: l.title ?? `Lecture ${l.number}`,
    topics: l.topics ?? [],
    concepts: (l.key_concepts ?? []).map((c: any) => ({
      term: c.term,
      definition: c.definition,
    })),
    idioms: l.code_idioms ?? [],
    pitfalls: l.common_pitfalls ?? [],
    examples: [],
  }));
  const tutorials: Unit[] = (tutorialsJson as any[]).map((t) => ({
    id: `T${pad(t.number)}`,
    kind: "tutorial" as const,
    number: t.number,
    title: t.title ?? `Tutorial ${t.number}`,
    topics: t.topics ?? [],
    concepts: (t.key_concepts ?? []).map((c: any) => ({
      term: c.term,
      definition: c.definition,
    })),
    idioms: t.cheatsheet ?? [],
    pitfalls: [],
    examples: t.worked_examples ?? [],
  }));
  unitsCache = [...lectures, ...tutorials];
  return unitsCache;
}

export function getUnit(unitId: string): Unit | null {
  return getUnits().find((u) => u.id === unitId) ?? null;
}

export interface TopicFreq {
  topic: string;
  appearances: number;
  notes?: string;
}

export function getExamTopics(): TopicFreq[] {
  const e: any = examsJson;
  return (e.topic_frequency ?? []).map((t: any) => ({
    topic: t.topic,
    appearances: t.appearances ?? 0,
    notes: t.notes,
  }));
}

export function getExamStructure(): any {
  return (examsJson as any).exam_structure ?? null;
}
