"use client";

import { useEffect, useRef, useState } from "react";

const W = 260;
const H = 130;

function FrameBase({
  children,
  ariaLabel,
}: {
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative select-none"
      style={{ width: W, height: H }}
    >
      {children}
    </div>
  );
}

/* ─────────── StatViz ─────────── */
/* The sealed path — the pipeline's actual architecture. Raw data on
   the left; a sealed registry function in the middle; a Hebrew RTL
   report on the right. One cycle traces a single number's journey:
   a datum leaves the matrix, the validated function computes (the
   model never does), F = 12.34 emerges and lands in the report line,
   verified. The real system calls this "the only sanctioned path
   from data to a reported number." Hover holds the path still.     */

const SV_CYCLE = 9.5;

const svEase = (k: number) =>
  k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

/* Report lines: [width, y-offset]; index 3 is the stat line the
   traveling number lands in. */
const svReportLines: [number, number][] = [
  [30, 10],
  [40, 19],
  [36, 26],
  [34, 34],
  [42, 42],
  [26, 49],
];
const SV_STAT_LINE = 3;

export function StatVizVisual({ quiet = false }: { quiet?: boolean }) {
  const [hover, setHover] = useState(false);
  const [t, setT] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (quiet || hover) return; // attention holds the path still
    let raf = 0;
    const start = performance.now() - elapsedRef.current * 1000;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      elapsedRef.current = elapsed;
      setT(elapsed % SV_CYCLE);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [quiet, hover]);

  /* Phase progress helper. */
  const ph = (a: number, b: number) =>
    t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a);

  /* End of cycle: the pass fades, the path rests, a new one begins. */
  const fadeK = ph(8.6, 9.4);
  const passOpacity = 1 - fadeK;

  /* Geometry */
  const yMid = 52;
  const gridCols = [14, 24, 34, 44];
  const gridRows = [28, 40, 52, 64, 76];
  const boxL = 78;
  const boxR = 154;
  const boxT = 38;
  const boxB = 66;
  const repL = 196;
  const repR = 252;
  const repT = 18;

  /* The datum's journey */
  const dotK = svEase(ph(0.4, 1.6));
  const dotX = 50 + (boxL - 50) * dotK;
  const dotVisible = t > 0.4 && t < 1.6 && fadeK === 0;

  const computing = t >= 1.6 && t < 2.8 && fadeK === 0;
  const pulseK = ph(2.5, 3.2);

  const chipK = svEase(ph(2.8, 4.4));
  const chipX = boxR + (repL - boxR) * chipK;
  const chipVisible = t > 2.8 && t < 4.4 && fadeK === 0;

  const landed = t >= 4.4;
  const checkK = ph(4.4, 4.9);

  return (
    <FrameBase ariaLabel="The StatViz sealed path: raw data enters a validated registry function — one-way ANOVA — which emits a provenance-stamped statistic that lands, verified, in a Hebrew report. The model plans; it never computes.">
      <svg
        width={W}
        height={H}
        className="block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Track: the one path, left to right */}
        <line
          x1={50}
          x2={boxL}
          y1={yMid}
          y2={yMid}
          stroke="var(--color-rule)"
          strokeWidth={1}
          opacity={0.5}
        />
        <line
          x1={boxR}
          x2={repL}
          y1={yMid}
          y2={yMid}
          stroke="var(--color-rule)"
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Data matrix — the raw spreadsheet */}
        {gridRows.map((gy, ri) =>
          gridCols.map((gx, ci) => (
            <circle
              key={`${ri}-${ci}`}
              cx={gx}
              cy={gy}
              r={1.7}
              fill="var(--color-ink-soft)"
              opacity={0.3 + ((ri * 7 + ci * 3) % 5) * 0.09}
            />
          ))
        )}

        {/* Sealed registry function — the only place numbers are made */}
        <rect
          x={boxL}
          y={boxT}
          width={boxR - boxL}
          height={boxB - boxT}
          fill="var(--color-paper-soft)"
          stroke={computing ? "var(--color-sky-deep)" : "var(--color-ink-soft)"}
          strokeWidth={1}
          opacity={computing ? 1 : 0.65}
          rx={1.5}
          style={{ transition: "stroke 300ms ease, opacity 300ms ease" }}
        />
        <text
          x={(boxL + boxR) / 2}
          y={yMid + 2.5}
          fontSize={7.5}
          textAnchor="middle"
          fill={computing ? "var(--color-ink)" : "var(--color-muted)"}
          fontFamily="var(--font-mono)"
          letterSpacing="0.04em"
          style={{ transition: "fill 300ms ease" }}
        >
          one_way_anova()
        </text>
        {/* Compute pulse — the ring of a number being made, validly */}
        {pulseK > 0 && pulseK < 1 && (
          <rect
            x={boxL - pulseK * 6}
            y={boxT - pulseK * 6}
            width={boxR - boxL + pulseK * 12}
            height={boxB - boxT + pulseK * 12}
            fill="none"
            stroke="var(--color-sky)"
            strokeWidth={1}
            rx={2}
            opacity={(1 - pulseK) * 0.5}
          />
        )}

        {/* Report page — Hebrew RTL, lines right-aligned */}
        <rect
          x={repL}
          y={repT}
          width={repR - repL}
          height={68}
          fill="var(--color-paper-soft)"
          stroke="var(--color-ink-soft)"
          strokeWidth={0.8}
          opacity={0.75}
          rx={1}
        />
        {svReportLines.map(([w, dy], i) => {
          const isStat = i === SV_STAT_LINE;
          const lit = isStat && landed;
          return (
            <line
              key={i}
              x1={repR - 6 - w}
              x2={repR - 6}
              y1={repT + dy}
              y2={repT + dy}
              stroke={lit ? "var(--color-sky-deep)" : "var(--color-rule)"}
              strokeWidth={lit ? 1.6 : 1.2}
              opacity={lit ? 0.4 + passOpacity * 0.55 : 0.9}
              style={{ transition: "stroke 300ms ease" }}
            />
          );
        })}
        {/* Verification check beside the landed stat line */}
        {landed && (
          <path
            d={`M ${repL + 5} ${repT + 34} l 2.2 2.4 l 4.2 -4.8`}
            fill="none"
            stroke="var(--color-sky-deep)"
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={checkK * passOpacity}
          />
        )}
        {/* Mini findings chart rising on the page */}
        {[8, 13, 16].map((bh, i) => {
          const riseK = svEase(ph(4.5 + i * 0.2, 5.2 + i * 0.2));
          return (
            <rect
              key={i}
              x={repR - 20 - i * 9}
              y={repT + 62 - bh * riseK}
              width={5.5}
              height={bh * riseK}
              fill={i === 2 ? "var(--color-sky)" : "var(--color-ink-soft)"}
              opacity={(i === 2 ? 0.8 : 0.45) * passOpacity}
            />
          );
        })}

        {/* The datum traveling toward the function */}
        {dotVisible && (
          <circle
            cx={dotX}
            cy={yMid}
            r={3}
            fill="var(--color-ink-soft)"
            opacity={Math.min(1, dotK * 6, (1 - dotK) * 6 + 0.3)}
          />
        )}

        {/* The stamped number traveling toward the report */}
        {chipVisible && (
          <g opacity={Math.min(1, chipK * 6)}>
            <circle cx={chipX} cy={yMid} r={2.5} fill="var(--color-sky-deep)" />
            <text
              x={Math.min(chipX, repL - 22)}
              y={yMid - 8}
              fontSize={8}
              textAnchor="middle"
              fill="var(--color-sky-deep)"
              fontFamily="var(--font-mono)"
              letterSpacing="0.04em"
            >
              F = 12.34
            </text>
          </g>
        )}

        {/* Element labels */}
        <text
          x={29}
          y={100}
          fontSize={7}
          textAnchor="middle"
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          letterSpacing="0.16em"
          opacity={0.75}
        >
          DATA
        </text>
        <text
          x={(boxL + boxR) / 2}
          y={100}
          fontSize={7}
          textAnchor="middle"
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          letterSpacing="0.16em"
          opacity={0.75}
        >
          SEALED REGISTRY
        </text>
        <text
          x={(repL + repR) / 2}
          y={100}
          fontSize={7}
          textAnchor="middle"
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          letterSpacing="0.16em"
          opacity={0.75}
        >
          REPORT
        </text>

        {/* Footer: the system's own words */}
        <text
          x={W / 2}
          y={H - 5}
          fontSize={6.5}
          textAnchor="middle"
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
          opacity={0.7}
        >
          THE ONLY PATH FROM DATA TO A REPORTED NUMBER
        </text>
      </svg>
    </FrameBase>
  );
}

/* ─────────── HIT — AI Persona Research ─────────── */
/* Half-human, half-bot. Each frame is an actual persona:
   - editorial silhouette (head + shoulders, no features)
   - synthetic ID (P-####, signaling 'one of many in the dataset')
   - demographic meta line in mono
   - real Hebrew testimonial
   - dot-row pager
   Each silhouette has small geometric variation so personas feel
   distinct without becoming portraits.                            */

type Persona = {
  id: string;
  meta: string;
  he: string;
  /* Silhouette geometry variations */
  headR: number;       /* head radius */
  headOffY: number;    /* head vertical nudge */
  shoulderW: number;   /* shoulder width */
  shoulderTilt: number;/* slight asymmetry, -1 to +1 */
};

const personas: Persona[] = [
  {
    id: "P-0017",
    meta: "17 · BASKETBALL · NORTH · ULTRA-ORTHODOX",
    he: "האתגר הגדול היה השילוב בין הלימודים, המשפחה והאימונים.",
    headR: 7.5,
    headOffY: 0,
    shoulderW: 22,
    shoulderTilt: 0,
  },
  {
    id: "P-2841",
    meta: "15 · SAILING · CENTER · ARAB-MUSLIM",
    he: "הנסיעות הארוכות לאימונים הפכו את העייפות לחלק בלתי נפרד מחיי.",
    headR: 7,
    headOffY: 1,
    shoulderW: 19,
    shoulderTilt: 0.3,
  },
  {
    id: "P-0463",
    meta: "14 · JUDO · SOUTH · JEWISH-SECULAR",
    he: "הלחץ של ההורים שלי לזכות הפך כל אימון לדבר שקשה לי לאהוב.",
    headR: 6.5,
    headOffY: 0,
    shoulderW: 17,
    shoulderTilt: -0.2,
  },
  {
    id: "P-3902",
    meta: "19 · TENNIS · NORTH · JEWISH-RELIGIOUS",
    he: "כשהפסדתי בטורניר הראשון, הרגשתי שאני כבר לא שייכת לכאן.",
    headR: 7,
    headOffY: -1,
    shoulderW: 20,
    shoulderTilt: 0.1,
  },
  {
    id: "P-1198",
    meta: "16 · TRIATHLON · CENTER · ARAB-CHRISTIAN",
    he: "האימונים הפכו לחובה, ולא משהו שבחרתי לעצמי.",
    headR: 7.2,
    headOffY: 0,
    shoulderW: 21,
    shoulderTilt: -0.1,
  },
];

function PersonaSilhouette({ p }: { p: Persona }) {
  const w = 40;
  const h = 52;
  const cx = w / 2;
  const headY = 13 + p.headOffY;
  const headBottomY = headY + p.headR;
  const neckBottomY = headBottomY + 3.5;
  const shoulderHalf = p.shoulderW / 2;
  const tilt = p.shoulderTilt * 1.6;
  const baseY = h - 3;

  /* Bust outline: a small dome-with-pedestal beneath the head.
     Curves out from the neck to each shoulder, then down to a flat
     base. Drawn as one closed path so the silhouette reads as a
     single form, not a stick figure.                              */
  const bustPath = `
    M ${cx - 2.4} ${neckBottomY}
    Q ${cx - 4.5} ${neckBottomY + 1.5} ${cx - shoulderHalf} ${neckBottomY + 4 + tilt}
    L ${cx - shoulderHalf} ${baseY}
    L ${cx + shoulderHalf} ${baseY}
    L ${cx + shoulderHalf} ${neckBottomY + 4 - tilt}
    Q ${cx + 4.5} ${neckBottomY + 1.5} ${cx + 2.4} ${neckBottomY}
    Z
  `;

  return (
    <svg width={w} height={h} className="block" aria-hidden>
      {/* Bust pedestal */}
      <path
        d={bustPath}
        fill="var(--color-paper-soft)"
        stroke="var(--color-ink-soft)"
        strokeWidth={0.85}
        strokeLinejoin="round"
        opacity={0.92}
      />
      {/* Head sitting atop the bust */}
      <circle
        cx={cx}
        cy={headY}
        r={p.headR}
        fill="var(--color-paper-soft)"
        stroke="var(--color-ink-soft)"
        strokeWidth={0.85}
      />
    </svg>
  );
}

export function HITVisual({ quiet = false }: { quiet?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || quiet) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % personas.length),
      4400
    );
    return () => clearInterval(id);
  }, [paused, quiet]);

  const p = personas[idx];

  return (
    <FrameBase
      ariaLabel={`Cycling synthetic persona: ${p.id} (${p.meta}).`}
    >
      <div
        className="absolute inset-0 flex flex-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Top row: silhouette + meta */}
        <div className="flex items-start gap-3.5 flex-1 min-h-0">
          <div
            key={`s-${idx}`}
            className="hit-fade shrink-0 flex flex-col items-center"
            style={{ animationDelay: "0ms" }}
          >
            <PersonaSilhouette p={p} />
            <div
              className="font-mono text-[7.5px] tracking-[0.18em] text-[var(--color-muted)] mt-1"
              style={{ opacity: 0.85 }}
            >
              {p.id}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div
              key={`m-${idx}`}
              className="font-mono text-[8.5px] tracking-[0.14em] text-[var(--color-muted)] leading-[1.55] hit-fade"
              style={{ animationDelay: "40ms" }}
            >
              {p.meta}
            </div>
            {/* Hebrew quote — RTL, serif */}
            <div
              key={`q-${idx}`}
              dir="rtl"
              lang="he"
              className="hit-fade text-[12.5px] leading-[1.5] text-[var(--color-ink)] mt-1.5"
              style={{
                fontFamily: "var(--font-hebrew), 'Frank Ruhl Libre', serif",
                animationDelay: "100ms",
              }}
            >
              <span className="text-[var(--color-rule)] mr-0.5">“</span>
              {p.he}
              <span className="text-[var(--color-rule)] ml-0.5">”</span>
            </div>
          </div>
        </div>

        {/* Dot row */}
        <div className="flex items-center gap-[7px] mt-2">
          {personas.map((_, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                aria-label={`Show persona ${i + 1}`}
                onClick={() => setIdx(i)}
                className="block rounded-full transition-all duration-500"
                style={{
                  width: active ? 12 : 3,
                  height: 3,
                  background: active
                    ? "var(--color-sky-deep)"
                    : "var(--color-rule)",
                  opacity: active ? 0.85 : 0.7,
                  cursor: "pointer",
                  padding: 0,
                  border: "none",
                }}
              />
            );
          })}
          <span className="ml-auto font-mono text-[7.5px] tracking-[0.2em] text-[var(--color-muted)]">
            {(idx + 1).toString().padStart(2, "0")} /{" "}
            {personas.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </FrameBase>
  );
}

/* ─────────── 2L — Multi-Agent Pipeline ─────────── */
/* The real six-agent pipeline: explore → plan → build → integrate →
   validate → heal. Two phases fan out (explorers and builders run in
   parallel); the rest are single. Heal is conditional — it only runs
   when validation fails, so it surfaces on roughly every third cycle.
   Everything resolves to a quiet "commit spine" at the right edge,
   where a ring blooms as each validated pass lands.

   Time-driven: one clock progresses; each dot computes its own
   position from (delay, duration, stagger).                         */

type Lane = {
  name: string;
  count: number;
  duration: number;
  delay: number;
  pulse?: boolean;
  /* Surfaces only on some cycles (heal runs when validation fails). */
  conditional?: boolean;
};

const lanes: Lane[] = [
  { name: "EXPLORE", count: 3, duration: 1.5, delay: 0 },
  { name: "PLAN", count: 1, duration: 1.0, delay: 1.8 },
  { name: "BUILD", count: 3, duration: 1.7, delay: 2.9 },
  { name: "INTEGRATE", count: 1, duration: 1.1, delay: 5.0 },
  { name: "VALIDATE", count: 1, duration: 1.1, delay: 6.3, pulse: true },
  { name: "HEAL", count: 1, duration: 1.0, delay: 7.5, pulse: true, conditional: true },
];

const cycleTotal = 9.4;

/* Heal surfaces on 1 of every HEAL_EVERY cycles. */
const HEAL_EVERY = 3;

const LANE_LEFT = 70;   /* x where dots start (after the label) */
const LANE_RIGHT = 246; /* x where dots converge (the commit spine) */

export function TwoLVisual({ quiet = false }: { quiet?: boolean }) {
  const [hoverLane, setHoverLane] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [cycle, setCycle] = useState(0);
  /* Total elapsed seconds, held across pauses so the pipeline resumes
     mid-flight rather than restarting when attention returns. */
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (quiet) return; // attention elsewhere: hold the pipeline still
    let raf = 0;
    const start = performance.now() - elapsedRef.current * 1000;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      elapsedRef.current = elapsed;
      setT(elapsed % cycleTotal);
      setCycle(Math.floor(elapsed / cycleTotal));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [quiet]);

  const healing = cycle % HEAL_EVERY === HEAL_EVERY - 1;

  /* Commit glow: a pulse lane's lead dot reaching the spine blooms
     the ring, which then decays as the dot disperses. */
  let commitGlow = 0;
  for (const lane of lanes) {
    if (!lane.pulse) continue;
    if (lane.conditional && !healing) continue;
    if (t >= lane.delay && t <= lane.delay + lane.duration) {
      const p = (t - lane.delay) / lane.duration;
      if (p > 0.8) commitGlow = Math.max(commitGlow, (p - 0.8) / 0.2);
    }
  }

  return (
    <FrameBase ariaLabel="2L pipeline: parallel explorers and builders converging through plan, integrate, validate, and heal toward a single committed result.">
      {/* Commit spine — the point of arrival at the right edge. */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: LANE_RIGHT,
          top: 14,
          bottom: 14,
          width: 1,
          background: "var(--color-rule)",
          opacity: 0.4,
        }}
      />
      {/* Commit ring — blooms as each validated pass lands. */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          left: LANE_RIGHT - 5,
          top: "50%",
          width: 10,
          height: 10,
          marginTop: -5,
          border: "1px solid var(--color-sky)",
          background: `color-mix(in srgb, var(--color-sky) ${commitGlow * 30}%, transparent)`,
          opacity: 0.3 + commitGlow * 0.7,
          transform: `scale(${1 + commitGlow * 0.7})`,
          boxShadow: commitGlow > 0 ? `0 0 ${commitGlow * 8}px var(--color-sky)` : "none",
          transition: "opacity 200ms ease",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-between py-2">
        {lanes.map((lane, i) => {
          const isHover = hoverLane === i;
          const dimmed = lane.conditional && !healing;
          return (
            <div
              key={lane.name}
              className="relative h-[14px] flex items-center"
              onMouseEnter={() => setHoverLane(i)}
              onMouseLeave={() => setHoverLane(null)}
            >
              {/* Lane track */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: LANE_LEFT - 4,
                  right: W - LANE_RIGHT,
                  height: 1,
                  background: isHover
                    ? "var(--color-sky)"
                    : "var(--color-rule)",
                  opacity: isHover ? 0.7 : dimmed ? 0.22 : 0.45,
                  transition: "background 250ms ease, opacity 250ms ease",
                }}
              />
              {/* Lane label */}
              <div
                className="absolute font-mono text-[8px] tracking-[0.14em] pointer-events-none"
                style={{
                  left: 0,
                  top: 0,
                  color: isHover
                    ? "var(--color-ink)"
                    : "var(--color-muted)",
                  opacity: isHover ? 1 : dimmed ? 0.32 : 0.6,
                  transition: "all 250ms ease",
                }}
              >
                {lane.name}
              </div>

              {/* Dots */}
              {Array.from({ length: lane.count }).map((_, dotI) => {
                if (lane.conditional && !healing) return null;
                const stagger = dotI * 0.18;
                const start = lane.delay + stagger;
                const end = start + lane.duration;
                let progress: number | null = null;
                if (t >= start && t <= end) {
                  progress = (t - start) / lane.duration;
                }
                const visible = progress !== null;
                const x = visible
                  ? LANE_LEFT + (LANE_RIGHT - LANE_LEFT) * (progress as number)
                  : LANE_LEFT;
                const opacity = visible
                  ? Math.min(
                      1,
                      Math.min(
                        (progress as number) * 8,
                        (1 - (progress as number)) * 8
                      )
                    )
                  : 0;
                const size = lane.pulse ? 5 : 4;
                return (
                  <span
                    key={dotI}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      background: lane.pulse
                        ? "var(--color-sky)"
                        : "var(--color-ink-soft)",
                      top: "50%",
                      left: 0,
                      transform: `translate(${x}px, -50%)`,
                      opacity,
                      boxShadow: lane.pulse
                        ? `0 0 6px var(--color-sky)`
                        : "none",
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </FrameBase>
  );
}

/* ─────────── SelahOS ─────────── */
/* The Today screen in miniature — the app's real architecture. Five
   anchor sections (sleep, food, meds, body, ground), each anchor a
   three-state circle: untouched ring, done, not-done. Over one cycle
   a day quietly fills in: an anchor completes with a tree-ring that
   etches outward and the exact time it was met blooming beside its
   row, lingering, then fading — the app's actual completion gesture
   (TIME_LINGER_MS = 3200 in the real code). At cycle's end the day
   releases and begins again; the real app rolls the day at 04:00.
   Hover holds the day still.                                        */

type SelahEvent = {
  at: number; /* seconds into the cycle when the anchor is met */
  time: string; /* time-of-day that blooms in beside the row */
  state: "done" | "notdone";
};

type SelahRow = {
  label: string;
  events: SelahEvent[]; /* one per circle, left to right */
};

const selahRows: SelahRow[] = [
  {
    label: "SLEEP",
    events: [
      { at: 1.0, time: "07:10", state: "done" },
      { at: 13.6, time: "23:40", state: "done" },
    ],
  },
  {
    label: "FOOD",
    events: [
      { at: 3.2, time: "08:05", state: "done" },
      { at: 6.2, time: "13:10", state: "done" },
      { at: 9.6, time: "19:45", state: "done" },
    ],
  },
  {
    label: "MEDS",
    events: [
      { at: 2.1, time: "07:25", state: "done" },
      { at: 12.0, time: "21:30", state: "done" },
    ],
  },
  {
    label: "BODY",
    events: [
      { at: 4.4, time: "08:40", state: "done" },
      { at: 12.8, time: "", state: "notdone" },
    ],
  },
  {
    label: "GROUND",
    events: [{ at: 8.4, time: "18:00", state: "done" }],
  },
];

const SELAH_CYCLE = 16;
const SELAH_RING_DUR = 1.0; /* tree-ring etch duration */
const SELAH_LINGER = 3.2; /* the app's TIME_LINGER_MS, in seconds */
const SELAH_RESET = 1.0; /* end-of-cycle release back to ground */

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function SelahOSVisual({ quiet = false }: { quiet?: boolean }) {
  const [hover, setHover] = useState(false);
  const [t, setT] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (quiet || hover) return; // attention holds the day still
    let raf = 0;
    const start = performance.now() - elapsedRef.current * 1000;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      elapsedRef.current = elapsed;
      setT(elapsed % SELAH_CYCLE);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [quiet, hover]);

  /* End of cycle: the day's marks release back to untouched ground. */
  const resetK =
    t > SELAH_CYCLE - SELAH_RESET
      ? (t - (SELAH_CYCLE - SELAH_RESET)) / SELAH_RESET
      : 0;
  const dayOpacity = 1 - resetK;

  const padT = 8;
  const padB = 20;
  const rowH = (H - padT - padB) / selahRows.length;
  const circleX0 = 66;
  const circleGap = 24;
  const r = 5;

  return (
    <FrameBase ariaLabel="SelahOS Today screen in miniature: anchors for sleep, food, meds, body and ground filling in through one day as three-state circles, each completion etching a tree-ring and blooming the time it was met.">
      <svg
        width={W}
        height={H}
        className="block"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {selahRows.map((row, ri) => {
          const cy = padT + rowH * ri + rowH / 2;

          /* The row's currently-lingering time label, if any. */
          const active = row.events.find(
            (e) =>
              e.time &&
              t >= e.at &&
              t <= e.at + SELAH_LINGER + 0.6 &&
              resetK === 0
          );
          let timeOpacity = 0;
          if (active) {
            const since = t - active.at;
            if (since < 0.25) timeOpacity = since / 0.25;
            else if (since > SELAH_LINGER) {
              timeOpacity = Math.max(0, 1 - (since - SELAH_LINGER) / 0.6);
            } else timeOpacity = 1;
          }

          return (
            <g key={row.label}>
              {/* Section label — the app's real groupings */}
              <text
                x={0}
                y={cy + 2.5}
                fontSize={8}
                letterSpacing="0.14em"
                fill="var(--color-muted)"
                fontFamily="var(--font-mono)"
                opacity={0.75}
              >
                {row.label}
              </text>

              {row.events.map((e, ci) => {
                const cx = circleX0 + ci * circleGap;
                const met = t >= e.at && resetK < 1;
                const since = t - e.at;

                /* Pop-in: the mark sets with a small ease, like a
                   stamp landing. */
                const popK = met ? Math.min(1, since / 0.3) : 0;
                const scale = 0.6 + 0.4 * easeOutCubic(popK);

                return (
                  <g key={ci}>
                    {/* Untouched ring — always present, the ground state */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="none"
                      stroke="var(--color-rule)"
                      strokeWidth={1}
                      opacity={0.8}
                    />

                    {/* Tree-ring etch on completion */}
                    {met && since < SELAH_RING_DUR && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + (since / SELAH_RING_DUR) * 9}
                        fill="none"
                        stroke="var(--color-sky)"
                        strokeWidth={1}
                        opacity={(1 - since / SELAH_RING_DUR) * 0.55}
                      />
                    )}

                    {/* The mark itself */}
                    {met && (
                      <g
                        transform={`translate(${cx}, ${cy}) scale(${scale})`}
                        opacity={dayOpacity}
                      >
                        {e.state === "done" ? (
                          <>
                            <circle
                              r={r}
                              fill="var(--color-sky-deep)"
                              opacity={0.92}
                            />
                            <path
                              d="M -2.2 0.2 L -0.6 1.8 L 2.4 -1.8"
                              fill="none"
                              stroke="var(--color-paper)"
                              strokeWidth={1.2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </>
                        ) : (
                          <>
                            <circle
                              r={r}
                              fill="none"
                              stroke="var(--color-muted)"
                              strokeWidth={1}
                            />
                            <line
                              x1={-2.4}
                              x2={2.4}
                              y1={0}
                              y2={0}
                              stroke="var(--color-muted)"
                              strokeWidth={1.2}
                              strokeLinecap="round"
                            />
                          </>
                        )}
                      </g>
                    )}
                  </g>
                );
              })}

              {/* The met time blooms in beside the row, lingers, fades —
                  the app's signature gesture. */}
              {active && (
                <text
                  x={W - 4}
                  y={cy + 2.5}
                  fontSize={8.5}
                  textAnchor="end"
                  fill="var(--color-ink)"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.08em"
                  opacity={timeOpacity * 0.9}
                >
                  {active.time}
                </text>
              )}
            </g>
          );
        })}

        {/* Footer: the app's real day boundary */}
        <text
          x={W / 2}
          y={H - 5}
          fontSize={7.5}
          textAnchor="middle"
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          letterSpacing="0.18em"
          opacity={0.7}
        >
          DAY ROLLS OVER · 04:00
        </text>
      </svg>
    </FrameBase>
  );
}
