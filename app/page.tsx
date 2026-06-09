import { SelectedWork } from "./components/SelectedWork";

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

        <SelectedWork />
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
