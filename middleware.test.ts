import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";
import { computeToken } from "./app/tutor/_lib/auth";

function mk(url: string, host: string, cookie?: string) {
  const headers = new Headers();
  headers.set("host", host);
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(url), { headers });
}

describe("middleware gate", () => {
  beforeEach(() => vi.stubEnv("TUTOR_PASSWORD", "secret"));
  afterEach(() => vi.unstubAllEnvs());

  it("308-redirects the bare apex to www", async () => {
    const res = await middleware(mk("https://ahiya.dev/tutor/234124", "ahiya.dev"));
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toContain("https://www.ahiya.dev/tutor/234124");
  });

  it("lets the public landing through", async () => {
    const res = await middleware(mk("https://www.ahiya.dev/tutor", "www.ahiya.dev"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects a gated page to login without a cookie", async () => {
    const res = await middleware(mk("https://www.ahiya.dev/tutor/234124", "www.ahiya.dev"));
    expect(res.headers.get("location")).toContain("/tutor/login");
  });

  it("401s a gated API without a cookie", async () => {
    const res = await middleware(mk("https://www.ahiya.dev/api/tutor/chat", "www.ahiya.dev"));
    expect(res.status).toBe(401);
  });

  it("allows a gated page with a valid cookie", async () => {
    const token = await computeToken("secret");
    const res = await middleware(
      mk("https://www.ahiya.dev/tutor/234124", "www.ahiya.dev", `tutor_auth=${token}`),
    );
    expect(res.headers.get("location")).toBeNull();
  });
});
