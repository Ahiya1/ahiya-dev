import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "./route";

function req(body: unknown, host = "example.com") {
  return new Request("http://x/api/tutor/login", {
    method: "POST",
    headers: { "content-type": "application/json", host },
    body: JSON.stringify(body),
  });
}

describe("login route", () => {
  beforeEach(() => vi.stubEnv("TUTOR_PASSWORD", "secret"));
  afterEach(() => vi.unstubAllEnvs());

  it("rejects a wrong password with 401", async () => {
    const res = await POST(req({ password: "nope" }));
    expect(res.status).toBe(401);
  });

  it("accepts the right password, sets an httpOnly cookie", async () => {
    const res = await POST(req({ password: "secret" }));
    expect(res.status).toBe(200);
    const sc = res.headers.get("set-cookie") ?? "";
    expect(sc).toContain("tutor_auth=");
    expect(sc.toLowerCase()).toContain("httponly");
  });

  it("scopes the cookie to .ahiya.dev on the real host", async () => {
    const res = await POST(req({ password: "secret" }, "www.ahiya.dev"));
    expect(res.headers.get("set-cookie") ?? "").toContain("Domain=.ahiya.dev");
  });

  it("500s when the gate is not configured", async () => {
    vi.stubEnv("TUTOR_PASSWORD", "");
    const res = await POST(req({ password: "x" }));
    expect(res.status).toBe(500);
  });
});
