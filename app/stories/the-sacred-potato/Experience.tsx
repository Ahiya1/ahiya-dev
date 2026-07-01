"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import styles from "./experience.module.css";

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

/* Each scene reports its own progress (0 → 1) as a CSS var on its root, so the
   desert's light, the tree, and the bloom can all be pure CSS off `--p`.
   Written straight to the DOM node — no React re-render per scroll frame. */
function useSceneProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh;
      const p =
        travel > 0
          ? clamp(-rect.top / travel)
          : rect.top < vh
          ? 1
          : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/* The whole document's progress — feeds the left-margin spine. */
function useDocProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/* One IntersectionObserver surfaces every line as it enters the walk. */
function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.55, rootMargin: "-12% 0px -22% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [scope]);
}

function Scene({
  atmosphere,
  className,
  children,
}: {
  atmosphere: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useSceneProgress(ref);
  return (
    <section ref={ref} className={`${styles.scene} ${className ?? ""}`}>
      <div className={styles.stage}>{atmosphere}</div>
      <div className={styles.flow}>{children}</div>
    </section>
  );
}

/* A flat-topped acacia — the lone tree where nothing should grow. */
function AcaciaTree() {
  return (
    <svg className={styles.tree} viewBox="0 0 400 320" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      >
        <path d="M200 320 C198 250 196 210 196 178" />
        <path d="M196 196 C168 188 150 172 118 166" />
        <path d="M196 182 C226 174 252 160 292 156" />
        <path d="M196 172 C188 152 184 138 182 120" />
        <path d="M196 172 C214 154 226 142 240 128" />
      </g>
      <g fill="currentColor">
        <ellipse cx="168" cy="120" rx="72" ry="26" />
        <ellipse cx="244" cy="124" rx="78" ry="24" />
        <ellipse cx="206" cy="104" rx="62" ry="24" />
      </g>
      <g className="fruit">
        <circle cx="150" cy="138" r="3.4" />
        <circle cx="196" cy="132" r="3.4" />
        <circle cx="238" cy="140" r="3.4" />
        <circle cx="276" cy="134" r="3.4" />
        <circle cx="176" cy="146" r="3" />
        <circle cx="216" cy="148" r="3" />
      </g>
    </svg>
  );
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  useDocProgress(root);
  useReveal(root);

  return (
    <div ref={root} className={styles.root}>
      <div className={styles.backdrop} />
      <div className={styles.grain} />
      <div className={styles.spine} aria-hidden="true">
        <div className={styles.spineFill} />
      </div>

      {/* ── Arrival ─────────────────────────────────────────── pre-dawn ── */}
      <Scene
        atmosphere={
          <>
            <div className={`${styles.layer} ${styles.skyDawn}`} />
            <div className={`${styles.layer} ${styles.stars}`} />
            <div className={styles.cue}>scroll to walk ↓</div>
          </>
        }
      >
        <div className={`${styles.beat} ${styles.tall}`}>
          <p className={styles.kicker} data-reveal>
            A desert story · Part I
          </p>
          <h1 className={styles.title} data-reveal>
            The Sacred Potato
          </h1>
          <p className={styles.byline} data-reveal>
            The Hollow Place — by Ahiya Butman
          </p>
        </div>
        <div className={styles.beat}>
          <p className={`${styles.line} ${styles.sacred}`} data-reveal>
            Before words, the desert.
          </p>
          <p className={`${styles.line} ${styles.sacred}`} data-reveal>
            Before the desert, promises broken.
          </p>
        </div>
      </Scene>

      {/* ── The walk ───────────────────────────────────── sun-bleached ── */}
      <Scene className={styles.seen} atmosphere={
        <>
          <div className={`${styles.layer} ${styles.skyWalk}`} />
          <div className={`${styles.layer} ${styles.horizonLine}`} />
          <div className={`${styles.layer} ${styles.dunes}`} />
          <div className={`${styles.layer} ${styles.shimmer}`} />
        </>
      }>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            Kai moves across sand that remembers nothing. Each footprint claims
            territory for seconds before wind reclaims it.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            Sometimes, in the space between one step and the next, awareness
            watches the body walking. The body continues. Sand yields. Sky
            remains indifferent.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={`${styles.calc}`} data-reveal>
            0.73 liters remaining. At 0.05 liters per hour in current
            conditions, 14.2 hours until the next well.
          </p>
          <p className={styles.line} data-reveal style={{ marginTop: "1.6em" }}>
            These calculations rise to the surface of thought without effort —
            the engineer&rsquo;s reflexes persisting despite his attempts to
            escape them.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            <span className={styles.said}>&ldquo;Three days left,&rdquo;</span>{" "}
            he says, startling himself with the sound. The words scatter into
            empty air, leaving no trace.
          </p>
        </div>
      </Scene>

      {/* ── Neel ───────────────────────────────────────────── felt dark ── */}
      <Scene className={styles.felt} atmosphere={
        <div className={`${styles.layer} ${styles.skyFelt}`} />
      }>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            <span className={styles.said}>
              &ldquo;You&rsquo;re running away again,&rdquo;
            </span>{" "}
            Neel had said, the night before Kai left for the desert the first
            time.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            <span className={styles.said}>
              &ldquo;Maybe I&rsquo;m not looking for anything.&rdquo;
            </span>
          </p>
          <p className={styles.line} data-reveal>
            <span className={styles.said}>
              &ldquo;That would be a first.&rdquo;
            </span>
          </p>
        </div>
        <div className={`${styles.beat} ${styles.tight}`}>
          <p className={styles.line} data-reveal>
            The familiar ache of regret settled between his shoulder blades —
            heavier than the pack, heavier than thirst.
          </p>
        </div>
      </Scene>

      {/* ── The tree ──────────────────────────────── the hour of change ── */}
      <Scene className={styles.seen} atmosphere={
        <>
          <div className={`${styles.layer} ${styles.skyTree}`} />
          <AcaciaTree />
        </>
      }>
        <div className={`${styles.beat} ${styles.tall}`}>
          <p className={styles.line} data-reveal>
            The tree appears in the hour when light begins to change but shadows
            have not yet lengthened. It stands alone, impossible and certain.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            A single tree where nothing should grow, its branches heavy with
            fruit unlike any Kai has seen before.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            Beneath it sits a woman, her fingers moving over a small stringed
            instrument — three notes repeating, then a fourth that changes the
            meaning of the others.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            <span className={styles.said}>
              &ldquo;Trees grow where they&rsquo;re needed.&rdquo;
            </span>
          </p>
          <p className={styles.line} data-reveal style={{ marginTop: "2em" }}>
            <span className={styles.said}>&ldquo;I&rsquo;m Senna.&rdquo;</span>
          </p>
        </div>
      </Scene>

      {/* ── The first bite ───────────────────── bloom, then the hollow ── */}
      <Scene className={styles.felt} atmosphere={
        <>
          <div className={`${styles.layer} ${styles.skyTree}`} />
          <div className={`${styles.layer} ${styles.bloom}`} />
          <div className={`${styles.layer} ${styles.hollow}`} />
        </>
      }>
        <div className={`${styles.beat} ${styles.tight}`}>
          <p className={styles.line} data-reveal>
            <span className={styles.said}>&ldquo;Try one,&rdquo;</span> she says.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            The first bite stops his breath. Something uncurls in his chest — a
            warmth spreading through numb fingers, into arms that had forgotten
            sensation.
          </p>
        </div>
        <div className={`${styles.beat} ${styles.tight}`}>
          <p className={`${styles.line} ${styles.sacred}`} data-reveal>
            For three heartbeats, the silence between his thoughts stretches into
            actual quiet.
          </p>
        </div>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            Then it vanishes, leaving an absence more noticeable than before.
          </p>
        </div>
      </Scene>

      {/* ── The parting ───────────────────────────── the hook westward ── */}
      <Scene className={styles.felt} atmosphere={
        <div className={`${styles.layer} ${styles.skyFelt}`} />
      }>
        <div className={styles.beat}>
          <p className={styles.line} data-reveal>
            They travel together for eleven days, their paths converging without
            explanation. She kisses him once, lightly, then turns away.
          </p>
        </div>
        <div className={`${styles.beat} ${styles.tight}`}>
          <p className={`${styles.line} ${styles.sacred}`} data-reveal>
            West, the whisper comes, almost too faint to hear.
          </p>
          <p className={styles.line} data-reveal style={{ marginTop: "1.4em" }}>
            Not purpose — only momentum.
          </p>
        </div>
        <div className={`${styles.beat} ${styles.tight}`}>
          <p className={`${styles.line} ${styles.sacred}`} data-reveal>
            The space beneath his ribs aches with emptiness.
          </p>
        </div>
      </Scene>

      {/* ── Close ─────────────────────────────────────── handoff to II ── */}
      <div className={styles.close}>
        <p className={styles.closeKicker}>End of Part I</p>
        <p className={styles.closeNext}>Part II — The Seeking</p>
        <p className={styles.closeSub}>
          The rumors prove true. In the western reaches, a grove of seven trees.
        </p>
        <Link href="/" className={styles.back}>
          ← back to ahiya.dev
        </Link>
      </div>
    </div>
  );
}
