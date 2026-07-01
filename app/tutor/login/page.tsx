"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/tutor/234124";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tutor/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(next);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "סיסמה שגויה");
        setLoading(false);
      }
    } catch {
      setError("שגיאת רשת, נסי שוב");
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-6"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm lift lift-1"
        style={{ color: "var(--color-ink)" }}
      >
        <p
          className="text-sm uppercase tracking-[0.18em]"
          style={{ color: "var(--color-sky-deep)" }}
        >
          tutor · ahiya.dev
        </p>
        <h1
          className="mt-4 text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          כניסה למורה הפרטי
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>
          הכניסי את הסיסמה שקיבלת כדי להתחיל.
        </p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          className="mt-6 w-full rounded-lg border px-4 py-3 outline-none"
          style={{
            borderColor: "var(--color-rule)",
            background: "var(--color-paper-soft)",
            color: "var(--color-ink)",
          }}
        />

        {error && (
          <p className="mt-3 text-sm" style={{ color: "#a23b2e" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ background: "var(--color-sky-deep)", color: "var(--color-paper)" }}
        >
          {loading ? "רגע…" : "כניסה"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
