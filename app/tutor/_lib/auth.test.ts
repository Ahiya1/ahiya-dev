import { describe, it, expect, vi } from "vitest";
import { computeToken, safeEqual, expectedToken } from "./auth";

describe("auth", () => {
  it("computeToken is deterministic and 64 hex chars", async () => {
    const a = await computeToken("hunter2");
    const b = await computeToken("hunter2");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it("different passwords -> different tokens", async () => {
    expect(await computeToken("a")).not.toBe(await computeToken("b"));
  });

  it("safeEqual compares correctly", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "ab")).toBe(false);
  });

  it("expectedToken reflects env password", async () => {
    vi.stubEnv("TUTOR_PASSWORD", "s3cret");
    expect(await expectedToken()).toBe(await computeToken("s3cret"));
    vi.stubEnv("TUTOR_PASSWORD", "");
    expect(await expectedToken()).toBeNull();
    vi.unstubAllEnvs();
  });
});
