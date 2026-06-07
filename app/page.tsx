import Link from "next/link";
import {
  HITVisual,
  SelahOSVisual,
  StatVizVisual,
  TwoLVisual,
} from "./components/ProjectVisuals";

type Project = {
  name: string;
  meta: string;
  body: string;
  stack?: string;
  href?: string;
  hrefLabel?: string;
  Visual?: React.ComponentType;
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

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
      {/* Hero */}
      <section>
        <p className="lift lift-1 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          ahiya.dev
        </p>
        <h1 className="lift lift-2 mt-6 font-display text-5xl font-normal leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-6xl">
          Ahiya Butman
        </h1>
        <p className="lift lift-3 mt-7 font-display text-[27px] font-light italic leading-[1.3] text-[var(--color-ink)] sm:text-[31px]">
          Clearest at the seam between the work and the people it&rsquo;s for.
        </p>
        <p className="lift lift-4 mt-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          AI Engineer · Founder · Independent Builder
        </p>

        <div className="lift lift-5 mt-12 space-y-5 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
          <p>
            I founded <span className="text-[var(--color-ink)]">StatViz</span>,
            an AI-augmented analysis platform serving academic institutions in
            Israel, Herzog College among them.
          </p>
          <p>
            Before StatViz,{" "}
            <span className="text-[var(--color-ink)]">
              software engineer in Unit 8200
            </span>
            , and a BSc in Computer Science, AI focus, from the Open University
            of Israel.
          </p>
          <p>
            Day to day:{" "}
            <span className="font-mono text-[13.5px] text-[var(--color-ink)]">
              Python · FastAPI · React · Docker · Supabase · OpenAI and
              Anthropic APIs
            </span>
            .
          </p>
          <p className="pt-4">
            Open to full-time roles and contract work: applied AI, AI tooling,
            automation, backend, or research engineering.
          </p>
        </div>
      </section>

      <div className="horizon my-24" />

      {/* Selected work */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Selected work
        </h2>

        <div className="mt-10 space-y-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </section>

      <div className="horizon my-24" />

      {/* Contact */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Contact
        </h2>
        <p className="mt-6 font-display text-[19px] italic leading-[1.4] text-[var(--color-ink)] sm:text-xl">
          If the work is unclear but important, write.
        </p>
        <ul className="mt-7 space-y-3 text-[15.5px] text-[var(--color-ink-soft)] sm:text-base">
          <li>
            <a className="link" href="mailto:ahiya.butman@gmail.com">
              ahiya.butman@gmail.com
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://www.linkedin.com/in/ahiya-butman-59b660165/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              className="link"
              href="https://github.com/Ahiya1"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </section>

      <footer className="mt-28 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
        Haifa · Israel
      </footer>
    </main>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const Visual = project.Visual;
  const inner = (
    <>
      {Visual && (
        <div className="mb-6 -ml-1">
          <Visual />
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

  const className = `card group spine block pl-6 transition-colors duration-300 ${
    project.href ? "spine-link" : ""
  }`;

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
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={className} style={spineDelay}>
      {inner}
    </div>
  );
}
