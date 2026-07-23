"use client";

import { useCallback, useEffect, useState } from "react";
import { playerById, type PlayerId } from "./content/players";
import type { GameState } from "./lib/store";
import NamePicker from "./components/NamePicker";
import MissionsTab from "./components/MissionsTab";
import FeedTab from "./components/FeedTab";
import LeaderboardTab from "./components/LeaderboardTab";

type Tab = "missions" | "feed" | "board";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "missions", label: "משימות", emoji: "🎯" },
  { id: "feed", label: "פיד", emoji: "📸" },
  { id: "board", label: "טבלה", emoji: "🏆" },
];

const POLL_MS = 15_000;

export default function TripPage() {
  const [player, setPlayer] = useState<PlayerId | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<Tab>("missions");

  useEffect(() => {
    const saved = localStorage.getItem("trip_player");
    if (saved && playerById(saved)) setPlayer(saved as PlayerId);
    setLoaded(true);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/trip/api/state", { cache: "no-store" });
      if (res.ok) setState((await res.json()) as GameState);
    } catch {
      // keep the last known state
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const pick = (id: PlayerId) => {
    localStorage.setItem("trip_player", id);
    setPlayer(id);
  };

  const switchPlayer = () => {
    localStorage.removeItem("trip_player");
    setPlayer(null);
  };

  if (!loaded) return <main dir="rtl" className="min-h-screen" />;

  if (!player) {
    return (
      <main dir="rtl" className="min-h-screen">
        <NamePicker onPick={pick} />
      </main>
    );
  }

  const me = playerById(player);

  return (
    <main dir="rtl" className="mx-auto min-h-screen max-w-md pb-24">
      <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-ink)]">
              🏆 הבוטמניאדה
            </h1>
            <p className="text-xs text-[var(--color-muted)]">
              אמירי הגליל 2026
              {state && (
                <span className="mr-1 font-medium">
                  · יום {state.currentDay}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={switchPlayer}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-rule)] bg-white/60 px-3 py-1.5 text-sm font-medium text-[var(--color-ink)]"
            title="החלפת שחקן"
          >
            <span className="text-lg">{me?.emoji}</span>
            {me?.name}
          </button>
        </div>
      </header>

      {state?.frozen && (
        <p className="mx-4 mt-3 rounded-xl bg-sky-100 p-3 text-center text-sm font-medium text-sky-900">
          🧊 המשחק הוקפא. התוצאות סופיות (עד שאבא יערער)
        </p>
      )}

      <div className="px-4 py-4">
        {!state ? (
          <div className="py-20 text-center text-[var(--color-muted)]">
            <div className="animate-bounce text-4xl">🏆</div>
            <p className="mt-3 text-sm">טוענים את המשחק...</p>
          </div>
        ) : tab === "missions" ? (
          <MissionsTab playerId={player} state={state} onRefresh={refresh} />
        ) : tab === "feed" ? (
          <FeedTab state={state} />
        ) : (
          <LeaderboardTab state={state} />
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-rule)] bg-[var(--color-paper)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-md">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
                tab === t.id
                  ? "text-[var(--color-sky-deep)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <span className="block text-xl">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
