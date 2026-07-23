"use client";

import { useCallback, useEffect, useState } from "react";
import { playerById } from "../content/players";
import { missionById } from "../content/missions";
import type { GameState } from "../lib/store";

interface PlayerLink {
  playerId: string;
  name: string;
  url: string;
}

export default function TripAdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [state, setState] = useState<GameState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [links, setLinks] = useState<PlayerLink[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("trip_admin_password");
    if (saved) setPassword(saved);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/trip/api/state", { cache: "no-store" });
      if (res.ok) setState((await res.json()) as GameState);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (password) refresh();
  }, [password, refresh]);

  const action = async (
    payload: Record<string, unknown>,
    busyKey: string,
    endpoint = "/trip/api/admin",
  ): Promise<void> => {
    if (!password) return;
    setBusy(busyKey);
    setMessage(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, ...payload }),
      });
      const data = await res.json();
      if (res.status === 401) {
        sessionStorage.removeItem("trip_admin_password");
        setPassword(null);
        setMessage("סיסמה שגויה");
      } else if (!res.ok) {
        setMessage(data.error ?? "שגיאה");
      } else {
        setMessage("בוצע ✓");
        await refresh();
      }
    } catch {
      setMessage("שגיאת רשת");
    } finally {
      setBusy(null);
    }
  };

  const loadLinks = async (): Promise<void> => {
    if (!password) return;
    setBusy("links");
    setMessage(null);
    try {
      const res = await fetch("/trip/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, action: "links" }),
      });
      const data = await res.json();
      if (res.status === 401) {
        sessionStorage.removeItem("trip_admin_password");
        setPassword(null);
        setMessage("סיסמה שגויה");
      } else if (!res.ok) {
        setMessage(data.error ?? "שגיאה");
      } else {
        setLinks(data.links as PlayerLink[]);
      }
    } catch {
      setMessage("שגיאת רשת");
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async (link: PlayerLink): Promise<void> => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(link.playerId);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setMessage("ההעתקה נכשלה");
    }
  };

  if (!password) {
    return (
      <main dir="rtl" className="mx-auto max-w-md px-5 py-16">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">
          🔐 ניהול הבוטמניאדה
        </h1>
        {message && <p className="mt-2 text-sm text-red-700">{message}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input) {
              sessionStorage.setItem("trip_admin_password", input);
              setPassword(input);
              setInput("");
            }
          }}
          className="mt-6 space-y-3"
        >
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="סיסמת ניהול"
            className="w-full rounded-xl border border-[var(--color-rule)] bg-white p-3 text-base"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--color-ink)] py-3 font-bold text-[var(--color-paper)]"
          >
            כניסה
          </button>
        </form>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-md px-5 pb-16 pt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">
          🔐 ניהול הבוטמניאדה
        </h1>
        <button
          onClick={() => {
            sessionStorage.removeItem("trip_admin_password");
            setPassword(null);
          }}
          className="text-sm text-[var(--color-muted)] underline"
        >
          יציאה
        </button>
      </div>

      {message && (
        <p className="mt-3 rounded-lg bg-white/70 p-2 text-center text-sm">
          {message}
        </p>
      )}

      <section className="mt-6 rounded-2xl border border-[var(--color-rule)] bg-white/60 p-4">
        <h2 className="font-bold text-[var(--color-ink)]">
          יום נוכחי: {state ? `יום ${state.currentDay}` : "..."}
          {state && !state.isLive && " (תצוגה מקדימה)"}
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {([1, 2, 3] as const).map((d) => (
            <button
              key={d}
              disabled={busy !== null}
              onClick={() => action({ action: "setDay", day: d }, `day-${d}`)}
              className={`rounded-lg border py-2 text-sm font-bold ${
                state?.currentDay === d
                  ? "border-[var(--color-sky-deep)] bg-[var(--color-sky-deep)] text-white"
                  : "border-[var(--color-rule)] bg-white text-[var(--color-ink)]"
              }`}
            >
              יום {d}
            </button>
          ))}
          <button
            disabled={busy !== null}
            onClick={() => action({ action: "setDay", day: null }, "day-auto")}
            className="rounded-lg border border-[var(--color-rule)] bg-white py-2 text-sm font-medium text-[var(--color-ink)]"
          >
            אוטומטי
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-rule)] bg-white/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--color-ink)]">
            {state?.frozen ? "🧊 המשחק קפוא" : "▶️ המשחק פעיל"}
          </h2>
          <button
            disabled={busy !== null}
            onClick={() =>
              action({ action: "freeze", frozen: !state?.frozen }, "freeze")
            }
            className="rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-bold text-[var(--color-paper)] disabled:opacity-50"
          >
            {state?.frozen ? "להפשיר" : "להקפיא"}
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-rule)] bg-white/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--color-ink)]">
            {state?.ceremonyDone ? "🏆 הטקס נערך" : "🔒 הטקס טרם נערך"}
          </h2>
          <button
            disabled={busy !== null || !state?.ceremonyDone}
            onClick={() =>
              action(
                { done: false },
                "ceremony-reset",
                "/trip/api/ceremony",
              )
            }
            className="rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-bold text-[var(--color-paper)] disabled:opacity-50"
          >
            אפס טקס
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--color-rule)] bg-white/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--color-ink)]">
            🔗 קישורים אישיים
          </h2>
          <button
            disabled={busy !== null}
            onClick={loadLinks}
            className="rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-bold text-[var(--color-paper)] disabled:opacity-50"
          >
            {busy === "links" ? "טוען..." : links ? "רענון" : "הצגת קישורים"}
          </button>
        </div>
        {links && (
          <div className="mt-3 space-y-2">
            {links.map((link) => {
              const p = playerById(link.playerId);
              return (
                <div
                  key={link.playerId}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-rule)] bg-white p-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--color-ink)]">
                      {p?.emoji} {link.name}
                    </p>
                    <p
                      dir="ltr"
                      className="truncate text-xs text-[var(--color-muted)]"
                    >
                      {link.url}
                    </p>
                  </div>
                  <button
                    onClick={() => copyLink(link)}
                    className="shrink-0 rounded-lg border border-[var(--color-rule)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-ink)]"
                  >
                    {copied === link.playerId ? "הועתק ✓" : "העתקה"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-4">
        <h2 className="mb-2 font-bold text-[var(--color-ink)]">
          הגשות ({state?.submissions.length ?? 0})
        </h2>
        <div className="space-y-2">
          {state?.submissions.map((s) => {
            const p = playerById(s.playerId);
            const m = missionById(s.missionId);
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-rule)] bg-white/60 p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-bold text-[var(--color-ink)]">
                    {p?.emoji} {p?.name} · {m?.title ?? s.missionId}
                  </p>
                  <p className="truncate text-xs text-[var(--color-muted)]">
                    {s.verdict ? `ציון ${s.verdict.avg}` : "ללא פסק דין"} ·{" "}
                    {s.id}
                  </p>
                </div>
                <button
                  disabled={busy !== null}
                  onClick={() =>
                    action(
                      { action: "rejudge", submissionId: s.id },
                      `rejudge-${s.id}`,
                    )
                  }
                  className="shrink-0 rounded-lg border border-[var(--color-rule)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-ink)] disabled:opacity-50"
                >
                  {busy === `rejudge-${s.id}` ? "שופטים..." : "שיפוט מחדש"}
                </button>
              </div>
            );
          })}
          {state && state.submissions.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]">אין הגשות עדיין.</p>
          )}
        </div>
      </section>
    </main>
  );
}
