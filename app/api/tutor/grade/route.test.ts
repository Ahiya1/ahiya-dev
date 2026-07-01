import { describe, it, expect, vi } from "vitest";

const structuredMock = vi.fn(async () => ({
  score: 80,
  verdict: "partial",
  summary_he: "כמעט",
  correct_points: ["deep copy נכון"],
  missing_points: ["חסר const"],
  hint_he: "הוסיפי const",
}));

vi.mock("../../../tutor/_lib/inference", () => ({
  structured: (...args: unknown[]) => structuredMock(...(args as [])),
}));

import { POST } from "./route";

const req = (body: unknown) =>
  new Request("http://x/api/tutor/grade", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("grade route", () => {
  it("400 when answer is missing", async () => {
    const res = await POST(req({ question: { prompt: "q" } }));
    expect(res.status).toBe(400);
  });

  it("grades and scales awarded points", async () => {
    const res = await POST(
      req({
        question: { prompt: "q", rubric: ["r"], model_solution: "s" },
        answer: "my attempt",
        points: 45,
      }),
    );
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.score).toBe(80);
    expect(j.awarded).toBe(36); // round(0.8 * 45)
    expect(j.outOf).toBe(45);
  });

  it("omits awarded when no points given", async () => {
    const res = await POST(
      req({ question: { prompt: "q", rubric: ["r"], model_solution: "s" }, answer: "a" }),
    );
    const j = await res.json();
    expect(j.awarded).toBeUndefined();
  });
});
