"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HITVisual,
  SelahOSVisual,
  StatVizVisual,
  TwoLVisual,
} from "./ProjectVisuals";

type Project = {
  name: string;
  meta: string;
  body: string;
  stack?: string;
  href?: string;
  hrefLabel?: string;
  Visual?: React.ComponentType<{ quiet?: boolean }>;
};

const projects: Project[] = [
  {
    name: "StatViz",
    meta: "Founder & Lead Engineer · 2025–present",
    body: "AI-augmented statistical analysis for academic institutions in Israel. End-to-end ownership: client intake, data processing, automated report generation, and customer-facing delivery. Real clients, real reports, paid work.",
    stack: "Next.js · TypeScript · PostgreSQL / Prisma · Claude agent pipeline · Python · pandas / SciPy",
    href: "https://stat-viz.com",
    hrefLabel: "stat-viz.com",
    Visual: StatVizVisual,
  },
  {
    name: "HIT · AI Persona Research",
    meta: "Consulting · 2025",
    body: "A Hebrew NLP pipeline for an academic study of youth sport dropout in Israel, built at Holon Institute of Technology. Synthetic personas, each defined by demographic factors (age, ethnicity, region, sport, training schedule, dropout reason), generate first-person Hebrew testimonials at scale, feeding a quantitative analysis of why Israeli teenagers leave organized sport. Built end to end: prompt engineering, generation, and output formatting for the research team's downstream pipeline.",
    stack: "Python · Hebrew NLP · LLM APIs · persona design",
    Visual: HITVisual,
  },
  {
    name: "2L",
    meta: "Personal project · ongoing",
    body: "A two-level agent orchestration system that breaks a vision into iterations and runs each through a pipeline of specialized agents (explorer, planner, builder, integrator, validator, healer), with a real-time observability dashboard.",
    stack: "Claude Code agents · Bash · Python · JSONL event log · HTML dashboard",
    href: "https://github.com/Ahiya1/2L",
    hrefLabel: "github.com/Ahiya1/2L",
    Visual: TwoLVisual,
  },
  {
    name: "SelahOS",
    meta: "Private · in development",
    body: "A personal instrument panel for the ground layer of life: the daily rhythm of sleep, food, medication, hygiene, movement. No coaching, no streaks, no nudging.",
    Visual: SelahOSVisual,
  },
];

/* Attention as a force: focusing one card quiets the rest. The hovered
   card keeps its life (its spine turns green and breathes on); the others
   recede — opacity eases down, blur softens them, and their restless
   visuals settle to stillness. The thing you attend to clarifies; the
   things you don't come to rest. */
export function SelectedWork() {
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <div
      className="mt-10 space-y-12"
      onMouseLeave={() => setFocused(null)}
    >
      {projects.map((p, i) => (
        <ProjectCard
          key={p.name}
          project={p}
          index={i}
          isFocused={focused === i}
          quiet={focused !== null && focused !== i}
          onFocus={() => setFocused(i)}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  isFocused,
  quiet,
  onFocus,
}: {
  project: Project;
  index: number;
  isFocused: boolean;
  quiet: boolean;
  onFocus: () => void;
}) {
  const Visual = project.Visual;
  const inner = (
    <>
      {Visual && (
        <div className="mb-6 -ml-1">
          <Visual quiet={quiet} />
        </div>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-medium tracking-tight text-[var(--color-ink)] sm:text-[26px]">
          {project.name}
        </h3>
        {project.href && (
          <span className="arrow font-mono text-base text-[var(--color-sky)]">
            ↗
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
        {project.meta}
      </p>
      <p className="mt-4 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
        {project.body}
      </p>
      {project.stack && (
        <p className="mt-4 font-mono text-[13px] text-[var(--color-muted)]">
          {project.stack}
        </p>
      )}
      {project.hrefLabel && (
        <p className="mt-3 font-mono text-[13px]">
          <span className="text-[var(--color-sky-deep)] group-hover:text-[var(--color-ink)] transition-colors duration-300">
            {project.hrefLabel}
          </span>
        </p>
      )}
    </>
  );

  const className = `card group spine block pl-6 ${
    project.href ? "spine-link" : ""
  } ${isFocused ? "is-focused" : ""} ${quiet ? "is-quiet" : ""}`;

  const spineDelay = {
    "--spine-delay": `${index * 1.6}s`,
  } as React.CSSProperties;

  if (project.href) {
    return (
      <Link
        className={className}
        style={spineDelay}
        href={project.href}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={onFocus}
        onFocus={onFocus}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={className}
      style={spineDelay}
      onMouseEnter={onFocus}
      tabIndex={0}
      onFocus={onFocus}
    >
      {inner}
    </div>
  );
}
