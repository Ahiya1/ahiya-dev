import React from "react";

// Shared presentational primitives for the tutor workspace (paper/ink theme).
// No hooks -> usable from both server and client components.

export function Card({
  children,
  className = "",
  as: Tag = "div",
  style,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`rounded-xl border p-5 ${className}`}
      style={{
        borderColor: "var(--color-rule)",
        background: "var(--color-paper-soft)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "green" | "warn";
}) {
  const tones: Record<string, React.CSSProperties> = {
    muted: { background: "var(--color-rule)", color: "var(--color-ink-soft)" },
    green: { background: "var(--color-sky)", color: "var(--color-paper)" },
    warn: { background: "#c8894b", color: "#1c130a" },
  };
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={tones[tone]}
    >
      {children}
    </span>
  );
}

export function Bar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="h-2 w-full rounded-full overflow-hidden"
      style={{ background: "var(--color-rule)" }}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: "var(--color-sky-deep)" }}
      />
    </div>
  );
}

export function ModeHeader({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && (
          <p
            className="text-xs uppercase tracking-[0.18em]"
            style={{ color: "var(--color-sky-deep)" }}
          >
            {kicker}
          </p>
        )}
        <h1
          className="mt-1 text-2xl sm:text-3xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "solid",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "outline";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, React.CSSProperties> = {
    solid: { background: "var(--color-sky-deep)", color: "var(--color-paper)" },
    outline: {
      background: "transparent",
      color: "var(--color-ink)",
      border: "1px solid var(--color-rule)",
    },
    ghost: { background: "transparent", color: "var(--color-sky-deep)" },
  };
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-40 ${className}`}
      style={variants[variant]}
      {...rest}
    >
      {children}
    </button>
  );
}
