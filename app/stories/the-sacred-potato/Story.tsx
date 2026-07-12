"use client";

// The Sacred Potato — an immersive read.
//
// Two clocks:
//   1. The desert's clock is real time. Breath, light, drifting sand run on
//      requestAnimationFrame whether or not the reader scrolls. Standing
//      still means standing in the desert, not pausing a page. The longer
//      the reader lives here (--lived), the deeper the night becomes —
//      more grain, more stars, a fuller breath. More true, less legible.
//   2. The walker's clock is the scroll. It is assent, not effort: it
//      carries the reader through the full prose, blending scene weathers
//      as the terrain changes.
//
// At the final dawn the two clocks converge: the page inverts to the
// site's paper daylight, and the fullness of that dawn scales with the
// time actually lived inside the night.

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./story.module.css";
import { WEATHERS, DEFAULT_WEATHER, type Weather } from "./weathers";
import { PartOne } from "./part1";
import { PartTwo } from "./part2";
import { PartThree } from "./part3";
import { PartFour } from "./part4";

const TAU = Math.PI * 2;
const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const smooth = (t: number) => t * t * (3 - 2 * t);

type RGB = [number, number, number];

function hex(c: string): RGB {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixRGB(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

const css = (c: RGB) =>
  `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])})`;

// weathers parsed once
type Parsed = {
  sky: [RGB, RGB, RGB];
  glowColor: RGB;
  nums: number[];
};
const NUM_KEYS = [
  "stars",
  "glow",
  "glowX",
  "heat",
  "wind",
  "dust",
  "tree",
  "treeX",
  "treeNear",
  "grove",
  "dim",
  "bleach",
] as const;

function parse(w: Weather): Parsed {
  return {
    sky: [hex(w.sky[0]), hex(w.sky[1]), hex(w.sky[2])],
    glowColor: hex(w.glowColor),
    nums: NUM_KEYS.map((k) => w[k]),
  };
}

const PARSED: Record<string, Parsed> = {};
for (const k of Object.keys(WEATHERS)) PARSED[k] = parse(WEATHERS[k]);
const PARSED_DEFAULT = parse(DEFAULT_WEATHER);
const PALLOR = hex("#9c9184");

function blend(a: Parsed, b: Parsed, t: number): Parsed {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return {
    sky: [
      mixRGB(a.sky[0], b.sky[0], t),
      mixRGB(a.sky[1], b.sky[1], t),
      mixRGB(a.sky[2], b.sky[2], t),
    ],
    glowColor: mixRGB(a.glowColor, b.glowColor, t),
    nums: a.nums.map((n, i) => n + (b.nums[i] - n) * t),
  };
}

const LIVED_MS = 40 * 60 * 1000; // the night deepens over ~40 minutes

type Particle = {
  x: number;
  y: number;
  s: number;
  a: number;
  v: number;
  ph: number;
};

export default function Story() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!root || !stage || !canvas) return;

    root.classList.add(styles.js);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const sceneEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scene]")
    );
    const proseEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-prose] > *")
    );

    // ---- reveals: prose surfaces as the walk reaches it ----
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    if (reduced) {
      // a clean, dark, motionless read; dawn still arrives, statically
      proseEls.forEach((el) => el.classList.add(styles.in));
      const last = sceneEls[sceneEls.length - 1];
      const dawnIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              root.style.setProperty("--dawn", "1");
              root.style.setProperty("--dawn-bg", "1");
              root.style.setProperty("--dawn-ink", "1");
              dawnIO.disconnect();
            }
          }
        },
        { threshold: 0.2 }
      );
      if (last) dawnIO.observe(last);
      return () => {
        dawnIO.disconnect();
      };
    }

    proseEls.forEach((el) => io.observe(el));

    // ---- scene geography ----
    type Band = { el: HTMLElement; top: number; height: number; w: string };
    let bands: Band[] = [];
    let dawnStart = Infinity;
    let docEnd = 1;

    const measure = () => {
      const y = window.scrollY;
      bands = sceneEls.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          top: r.top + y,
          height: r.height,
          w: el.dataset.w || "void",
        };
      });
      const dawnBand = bands.find((b) => b.w === "dawn");
      dawnStart = dawnBand ? dawnBand.top : Infinity;
      const lastBand = bands[bands.length - 1];
      docEnd = lastBand ? lastBand.top + lastBand.height : 1;
    };
    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(root);

    // ---- canvas: sand in the air ----
    const ctx = canvas.getContext("2d");
    let W = 0;
    let H = 0;
    let DPR = 1;
    const sizeCanvas = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
    };
    sizeCanvas();

    const particles: Particle[] = Array.from({ length: 110 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1400,
      s: 0.6 + Math.random() * 1.5,
      a: 0.05 + Math.random() * 0.2,
      v: 0.4 + Math.random() * 1.1,
      ph: Math.random() * TAU,
    }));

    const onResize = () => {
      sizeCanvas();
      measure();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ---- the loop: both clocks ----
    const t0 = performance.now();
    let lastT = t0;
    let sScroll = window.scrollY;
    let lastY = sScroll;
    let lastMoveT = t0;
    let walked = false;
    let dawnMax = 0;
    let raf = 0;

    const varCache: Record<string, string> = {};
    const setVar = (el: HTMLElement, k: string, v: string) => {
      if (varCache[k] !== v) {
        varCache[k] = v;
        el.style.setProperty(k, v);
      }
    };

    const weatherOf = (key: string) => PARSED[key] ?? PARSED_DEFAULT;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      const y = window.scrollY;
      if (Math.abs(y - lastY) > 0.5) {
        lastMoveT = now;
        lastY = y;
        if (!walked && y > 40) {
          walked = true;
          root.classList.add(styles.walked);
        }
      }
      sScroll += (y - sScroll) * (1 - Math.exp(-6 * dt));

      const vh = window.innerHeight;
      const doc = document.documentElement.scrollHeight - vh;
      const journey = doc > 0 ? clamp(sScroll / doc) : 0;

      // clock A: lived time, breath, stillness
      const lived = clamp((now - t0) / LIVED_MS);
      const still = clamp(((now - lastMoveT) / 1000 - 4) / 22);
      const breath = Math.sin(((now - t0) / 9000) * TAU);

      // clock B: where the walk is
      const focus = sScroll + vh * 0.55;
      let i = 0;
      while (i < bands.length - 1 && bands[i + 1].top <= focus) i++;
      const cur = bands[i];
      let eff = cur ? weatherOf(cur.w) : PARSED_DEFAULT;
      const nxt = bands[i + 1];
      if (cur && nxt) {
        const zone = Math.min(vh * 0.5, Math.max(140, cur.height * 0.2));
        const t = clamp((focus - (nxt.top - zone)) / (zone * 2));
        if (t > 0) eff = blend(eff, weatherOf(nxt.w), smooth(t));
      }

      // per-scene progress for in-scene choreography (--p)
      for (
        let k = Math.max(0, i - 1);
        k <= Math.min(bands.length - 1, i + 2);
        k++
      ) {
        const b = bands[k];
        const p = clamp((sScroll + vh - b.top) / (b.height + vh));
        b.el.style.setProperty("--p", p.toFixed(3));
      }

      const [stars, glow, glowX, heat, wind, dust, tree, treeX, treeNear, grove, dim, bleach] =
        eff.nums;

      // the recycling desert: bleach washes the palette out
      const wash = bleach * 0.7;
      const skyA = wash > 0 ? mixRGB(eff.sky[0], PALLOR, wash) : eff.sky[0];
      const skyB = wash > 0 ? mixRGB(eff.sky[1], PALLOR, wash) : eff.sky[1];
      const skyC = wash > 0 ? mixRGB(eff.sky[2], PALLOR, wash) : eff.sky[2];

      // dawn: monotonic — mornings do not rewind
      if (focus > dawnStart && dawnStart < Infinity) {
        const span = Math.max(1, docEnd - dawnStart - vh * 0.5);
        const p = clamp((focus - dawnStart) / span);
        const cap = 0.62 + 0.38 * Math.pow(lived, 0.6);
        dawnMax = Math.max(dawnMax, smooth(p) * cap);
      }
      // paper lightens first; the ink commits late and fast, so the text
      // lands on ground that can already hold it
      const dawnBg = smooth(clamp(dawnMax * 1.25));
      const dawnInk = smooth(clamp((dawnMax - 0.3) / 0.25));

      // write the desert
      setVar(stage, "--sky-a", css(skyA));
      setVar(stage, "--sky-b", css(skyB));
      setVar(stage, "--sky-c", css(skyC));
      setVar(stage, "--glow-c", css(eff.glowColor));
      setVar(stage, "--glow", (glow * (0.92 + 0.08 * breath)).toFixed(3));
      setVar(stage, "--glow-x", `${(glowX * 100).toFixed(1)}%`);
      setVar(stage, "--gp", (1 + 0.03 * breath * (0.5 + lived)).toFixed(4));
      setVar(stage, "--stars", (stars * (0.7 + 0.3 * lived)).toFixed(3));
      setVar(stage, "--deep", (0.25 + 0.75 * lived).toFixed(3));
      setVar(stage, "--sy", `${(-journey * 46).toFixed(1)}px`);
      setVar(stage, "--heat", Math.min(1, heat * (1 - 0.6 * still)).toFixed(3));
      setVar(stage, "--tree", tree.toFixed(3));
      setVar(stage, "--tree-x", `${(treeX * 100).toFixed(1)}%`);
      setVar(stage, "--tree-s", (0.16 + treeNear * 2).toFixed(3));
      setVar(stage, "--grove", grove.toFixed(3));
      setVar(stage, "--dim", dim.toFixed(3));
      setVar(stage, "--grain", (0.035 + lived * 0.075).toFixed(3));
      setVar(stage, "--vig", (0.3 + lived * 0.22).toFixed(3));

      // the desert breathes; more visibly the longer you live in it
      const b = breath * (1.5 + lived * 3.5);
      setVar(stage, "--b1", `${(b * 0.5).toFixed(2)}px`);
      setVar(stage, "--b2", `${b.toFixed(2)}px`);
      setVar(stage, "--b3", `${(b * 1.7).toFixed(2)}px`);
      setVar(stage, "--dx1", `${(-journey * 30).toFixed(1)}px`);
      setVar(stage, "--dx2", `${(-journey * 60).toFixed(1)}px`);
      setVar(stage, "--dx3", `${(-journey * 95).toFixed(1)}px`);

      // chrome recedes for good after the first minutes: the page stops
      // explaining itself
      const livedMin = (now - t0) / 60000;
      setVar(root, "--chrome", (1 - clamp((livedMin - 3.5) / 1.5)).toFixed(3));
      setVar(root, "--journey", journey.toFixed(4));
      setVar(root, "--dawn", dawnMax.toFixed(4));
      setVar(root, "--dawn-bg", dawnBg.toFixed(4));
      setVar(root, "--dawn-ink", dawnInk.toFixed(4));

      // sand: wind quiets when you stand still
      if (ctx) {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const windv = (0.25 + wind) * (1 - 0.55 * still);
        const fade = 1 - dawnMax * 0.85;
        const dark = dawnMax > 0.5;
        ctx.fillStyle = dark ? "#131210" : "#ddd9cd";
        for (const p of particles) {
          p.ph += dt * (0.5 + p.v * 0.5);
          p.x -= dt * windv * (14 + p.v * 46);
          p.y += Math.sin(p.ph) * dt * 9 - dt * 2;
          if (p.x < -4) {
            p.x = W + 4;
            p.y = Math.random() * H;
          }
          if (p.y < -4) p.y = H + 4;
          else if (p.y > H + 4) p.y = -4;
          const a = p.a * dust * fade;
          if (a < 0.005) continue;
          ctx.globalAlpha = a;
          ctx.fillRect(p.x, p.y, p.s, p.s);
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={stageRef} className={styles.stage} aria-hidden="true">
        <div className={styles.sky} />
        <div className={styles.stars} />
        <div className={styles.stars2} />
        <div className={styles.glow} />
        <Tree className={styles.grove1} />
        <Tree className={styles.grove2} />
        <Tree className={styles.treeLayer} />
        <svg
          className={styles.dunes}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className={styles.d0}
            d="M0,140 C160,132 280,108 420,112 C480,113 540,130 620,134 C760,140 860,112 980,110 C1080,108 1160,126 1260,130 C1330,133 1390,126 1440,122 L1440,320 L0,320 Z"
          />
          <path
            className={styles.d1}
            d="M0,176 C120,172 220,138 340,140 C400,141 440,164 520,170 C640,180 720,142 840,138 C920,136 970,158 1060,166 C1180,176 1300,150 1440,158 L1440,320 L0,320 Z"
          />
          <path
            className={styles.d2}
            d="M0,222 C150,214 260,186 380,190 C460,193 520,214 620,220 C760,228 850,196 980,194 C1090,193 1180,214 1290,220 C1350,223 1400,218 1440,214 L1440,320 L0,320 Z"
          />
          <path
            className={styles.d3}
            d="M0,268 C180,258 320,238 480,242 C620,246 720,264 880,266 C1040,268 1160,250 1300,252 C1360,253 1410,258 1440,256 L1440,320 L0,320 Z"
          />
        </svg>
        <canvas ref={canvasRef} className={styles.sand} />
        <div className={styles.heat} />
        <div className={styles.dimmer} />
        <div className={styles.grain} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.thread} aria-hidden="true">
        <i />
      </div>

      <main className={styles.column}>
        <section data-scene data-w="void" className={styles.intro}>
          <div data-prose className={styles.introInner}>
            <span className={styles.introEyebrow}>a desert story</span>
            <h1 className={styles.introTitle}>The Sacred Potato</h1>
            <p className={styles.introBy}>Ahiya Butman</p>
            <p className={styles.introMeta}>
              four parts · walked in about an hour
            </p>
          </div>
          <div className={styles.cue}>walk</div>
        </section>

        <PartOne />
        <PartTwo />
        <PartThree />
        <PartFour />

        <section data-scene data-w="dawn" className={styles.coda}>
          <div data-prose>
            <p className={styles.codaQuote}>
              &ldquo;Sometimes consciousness is a potato taking itself too
              seriously, forgetting it is earth experiencing the cosmic joke of
              its own existence.&rdquo;
            </p>
            <p className={styles.codaBy}>The Sacred Potato</p>
            <p>
              <Link href="/" className={styles.codaHome}>
                &larr; ahiya.dev
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

// A lone acacia: layered flat crown, a trunk that forks into four tapering
// limbs reaching up inside it. Drawn once, reused for the grove.
function Tree({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12,80 C20,52 56,36 94,38 C106,26 152,24 170,36 C202,34 226,50 232,74 C226,92 202,102 174,98 C158,106 118,108 98,102 C64,106 26,98 12,80 Z"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path strokeWidth="10" d="M121,238 C120,202 118,172 114,144" />
        <path strokeWidth="5.5" d="M114,144 C98,122 78,108 58,96" />
        <path strokeWidth="4.5" d="M114,144 C110,118 104,102 94,88" />
        <path strokeWidth="4.5" d="M116,144 C124,118 130,102 140,86" />
        <path strokeWidth="5.5" d="M116,144 C132,122 154,106 178,96" />
        <path strokeWidth="3" d="M58,96 C50,90 44,86 38,84" />
        <path strokeWidth="3" d="M178,96 C188,90 196,86 204,86" />
      </g>
    </svg>
  );
}
