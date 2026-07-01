"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Plus, Trash2, Pencil, X, FileText, MessageSquare, PanelLeft } from "lucide-react";
import Markdown from "./Markdown";
import { useSessions, type StoredMsg } from "../_lib/useSessions";

type LiveAttachment = {
  id: string;
  kind: "image" | "pdf";
  mediaType: string;
  dataUrl: string; // for preview
  data: string; // raw base64 for send
  name: string;
};
type Msg = { role: "user" | "assistant"; content: string; attachments?: LiveAttachment[]; hadAttachment?: boolean };

const STARTERS = [
  "תסבירי לי מה ההבדל בין reference ל-pointer",
  "מה זה Rule of Three ומתי צריך אותו?",
  "תני לי שאלת תרגול בסגנון המבחן על operator overloading",
  "צילמתי שאלה מהתרגול — אפשר לעזור לי לפתור?",
];

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf";
const MAX_BYTES = 4 * 1024 * 1024;

function readFile(file: File): Promise<LiveAttachment | null> {
  return new Promise((resolve) => {
    if (file.size > MAX_BYTES) return resolve(null);
    const r = new FileReader();
    r.onload = () => {
      const dataUrl = String(r.result);
      const data = dataUrl.split(",")[1] ?? "";
      resolve({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        kind: file.type === "application/pdf" ? "pdf" : "image",
        mediaType: file.type,
        dataUrl,
        data,
        name: file.name,
      });
    };
    r.onerror = () => resolve(null);
    r.readAsDataURL(file);
  });
}

function toStored(m: Msg): StoredMsg {
  return { role: m.role, content: m.content, hadAttachment: !!m.attachments?.length || m.hadAttachment };
}
function fromStored(s: StoredMsg): Msg {
  return { role: s.role, content: s.content, hadAttachment: s.hadAttachment };
}

export default function TutorChat({ courseId, seed }: { courseId: string; seed?: string }) {
  const { sessions, currentId, setCurrentId, loaded, create, remove, rename, save } = useSessions(courseId);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<LiveAttachment[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Msg[]>([]);
  const sessionsRef = useRef(sessions);
  const seededRef = useRef(false);
  sessionsRef.current = sessions;
  messagesRef.current = messages;

  // Load messages when the active session changes (NOT on save — currentId is stable then).
  useEffect(() => {
    if (!loaded || !currentId) return;
    const s = sessionsRef.current.find((x) => x.id === currentId);
    setMessages((s?.messages ?? []).map(fromStored));
  }, [currentId, loaded]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (seed && loaded && !seededRef.current) {
      seededRef.current = true;
      send(seed, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, loaded]);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const read = await Promise.all(Array.from(files).slice(0, 4).map(readFile));
    const ok = read.filter((x): x is LiveAttachment => x !== null);
    if (ok.length < Array.from(files).length) {
      // some rejected (too big / unsupported)
    }
    setPending((p) => [...p, ...ok].slice(0, 4));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function send(text: string, attachments: LiveAttachment[]) {
    const content = text.trim();
    if ((!content && attachments.length === 0) || streaming) return;
    const sid = currentId;
    const next: Msg[] = [...messages, { role: "user", content, attachments }];
    setMessages(next);
    setInput("");
    setPending([]);
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    const payload = next.map((m) => ({
      role: m.role,
      content: m.content,
      attachments: m.attachments?.map((a) => ({ kind: a.kind, mediaType: a.mediaType, data: a.data })),
    }));

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId, messages: payload }),
      });
      if (!res.ok || !res.body) {
        const msg = res.status === 401 ? "פג תוקף החיבור. רעֲנני והתחברי שוב." : "משהו השתבש. נסי שוב.";
        setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: msg }; return c; });
      } else {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: acc }; return c; });
        }
      }
    } catch {
      setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: "שגיאת רשת. נסי שוב." }; return c; });
    } finally {
      setStreaming(false);
      if (sid) save(sid, messagesRef.current.map(toStored));
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input, pending);
    }
  }

  const empty = messages.length === 0;

  return (
    <div dir="rtl" className="flex h-full" style={{ fontFamily: "var(--font-sans)", background: "var(--color-paper)" }}>
      {/* sessions sidebar */}
      <aside
        className={`${sidebar ? "flex" : "hidden"} md:flex flex-col w-60 shrink-0 border-l`}
        style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}
      >
        <div className="p-3">
          <button onClick={() => { create(); setSidebar(false); }} className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
            style={{ background: "var(--color-sky-deep)", color: "var(--color-paper)" }}>
            <Plus size={16} /> שיחה חדשה
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {sessions.map((s) => (
            <div key={s.id}
              className="group flex items-center gap-1 rounded-lg px-2 py-2 mb-1 cursor-pointer"
              style={s.id === currentId ? { background: "var(--color-rule)" } : {}}
              onClick={() => { setCurrentId(s.id); setSidebar(false); }}>
              <MessageSquare size={14} className="shrink-0" style={{ color: "var(--color-muted)" }} />
              <span className="min-w-0 flex-1 truncate text-sm" style={{ color: "var(--color-ink)" }}>{s.title}</span>
              <button onClick={(e) => { e.stopPropagation(); const t = prompt("שם השיחה:", s.title); if (t) rename(s.id, t); }}
                className="opacity-0 group-hover:opacity-100" title="שנה שם"><Pencil size={13} style={{ color: "var(--color-muted)" }} /></button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm("למחוק את השיחה?")) remove(s.id); }}
                className="opacity-0 group-hover:opacity-100" title="מחק"><Trash2 size={13} style={{ color: "#a23b2e" }} /></button>
            </div>
          ))}
        </div>
      </aside>

      {/* main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* mobile session toggle */}
        <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: "var(--color-rule)" }}>
          <button onClick={() => setSidebar((v) => !v)} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-ink-soft)" }}>
            <PanelLeft size={16} /> שיחות
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
            {empty ? (
              <div className="lift lift-1 mt-6">
                <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
                  שלום! 👋 במה נתחיל?
                </h2>
                <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>
                  אני מכיר את כל ההרצאות, התרגולים והמבחנים. שאלי כל דבר, או צלמי שאלה והעלי אותה.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {STARTERS.map((s, i) => (
                    <button key={i} onClick={() => send(s, [])}
                      className={`text-right rounded-lg border px-4 py-3 text-sm lift lift-${i + 2}`}
                      style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)", color: "var(--color-ink-soft)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((m, i) => <Bubble key={i} msg={m} streaming={streaming && i === messages.length - 1} />)}
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <div className="border-t" style={{ borderColor: "var(--color-rule)" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4">
            {pending.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {pending.map((a) => (
                  <div key={a.id} className="relative">
                    {a.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.dataUrl} alt={a.name} className="h-16 w-16 object-cover rounded-lg border" style={{ borderColor: "var(--color-rule)" }} />
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
                        <FileText size={22} style={{ color: "var(--color-sky-deep)" }} />
                      </div>
                    )}
                    <button onClick={() => setPending((p) => p.filter((x) => x.id !== a.id))}
                      className="absolute -top-1.5 -right-1.5 rounded-full p-0.5" style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
              <input ref={fileRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              <button onClick={() => fileRef.current?.click()} title="צרפי תמונה או קובץ" className="p-2 shrink-0" style={{ color: "var(--color-muted)" }}>
                <Paperclip size={18} />
              </button>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} rows={1}
                placeholder="כתבי שאלה… (אפשר גם לצרף תמונה)"
                className="flex-1 resize-none bg-transparent outline-none py-2 max-h-40 text-[15px]" style={{ color: "var(--color-ink)" }} />
              <button onClick={() => send(input, pending)} disabled={streaming || (!input.trim() && pending.length === 0)}
                className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40" style={{ background: "var(--color-sky-deep)", color: "var(--color-paper)" }}>
                {streaming ? "…" : "שליחה"}
              </button>
            </div>
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
      <div className={`${isUser ? "max-w-[85%]" : "max-w-full w-full"} rounded-2xl px-4 py-3 text-[15px] leading-relaxed`}
        style={isUser
          ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" }
          : { background: "var(--color-paper-soft)", color: "var(--color-ink)", border: "1px solid var(--color-rule)" }}>
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {msg.attachments.map((a) => a.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.id} src={a.dataUrl} alt={a.name} className="max-h-40 rounded-lg" />
            ) : (
              <span key={a.id} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs" style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}>
                <FileText size={13} /> {a.name}
              </span>
            ))}
          </div>
        )}
        {!msg.attachments?.length && msg.hadAttachment && (
          <p className="mb-1 text-xs opacity-70">📎 קובץ מצורף (לא נשמר בהיסטוריה)</p>
        )}
        {msg.content ? (
          isUser ? <span className="whitespace-pre-wrap">{msg.content}</span> : <Markdown>{msg.content}</Markdown>
        ) : streaming ? (
          <span style={{ color: "var(--color-muted)" }}>חושב…</span>
        ) : null}
      </div>
    </div>
  );
}
