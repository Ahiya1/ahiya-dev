"use client";

import { useEffect, useMemo, useState } from "react";

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

export function StatVizVisual() {
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
    if (hoverIdx !== null) return;
    const id = setInterval(() => setAutoIdx((i) => (i + 1) % 3), 1800);
    return () => clearInterval(id);
  }, [hoverIdx]);

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
/* Real persona schema, real testimonial themes.                  */

type Persona = {
  meta: string;
  he: string;
};

const personas: Persona[] = [
  {
    meta: "17 · BASKETBALL · NORTH · ULTRA-ORTHODOX",
    he: "האתגר הגדול היה השילוב בין הלימודים, המשפחה והאימונים.",
  },
  {
    meta: "15 · SAILING · CENTER · ARAB-MUSLIM",
    he: "הנסיעות הארוכות לאימונים הפכו את העייפות לחלק בלתי נפרד מחיי.",
  },
  {
    meta: "14 · JUDO · SOUTH · JEWISH-SECULAR",
    he: "הלחץ של ההורים שלי לזכות הפך כל אימון לדבר שקשה לי לאהוב.",
  },
  {
    meta: "19 · TENNIS · NORTH · JEWISH-RELIGIOUS",
    he: "כשהפסדתי בטורניר הראשון, הרגשתי שאני כבר לא שייכת לכאן.",
  },
  {
    meta: "16 · TRIATHLON · CENTER · ARAB-CHRISTIAN",
    he: "האימונים הפכו לחובה, ולא משהו שבחרתי לעצמי.",
  },
];

export function HITVisual() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % personas.length),
      4200
    );
    return () => clearInterval(id);
  }, [paused]);

  const p = personas[idx];

  return (
    <FrameBase
      ariaLabel={`Cycling Hebrew testimonial from synthetic persona: ${p.meta}.`}
    >
      <div
        className="absolute inset-0 flex flex-col justify-between"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Meta chip */}
        <div
          key={`m-${idx}`}
          className="font-mono text-[9px] tracking-[0.12em] text-[var(--color-muted)] hit-fade"
          style={{ animationDelay: "0ms" }}
        >
          {p.meta}
        </div>

        {/* Hebrew quote — RTL, serif */}
        <div
          key={`q-${idx}`}
          dir="rtl"
          lang="he"
          className="hit-fade text-[13.5px] leading-[1.55] text-[var(--color-ink)] px-0.5"
          style={{
            fontFamily: "var(--font-hebrew), 'Frank Ruhl Libre', serif",
            animationDelay: "60ms",
          }}
        >
          <span className="text-[var(--color-sky-deep)] mr-0.5">“</span>
          {p.he}
          <span className="text-[var(--color-sky-deep)] ml-0.5">”</span>
        </div>

        {/* Dot row */}
        <div className="flex items-center gap-[6px] mt-1">
          {personas.map((_, i) => {
            const active = i === idx;
            return (
              <button
                key={i}
                aria-label={`Show persona ${i + 1}`}
                onClick={() => setIdx(i)}
                className="block rounded-full transition-all duration-300"
                style={{
                  width: active ? 16 : 5,
                  height: 5,
                  background: active
                    ? "var(--color-sky)"
                    : "var(--color-rule)",
                  cursor: "pointer",
                  padding: 0,
                  border: "none",
                }}
              />
            );
          })}
          <span className="ml-auto font-mono text-[8px] tracking-[0.16em] text-[var(--color-muted)]">
            {(idx + 1).toString().padStart(2, "0")} / {personas.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </FrameBase>
  );
}

/* ─────────── 2L — Multi-Agent Pipeline ─────────── */
/* Parallel-then-sequential rhythm across 5 phase lanes.
   Time-driven: a single clock progresses; each dot computes its
   own position from (delay, duration, stagger).                  */

type Lane = {
  name: string;
  count: number;
  duration: number;
  delay: number;
  pulse?: boolean;
};

const lanes: Lane[] = [
  { name: "EXPLORE", count: 3, duration: 1.6, delay: 0 },
  { name: "PLAN", count: 1, duration: 1.0, delay: 1.7 },
  { name: "BUILD", count: 3, duration: 1.8, delay: 2.8 },
  { name: "VALIDATE", count: 1, duration: 1.2, delay: 4.7, pulse: true },
  { name: "COMMIT", count: 1, duration: 0.7, delay: 6.0, pulse: true },
];

const cycleTotal = 7.6;

const LANE_LEFT = 70;   /* x where dots start (after the label) */
const LANE_RIGHT = 250; /* x where dots end (right edge) */

export function TwoLVisual() {
  const [hoverLane, setHoverLane] = useState<number | null>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(((now - start) / 1000) % cycleTotal);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <FrameBase ariaLabel="2L pipeline: parallel exploration converging through plan, build, validate, commit.">
      <div className="absolute inset-0 flex flex-col justify-between py-1.5">
        {lanes.map((lane, i) => {
          const isHover = hoverLane === i;
          return (
            <div
              key={lane.name}
              className="relative h-[16px] flex items-center"
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
                  opacity: isHover ? 0.7 : 0.45,
                  transition: "background 250ms ease, opacity 250ms ease",
                }}
              />
              {/* Lane label */}
              <div
                className="absolute font-mono text-[8.5px] tracking-[0.14em] pointer-events-none"
                style={{
                  left: 0,
                  top: 1,
                  color: isHover
                    ? "var(--color-ink)"
                    : "var(--color-muted)",
                  opacity: isHover ? 1 : 0.6,
                  transition: "all 250ms ease",
                }}
              >
                {lane.name}
              </div>

              {/* Dots */}
              {Array.from({ length: lane.count }).map((_, dotI) => {
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
/* A sealed center. Four compass breaths.                         */

export function SelahOSVisual() {
  const [hover, setHover] = useState(false);

  /* Four cardinal companions at different periods */
  const companions = [
    { angle: 0, dur: 5.0 },
    { angle: 90, dur: 6.0 },
    { angle: 180, dur: 7.0 },
    { angle: 270, dur: 4.0 },
  ];

  return (
    <FrameBase ariaLabel="A sealed breathing center; four faint companions at compass points.">
      <div
        className="absolute inset-0 flex items-center justify-center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="relative"
          style={{
            width: 100,
            height: 100,
            ["--selah-cycle" as never]: hover ? "8s" : "6s",
            transition: "all 800ms ease",
          }}
        >
          {/* Outer ring (inverts breath) */}
          <span
            className="absolute inset-0 rounded-full selah-ring"
            style={{
              border: "1px solid var(--color-rule)",
              opacity: hover ? 0.7 : 0.45,
              transition: "opacity 1.2s ease",
            }}
          />
          {/* Compass companions */}
          {companions.map((c, i) => {
            const rad = (c.angle * Math.PI) / 180;
            const r = 44;
            const x = 50 + Math.cos(rad) * r;
            const y = 50 + Math.sin(rad) * r;
            return (
              <span
                key={i}
                className="absolute rounded-full selah-companion"
                style={{
                  width: 4,
                  height: 4,
                  left: x - 2,
                  top: y - 2,
                  background: "var(--color-muted)",
                  opacity: hover ? 0.7 : 0.4,
                  animationDuration: `${c.dur}s`,
                  animationDelay: `-${(c.dur / 4) * i}s`,
                  transition: "opacity 1.2s ease",
                }}
              />
            );
          })}
          {/* Central breathing dot */}
          <span
            className="absolute selah-center rounded-full"
            style={{
              width: 14,
              height: 14,
              left: 43,
              top: 43,
              background: "var(--color-sky-deep)",
            }}
          />
        </div>
      </div>
    </FrameBase>
  );
}
