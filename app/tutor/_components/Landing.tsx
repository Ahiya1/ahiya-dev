"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseSummary } from "../_lib/courses";

type Lang = "en" | "he";

const COPY = {
  en: {
    dir: "ltr" as const,
    kicker: "AI tutor · grounded in your real course",
    title: "The tutor that has\nread your whole course.",
    lede: "Lectures, tutorials, and every past exam — distilled and always on. Ask anything, get worked examples, and drill real exam-style questions. In your language.",
    coursesHeading: "Available courses",
    enter: "Enter",
    langLabel: "עברית",
    soon: "More courses soon",
    footer: "Built by Ahiya",
    taught: "Taught in",
  },
  he: {
    dir: "rtl" as const,
    kicker: "מורה פרטי מבוסס AI · יודע את הקורס שלך",
    title: "המורה הפרטי\nשקרא את כל הקורס שלך.",
    lede: "הרצאות, תרגולים וכל המבחנים הקודמים — מזוקקים וזמינים תמיד. שאלי כל דבר, קבלי דוגמאות פתורות, ותרגלי שאלות בסגנון המבחן. בשפה שלך.",
    coursesHeading: "קורסים זמינים",
    enter: "כניסה",
    langLabel: "English",
    soon: "עוד קורסים בקרוב",
    footer: "נבנה על ידי אחיה",
    taught: "נלמד ב-",
  },
};

export default function Landing({ courses }: { courses: CourseSummary[] }) {
  const [lang, setLang] = useState<Lang>("he");
  const t = COPY[lang];

  return (
    <main
      dir={t.dir}
      className="min-h-screen px-6 py-10 sm:px-10 md:px-16 lg:px-24 max-w-5xl mx-auto flex flex-col"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <header className="flex items-center justify-between lift lift-1">
        <span
          className="text-sm tracking-wide"
          style={{ color: "var(--color-muted)" }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>tutor</span> · ahiya.dev
        </span>
        <button
          onClick={() => setLang(lang === "en" ? "he" : "en")}
          className="text-sm link"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {t.langLabel}
        </button>
      </header>

      <section className="mt-20 sm:mt-28 lift lift-2">
        <p
          className="text-sm uppercase tracking-[0.18em]"
          style={{ color: "var(--color-sky-deep)" }}
        >
          {t.kicker}
        </p>
        <h1
          className="mt-6 whitespace-pre-line text-4xl sm:text-5xl md:text-6xl leading-[1.05]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {t.title}
        </h1>
        <p
          className="mt-8 max-w-2xl text-lg leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {t.lede}
        </p>
      </section>

      <section className="mt-20 lift lift-3">
        <h2
          className="text-sm uppercase tracking-[0.18em] mb-6"
          style={{ color: "var(--color-muted)" }}
        >
          {t.coursesHeading}
        </h2>
        <ul className="flex flex-col gap-3">
          {courses.map((c) => (
            <li key={c.id}>
              <Link
                href={`/tutor/${c.id}`}
                className="group flex items-center justify-between rounded-lg border px-6 py-5 transition-colors"
                style={{
                  borderColor: "var(--color-rule)",
                  background: "var(--color-paper-soft)",
                }}
              >
                <span dir={c.language === "he" ? "rtl" : "ltr"}>
                  <span
                    className="block text-xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-ink)",
                    }}
                  >
                    {lang === "he" ? c.nameHe : c.nameEn}
                  </span>
                  <span
                    className="block text-sm mt-1"
                    style={{
                      color: "var(--color-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {c.number}
                  </span>
                </span>
                <span
                  className="text-sm inline-flex items-center gap-2"
                  style={{ color: "var(--color-sky-deep)" }}
                >
                  {t.enter}
                  <span className="arrow group-hover:translate-x-1">
                    {t.dir === "rtl" ? "←" : "→"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li
            className="px-6 py-4 text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            {t.soon}
          </li>
        </ul>
      </section>

      <footer
        className="mt-auto pt-24 text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        {t.footer}
      </footer>
    </main>
  );
}
