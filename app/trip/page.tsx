"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playerById, type PlayerId } from "./content/players";
import type { GameState } from "./lib/store";
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

interface Identity {
  playerId: PlayerId;
  token: string;
}

function storedIdentity(): Identity | null {
  try {
    const raw = localStorage.getItem("trip_identity");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Identity>;
    if (
      typeof parsed.playerId === "string" &&
      typeof parsed.token === "string" &&
      playerById(parsed.playerId)
    ) {
      return { playerId: parsed.playerId, token: parsed.token };
    }
  } catch {
    // corrupt storage — treat as logged out
  }
  return null;
}

export default function TripPage() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<Tab>("missions");
  // Set when a claim could not be completed because of the network, NOT
  // because the link was rejected. `?k=` stays in the URL so a retry works.
  const [claimFailed, setClaimFailed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  // An identity from a previous successful claim, offered as an escape hatch
  // when a fresh claim cannot reach the server.
  const [fallbackIdentity, setFallbackIdentity] = useState<Identity | null>(
    null,
  );

  // Identity comes from a personal magic link (?k=...) sent in WhatsApp.
  // Once claimed it lives in localStorage; there is no manual name picker.
  // The URL is only cleaned after a claim that actually saved an identity —
  // on rural cellular, dropping `k` on a failed fetch would strand the player
  // with no way back in.
  const claimingRef = useRef(false);

  const claim = useCallback(async () => {
    if (claimingRef.current) return;
    claimingRef.current = true;
    setClaiming(true);
    try {
      const saved = storedIdentity();
      const url = new URL(window.location.href);
      const k = url.searchParams.get("k");
      const clean = () => {
        url.searchParams.delete("k");
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      };
      if (k) {
        try {
          const res = await fetch("/trip/api/claim", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ k }),
          });
          if (res.ok) {
            const data = (await res.json()) as Identity;
            localStorage.setItem("trip_identity", JSON.stringify(data));
            setIdentity(data);
            setClaimFailed(false);
            clean(); // only now: the identity is actually saved
            setLoaded(true);
            return;
          }
          if (res.status !== 404) {
            // 5xx / proxy error: the link may well be fine. Keep `k`, retry.
            setClaimFailed(true);
            setFallbackIdentity(saved);
            setLoaded(true);
            return;
          }
          // 404: the token is genuinely not one of ours. Drop it and fall
          // through to the "open your personal link" screen.
          clean();
        } catch {
          // Network hiccup — keep `k` so the retry button can use it, and
          // offer the already-saved identity as an escape hatch (a returning
          // player reopening their link in a dead zone must not get stuck).
          setClaimFailed(true);
          setFallbackIdentity(saved);
          setLoaded(true);
          return;
        }
      }
      setClaimFailed(false);
      if (saved) setIdentity(saved);
      setLoaded(true);
    } finally {
      claimingRef.current = false;
      setClaiming(false);
    }
  }, []);

  useEffect(() => {
    claim();
  }, [claim]);

  // Poll bookkeeping: never let two state requests overlap (a slow one landing
  // after a fast one would overwrite newer data), and never apply a response
  // older than one already applied.
  const inFlight = useRef(false);
  const queued = useRef(false);
  const ticket = useRef(0);
  const applied = useRef(0);
  const refreshRef = useRef<() => Promise<void>>(async () => {});

  const refresh = useCallback(async () => {
    if (inFlight.current) {
      queued.current = true; // coalesce: run once more when this one lands
      return;
    }
    inFlight.current = true;
    const mine = ++ticket.current;
    try {
      const res = await fetch("/trip/api/state", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as GameState;
        if (mine > applied.current) {
          applied.current = mine;
          setState(data);
        }
      }
    } catch {
      // keep the last known state
    } finally {
      inFlight.current = false;
    }
    if (queued.current) {
      queued.current = false;
      await refreshRef.current();
    }
  }, []);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

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

  if (!loaded) return <main dir="rtl" className="min-h-screen" />;

  // The personal link is still in the URL but we could not reach the server to
  // exchange it. Never strip `k` here — offer a retry instead.
  if (claimFailed && !identity) {
    const fallbackPlayer = fallbackIdentity
      ? playerById(fallbackIdentity.playerId)
      : undefined;
    return (
      <main
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="text-7xl">📶</div>
        <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-ink)]">
          החיבור נכשל - נסו שוב
        </h1>
        <p className="mt-4 max-w-xs text-base leading-relaxed text-[var(--color-ink-soft)]">
          הקישור האישי שלכם שמור בכתובת, רק הרשת הפריעה. התקרבו לוואטסאפ, נשמו,
          ולחצו שוב.
        </p>
        <button
          onClick={() => claim()}
          disabled={claiming}
          className="mt-6 w-full max-w-xs rounded-xl bg-[var(--color-ink)] py-3 text-base font-bold text-[var(--color-paper)] transition-transform active:scale-95 disabled:opacity-50"
        >
          {claiming ? "מנסים..." : "לנסות שוב"}
        </button>
        {fallbackPlayer && fallbackIdentity && (
          <button
            onClick={() => {
              setIdentity(fallbackIdentity);
              setClaimFailed(false);
            }}
            className="mt-3 w-full max-w-xs rounded-xl border border-[var(--color-rule)] py-3 text-sm font-medium text-[var(--color-ink-soft)]"
          >
            להמשיך כ{fallbackPlayer.emoji} {fallbackPlayer.name}
          </button>
        )}
      </main>
    );
  }

  // The game stays locked until the opening ceremony has been run —
  // before AND during the trip. Claimed identities still bind while
  // locked (the ?k= effect above), and the 15s state poll unlocks
  // everyone automatically the moment ceremonyDone flips.
  if (state && !state.ceremonyDone) {
    const player = identity ? playerById(identity.playerId) : undefined;
    return (
      <main
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="text-7xl">🏆</div>
        <h1 className="mt-4 text-4xl font-extrabold text-[var(--color-ink)]">
          הבוטמניאדה
        </h1>
        {player && (
          <p className="mt-4 rounded-full border border-[var(--color-rule)] bg-white/60 px-4 py-1.5 text-base font-bold text-[var(--color-ink)]">
            {player.emoji} {player.name}, מקומך שמור
          </p>
        )}
        <p className="mt-3 animate-pulse text-xl font-bold text-[var(--color-sky-deep)]">
          {state.isLive ? "הטקס טרם נערך" : "אמירי הגליל · 29 ביולי"}
        </p>
        <p className="mt-2 text-base text-[var(--color-muted)]">
          {state.isLive
            ? "התכנסו כולם יחד - הטקס ייפתח על ידי מנהל התחרות"
            : "המשחק ייפתח בטקס חגיגי ביום הראשון של הטיול"}
        </p>
      </main>
    );
  }

  if (!identity) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="text-7xl">🏆</div>
        <h1 className="mt-4 text-4xl font-extrabold text-[var(--color-ink)]">
          הבוטמניאדה
        </h1>
        <p className="mt-6 max-w-xs text-lg leading-relaxed text-[var(--color-ink-soft)]">
          כדי להצטרף, פתחו את הקישור האישי שקיבלתם בוואטסאפ
        </p>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          לא קיבלתם קישור? תתלוננו אצל אחיה
        </p>
      </main>
    );
  }

  const me = playerById(identity.playerId);

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
          <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-rule)] bg-white/60 px-3 py-1.5 text-sm font-medium text-[var(--color-ink)]">
            <span className="text-lg">{me?.emoji}</span>
            {me?.name}
          </div>
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
          <MissionsTab
            playerId={identity.playerId}
            token={identity.token}
            state={state}
            onRefresh={refresh}
          />
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
