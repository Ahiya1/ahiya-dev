import { describe, it, expect, vi } from "vitest";

vi.mock("../../../tutor/_lib/inference", () => ({
  // eslint-disable-next-line require-yield
  streamTutor: async function* () {
    yield "שלום";
    yield " עולם";
  },
}));

import { POST } from "./route";

const req = (body: unknown) =>
  new Request("http://x/api/tutor/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("chat route", () => {
  it("404 for an unknown course", async () => {
    const res = await POST(req({ courseId: "000000", messages: [{ role: "user", content: "hi" }] }));
    expect(res.status).toBe(404);
  });

  it("400 when the last message is not from the user", async () => {
    const res = await POST(req({ courseId: "234124", messages: [{ role: "assistant", content: "hi" }] }));
    expect(res.status).toBe(400);
  });

  it("streams the assistant reply for a valid request", async () => {
    const res = await POST(req({ courseId: "234124", messages: [{ role: "user", content: "מה שלומך" }] }));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe("שלום עולם");
  });
});
