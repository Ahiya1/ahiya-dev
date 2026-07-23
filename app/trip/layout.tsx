import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הבוטמניאדה",
  description: "המשחק המשפחתי של טיול אמירי הגליל 2026",
  robots: { index: false, follow: false },
};

export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "var(--font-hebrew), var(--font-sans), sans-serif",
      }}
    >
      {children}
    </div>
  );
}
