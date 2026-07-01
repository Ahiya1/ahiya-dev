// Typed accessors for the generated study content (cheat sheets, practice bank,
// mock exams). These JSON files are produced by the content-generation pass.

import practiceJson from "../_courses/234124/content/practice.json";
import cheatsheetsJson from "../_courses/234124/content/cheatsheets.json";
import mockExamsJson from "../_courses/234124/content/mock_exams.json";

export type QuestionType = "design" | "container" | "python" | "theory";
export type Difficulty = "easy" | "medium" | "hard";

export interface PracticeQuestion {
  id: string;
  title_he: string;
  type: QuestionType;
  topics: string[];
  difficulty: Difficulty;
  source?: string;
  prompt_he: string;
  starter_code?: string | null;
  model_solution: string;
  rubric: string[];
}

export function getPractice(): PracticeQuestion[] {
  return ((practiceJson as any).questions ?? []) as PracticeQuestion[];
}
export function getPracticeTopics(): string[] {
  return ((practiceJson as any).topics ?? []) as string[];
}
export function getPracticeById(id: string): PracticeQuestion | null {
  return getPractice().find((q) => q.id === id) ?? null;
}

export interface CheatItem {
  label_he: string;
  detail_he: string;
  code?: string;
}
export interface CheatSection {
  id: string;
  title_he: string;
  title_en?: string;
  category: string;
  blurb_he?: string;
  items: CheatItem[];
}
export function getCheatsheets(): CheatSection[] {
  return ((cheatsheetsJson as any).sections ?? []) as CheatSection[];
}

export interface ExamQuestion {
  n: number;
  type: string;
  points: number;
  prompt_he: string;
  model_solution: string;
  rubric: string[];
}
export interface MockExam {
  id: string;
  title_he: string;
  theme_he?: string;
  duration_minutes: number;
  total_points: number;
  questions: ExamQuestion[];
}
export function getMockExams(): MockExam[] {
  return ((mockExamsJson as any).exams ?? []) as MockExam[];
}
export function getMockExam(id: string): MockExam | null {
  return getMockExams().find((e) => e.id === id) ?? null;
}
