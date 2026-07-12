import React from "react";
import styles from "./story.module.css";

// The grammar all four parts are written in.
//
// mode "seen"  — the walk: light on the horizon, prose in flow.
// mode "felt"  — interiors: the stage falls dark, words centred, italic.
// pace "slow"  — thresholds: each line gets its own stretch of desert.

export function Scene({
  w,
  mode = "seen",
  pace = "read",
  children,
}: {
  w: string;
  mode?: "seen" | "felt";
  pace?: "read" | "slow";
  children: React.ReactNode;
}) {
  const cls = [
    styles.scene,
    mode === "felt" ? styles.felt : styles.seen,
    pace === "slow" ? styles.slow : styles.read,
  ].join(" ");
  return (
    <section data-scene data-w={w} className={cls}>
      <div data-prose className={styles.prose}>
        {children}
      </div>
    </section>
  );
}

export function Threshold({
  n,
  title,
  w,
}: {
  n: string;
  title: string;
  w: string;
}) {
  return (
    <section data-scene data-w={w} className={`${styles.scene} ${styles.threshold}`}>
      <div data-prose className={styles.thresholdInner}>
        <span className={styles.thresholdN}>{n}</span>
        <h2 className={styles.thresholdTitle}>{title}</h2>
      </div>
    </section>
  );
}

// Lines the source marks as sacred-text.
export function Sacred({ children }: { children: React.ReactNode }) {
  return <p className={styles.sacred}>{children}</p>;
}

// One-line strikes: a single short sentence given the whole breath.
export function Beat({ children }: { children: React.ReactNode }) {
  return <p className={styles.beat}>{children}</p>;
}

// The design law's second half: image loud, explanation a whisper
// downstream. Thesis lines survive at lower volume.
export function Whisper({ children }: { children: React.ReactNode }) {
  return <p className={styles.whisper}>{children}</p>;
}

// Letters and plans: paper held close in the dark.
export function Letter({ children }: { children: React.ReactNode }) {
  return <div className={styles.letter}>{children}</div>;
}
