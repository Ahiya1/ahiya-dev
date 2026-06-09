"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
/* Real analysis: emotional burnout by seniority (Herzog College sample).
   One-way ANOVA across three tenure groups, n=50 each.            */

export function StatVizVisual({ quiet = false }: { quiet?: boolean }) {
  const bars = useMemo(
    () => [
      { label: "0–3", mean: 2.8, sd: 0.9, n: 50 },
      { label: "4–7", mean: 3.6, sd: 0.8, n: 50 },
      { label: "8+", mean: 4.1, sd: 1.0, n: 50 },
    ],
    []
  );

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [autoIdx, setAutoIdx] = useState(0);

  useEffect(() => {
    if (hoverIdx !== null || quiet) return;
    const id = setInterval(() => setAutoIdx((i) => (i + 1) % 3), 1800);
    return () => clearInterval(id);
  }, [hoverIdx, quiet]);

  const activeIdx = hoverIdx ?? autoIdx;

  const maxY = 5.2;
  const padL = 18;
  const padR = 14;
  const padT = 14;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW = 30;
  const gap = (chartW - bars.length * barW) / (bars.length + 1);

  return (
    <FrameBase ariaLabel="Burnout score by years in role; three groups, n=50 each. F(2,147) = 12.34, p < 0.001.">
      <svg
        width={W}
        height={H}
        className="block"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {/* Y gridlines (Likert anchors) */}
        {[1, 3, 5].map((tick) => {
          const y = padT + chartH - (tick / maxY) * chartH;
          return (
            <line
              key={tick}
              x1={padL}
              x2={W - padR}
              y1={y}
              y2={y}
              stroke="var(--color-rule)"
              strokeWidth={0.5}
              opacity={0.5}
            />
          );
        })}
        {/* Baseline */}
        <line
          x1={padL}
          x2={W - padR}
          y1={padT + chartH}
          y2={padT + chartH}
          stroke="var(--color-rule)"
          strokeWidth={1}
        />

        {bars.map((bar, i) => {
          const x = padL + gap + i * (barW + gap);
          const barH = (bar.mean / maxY) * chartH;
          const y = padT + chartH - barH;
          const sdPx = (bar.sd / maxY) * chartH;
          const isActive = activeIdx === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              style={{ cursor: "default" }}
            >
              {/* Invisible larger hit area */}
              <rect
                x={x - 6}
                y={padT}
                width={barW + 12}
                height={chartH + 10}
                fill="transparent"
              />
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={isActive ? "var(--color-sky)" : "var(--color-ink-soft)"}
                opacity={isActive ? 0.92 : 0.5}
                style={{
                  transition:
                    "fill 400ms ease, opacity 400ms ease, y 600ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              {/* Error bar (±1 SD/2 visualized) */}
              <line
                x1={x + barW / 2}
                x2={x + barW / 2}
                y1={y - sdPx / 2}
                y2={y + sdPx / 2}
                stroke={isActive ? "var(--color-sky-deep)" : "var(--color-ink-soft)"}
                strokeWidth={1}
                opacity={0.7}
                style={{ transition: "stroke 300ms ease" }}
              />
              <line
                x1={x + barW / 2 - 4}
                x2={x + barW / 2 + 4}
                y1={y - sdPx / 2}
                y2={y - sdPx / 2}
                stroke={isActive ? "var(--color-sky-deep)" : "var(--color-ink-soft)"}
                strokeWidth={1}
                opacity={0.7}
              />
              {/* Group label */}
              <text
                x={x + barW / 2}
                y={padT + chartH + 12}
                fontSize={9}
                fill={isActive ? "var(--color-ink)" : "var(--color-muted)"}
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                style={{ transition: "fill 300ms ease" }}
              >
                {bar.label}
              </text>
            </g>
          );
        })}

        {/* Footer line: actual ANOVA result */}
        <text
          x={W / 2}
          y={H - 6}
          fontSize={9}
          fill="var(--color-muted)"
          fontFamily="var(--font-mono)"
          textAnchor="middle"
          letterSpacing="0.06em"
        >
          F(2,147) = 12.34 · p &lt; 0.001
        </text>
      </svg>

      {/* Tooltip */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 4,
          right: 6,
          opacity: activeIdx !== null ? 1 : 0,
          transform:
            activeIdx !== null ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
      >
        <div className="font-mono text-[9px] leading-[1.35] text-[var(--color-ink)] bg-[var(--color-paper-soft)] px-1.5 py-1 rounded-sm border border-[var(--color-rule)]">
          <div>M = {bars[activeIdx].mean.toFixed(1)}</div>
          <div className="text-[var(--color-muted)]">
            SD = {bars[activeIdx].sd.toFixed(1)}
          </div>
        </div>
      </div>
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
/* Coming back to ground. The dot is displaced (a quick tug, almost
   imperceptible), then returns to center with intentional, effortless
   motion (cubic ease-out). Rests at center. Cycle of three returns,
   each from a different direction. Hover stops the cycle entirely:
   the dot is held at center for as long as attention is held.       */

type SelahPhase = {
  /* start time of the displacement (the "tug") in seconds          */
  tugAt: number;
  /* duration of the return motion                                  */
  returnDur: number;
  /* (dx, dy) of the displacement in component pixels               */
  dx: number;
  dy: number;
};

const selahPhases: SelahPhase[] = [
  { tugAt: 0.0, returnDur: 1.7, dx: 18, dy: -10 },
  { tugAt: 2.7, returnDur: 1.6, dx: -16, dy: 12 },
  { tugAt: 5.2, returnDur: 1.5, dx: -12, dy: -14 },
];
const selahCycle = 7.4;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function SelahOSVisual({ quiet = false }: { quiet?: boolean }) {
  const [hover, setHover] = useState(false);
  const [t, setT] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (quiet) return; // held off-attention: the clock rests
    let raf = 0;
    const start = performance.now() - elapsedRef.current * 1000;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      elapsedRef.current = elapsed;
      setT(elapsed % selahCycle);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [quiet]);

  /* Hover or attention-elsewhere both bring the dot home to ground. */
  const settled = hover || quiet;

  /* Compute current displacement from center. */
  let dx = 0;
  let dy = 0;
  if (!settled) {
    /* Find the most recent tug at or before t. */
    const active = [...selahPhases]
      .reverse()
      .find((p) => t >= p.tugAt) ?? selahPhases[selahPhases.length - 1];
    const since = t - active.tugAt;
    if (since >= 0 && since < active.returnDur) {
      const k = 1 - easeOutCubic(since / active.returnDur);
      dx = active.dx * k;
      dy = active.dy * k;
    }
  }

  return (
    <FrameBase ariaLabel="A dot displaced from ground, returning to center; an intentional, effortless homecoming.">
      <div
        className="absolute inset-0 flex items-center justify-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="relative"
          style={{ width: 120, height: 120 }}
        >
          {/* The ground: a faint, fixed cross at center */}
          <span
            className="absolute"
            style={{
              left: 60 - 4,
              top: 60,
              width: 8,
              height: 1,
              background: "var(--color-rule)",
              opacity: 0.7,
            }}
          />
          <span
            className="absolute"
            style={{
              left: 60,
              top: 60 - 4,
              width: 1,
              height: 8,
              background: "var(--color-rule)",
              opacity: 0.7,
            }}
          />
          {/* Faint trail from current position toward ground */}
          {(dx !== 0 || dy !== 0) && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={120}
              height={120}
            >
              <line
                x1={60}
                y1={60}
                x2={60 + dx}
                y2={60 + dy}
                stroke="var(--color-sky)"
                strokeWidth={1}
                opacity={0.22}
              />
            </svg>
          )}
          {/* The returning dot */}
          <span
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              left: 60 - 5 + dx,
              top: 60 - 5 + dy,
              background: "var(--color-sky-deep)",
              boxShadow: hover
                ? "0 0 0 3px color-mix(in srgb, var(--color-sky) 18%, transparent)"
                : "none",
              transition: settled
                ? "left 900ms cubic-bezier(0.16,1,0.3,1), top 900ms cubic-bezier(0.16,1,0.3,1), box-shadow 600ms ease"
                : "box-shadow 600ms ease",
            }}
          />
        </div>
      </div>
    </FrameBase>
  );
}
