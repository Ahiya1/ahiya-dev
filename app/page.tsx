import { SelectedWork } from "./components/SelectedWork";

/* Quiet glyphs for the "What I can do for you" section: small
   diagrams in the same mono line-language as the project visuals.
   They breathe on the same slow cycle as the spines and horizons,
   staggered so they never inhale in unison. */

function ShipGlyph() {
  return (
    <svg
      viewBox="0 0 64 24"
      width={92}
      height={34}
      aria-hidden
      className="shrink-0 glyph-breathe"
    >
      <line x1={9} x2={23} y1={12} y2={12} stroke="var(--color-muted)" strokeWidth={1} />
      <line x1={29} x2={42} y1={12} y2={12} stroke="var(--color-muted)" strokeWidth={1} />
      <circle cx={6} cy={12} r={3} fill="none" stroke="var(--color-muted)" strokeWidth={1} />
      <circle cx={26} cy={12} r={3} fill="none" stroke="var(--color-muted)" strokeWidth={1} />
      <rect x={45} y={9} width={6} height={6} fill="var(--color-sky-deep)" opacity={0.85} />
    </svg>
  );
}

function AutomationGlyph() {
  return (
    <svg
      viewBox="0 0 64 24"
      width={92}
      height={34}
      aria-hidden
      className="shrink-0 glyph-breathe"
      style={{ animationDelay: "2.2s" }}
    >
      <line x1={4} x2={18} y1={6} y2={9} stroke="var(--color-muted)" strokeWidth={1} />
      <line x1={4} x2={18} y1={12} y2={12} stroke="var(--color-muted)" strokeWidth={1} />
      <line x1={4} x2={18} y1={18} y2={15} stroke="var(--color-muted)" strokeWidth={1} />
      <rect x={22} y={6} width={18} height={12} fill="none" stroke="var(--color-muted)" strokeWidth={1} rx={1} />
      <line x1={40} x2={56} y1={12} y2={12} stroke="var(--color-sky-deep)" strokeWidth={1} opacity={0.85} />
      <path d="M 53 9.5 L 56.5 12 L 53 14.5" fill="none" stroke="var(--color-sky-deep)" strokeWidth={1} opacity={0.85} />
    </svg>
  );
}

function ResearchGlyph() {
  return (
    <svg
      viewBox="0 0 64 24"
      width={92}
      height={34}
      aria-hidden
      className="shrink-0 glyph-breathe"
      style={{ animationDelay: "4.4s" }}
    >
      <line x1={4} x2={60} y1={20} y2={20} stroke="var(--color-muted)" strokeWidth={1} opacity={0.7} />
      <path
        d="M 6 20 C 20 20 24 5 32 5 C 40 5 44 20 58 20"
        fill="none"
        stroke="var(--color-muted)"
        strokeWidth={1}
      />
      <line x1={32} x2={32} y1={5} y2={20} stroke="var(--color-sky-deep)" strokeWidth={1} opacity={0.7} strokeDasharray="2 2" />
    </svg>
  );
}

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
          Clearest at the{" "}
          <span className="seam">seam</span>{" "}
          between the work and the people it&rsquo;s for.
        </p>
        <p className="lift lift-4 mt-5 text-[17px] leading-[1.6] text-[var(--color-ink)] sm:text-lg">
          In plain terms: I build production AI systems for research, analysis,
          and automation, and I ship them end to end, from intake to delivery.
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
              Python · TypeScript · Next.js / React · FastAPI · PostgreSQL ·
              Docker · Claude and OpenAI APIs
            </span>
            .
          </p>
        </div>

        <div className="lift lift-6 mt-11 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a className="btn" href="mailto:ahiya.butman@gmail.com">
            Email me
          </a>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Open to full-time &amp; contract work
          </span>
        </div>
      </section>

      <div className="horizon my-24" />

      {/* Selected work */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Selected work
        </h2>

        <SelectedWork />
      </section>

      <div className="horizon my-24" />

      {/* What I can do for you */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          What I can do for you
        </h2>
        <ul className="mt-10 space-y-9">
          <li className="spine pl-8" style={{ "--spine-delay": "0.8s" } as React.CSSProperties}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-xl font-medium tracking-tight text-[var(--color-ink)]">
                AI systems that ship
              </h3>
              <ShipGlyph />
            </div>
            <p className="mt-2 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
              Agent pipelines, LLM workflows, and the evaluation and plumbing
              that keep them reliable once real users depend on them.
            </p>
          </li>
          <li className="spine pl-8" style={{ "--spine-delay": "2.4s" } as React.CSSProperties}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-xl font-medium tracking-tight text-[var(--color-ink)]">
                Internal tools &amp; automation
              </h3>
              <AutomationGlyph />
            </div>
            <p className="mt-2 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
              Intake, processing, reporting, delivery: the systems that turn a
              manual service into a product. StatViz is this, running as a
              business.
            </p>
          </li>
          <li className="spine pl-8" style={{ "--spine-delay": "4s" } as React.CSSProperties}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-xl font-medium tracking-tight text-[var(--color-ink)]">
                Research engineering
              </h3>
              <ResearchGlyph />
            </div>
            <p className="mt-2 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
              Data pipelines, statistical analysis, Hebrew NLP. Work that has
              to be defensible, not just plausible.
            </p>
          </li>
        </ul>
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
        <p className="mt-4 text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)] sm:text-base">
          Open to full-time roles and contract work in applied AI, AI tooling,
          automation, backend, and research engineering. Email is fastest.
        </p>
        <div className="mt-7">
          <a className="btn" href="mailto:ahiya.butman@gmail.com">
            Email me
          </a>
        </div>
        <ul className="mt-7 space-y-3 text-[15.5px] text-[var(--color-ink-soft)] sm:text-base">
          <li>
            <a className="link" href="mailto:ahiya.butman@gmail.com">
              ahiya.butman@gmail.com
            </a>
          </li>
          <li>
            <a className="link" href="tel:+972587789019">
              058-778-9019
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
