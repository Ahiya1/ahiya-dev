// Shared chat message shaping: turn the client's messages (text + attachments)
// into Anthropic content blocks, with validation. Pure + unit-tested.

import type { ChatMessage, ContentBlock } from "./inference";

export interface Attachment {
  kind: "image" | "pdf";
  mediaType: string;
  data: string; // raw base64 (no data: URL prefix)
  name?: string;
}

export interface RawMessage {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
}

export const MAX_ATTACHMENTS = 4;
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024; // ~4MB decoded per file
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const PDF_TYPE = "application/pdf";

/** Approx decoded size of a base64 string in bytes. */
export function base64Bytes(b64: string): number {
  const len = b64.length;
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((len * 3) / 4) - padding;
}

/** Validate/normalize a single attachment; null if invalid or too big. */
export function sanitizeAttachment(a: unknown): Attachment | null {
  if (!a || typeof a !== "object") return null;
  const att = a as Partial<Attachment>;
  if (typeof att.data !== "string" || att.data.length === 0) return null;
  if (typeof att.mediaType !== "string") return null;
  const isImage = IMAGE_TYPES.includes(att.mediaType);
  const isPdf = att.mediaType === PDF_TYPE;
  if (!isImage && !isPdf) return null;
  if (base64Bytes(att.data) > MAX_ATTACHMENT_BYTES) return null;
  return {
    kind: isPdf ? "pdf" : "image",
    mediaType: att.mediaType,
    data: att.data,
    name: typeof att.name === "string" ? att.name.slice(0, 120) : undefined,
  };
}

function toBlocks(text: string, attachments: Attachment[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  for (const a of attachments.slice(0, MAX_ATTACHMENTS)) {
    blocks.push({
      type: a.kind === "pdf" ? "document" : "image",
      source: { type: "base64", media_type: a.mediaType, data: a.data },
    });
  }
  if (text.trim()) blocks.push({ type: "text", text });
  // A user block array must not be empty; fall back to a nudge.
  if (blocks.length === 0) blocks.push({ type: "text", text: "(no text)" });
  return blocks;
}

/** Build validated Anthropic-shaped messages from raw client messages. */
export function buildApiMessages(
  raw: RawMessage[],
  opts: { maxChars: number },
): ChatMessage[] {
  return raw.map((m) => {
    const text = (m.content ?? "").slice(0, opts.maxChars);
    if (m.role === "user" && Array.isArray(m.attachments) && m.attachments.length) {
      const clean = m.attachments
        .map(sanitizeAttachment)
        .filter((x): x is Attachment => x !== null);
      if (clean.length) return { role: "user", content: toBlocks(text, clean) };
    }
    return { role: m.role, content: text };
  });
}

/** Whether any message carries a PDF document (needs the pdfs beta upstream). */
export function hasDocument(messages: ChatMessage[]): boolean {
  return messages.some(
    (m) => Array.isArray(m.content) && m.content.some((b) => b.type === "document"),
  );
}
