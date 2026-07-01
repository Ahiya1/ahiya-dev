"use client";

import { useCallback, useEffect, useState } from "react";

// Per-course study progress, persisted in localStorage. No accounts needed for
// the single-student use; a real account layer can replace this later.

export type Confidence = "unknown" | "shaky" | "good";

export interface PracticeResult {
  score: number; // 0-100
  attempts: number;
  lastAt: number;
}

export interface MockResult {
  examId: string;
  score: number;
  total: number;
  at: number;
}

export interface Progress {
  examDate?: string; // ISO date
  units: Record<string, Confidence>; // unitId -> confidence
  practice: Record<string, PracticeResult>; // questionId -> result
  mocks: MockResult[];
}

const EMPTY: Progress = { units: {}, practice: {}, mocks: [] };

function keyFor(courseId: string) {
  return `tutor:${courseId}:progress`;
}

export function useProgress(courseId: string) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(courseId));
      if (raw) setProgress({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [courseId]);

  const persist = useCallback(
    (next: Progress) => {
      setProgress(next);
      try {
        localStorage.setItem(keyFor(courseId), JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [courseId],
  );

  const setExamDate = useCallback(
    (date: string | undefined) => persist({ ...progress, examDate: date }),
    [progress, persist],
  );

  const setUnitConfidence = useCallback(
    (unitId: string, c: Confidence) =>
      persist({ ...progress, units: { ...progress.units, [unitId]: c } }),
    [progress, persist],
  );

  const recordPractice = useCallback(
    (questionId: string, score: number) => {
      const prev = progress.practice[questionId];
      persist({
        ...progress,
        practice: {
          ...progress.practice,
          [questionId]: {
            score,
            attempts: (prev?.attempts ?? 0) + 1,
            lastAt: Date.now(),
          },
        },
      });
    },
    [progress, persist],
  );

  const recordMock = useCallback(
    (examId: string, score: number, total: number) =>
      persist({
        ...progress,
        mocks: [...progress.mocks, { examId, score, total, at: Date.now() }],
      }),
    [progress, persist],
  );

  const reset = useCallback(() => persist(EMPTY), [persist]);

  return {
    progress,
    loaded,
    setExamDate,
    setUnitConfidence,
    recordPractice,
    recordMock,
    reset,
  };
}

/** Days until the exam date (null if unset). */
export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const now = new Date();
  const then = new Date(iso + "T00:00:00");
  const ms = then.getTime() - new Date(now.toDateString()).getTime();
  return Math.round(ms / 86_400_000);
}
