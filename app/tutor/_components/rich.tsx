import React from "react";

// Lightweight, safe markdown-ish renderer (no dangerouslySetInnerHTML).
// Handles: fenced code blocks, inline code, bold, and bullet/numbered lists.
// Built for mixed Hebrew (RTL) prose + C++ code (LTR).

const FENCE = /```[\w+-]*\n?([\s\S]*?)```/g;

export function renderRich(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  FENCE.lastIndex = 0;
  while ((m = FENCE.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(
        <ProseBlock key={key++} text={text.slice(last, m.index)} />,
      );
    }
    parts.push(
      <pre
        key={key++}
        dir="ltr"
        className="my-2 overflow-x-auto rounded-lg px-4 py-3 text-[13px] leading-relaxed"
        style={{
          fontFamily: "var(--font-mono)",
          background: "var(--color-ink)",
          color: "var(--color-paper)",
        }}
      >
        <code>{m[1].replace(/\n$/, "")}</code>
      </pre>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(<ProseBlock key={key++} text={text.slice(last)} />);
  }
  return <>{parts}</>;
}

function ProseBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let k = 0;

  const flush = () => {
    if (!list) return;
    const items = list.items;
    out.push(
      list.ordered ? (
        <ol key={k++} className="list-decimal pr-5 my-1 space-y-1">
          {items.map((it, i) => (
            <li key={i}>{inline(it)}</li>
          ))}
        </ol>
      ) : (
        <ul key={k++} className="list-disc pr-5 my-1 space-y-1">
          {items.map((it, i) => (
            <li key={i}>{inline(it)}</li>
          ))}
        </ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet) {
      if (!list || list.ordered) {
        flush();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
    } else if (numbered) {
      if (!list || !list.ordered) {
        flush();
        list = { ordered: true, items: [] };
      }
      list.items.push(numbered[1]);
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      out.push(
        <p key={k++} className="my-1">
          {inline(line)}
        </p>,
      );
    }
  }
  flush();
  return <>{out}</>;
}

// Inline: **bold** and `code`.
function inline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      nodes.push(<strong key={k++}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      nodes.push(
        <code
          key={k++}
          dir="ltr"
          className="rounded px-1 py-0.5 text-[0.9em]"
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--color-rule)",
            color: "var(--color-ink)",
          }}
        >
          {m[3]}
        </code>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
