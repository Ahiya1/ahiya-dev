"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { playerById, type PlayerId } from "../content/players";
import { missionById } from "../content/missions";
import type { GameState, SubmissionWithVerdict } from "../lib/store";

/** טקס הסיום — the podium the opening ceremony promised for Friday.
 * Admin-gated, tap-to-advance, built from the real final standings. */

const JUDGE_FAREWELLS = [
  {
    emoji: "⚖️",
    name: "השופט",
    line: "התפקדות אחרונה לטיול. כולם נוכחים, כולל טל. שתיתם מים? אז אפשר להכריז!!!",
  },
  {
    emoji: "🧡",
    name: "הדודה מהצפון",
    line: "נשמות, אצלי כולכם על הפודיום. אבל בנו רק שלושה מקומות, אז תחזיקו לי את הלב.",
  },
  {
    emoji: "🪶",
    name: "המשורר",
    line: "שלושה ימים של גליל, של צחוק ושל פריים. הפודיום כבר בנוי - נשאר רק לגלות מי.",
  },
];

const MEDALS: Record<number, { emoji: string; label: string }> = {
  3: { emoji: "🥉", label: "מקום שלישי" },
  2: { emoji: "🥈", label: "מקום שני" },
  1: { emoji: "🥇", label: "מקום ראשון" },
};

interface Award {
  emoji: string;
  title: string;
  playerId: PlayerId;
  detail: string;
}

type Slide =
  | { kind: "intro" }
  | { kind: "numbers" }
  | { kind: "title" }
  | { kind: "judge"; index: number }
  | { kind: "awardsTitle" }
  | { kind: "award"; award: Award }
  | { kind: "podiumTitle" }
  | { kind: "place"; place: 3 | 2 }
  | { kind: "countdown" }
  | { kind: "champion" }
  | { kind: "table" }
  | { kind: "finale" };

// Deterministic confetti (no Math.random — keeps hydration stable).
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  emoji: ["🎉", "✨", "🎊", "🏆", "⭐"][i % 5],
  left: (i * 37 + 11) % 100,
  delay: ((i * 53) % 24) / 10,
  duration: 2.6 + ((i * 29) % 16) / 10,
  size: 1.1 + ((i * 17) % 12) / 10,
}));

/** The latest-verdict submission with the highest average score. */
function bestSubmission(
  subs: SubmissionWithVerdict[],
): SubmissionWithVerdict | null {
  let best: SubmissionWithVerdict | null = null;
  for (const s of subs) {
    if (!s.verdict) continue;
    if (
      !best ||
      s.verdict.avg > best.verdict!.avg ||
      (s.verdict.avg === best.verdict!.avg && s.createdAt < best.createdAt)
    ) {
      best = s;
    }
  }
  return best;
}

function computeAwards(state: GameState): Award[] {
  const awards: Award[] = [];

  const best = bestSubmission(state.submissions);
  if (best?.verdict) {
    awards.push({
      emoji: "🎖️",
      title: "הגשת הטיול",
      playerId: best.playerId,
      detail: `"${missionById(best.missionId)?.title ?? best.missionId}" — ציון ${best.verdict.avg}`,
    });
  }

  const triviaTop = [...state.leaderboard].sort(
    (a, b) => b.triviaPoints - a.triviaPoints,
  )[0];
  if (triviaTop && triviaTop.triviaPoints > 0) {
    awards.push({
      emoji: "🧠",
      title: "מוח הטריוויה",
      playerId: triviaTop.playerId,
      detail: `${triviaTop.triviaPoints} נקודות על זיהוי בוטמנים לפי ציטוט`,
    });
  }

  const counts = new Map<PlayerId, number>();
  for (const s of state.submissions) {
    counts.set(s.playerId, (counts.get(s.playerId) ?? 0) + 1);
  }
  const prolific = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (prolific && prolific[1] >= 2) {
    awards.push({
      emoji: "📮",
      title: "הכי הרבה הגשות",
      playerId: prolific[0],
      detail: `${prolific[1]} הגשות. השופטים ביקשו העלאת שכר.`,
    });
  }

  const eleven = state.submissions.find((s) =>
    s.verdict?.verdicts.some((v) => v.score === 11),
  );
  if (eleven) {
    awards.push({
      emoji: "🪶",
      title: "רגע ה-11",
      playerId: eleven.playerId,
      detail: `המשורר חרג מהסולם על "${missionById(eleven.missionId)?.title ?? eleven.missionId}". חוקים זה לחלשים.`,
    });
  }

  return awards;
}

export default function PodiumPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [stateError, setStateError] = useState(false);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(3);
  const [sealBusy, setSealBusy] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [sealError, setSealError] = useState<string | null>(null);

  // Admin gate — same sessionStorage key as /trip/admin and the opening
  // ceremony, so whoever ran Wednesday's ceremony is already unlocked.
  const [password, setPassword] = useState<string | null>(null);
  const [gateInput, setGateInput] = useState("");
  const [gateBusy, setGateBusy] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("trip_admin_password");
    if (saved) setPassword(saved);
    setGateChecked(true);
  }, []);

  const loadState = useCallback(() => {
    setStateError(false);
    fetch("/trip/api/state", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`state ${r.status}`);
        const s = (await r.json()) as GameState;
        setState(s);
        setSealed(s.frozen === true);
      })
      .catch(() => setStateError(true));
  }, []);

  useEffect(loadState, [loadState]);

  const slides = useMemo<Slide[]>(() => {
    if (!state) return [];
    const awards = computeAwards(state);
    return [
      { kind: "intro" },
      { kind: "numbers" },
      { kind: "title" },
      ...JUDGE_FAREWELLS.map((_, index) => ({ kind: "judge", index }) as Slide),
      ...(awards.length > 0
        ? [
            { kind: "awardsTitle" } as Slide,
            ...awards.map((award) => ({ kind: "award", award }) as Slide),
          ]
        : []),
      { kind: "podiumTitle" },
      { kind: "place", place: 3 },
      { kind: "place", place: 2 },
      { kind: "countdown" },
      { kind: "champion" },
      { kind: "table" },
      { kind: "finale" },
    ];
  }, [state]);

  const slide = slides[step] ?? null;
  const numberLines = useMemo(() => {
    if (!state) return [];
    const judgedCount = state.submissions.filter((s) => s.verdict).length;
    return [
      "שלושה ימים.",
      `${state.submissions.length} הגשות.`,
      `${judgedCount * 3} פסקי דין.`,
      "משפחה אחת.",
    ];
  }, [state]);
  // The numbers slide reveals its lines one tap at a time, like the opening.
  const [numbersShown, setNumbersShown] = useState(1);

  const advance = useCallback(() => {
    if (!slide) return;
    if (slide.kind === "countdown" || slide.kind === "finale") return;
    if (slide.kind === "numbers" && numbersShown < numberLines.length) {
      setNumbersShown(numbersShown + 1);
      return;
    }
    setStep((s) => Math.min(s + 1, slides.length - 1));
  }, [slide, numbersShown, numberLines.length, slides.length]);

  // Countdown slide advances itself: 3 → 2 → 1 → champion.
  useEffect(() => {
    if (slide?.kind !== "countdown") return;
    setCount(3);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setStep((s) => s + 1);
          return c;
        }
        return c - 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [slide?.kind]);

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

  // Sealing = freezing the game, so the final numbers on this screen are
  // the final numbers forever. Optional, reversible from /trip/admin.
  const seal = async () => {
    if (sealBusy || sealed || !password) return;
    setSealBusy(true);
    setSealError(null);
    try {
      const res = await fetch("/trip/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, action: "freeze", frozen: true }),
      });
      if (res.ok) {
        setSealed(true);
      } else if (res.status === 401) {
        sessionStorage.removeItem("trip_admin_password");
        setPassword(null);
        setGateError("הסיסמה לא התקבלה - הזינו שוב");
      } else {
        setSealError("הנעילה נכשלה - נסו שוב");
      }
    } catch {
      setSealError("שגיאת רשת - נסו שוב");
    } finally {
      setSealBusy(false);
    }
  };

  const podium = state?.leaderboard ?? [];
  const rowAt = (place: number) => podium[place - 1] ?? null;
  const renderPlace = (place: 3 | 2 | 1) => {
    const row = rowAt(place);
    const p = row ? playerById(row.playerId) : null;
    if (!row || !p) return null;
    const medal = MEDALS[place];
    return (
      <div key={`place-${place}`} className="cer-pop">
        <div className="text-7xl">{medal.emoji}</div>
        <p className="mt-3 text-2xl font-bold text-amber-200/80">
          {medal.label}
        </p>
        <div className="mt-5 text-8xl">{p.emoji}</div>
        <p className="mt-3 text-6xl font-black text-amber-300">{p.name}</p>
        <p className="mt-4 text-2xl text-amber-50/80">{row.total} נקודות</p>
        <p className="mt-1 text-base text-amber-50/50">
          {row.judgedPoints} משיפוט · {row.triviaPoints} מטריוויה
        </p>
      </div>
    );
  };

  if (!password) {
    return (
      <main
        dir="rtl"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] px-6 text-center text-amber-50"
      >
        {gateChecked && (
          <>
            <div className="text-6xl">🏅</div>
            <h1 className="mt-5 text-3xl font-black text-amber-300">
              טקס הסיום
            </h1>
            <p className="mt-3 text-base text-amber-50/60">
              הפודיום נחשף על ידי מנהל התחרות בלבד
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

  if (!state) {
    return (
      <main
        dir="rtl"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] px-6 text-center text-amber-50"
      >
        {stateError ? (
          <>
            <p className="text-xl text-amber-50/70">הטבלה לא נטענה</p>
            <button
              onClick={loadState}
              className="mt-6 rounded-xl bg-amber-400 px-6 py-3 text-lg font-black text-[#0c0a09]"
            >
              לנסות שוב
            </button>
          </>
        ) : (
          <p className="animate-pulse text-xl text-amber-50/60">
            סופרים את הנקודות בפעם האחרונה...
          </p>
        )}
      </main>
    );
  }

  const champion = rowAt(1);
  const championPlayer = champion ? playerById(champion.playerId) : null;
  const showConfetti =
    slide?.kind === "champion" || slide?.kind === "finale";
  const showHint =
    slide && slide.kind !== "countdown" && slide.kind !== "finale";

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
        {slide?.kind === "intro" && (
          <div key={step} className="cer-fade-slow">
            <p className="text-3xl font-light tracking-[0.3em] text-amber-200/90">
              אמירי הגליל
            </p>
            <p className="mt-4 text-xl text-amber-50/60">
              יום שישי. הגיע הרגע.
            </p>
          </div>
        )}

        {slide?.kind === "numbers" && (
          <div className="space-y-6">
            {numberLines.slice(0, numbersShown).map((line, i) => (
              <p
                key={line}
                className={`text-4xl font-extrabold ${
                  i === numbersShown - 1 ? "cer-fade" : ""
                } ${i === numberLines.length - 1 ? "text-amber-300" : ""}`}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {slide?.kind === "title" && (
          <div key={step} className="cer-pop">
            <div className="text-8xl drop-shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              🏅
            </div>
            <h1 className="mt-6 text-6xl font-black text-amber-300">
              טקס הסיום
            </h1>
            <p className="mt-4 text-xl text-amber-50/70">
              השופטים סיימו לריב. יש הכרעה.
            </p>
          </div>
        )}

        {slide?.kind === "judge" && (
          <div key={step} className="cer-pop">
            <div className="text-8xl">{JUDGE_FAREWELLS[slide.index].emoji}</div>
            <h2 className="mt-5 text-5xl font-black text-amber-300">
              {JUDGE_FAREWELLS[slide.index].name}
            </h2>
            <p className="mx-auto mt-6 max-w-md text-2xl leading-relaxed text-amber-50/85">
              {JUDGE_FAREWELLS[slide.index].line}
            </p>
          </div>
        )}

        {slide?.kind === "awardsTitle" && (
          <h2 key={step} className="cer-fade text-5xl font-black text-amber-200">
            פרסי הטיול
          </h2>
        )}

        {slide?.kind === "award" && (
          <div key={step} className="cer-pop">
            <div className="text-8xl">{slide.award.emoji}</div>
            <p className="mt-4 text-2xl font-bold text-amber-200/80">
              {slide.award.title}
            </p>
            <p className="mt-4 text-5xl font-black text-amber-300">
              {playerById(slide.award.playerId)?.emoji}{" "}
              {playerById(slide.award.playerId)?.name}
            </p>
            <p className="mx-auto mt-5 max-w-md text-xl leading-relaxed text-amber-50/75">
              {slide.award.detail}
            </p>
          </div>
        )}

        {slide?.kind === "podiumTitle" && (
          <h2 key={step} className="cer-fade text-5xl font-black text-amber-200">
            הפודיום
          </h2>
        )}

        {slide?.kind === "place" && renderPlace(slide.place)}

        {slide?.kind === "countdown" && (
          <p
            key={count}
            className="cer-pop text-[11rem] font-black leading-none text-amber-300"
          >
            {count}
          </p>
        )}

        {slide?.kind === "champion" && champion && championPlayer && (
          <div key={step} className="cer-pop">
            <div className="text-7xl drop-shadow-[0_0_40px_rgba(251,191,36,0.5)]">
              👑
            </div>
            <p className="mt-3 text-2xl font-bold text-amber-200/80">
              אלוף/ת הבוטמניאדה הראשונה
            </p>
            <div className="mt-5 text-9xl">{championPlayer.emoji}</div>
            <p className="mt-3 text-7xl font-black text-amber-300">
              {championPlayer.name}
            </p>
            <p className="mt-4 text-2xl text-amber-50/80">
              {champion.total} נקודות
            </p>
          </div>
        )}

        {slide?.kind === "table" && (
          <div key={step} className="cer-fade w-full max-w-md">
            <h2 className="text-3xl font-black text-amber-200">
              הטבלה הסופית
            </h2>
            <div className="mt-6 space-y-2 text-right">
              {podium.map((row, i) => {
                const p = playerById(row.playerId);
                return (
                  <div
                    key={row.playerId}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                      i === 0
                        ? "bg-amber-400/20 text-amber-200"
                        : "bg-amber-50/5"
                    }`}
                  >
                    <span className="text-lg font-bold">
                      {i + 1}. {p?.emoji} {p?.name}
                      {i === 0 && " 👑"}
                    </span>
                    <span className="text-lg font-black tabular-nums">
                      {row.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {slide?.kind === "finale" && (
          <div key={step} className="cer-pop">
            <h1 className="text-5xl font-black leading-tight text-amber-300">
              זו הייתה הבוטמניאדה 🐙
            </h1>
            <p className="mx-auto mt-6 max-w-md text-xl leading-relaxed text-amber-50/80">
              שלושה ימים, שמונה בוטמנים, שלושה שופטים שלא הסכימו על כלום חוץ
              מדבר אחד: משפחה אחת.
            </p>
            {sealError && (
              <p className="mt-6 text-sm font-medium text-red-400">
                {sealError}
              </p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                seal();
              }}
              disabled={sealBusy || sealed}
              className="mt-10 rounded-2xl bg-amber-400 px-10 py-5 text-2xl font-black text-[#0c0a09] shadow-[0_0_50px_rgba(251,191,36,0.45)] transition-transform active:scale-95 disabled:opacity-60"
            >
              {sealed
                ? "התוצאות נחתמו 🧊"
                : sealBusy
                  ? "חותמים..."
                  : "לחתום את התוצאות"}
            </button>
            <p className="mt-4 text-sm text-amber-50/40">
              {sealed
                ? "הטבלה הזו נכנסת להיסטוריה המשפחתית."
                : "נועל את המשחק - אף נקודה לא תזוז יותר."}
            </p>
          </div>
        )}
      </div>

      {showConfetti && (
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
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-5 bg-amber-400"
                  : i < step
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
