"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  Dumbbell,
  Timer,
  ScrollText,
  MessagesSquare,
  LogOut,
} from "lucide-react";

export interface RailProps {
  courseId: string;
  nameHe: string;
  number: string;
}

export default function Rail({ courseId, nameHe, number }: RailProps) {
  const pathname = usePathname();
  const router = useRouter();
  const base = `/tutor/${courseId}`;

  const items = [
    { href: base, label: "בית", icon: Home, exact: true },
    { href: `${base}/map`, label: "מפת הקורס", icon: Compass },
    { href: `${base}/practice`, label: "תרגול", icon: Dumbbell },
    { href: `${base}/exam`, label: "מבחן דמה", icon: Timer },
    { href: `${base}/cheatsheets`, label: "דפי עזר", icon: ScrollText },
    { href: `${base}/ask`, label: "שאל", icon: MessagesSquare },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/") || pathname === href;

  async function logout() {
    await fetch("/api/tutor/logout", { method: "POST" });
    router.replace("/tutor");
  }

  return (
    <aside
      className="md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-l flex md:flex-col"
      style={{ borderColor: "var(--color-rule)", background: "var(--color-paper)" }}
    >
      <div className="hidden md:block px-5 pt-6 pb-4">
        <Link href={base} className="block">
          <span
            className="block text-lg leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {nameHe}
          </span>
          <span
            className="block text-xs mt-0.5"
            style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
          >
            {number} · מורה פרטי
          </span>
        </Link>
      </div>

      <nav className="flex md:flex-col gap-1 px-2 md:px-3 py-2 md:py-1 overflow-x-auto md:overflow-visible flex-1">
        {items.map((it) => {
          const active = isActive(it.href, it.exact);
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors"
              style={
                active
                  ? { background: "var(--color-sky-deep)", color: "var(--color-paper)" }
                  : { color: "var(--color-ink-soft)" }
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block px-3 py-4 mt-auto border-t" style={{ borderColor: "var(--color-rule)" }}>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          <LogOut size={16} strokeWidth={1.8} />
          יציאה
        </button>
      </div>
    </aside>
  );
}
