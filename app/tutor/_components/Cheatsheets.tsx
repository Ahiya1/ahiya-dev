"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CheatSection } from "../_lib/content";

export default function Cheatsheets({ sections }: { sections: CheatSection[] }) {
  const [cat, setCat] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(sections.map((s) => s.category)))],
    [sections],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections
      .filter((s) => cat === "all" || s.category === cat)
      .map((s) => {
        if (!q) return s;
        const items = s.items.filter(
          (it) =>
            it.label_he.toLowerCase().includes(q) ||
            it.detail_he.toLowerCase().includes(q) ||
            (it.code ?? "").toLowerCase().includes(q) ||
            s.title_he.toLowerCase().includes(q) ||
            (s.title_en ?? "").toLowerCase().includes(q),
        );
        return { ...s, items };
      })
      .filter((s) => s.items.length > 0);
  }, [sections, cat, query]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>דפי עזר</p>
      <h1 className="mt-1 mb-4 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
        סיכומים לרגע האחרון
      </h1>

      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 mb-4" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
        <Search size={16} style={{ color: "var(--color-muted)" }} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="חיפוש בדפי העזר…"
          className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--color-ink)" }} />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="rounded-full px-3 py-1.5 text-xs"
            style={cat === c ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" } : { background: "var(--color-paper-soft)", color: "var(--color-ink-soft)", border: "1px solid var(--color-rule)" }}>
            {c === "all" ? "הכל" : c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((s) => (
          <section key={s.id} className="rounded-xl border p-4" style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)" }}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }} dir="auto">{s.title_he}</h2>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>{s.category}</span>
            </div>
            {s.blurb_he && <p className="mt-0.5 text-xs" style={{ color: "var(--color-muted)" }}>{s.blurb_he}</p>}
            <ul className="mt-3 space-y-3">
              {s.items.map((it, i) => (
                <li key={i}>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }} dir="auto">{it.label_he}</p>
                  <p className="text-[13px] mt-0.5" style={{ color: "var(--color-ink-soft)" }} dir="auto">{it.detail_he}</p>
                  {it.code && (
                    <pre dir="ltr" className="mt-1 overflow-x-auto rounded-lg px-3 py-2 text-[12px]" style={{ background: "var(--color-ink)", color: "var(--color-paper)", fontFamily: "var(--font-mono)" }}>
                      <code>{it.code}</code>
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {filtered.length === 0 && <p className="text-sm" style={{ color: "var(--color-muted)" }}>לא נמצאו תוצאות.</p>}
      </div>
    </div>
  );
}
