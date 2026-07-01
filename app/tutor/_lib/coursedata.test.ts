import { describe, it, expect } from "vitest";
import { getUnits, getUnit, getMeta, getExamTopics } from "./coursedata";

describe("coursedata", () => {
  it("returns lectures and tutorials as units", () => {
    const u = getUnits();
    expect(u.length).toBeGreaterThanOrEqual(25);
    expect(u.some((x) => x.kind === "lecture")).toBe(true);
    expect(u.some((x) => x.kind === "tutorial")).toBe(true);
    expect(u.every((x) => x.id && x.title && Array.isArray(x.topics))).toBe(true);
  });

  it("unit ids are unique", () => {
    const ids = getUnits().map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getUnit finds and misses correctly", () => {
    const first = getUnits()[0];
    expect(getUnit(first.id)?.id).toBe(first.id);
    expect(getUnit("nope")).toBeNull();
  });

  it("meta has course identity", () => {
    const m = getMeta();
    expect(m.number).toBe("234124");
    expect(m.nameHe).toBeTruthy();
  });

  it("exam topics are present", () => {
    expect(getExamTopics().length).toBeGreaterThan(0);
  });
});
