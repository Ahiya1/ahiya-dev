"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./walk.module.css";

/* One IntersectionObserver surfaces each paragraph from the haze as the walk
   brings it into view — gently, continuously. No scenes, no holds. */
function useSurface(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -18% 0px" }
    );
    root.querySelectorAll<HTMLElement>("[data-surface]").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [scope]);
}

export default function Walk() {
  const root = useRef<HTMLDivElement>(null);
  useSurface(root);

  return (
    <div ref={root} className={styles.root}>
      {/* the one continuous world — fixed, always walking */}
      <div className={styles.world} aria-hidden="true">
        <div className={styles.air} />
        <div className={styles.ground} />
        <div className={styles.sand} />
        <div className={styles.motes} />
        <div className={styles.vignette} />
      </div>
      <div className={styles.grain} aria-hidden="true" />

      <article className={styles.column}>
        <p className={`${styles.p} ${styles.sacred}`} data-surface>
          Before words, the desert.
        </p>

        <p className={styles.p} data-surface>
          Kai moves across sand that remembers nothing. Each footprint claims
          territory for seconds before wind reclaims it.
        </p>

        <p className={styles.p} data-surface>
          Sometimes, in the space between one step and the next, awareness
          watches the body walking. The body continues. Sand yields. Sky remains
          indifferent.
        </p>

        <div className={styles.smoke} data-surface aria-hidden="true">
          <span>0.73 liters remaining</span>
          <span>0.05 liters per hour</span>
          <span>14.2 hours to the next well</span>
        </div>

        <p className={styles.p} data-surface>
          The calculations rise without effort — the engineer&rsquo;s reflexes,
          persisting despite him. His mouth will become dust. His lips will split
          at the corners. This is mathematics, not sensation.
        </p>

        <p className={styles.p} data-surface>
          He is thirsty, but the flow moves through him. Tired, but not
          defeated. Hungry, but not desperate.
        </p>

        <p className={styles.p} data-surface>
          <span className={styles.said}>&ldquo;Three days left,&rdquo;</span> he
          says, startling himself with the sound. The words scatter into empty
          air, leaving no trace.
        </p>

        <p className={styles.p} data-surface>
          Around him, the desert stretches in every direction. He expects
          nothing today. He expects nothing at all.
        </p>

        <p className={`${styles.p} ${styles.sacred}`} data-surface>
          And the legs simply move forward.
        </p>
      </article>

      <div className={styles.tail}>
        <p className={styles.tailNote}>the walk continues</p>
        <Link href="/" className={styles.back}>
          ← back
        </Link>
      </div>
    </div>
  );
}
