"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Compass, Dumbbell, Timer, ScrollText, MessagesSquare, ArrowLeft } from "lucide-react";
import { Card, Bar, Button, Pill } from "./ui";
import { useProgress, daysUntil } from "../_lib/useProgress";

export interface HomeUnit {
  id: string;
  kind: "lecture" | "tutorial";
  number: number;
  title: string;
}

export default function Home({
  courseId,
  nameHe,
  summaryHe,
  units,
}: {
  courseId: string;
  nameHe: string;
  summaryHe: string;
  units: HomeUnit[];
}) {
  const { progress, loaded, setExamDate } = useProgress(courseId);
  const base = `/tutor/${courseId}`;

  const stats = useMemo(() => {
    const good = Object.values(progress.units).filter((c) => c === "good").length;
    const shaky = units.filter((u) => progress.units[u.id] === "shaky");
    const practiceCount = Object.keys(progress.practice).length;
    const bestMock = progress.mocks.reduce(
      (m, r) => Math.max(m, Math.round((r.score / r.total) * 100)),
      0,
    );
    const pct = Math.round((good / units.length) * 100);
    return { good, shaky, practiceCount, bestMock, pct };
  }, [progress, units]);

  const days = daysUntil(progress.examDate);

  const next = useMemo(() => {
    if (!progress.examDate)
      return { label: "קבעי תאריך מבחן כדי לבנות תוכנית", href: null };
    if (stats.good < units.length * 0.3)
      return { label: "התחילי לעבור על החומר במפת הקורס", href: `${base}/map` };
    if (stats.practiceCount === 0)
      return { label: "תרגלי שאלות בסגנון המבחן", href: `${base}/practice` };
    if (progress.mocks.length === 0)
      return { label: "נסי מבחן דמה מלא בתנאי אמת", href: `${base}/exam` };
    return { label: "חזרה ממוקדת על נקודות התורפה", href: `${base}/map` };
  }, [progress, stats, units.length, base]);

  const navCards = [
    { href: `${base}/map`, label: "מפת הקורס", desc: "כל ההרצאות והתרגולים", icon: Compass },
    { href: `${base}/practice`, label: "תרגול", desc: "שאלות עם בדיקה ומשוב", icon: Dumbbell },
    { href: `${base}/exam`, label: "מבחן דמה", desc: "3 שאלות, 3 שעות, ציון", icon: Timer },
    { href: `${base}/cheatsheets`, label: "דפי עזר", desc: "סיכומים לרגע האחרון", icon: ScrollText },
    { href: `${base}/ask`, label: "שאל את המורה", desc: "צ׳אט על כל שאלה", icon: MessagesSquare },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 lift lift-1">
      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--color-sky-deep)" }}>
        מורה פרטי · 234124
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
        {nameHe}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px]" style={{ color: "var(--color-ink-soft)" }}>
        {summaryHe}
      </p>

      {/* top row: countdown + progress + next action */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>עד המבחן</p>
          {loaded && days !== null ? (
            <>
              <p className="mt-1 text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
                {days} <span className="text-lg">ימים</span>
              </p>
              <input
                type="date"
                value={progress.examDate ?? ""}
                onChange={(e) => setExamDate(e.target.value || undefined)}
                className="mt-2 text-xs bg-transparent outline-none"
                style={{ color: "var(--color-muted)" }}
              />
            </>
          ) : (
            <div className="mt-2">
              <input
                type="date"
                onChange={(e) => setExamDate(e.target.value || undefined)}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent outline-none"
                style={{ borderColor: "var(--color-rule)", color: "var(--color-ink)" }}
              />
              <p className="mt-2 text-xs" style={{ color: "var(--color-muted)" }}>קבעי תאריך למעקב</p>
            </div>
          )}
        </Card>

        <Card>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>התקדמות בחומר</p>
          <p className="mt-1 text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
            {stats.pct}%
          </p>
          <div className="mt-3"><Bar value={stats.pct} /></div>
          <p className="mt-2 text-xs" style={{ color: "var(--color-muted)" }}>
            {stats.good}/{units.length} יחידות · {stats.practiceCount} תרגולים · מבחן דמה הכי טוב {stats.bestMock}%
          </p>
        </Card>

        <Card style={{ background: "var(--color-sky-deep)" }}>
          <p className="text-sm" style={{ color: "var(--color-paper)" }}>המשך מכאן</p>
          <p className="mt-2 text-lg leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--color-paper)" }}>
            {next.label}
          </p>
          {next.href && (
            <Link href={next.href} className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--color-paper)", color: "var(--color-sky-deep)" }}>
              קדימה <ArrowLeft size={16} />
            </Link>
          )}
        </Card>
      </div>

      {/* weak spots */}
      {stats.shaky.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-muted)" }}>
            נקודות לחיזוק
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.shaky.map((u) => (
              <Link key={u.id} href={`${base}/map/${u.id}`} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--color-rule)", background: "var(--color-paper-soft)", color: "var(--color-ink)" }}>
                <Pill tone="warn">{u.id}</Pill>
                {u.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* nav grid */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {navCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card className="h-full transition-colors hover:border-current">
                <Icon size={22} strokeWidth={1.6} style={{ color: "var(--color-sky-deep)" }} />
                <p className="mt-3 text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
                  {c.label}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>{c.desc}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
