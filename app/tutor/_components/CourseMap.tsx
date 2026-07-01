"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useProgress, type Confidence } from "../_lib/useProgress";

export interface MapUnit {
  id: string;
  kind: "lecture" | "tutorial";
  number: number;
  title: string;
  topics: string[];
}

const DOT: Record<Confidence, string> = {
  good: "var(--color-sky-deep)",
  shaky: "#c8894b",
  unknown: "var(--color-rule)",
};
const LABEL: Record<Confidence, string> = {
  good: "שולט/ת",
  shaky: "לחיזוק",
  unknown: "טרם",
};

function Section({
  title,
  units,
  base,
  conf,
}: {
  title: string;
  units: MapUnit[];
  base: string;
  conf: (id: string) => Confidence;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-sm uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-muted)" }}>
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {units.map((u) => {
          const c = conf(u.id);
          return (
            <Link
              key={u.id}
              href={`${base}/map/${u.id}`}
              className="group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
              style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}
            >
              <span
                title={LABEL[c]}
                className="shrink-0 h-2.5 w-2.5 rounded-full"
                style={{ background: DOT[c] }}
              />
              <span className="shrink-0 text-xs w-9" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                {u.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate" style={{ color: "var(--color-ink)" }}>{u.title}</span>
                {u.topics.length > 0 && (
                  <span className="block truncate text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {u.topics.slice(0, 5).join(" · ")}
                  </span>
                )}
              </span>
              <ChevronLeft size={18} className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-sky-deep)" }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function CourseMap({ courseId, units }: { courseId: string; units: MapUnit[] }) {
  const { progress } = useProgress(courseId);
  const base = `/tutor/${courseId}`;
  const conf = (id: string): Confidence => progress.units[id] ?? "unknown";

  const lectures = units.filter((u) => u.kind === "lecture").sort((a, b) => a.number - b.number);
  const tutorials = units.filter((u) => u.kind === "tutorial").sort((a, b) => a.number - b.number);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>מפת הקורס</p>
      <h1 className="mt-1 mb-6 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
        כל החומר במקום אחד
      </h1>
      <Section title="הרצאות" units={lectures} base={base} conf={conf} />
      <Section title="תרגולים" units={tutorials} base={base} conf={conf} />
    </div>
  );
}
