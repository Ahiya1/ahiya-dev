"use client";

import { PLAYERS, type PlayerId } from "../content/players";

export default function NamePicker({
  onPick,
}: {
  onPick: (id: PlayerId) => void;
}) {
  return (
    <div className="mx-auto max-w-md px-5 pb-16 pt-10 text-center">
      <div className="lift lift-1 text-6xl">🏆</div>
      <h1 className="lift lift-2 mt-3 text-4xl font-bold text-[var(--color-ink)]">
        הבוטמניאדה
      </h1>
      <p className="lift lift-3 mt-2 text-lg text-[var(--color-ink-soft)]">
        אמירי הגליל 2026 · 29-31 ביולי
      </p>
      <p className="lift lift-4 mt-8 mb-4 text-base font-medium text-[var(--color-muted)]">
        רגע, מי אתם בכלל?
      </p>
      <div className="lift lift-5 grid grid-cols-2 gap-3">
        {PLAYERS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[var(--color-rule)] bg-white/60 px-4 py-5 text-xl font-semibold text-[var(--color-ink)] shadow-sm transition-transform active:scale-95"
          >
            <span className="text-3xl">{p.emoji}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-8 text-xs text-[var(--color-muted)]">
        שלושה שופטי AI כבר מחכים לכם. אל תאכזבו את הדודה מהצפון.
      </p>
    </div>
  );
}
