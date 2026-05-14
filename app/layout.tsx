import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahiya Butman — AI Engineer & Independent Builder",
  description:
    "Independent builder shipping practical AI tools and full-stack systems out of Israel. Python, FastAPI, React, LLM APIs.",
  metadataBase: new URL("https://ahiya.dev"),
  openGraph: {
    title: "Ahiya Butman — AI Engineer & Independent Builder",
    description:
      "Independent builder shipping practical AI tools and full-stack systems out of Israel.",
    type: "website",
    url: "https://ahiya.dev",
    siteName: "ahiya.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahiya Butman — AI Engineer & Independent Builder",
    description:
      "Independent builder shipping practical AI tools and full-stack systems out of Israel.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
