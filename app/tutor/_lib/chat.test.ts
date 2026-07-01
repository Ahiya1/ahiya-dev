import { describe, it, expect } from "vitest";
import {
  base64Bytes,
  sanitizeAttachment,
  buildApiMessages,
  MAX_ATTACHMENT_BYTES,
} from "./chat";

const smallB64 = "aGVsbG8="; // "hello"

describe("attachment sanitizing", () => {
  it("estimates base64 decoded size", () => {
    expect(base64Bytes(smallB64)).toBe(5);
  });

  it("accepts a valid image", () => {
    const a = sanitizeAttachment({ mediaType: "image/png", data: smallB64, name: "x.png" });
    expect(a).not.toBeNull();
    expect(a!.kind).toBe("image");
  });

  it("accepts a pdf", () => {
    const a = sanitizeAttachment({ mediaType: "application/pdf", data: smallB64 });
    expect(a!.kind).toBe("pdf");
  });

  it("rejects an unsupported type", () => {
    expect(sanitizeAttachment({ mediaType: "text/plain", data: smallB64 })).toBeNull();
  });

  it("rejects an oversized attachment", () => {
    const big = "A".repeat(Math.ceil((MAX_ATTACHMENT_BYTES + 1024) * 4 / 3));
    expect(sanitizeAttachment({ mediaType: "image/png", data: big })).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(sanitizeAttachment(null)).toBeNull();
    expect(sanitizeAttachment({ mediaType: "image/png" })).toBeNull();
  });
});

describe("buildApiMessages", () => {
  it("keeps text-only messages as strings", () => {
    const out = buildApiMessages([{ role: "user", content: "hi" }], { maxChars: 100 });
    expect(out[0]).toEqual({ role: "user", content: "hi" });
  });

  it("turns a user image message into content blocks (image + text)", () => {
    const out = buildApiMessages(
      [{ role: "user", content: "what is this?", attachments: [{ kind: "image", mediaType: "image/png", data: smallB64 }] }],
      { maxChars: 100 },
    );
    const content = out[0].content as any[];
    expect(Array.isArray(content)).toBe(true);
    expect(content[0].type).toBe("image");
    expect(content[0].source.media_type).toBe("image/png");
    expect(content[content.length - 1]).toEqual({ type: "text", text: "what is this?" });
  });

  it("supports an image with no text (image-only block)", () => {
    const out = buildApiMessages(
      [{ role: "user", content: "", attachments: [{ kind: "image", mediaType: "image/jpeg", data: smallB64 }] }],
      { maxChars: 100 },
    );
    const content = out[0].content as any[];
    expect(content).toHaveLength(1);
    expect(content[0].type).toBe("image");
  });

  it("drops invalid attachments but keeps the text", () => {
    const out = buildApiMessages(
      [{ role: "user", content: "hello", attachments: [{ kind: "image", mediaType: "text/plain", data: smallB64 }] }],
      { maxChars: 100 },
    );
    expect(out[0].content).toBe("hello"); // fell back to plain string
  });

  it("truncates content to maxChars", () => {
    const out = buildApiMessages([{ role: "user", content: "abcdef" }], { maxChars: 3 });
    expect(out[0].content).toBe("abc");
  });
});
