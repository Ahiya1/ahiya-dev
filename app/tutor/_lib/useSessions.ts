"use client";

import { useCallback, useEffect, useState } from "react";

// Saved chat sessions, scoped to the course (the "account" is the course).
// Persisted in localStorage; message text is stored, attachments are not
// (they stay in memory for the live session only — a note marks where one was).

export interface StoredMsg {
  role: "user" | "assistant";
  content: string;
  hadAttachment?: boolean;
}

export interface Session {
  id: string;
  title: string;
  messages: StoredMsg[];
  createdAt: number;
  updatedAt: number;
}

const keyFor = (courseId: string) => `tutor:${courseId}:sessions`;

function newId() {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function titleFrom(messages: StoredMsg[]): string {
  const first = messages.find((m) => m.role === "user" && m.content.trim());
  if (!first) return "שיחה חדשה";
  return first.content.trim().replace(/\s+/g, " ").slice(0, 40);
}

export function useSessions(courseId: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let list: Session[] = [];
    try {
      const raw = localStorage.getItem(keyFor(courseId));
      if (raw) list = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    if (!Array.isArray(list) || list.length === 0) {
      const s: Session = { id: newId(), title: "שיחה חדשה", messages: [], createdAt: Date.now(), updatedAt: Date.now() };
      list = [s];
    }
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    setSessions(list);
    setCurrentId(list[0].id);
    setLoaded(true);
  }, [courseId]);

  const persist = useCallback(
    (list: Session[]) => {
      const sorted = [...list].sort((a, b) => b.updatedAt - a.updatedAt);
      setSessions(sorted);
      try {
        localStorage.setItem(keyFor(courseId), JSON.stringify(sorted));
      } catch {
        /* quota — ignore */
      }
    },
    [courseId],
  );

  const create = useCallback(() => {
    const s: Session = { id: newId(), title: "שיחה חדשה", messages: [], createdAt: Date.now(), updatedAt: Date.now() };
    persist([s, ...sessions]);
    setCurrentId(s.id);
    return s.id;
  }, [sessions, persist]);

  const remove = useCallback(
    (id: string) => {
      const rest = sessions.filter((s) => s.id !== id);
      if (rest.length === 0) {
        const s: Session = { id: newId(), title: "שיחה חדשה", messages: [], createdAt: Date.now(), updatedAt: Date.now() };
        persist([s]);
        setCurrentId(s.id);
      } else {
        persist(rest);
        if (currentId === id) setCurrentId(rest[0].id);
      }
    },
    [sessions, currentId, persist],
  );

  const rename = useCallback(
    (id: string, title: string) => {
      persist(sessions.map((s) => (s.id === id ? { ...s, title: title.slice(0, 60) || s.title } : s)));
    },
    [sessions, persist],
  );

  /** Save the current message list into a session (auto-titles untitled ones). */
  const save = useCallback(
    (id: string, messages: StoredMsg[]) => {
      persist(
        sessions.map((s) => {
          if (s.id !== id) return s;
          const autoTitle = s.title === "שיחה חדשה" ? titleFrom(messages) : s.title;
          return { ...s, messages, title: autoTitle, updatedAt: Date.now() };
        }),
      );
    },
    [sessions, persist],
  );

  const current = sessions.find((s) => s.id === currentId) ?? null;

  return { sessions, current, currentId, setCurrentId, loaded, create, remove, rename, save };
}
