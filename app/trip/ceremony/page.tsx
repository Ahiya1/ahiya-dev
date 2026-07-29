"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PLAYERS, type PlayerId } from "../content/players";

// Teaser line per player (names + emoji come from PLAYERS).
const TEASERS: Record<PlayerId, string> = {
  abba: "מגיע עם וויז מדויק לשנייה ונקודה בסוף כל משפט. סנדלים בכל מזג אוויר, גם בגליל.",
  ima: "ראש מחלקה למדעי המחשב ואלופת העולם בטעויות הלקדה. ההקלדה. 708 פעמים 💞, אפס חרטות.",
  shir: "שלחה עשר הודעות בזמן שקראתם את המשפט הזה. קולולולוש! (בוטמנים בלי ג'. רשמנו.)",
  moshe: "נכנס לפני חמש שנים עם 'ברוכים הנמצאים' ועדיין הכי מנומס בחדר. עונה 'הנני' להתפקדות, בלי שמץ אירוניה.",
  tal: "עובד במיקרוסופט, כותב בשפה שרק התיקון האוטומטי מבין. טל? ...טל? חבל. נמשיך, הוא בטח בסדר גמוק.",
  ahiya: "האיש שנתן לרובוטים לקרוא את הקבוצה. תבדקו את הציונים שלו פעמיים, יש לו קשרים בפאנל.",
  netanel: "החטיפים שלו מסומנים והשינה שלו באחריותכם. מי שנוגע בשוקו - עונה לשופטים.",
  hillel: "83 אימוג'י בכי על פיצה אחת. טסט ראשון לפני כולם. ביקורת במילה אחת, ותמיד הנכונה.",
};

const NUMBER_LINES = [
  "שבע שנים.",
  "22,943 הודעות.",
  "708 💞.",
  "משפחה אחת.",
];

const JUDGES = [
  {
    emoji: "⚖️",
    name: "השופט",
    line: "התפקדו. הערב שופטים אתכם. מי שעוד לא שתה מים - שישתה עכשיו!!!",
  },
  {
    emoji: "🧡",
    name: "הדודה מהצפון",
    line: "אני כבר אוהבת את כולכם שווה. אבל ציונים זה ציונים, נשמות.",
  },
  {
    emoji: "🪶",
    name: "המשורר",
    line: "אשפוט על פי מדד הכמיהה, הקומפוזיציה, וכמות החומוס בפריים.",
  },
];

const RULE_LINES = [
  "כל בוקר: משימות חדשות.",
  "השופטים פוסקים. אין ערעורים. יש בכי.",
  "ביום שישי: פודיום.",
];

// Slides: 0 intro, 1 numbers, 2 reveal, 3 judges title, 4-6 judges,
// 7 roll call, 8 rules, 9 countdown, 10 finale.
const SUBSTEPS = [1, 4, 1, 1, 1, 1, 1, 9, 3, 1, 1];
const COUNTDOWN_SLIDE = 9;
const FINALE_SLIDE = 10;

// Deterministic confetti (no Math.random — keeps hydration stable).
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  emoji: ["🎉", "✨", "🎊", "🏆", "⭐"][i % 5],
  left: (i * 37 + 11) % 100,
  delay: ((i * 53) % 24) / 10,
  duration: 2.6 + ((i * 29) % 16) / 10,
  size: 1.1 + ((i * 17) % 12) / 10,
}));

export default function CeremonyPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [sub, setSub] = useState(0);
  const [count, setCount] = useState(3);
  const [busy, setBusy] = useState(false);
  const [releaseError, setReleaseError] = useState<string | null>(null);

  // Watch mode (?watch=1): a family phone that got soaked into the ceremony.
  // It follows the presenter's position read-only — no password, no taps.
  const [watch, setWatch] = useState<boolean | null>(null);
  const [liveSeen, setLiveSeen] = useState(false);
  const seqRef = useRef(0);
  const startedAtRef = useRef<string | null>(null);

  // Admin gate: the ceremony only opens with the admin password
  // (shared with /trip/admin via the same sessionStorage key).
  const [password, setPassword] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);
  const [gateInput, setGateInput] = useState("");
  const [gateBusy, setGateBusy] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  // Pre-trip the ceremony is open as a preview (no password, no release
  // button); once the trip is live, the admin gate applies.
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    setWatch(new URLSearchParams(window.location.search).get("watch") === "1");
    const saved = sessionStorage.getItem("trip_admin_password");
    if (saved) setPassword(saved);
    // Preview mode is only entered on an explicit, successful `isLive: false`.
    // A failed request or an unreadable body means we do NOT know, and the safe
    // assumption is that the game is live and locked — so the admin gate and
    // the real release button both stay available.
    fetch("/trip/api/state", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`state ${r.status}`);
        const s = (await r.json()) as { isLive?: boolean };
        setIsLive(s.isLive === false ? false : true);
      })
      .catch(() => setIsLive(true)) // on doubt, stay locked
      .finally(() => setGateChecked(true));
  }, []);

  const previewMode = isLive === false;
  const presenting = watch === false && !previewMode && !!password;

  // The presenter's phone is the remote control: every slide change is
  // broadcast, and every phone sitting on the /trip lock screen gets pulled
  // into the ceremony and follows along.
  useEffect(() => {
    if (!presenting || !password) return;
    if (!startedAtRef.current) startedAtRef.current = new Date().toISOString();
    fetch("/trip/api/ceremony-live", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        password,
        ceremony: "opening",
        active: true,
        slide,
        sub,
        seq: ++seqRef.current,
        startedAt: startedAtRef.current,
      }),
    }).catch(() => {
      // best effort — followers simply hold the last position they saw
    });
  }, [presenting, password, slide, sub]);

  // Followers: track the presenter's position.
  useEffect(() => {
    if (watch !== true) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/trip/api/ceremony-live", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const { live } = (await res.json()) as {
          live: {
            ceremony: string;
            active: boolean;
            slide: number;
            sub: number;
          } | null;
        };
        if (cancelled || !live?.active || live.ceremony !== "opening") return;
        setLiveSeen(true);
        const s = Math.min(Math.max(0, live.slide), SUBSTEPS.length - 1);
        setSlide(s);
        setSub(Math.min(Math.max(0, live.sub), SUBSTEPS[s] - 1));
      } catch {
        // next tick retries
      }
    };
    tick();
    const interval = setInterval(tick, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [watch]);

  // Followers leave for the game the moment the presenter releases it.
  useEffect(() => {
    if (watch !== true) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/trip/api/state", { cache: "no-store" });
        if (res.ok) {
          const s = (await res.json()) as { ceremonyDone?: boolean };
          if (s.ceremonyDone === true) router.push("/trip");
        }
      } catch {
        // next tick retries
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [watch, router]);

  const unlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!gateInput || gateBusy) return;
    setGateBusy(true);
    setGateError(null);
    try {
      const res = await fetch("/trip/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: gateInput, action: "ping" }),
      });
      if (res.ok) {
        sessionStorage.setItem("trip_admin_password", gateInput);
        setPassword(gateInput);
        setGateInput("");
      } else if (res.status === 401) {
        setGateError("סיסמה שגויה");
      } else {
        setGateError("משהו השתבש, נסו שוב");
      }
    } catch {
      setGateError("שגיאת רשת, נסו שוב");
    } finally {
      setGateBusy(false);
    }
  };

  const advance = useCallback(() => {
    if (watch !== false) return; // followers don't drive, they ride
    if (slide === COUNTDOWN_SLIDE || slide === FINALE_SLIDE) return;
    if (sub < SUBSTEPS[slide] - 1) {
      setSub(sub + 1);
    } else {
      setSlide(slide + 1);
      setSub(0);
    }
  }, [watch, slide, sub]);

  // Countdown slide advances itself: 3 → 2 → 1 → finale.
  useEffect(() => {
    if (slide !== COUNTDOWN_SLIDE) return;
    setCount(3);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          // Followers hold on "1" until the presenter's finale arrives.
          if (watch !== true) {
            setSlide(FINALE_SLIDE);
            setSub(0);
          }
          return c;
        }
        return c - 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [slide, watch]);

  /** Confirm the release actually landed. The blob log and the state route's
   * short cache are both eventually consistent, so poll for a few seconds
   * before declaring failure. Returns false only if we never saw it. */
  const confirmReleased = async (): Promise<boolean> => {
    const ATTEMPTS = 6;
    for (let i = 0; i < ATTEMPTS; i++) {
      try {
        const res = await fetch("/trip/api/state", { cache: "no-store" });
        if (res.ok) {
          const s = (await res.json()) as { ceremonyDone?: boolean };
          if (s.ceremonyDone === true) return true;
        }
      } catch {
        // keep trying
      }
      if (i < ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
    return false;
  };

  // Releasing is the one irreversible moment of the evening: eight phones are
  // locked until ceremonyDone flips. So we never navigate on hope — only after
  // a 2xx write AND a state read that confirms ceremonyDone === true. Every
  // other outcome keeps us on the finale slide with a retry button.
  const finish = async () => {
    if (busy) return;
    setBusy(true);
    setReleaseError(null);
    try {
      const res = await fetch("/trip/api/ceremony", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ done: true, password }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          // Wrong/stale admin password: send them back to the gate so they can
          // re-enter it. The slide state is kept, so unlocking returns here.
          sessionStorage.removeItem("trip_admin_password");
          setPassword(null);
          setGateError("הסיסמה לא התקבלה - הזינו שוב כדי לשחרר");
        } else {
          setReleaseError("השחרור נכשל - נסו שוב");
        }
        setBusy(false);
        return;
      }
      if (!(await confirmReleased())) {
        setReleaseError("השחרור עוד לא אושר - נסו שוב");
        setBusy(false);
        return;
      }
    } catch {
      setReleaseError("השחרור נכשל - בדקו את החיבור ונסו שוב");
      setBusy(false);
      return;
    }
    // Confirmed released. `busy` stays true so nobody double-taps mid-navigation.
    router.push("/trip");
  };

  const key = `${slide}-${sub}`;
  const showHint =
    watch !== true && slide !== COUNTDOWN_SLIDE && slide !== FINALE_SLIDE;

  // Until we know whether this is a follower phone, render the dark stage.
  if (watch === null) {
    return <main dir="rtl" className="fixed inset-0 z-50 bg-[#0c0a09]" />;
  }

  if (watch && !liveSeen) {
    return (
      <main
        dir="rtl"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] px-6 text-center text-amber-50"
      >
        <div className="animate-bounce text-7xl">🏆</div>
        <p className="mt-6 animate-pulse text-xl text-amber-50/70">
          מתחברים לטקס...
        </p>
      </main>
    );
  }

  if (!watch && !password && !previewMode) {
    return (
      <main
        dir="rtl"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] px-6 text-center text-amber-50"
      >
        {gateChecked && isLive !== null && (
          <>
            <div className="text-6xl">🔐</div>
            <h1 className="mt-5 text-3xl font-black text-amber-300">
              טקס הפתיחה
            </h1>
            <p className="mt-3 text-base text-amber-50/60">
              הטקס נפתח על ידי מנהל התחרות בלבד
            </p>
            {gateError && (
              <p className="mt-4 text-sm font-medium text-red-400">
                {gateError}
              </p>
            )}
            <form onSubmit={unlock} className="mt-8 w-full max-w-xs space-y-3">
              <input
                type="password"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                placeholder="סיסמת ניהול"
                className="w-full rounded-xl border border-amber-50/20 bg-amber-50/5 p-3 text-center text-base text-amber-50 placeholder:text-amber-50/30 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!gateInput || gateBusy}
                className="w-full rounded-xl bg-amber-400 py-3 text-lg font-black text-[#0c0a09] transition-transform active:scale-95 disabled:opacity-50"
              >
                {gateBusy ? "בודקים..." : "פתח את הטקס"}
              </button>
            </form>
          </>
        )}
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      onClick={advance}
      className="fixed inset-0 z-50 flex select-none flex-col overflow-hidden bg-[#0c0a09] text-amber-50"
    >
      <style>{`
        @keyframes cer-fade {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cer-pop {
          0% { opacity: 0; transform: scale(0.4); }
          70% { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes cer-fall {
          0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(112vh) rotate(360deg); opacity: 0.8; }
        }
        .cer-fade { animation: cer-fade 0.7s ease-out both; }
        .cer-fade-slow { animation: cer-fade 1.4s ease-out both; }
        .cer-pop { animation: cer-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {slide === 0 && (
          <div key={key} className="cer-fade-slow">
            <p className="text-3xl font-light tracking-[0.3em] text-amber-200/90">
              אמירי הגליל
            </p>
            <p className="mt-4 text-xl text-amber-50/60">29–31 ביולי 2026</p>
          </div>
        )}

        {slide === 1 && (
          <div className="space-y-6">
            {NUMBER_LINES.slice(0, sub + 1).map((line, i) => (
              <p
                key={line}
                className={`text-4xl font-extrabold ${
                  i === sub ? "cer-fade" : ""
                } ${i === 3 ? "text-amber-300" : ""}`}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {slide === 2 && (
          <div key={key} className="cer-pop">
            <div className="text-8xl drop-shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              🏆
            </div>
            <h1 className="mt-6 text-6xl font-black text-amber-300">
              הבוטמניאדה
            </h1>
            <p className="mt-4 text-xl text-amber-50/70">
              התחרות המשפחתית הראשונה מסוגה
            </p>
          </div>
        )}

        {slide === 3 && (
          <h2 key={key} className="cer-fade text-5xl font-black text-amber-200">
            הכירו את השופטים
          </h2>
        )}

        {slide >= 4 && slide <= 6 && (
          <div key={key} className="cer-pop">
            <div className="text-8xl">{JUDGES[slide - 4].emoji}</div>
            <h2 className="mt-5 text-5xl font-black text-amber-300">
              {JUDGES[slide - 4].name}
            </h2>
            <p className="mx-auto mt-6 max-w-md text-2xl leading-relaxed text-amber-50/85">
              {JUDGES[slide - 4].line}
            </p>
          </div>
        )}

        {slide === 7 && (
          <div className="w-full">
            <h2
              className={`text-3xl font-bold text-amber-200/80 ${
                sub === 0 ? "cer-fade text-5xl font-black text-amber-200" : ""
              }`}
            >
              מסדר השמות
            </h2>
            {sub > 0 && (
              <div key={key} className="cer-pop mt-8">
                <div className="text-8xl">{PLAYERS[sub - 1].emoji}</div>
                <p className="mt-4 text-6xl font-black text-amber-300">
                  {PLAYERS[sub - 1].name}
                </p>
                <p className="mx-auto mt-5 max-w-md text-2xl leading-relaxed text-amber-50/85">
                  {TEASERS[PLAYERS[sub - 1].id]}
                </p>
              </div>
            )}
            {sub > 1 && (
              <p className="mt-8 text-2xl tracking-widest opacity-60">
                {PLAYERS.slice(0, sub - 1)
                  .map((p) => p.emoji)
                  .join(" ")}
              </p>
            )}
          </div>
        )}

        {slide === 8 && (
          <div>
            <h2 className="text-5xl font-black text-amber-200">החוקים</h2>
            <div className="mt-10 space-y-6">
              {RULE_LINES.slice(0, sub + 1).map((line, i) => (
                <p
                  key={line}
                  className={`text-3xl font-bold leading-relaxed ${
                    i === sub ? "cer-fade" : ""
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {slide === COUNTDOWN_SLIDE && (
          <p
            key={count}
            className="cer-pop text-[11rem] font-black leading-none text-amber-300"
          >
            {count}
          </p>
        )}

        {slide === FINALE_SLIDE && (
          <div key={key} className="cer-pop">
            <h1 className="text-5xl font-black leading-tight text-amber-300">
              שהמשחקים יחלו! 🎉
            </h1>
            {watch ? (
              <p className="mt-12 animate-pulse text-xl font-bold text-amber-200/80">
                עוד רגע המשחק נפתח אצלכם...
              </p>
            ) : previewMode ? (
              <p className="mt-12 max-w-xs text-lg font-bold text-amber-200/80">
                🔒 זו תצוגה מקדימה. הכפתור האמיתי מחכה ליום רביעי, כשכולם
                בחדר.
              </p>
            ) : (
              <>
                {releaseError && (
                  <div className="mx-auto mt-10 max-w-xs rounded-2xl border border-red-400/40 bg-red-500/10 p-4">
                    <p className="text-lg font-black text-red-300">
                      {releaseError}
                    </p>
                    <p className="mt-2 text-sm text-amber-50/70">
                      הטלפונים עדיין נעולים. אל תעזבו את המסך הזה עד שהשחרור
                      יאושר.
                    </p>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    finish();
                  }}
                  disabled={busy}
                  className="mt-12 rounded-2xl bg-amber-400 px-10 py-5 text-2xl font-black text-[#0c0a09] shadow-[0_0_50px_rgba(251,191,36,0.45)] transition-transform active:scale-95 disabled:opacity-60"
                >
                  {busy
                    ? "משחררים..."
                    : releaseError
                      ? "לנסות לשחרר שוב"
                      : "לשחרר את הבוטמנים ←"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {slide === FINALE_SLIDE && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute top-0"
              style={{
                left: `${c.left}%`,
                fontSize: `${c.size}rem`,
                animation: `cer-fall ${c.duration}s linear ${c.delay}s infinite`,
              }}
            >
              {c.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="pb-8 pt-2 text-center">
        {showHint && (
          <p className="mb-4 animate-pulse text-sm text-amber-50/40">
            הקישו להמשך
          </p>
        )}
        <div className="flex justify-center gap-1.5" dir="ltr">
          {SUBSTEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide
                  ? "w-5 bg-amber-400"
                  : i < slide
                    ? "w-1.5 bg-amber-400/50"
                    : "w-1.5 bg-amber-50/15"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
