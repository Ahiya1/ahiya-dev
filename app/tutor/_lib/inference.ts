// Anthropic inference client for the tutor.
//
// Two auth modes, resolved at call time:
//   1. ANTHROPIC_API_KEY present  -> standard metered API (used in production / Vercel).
//   2. otherwise                  -> local Claude Code plan-token bridge (free, dev only).
//      The bridge reads ~/.claude/.credentials.json and requires the Claude Code
//      system preamble as the first system block + the oauth beta header.
//
// Streams text deltas back as an async iterator so the route handler can pipe SSE.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_CODE_PREAMBLE =
  "You are Claude Code, Anthropic's official CLI for Claude.";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type SystemBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
};

export interface TutorCallOpts {
  /** Tutor persona + pedagogy instructions. */
  system: string;
  /** Course knowledge base — large & static, marked for prompt caching. */
  courseContext: string;
  /** Conversation so far, oldest first. */
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
}

function readPlanToken(): string | null {
  try {
    const p = path.join(os.homedir(), ".claude", ".credentials.json");
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    return raw?.claudeAiOauth?.accessToken ?? null;
  } catch {
    return null;
  }
}

function resolveAuth(): { headers: Record<string, string>; bridge: boolean } {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    return {
      bridge: false,
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
    };
  }
  const token = readPlanToken();
  if (!token) {
    throw new Error(
      "No ANTHROPIC_API_KEY and no local plan token available for inference.",
    );
  }
  return {
    bridge: true,
    headers: {
      authorization: `Bearer ${token}`,
      "anthropic-beta": "oauth-2025-04-20",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
  };
}

function defaultModel(bridge: boolean): string {
  if (process.env.TUTOR_MODEL) return process.env.TUTOR_MODEL;
  // Bridge is free -> use the strongest model. Metered -> use the value tier.
  return bridge ? "claude-opus-4-8" : "claude-sonnet-5";
}

function buildSystem(
  bridge: boolean,
  system: string,
  courseContext: string,
): SystemBlock[] {
  const blocks: SystemBlock[] = [];
  // The bridge REQUIRES the first system block to be exactly the Claude Code
  // preamble; custom instructions must go in later blocks.
  if (bridge) blocks.push({ type: "text", text: CLAUDE_CODE_PREAMBLE });
  blocks.push({ type: "text", text: system });
  // Course context is big and reused every turn -> cache it.
  blocks.push({
    type: "text",
    text: courseContext,
    cache_control: { type: "ephemeral" },
  });
  return blocks;
}

/** Stream the assistant reply as text chunks. */
export async function* streamTutor(
  opts: TutorCallOpts,
): AsyncGenerator<string, void, unknown> {
  const { bridge, headers } = resolveAuth();
  const body = {
    model: opts.model ?? defaultModel(bridge),
    max_tokens: opts.maxTokens ?? 2048,
    stream: true,
    system: buildSystem(bridge, opts.system, opts.courseContext),
    messages: opts.messages,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 500)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // SSE frames are separated by blank lines.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      const dataLine = frame
        .split("\n")
        .find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const json = dataLine.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      try {
        const evt = JSON.parse(json);
        if (
          evt.type === "content_block_delta" &&
          evt.delta?.type === "text_delta"
        ) {
          yield evt.delta.text as string;
        }
      } catch {
        // ignore keep-alive / non-JSON frames
      }
    }
  }
}
