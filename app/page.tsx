import Link from "next/link";

type Project = {
  name: string;
  meta: string;
  body: string;
  stack?: string;
  href?: string;
  hrefLabel?: string;
  privateTag?: boolean;
};

const projects: Project[] = [
  {
    name: "StatViz",
    meta: "Founder & Lead Engineer · 2025–present",
    body: "AI-augmented statistical analysis for academic institutions in Israel. End-to-end ownership: client intake, data processing, automated report generation, and customer-facing delivery. Real clients including Herzog College.",
    stack: "Python · FastAPI · OpenAI / Anthropic · pandas · MongoDB",
    href: "https://stat-viz.com",
    hrefLabel: "stat-viz.com",
  },
  {
    name: "HIT — AI Persona Research",
    meta: "Consulting · 2025",
    body: "A Hebrew NLP pipeline for an academic study of youth sport dropout in Israel, built at Holon Institute of Technology. Synthetic personas — each defined by demographic factors (age, ethnicity, region, sport, training schedule, dropout reason) — generate first-person Hebrew testimonials at scale, feeding a quantitative analysis of why Israeli teenagers leave organized sport. Built end-to-end: prompt engineering, generation, and output formatting for the research team's downstream pipeline.",
    stack: "Python · Hebrew NLP · LLM APIs · persona design",
  },
  {
    name: "2L",
    meta: "Personal project · ongoing",
    body: "A multi-agent orchestration system for AI workflow experimentation. Infrastructure for coordinating multiple LLM-based agents in semi-autonomous workflows — prompt infrastructure, execution pipelines, and practical patterns for AI–human collaboration.",
    stack: "TypeScript · LLM APIs · multi-agent coordination",
    href: "https://github.com/Ahiya1/2L",
    hrefLabel: "github.com/Ahiya1/2L",
  },
  {
    name: "SelahOS",
    meta: "Private · in development",
    body: "A ground-first regulation system. Quiet, not yet public.",
    privateTag: true,
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
        <h1 className="lift lift-2 mt-6 font-display text-5xl font-light leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-6xl">
          Ahiya Butman
        </h1>
        <p className="lift lift-3 mt-4 font-display text-xl italic text-[var(--color-ink-soft)] sm:text-2xl">
          AI Engineer &amp; Independent Builder
        </p>

        <div className="lift lift-4 mt-10 space-y-5 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
          <p>
            I&rsquo;m an independent builder shipping practical AI tools and
            full-stack systems out of Israel.
          </p>
          <p>
            Day-to-day:{" "}
            <span className="font-mono text-[13.5px] text-[var(--color-ink)]">
              Python · FastAPI · React · Docker · MongoDB · Supabase · OpenAI
              and Anthropic APIs
            </span>
            . Comfortable in ambiguous problem spaces, and clear at the seam
            between technical work and the people it&rsquo;s for.
          </p>
          <p>
            Background:{" "}
            <span className="text-[var(--color-ink)]">
              BSc in Computer Science
            </span>{" "}
            (Open University of Israel, AI focus), and{" "}
            <span className="text-[var(--color-ink)]">Software Engineer</span>{" "}
            in Unit 8200.
          </p>
          <p>
            Currently open to part-time and contract work in applied AI, AI
            tooling, automation, backend, or research engineering.
          </p>
        </div>
      </section>

      <div className="horizon lift lift-5 my-20" />

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

      <div className="horizon my-20" />

      {/* Contact */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Contact
        </h2>
        <ul className="mt-6 space-y-3 text-[15.5px] text-[var(--color-ink-soft)] sm:text-base">
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
  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-medium tracking-tight text-[var(--color-ink)] sm:text-[26px]">
          {project.name}
        </h3>
        {project.href && (
          <span className="arrow font-mono text-base text-[var(--color-sky)]">
            ↗
          </span>
        )}
        {project.privateTag && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-sky)] border border-[var(--color-sky)] rounded-full px-2.5 py-1 whitespace-nowrap">
            Private
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

  const className = `card group block border-l-2 border-[var(--color-rule)] pl-6 transition-colors duration-300 ${
    project.href ? "hover:border-[var(--color-sky)]" : ""
  }`;

  if (project.href) {
    return (
      <Link
        className={className}
        href={project.href}
        target="_blank"
        rel="noreferrer"
      >
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
