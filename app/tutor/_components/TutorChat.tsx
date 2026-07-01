"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { renderRich } from "./rich";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "תסבירי לי מה ההבדל בין reference ל-pointer",
  "מה זה Rule of Three ומתי צריך אותו?",
  "תני לי שאלת תרגול בסגנון המבחן על operator overloading",
  "אני לא מבינה iterators, אפשר דוגמה?",
];

export default function TutorChat({
  courseId,
  number,
  nameHe,
}: {
  courseId: string;
  number: string;
  nameHe: string;
  nameEn: string;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId, messages: next }),
      });
      if (!res.ok || !res.body) {
        const msg =
          res.status === 401
            ? "פג תוקף החיבור. רעֲנני את העמוד והתחברי שוב."
            : "משהו השתבש. נסי שוב.";
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: msg };
          return copy;
        });
        setStreaming(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "שגיאת רשת. נסי שוב.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  async function logout() {
    await fetch("/api/tutor/logout", { method: "POST" });
    router.replace("/tutor");
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const empty = messages.length === 0;

  return (
    <div
      dir="rtl"
      className="flex flex-col h-screen"
      style={{ fontFamily: "var(--font-sans)", background: "var(--color-paper)" }}
    >
      {/* header */}
      <header
        className="flex items-center justify-between px-5 sm:px-8 py-4 border-b"
        style={{ borderColor: "var(--color-rule)" }}
      >
        <div>
          <span
            className="block text-lg leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {nameHe}
          </span>
          <span
            className="block text-xs"
            style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
          >
            {number} · מורה פרטי
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/tutor" className="link">
            קורסים
          </Link>
          <button onClick={logout} className="link">
            יציאה
          </button>
        </div>
      </header>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          {empty ? (
            <div className="lift lift-1 mt-6">
              <h2
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                שלום נועה 👋 במה נתחיל?
              </h2>
              <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>
                אני מכיר את כל ההרצאות, התרגולים והמבחנים של הקורס. שאלי כל דבר,
                או בחרי התחלה:
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {STARTERS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className={`text-right rounded-lg border px-4 py-3 text-sm transition-colors lift lift-${i + 2}`}
                    style={{
                      borderColor: "var(--color-rule)",
                      background: "var(--color-paper-soft)",
                      color: "var(--color-ink-soft)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map((m, i) => (
                <Bubble key={i} msg={m} streaming={streaming && i === messages.length - 1} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* composer */}
      <div className="border-t" style={{ borderColor: "var(--color-rule)" }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4">
          <div
            className="flex items-end gap-3 rounded-xl border px-4 py-2"
            style={{
              borderColor: "var(--color-rule)",
              background: "var(--color-paper-soft)",
            }}
          >
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="כתבי שאלה… (Enter לשליחה, Shift+Enter לשורה חדשה)"
              className="flex-1 resize-none bg-transparent outline-none py-2 max-h-40 text-[15px]"
              style={{ color: "var(--color-ink)" }}
            />
            <button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
              style={{ background: "var(--color-sky-deep)", color: "var(--color-paper)" }}
            >
              {streaming ? "…" : "שליחה"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg, streaming }: { msg: Msg; streaming: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={isUser ? "flex justify-start" : "flex justify-end"}>
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed"
        style={
          isUser
            ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" }
            : { background: "var(--color-paper-soft)", color: "var(--color-ink)", border: "1px solid var(--color-rule)" }
        }
      >
        {msg.content ? (
          renderRich(msg.content)
        ) : streaming ? (
          <span style={{ color: "var(--color-muted)" }}>חושב…</span>
        ) : null}
      </div>
    </div>
  );
}
