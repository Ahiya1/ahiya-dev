"use client";

import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = ref.current?.innerText ?? "";
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div
      dir="ltr"
      className="group relative my-3 overflow-hidden rounded-xl"
      style={{ background: "#1c1a17", border: "1px solid #2c2822" }}
    >
      <button
        onClick={copy}
        className="absolute top-2 right-2 z-10 rounded-md px-2 py-1 text-[11px] opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: "#2c2822", color: "#d5d1c4", fontFamily: "var(--font-mono)" }}
      >
        {copied ? "✓ copied" : "copy"}
      </button>
      <pre
        ref={ref}
        {...props}
        className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed"
        style={{ fontFamily: "var(--font-mono)", background: "transparent" }}
      />
    </div>
  );
}

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          h1: (p) => (
            <h1
              className="mt-4 mb-2 text-2xl leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              {...p}
            />
          ),
          h2: (p) => (
            <h2
              className="mt-4 mb-2 pb-1 text-xl leading-tight border-b"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-ink)",
                borderColor: "var(--color-rule)",
              }}
              {...p}
            />
          ),
          h3: (p) => (
            <h3
              className="mt-3 mb-1 text-lg"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              {...p}
            />
          ),
          p: (p) => <p className="my-2 leading-relaxed" {...p} />,
          strong: (p) => (
            <strong style={{ fontWeight: 700, color: "var(--color-ink)" }} {...p} />
          ),
          a: (p) => (
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--color-sky-deep)" }}
              {...p}
            />
          ),
          ul: (p) => <ul className="my-2 pr-5 space-y-1 list-disc" {...p} />,
          ol: (p) => <ol className="my-2 pr-5 space-y-1 list-decimal" {...p} />,
          li: (p) => <li className="leading-relaxed" {...p} />,
          blockquote: (p) => (
            <blockquote
              className="my-3 pr-4 py-1 italic"
              style={{
                borderRight: "3px solid var(--color-sky)",
                color: "var(--color-ink-soft)",
              }}
              {...p}
            />
          ),
          hr: () => (
            <hr className="my-4" style={{ borderColor: "var(--color-rule)" }} />
          ),
          table: (p) => (
            <div className="my-3 overflow-x-auto">
              <table
                dir="auto"
                className="w-full text-[14px] border-collapse"
                style={{ border: "1px solid var(--color-rule)" }}
                {...p}
              />
            </div>
          ),
          thead: (p) => (
            <thead style={{ background: "var(--color-paper-soft)" }} {...p} />
          ),
          th: (p) => (
            <th
              dir="auto"
              className="px-3 py-2 text-right font-semibold"
              style={{ border: "1px solid var(--color-rule)", color: "var(--color-ink)" }}
              {...p}
            />
          ),
          td: (p) => (
            <td
              dir="auto"
              className="px-3 py-2 align-top"
              style={{ border: "1px solid var(--color-rule)" }}
              {...p}
            />
          ),
          pre: (p) => <CodeBlock {...(p as React.HTMLAttributes<HTMLPreElement>)} />,
          code: ({ className, children, ...rest }) => {
            const isBlock = /(^|\s)(language-|hljs)/.test(className ?? "");
            if (isBlock) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            }
            return (
              <code
                dir="ltr"
                className="rounded px-1.5 py-0.5 text-[0.88em] align-baseline"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--color-rule)",
                  color: "var(--color-ink)",
                }}
                {...rest}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
