"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PLAYERS, type PlayerId } from "../content/players";

// Teaser line per player (names + emoji come from PLAYERS).
const TEASERS: Record<PlayerId, string> = {
  abba: "מייסד ההתפקדות. הערב מתפקדים בשבילו.",
  ima: "708 פעמים. הסטטיסטיקה איתה, הקייטרינג גם.",
  shir: "אלופת העולם בעשר הודעות. הערב: אחת. קולולולוש.",
  moshe: "ברוכים הנמצאים. הנימוס שלו עומד הערב למבחן.",
  tal: "מתבקש לענות להתפקדות. טל? ...טל?",
  ahiya: "הביא את השופטים. חסינות אין לו.",
  netanel: "לא לגעת בחטיפים שלו. כן לגעת בשיאים שלו.",
  hillel: "מילה אחת: אלופה.",
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

  // Admin gate: the ceremony only opens with the admin password
  // (shared with /trip/admin via the same sessionStorage key).
  const [password, setPassword] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);
  const [gateInput, setGateInput] = useState("");
  const [gateBusy, setGateBusy] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("trip_admin_password");
    if (saved) setPassword(saved);
    setGateChecked(true);
  }, []);

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
    if (slide === COUNTDOWN_SLIDE || slide === FINALE_SLIDE) return;
    if (sub < SUBSTEPS[slide] - 1) {
      setSub(sub + 1);
    } else {
      setSlide(slide + 1);
      setSub(0);
    }
  }, [slide, sub]);

  // Countdown slide advances itself: 3 → 2 → 1 → finale.
  useEffect(() => {
    if (slide !== COUNTDOWN_SLIDE) return;
    setCount(3);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setSlide(FINALE_SLIDE);
          setSub(0);
          return c;
        }
        return c - 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [slide]);

  const finish = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/trip/api/ceremony", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ done: true, password }),
      });
    } catch {
      // even if the write hiccups, take them to the game
    }
    router.push("/trip");
  };

  const key = `${slide}-${sub}`;
  const showHint = slide !== COUNTDOWN_SLIDE && slide !== FINALE_SLIDE;

  if (!password) {
    return (
      <main
        dir="rtl"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] px-6 text-center text-amber-50"
      >
        {gateChecked && (
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                finish();
              }}
              disabled={busy}
              className="mt-12 rounded-2xl bg-amber-400 px-10 py-5 text-2xl font-black text-[#0c0a09] shadow-[0_0_50px_rgba(251,191,36,0.45)] transition-transform active:scale-95 disabled:opacity-60"
            >
              {busy ? "משחררים..." : "לשחרר את הבוטמנים ←"}
            </button>
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
