import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "app/tutor/_courses/234124/content");
const load = (f: string) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));

describe("generated content: cheatsheets", () => {
  it("has well-formed sections", () => {
    const { sections } = load("cheatsheets.json");
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThanOrEqual(8);
    for (const s of sections) {
      expect(s.id && s.title_he && s.category).toBeTruthy();
      expect(Array.isArray(s.items) && s.items.length > 0).toBe(true);
      for (const it of s.items) expect(it.label_he && it.detail_he).toBeTruthy();
    }
  });
});

describe("generated content: practice", () => {
  it("has questions with required fields and valid enums", () => {
    const { questions } = load("practice.json");
    expect(questions.length).toBeGreaterThanOrEqual(12);
    const types = new Set(["design", "container", "python", "theory"]);
    const diffs = new Set(["easy", "medium", "hard"]);
    const ids = new Set<string>();
    for (const q of questions) {
      expect(q.id).toBeTruthy();
      ids.add(q.id);
      expect(types.has(q.type)).toBe(true);
      expect(diffs.has(q.difficulty)).toBe(true);
      expect(q.prompt_he && q.model_solution).toBeTruthy();
      expect(Array.isArray(q.rubric) && q.rubric.length > 0).toBe(true);
    }
    expect(ids.size).toBe(questions.length); // unique ids
  });

  it("covers all four question types", () => {
    const { questions } = load("practice.json");
    const kinds = new Set(questions.map((q: any) => q.type));
    for (const t of ["design", "container", "python", "theory"]) expect(kinds.has(t)).toBe(true);
  });
});

describe("generated content: mock_exams", () => {
  it("each exam has 3 questions summing to its total points", () => {
    const { exams } = load("mock_exams.json");
    expect(exams.length).toBeGreaterThanOrEqual(1);
    for (const e of exams) {
      expect(e.questions.length).toBe(3);
      const sum = e.questions.reduce((s: number, q: any) => s + q.points, 0);
      expect(sum).toBe(e.total_points);
      for (const q of e.questions) {
        expect(q.prompt_he && q.model_solution).toBeTruthy();
        expect(Array.isArray(q.rubric) && q.rubric.length > 0).toBe(true);
      }
    }
  });
});
