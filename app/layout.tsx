import type { Metadata } from "next";
import {
  Fraunces,
  Assistant,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
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

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-hebrew",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahiya Butman · AI Engineer, Founder, Independent Builder",
  description:
    "AI engineer and founder of StatViz. I build practical AI tools and full-stack systems end to end, out of Israel. Former software engineer, Unit 8200.",
  metadataBase: new URL("https://ahiya.dev"),
  openGraph: {
    title: "Ahiya Butman · AI Engineer, Founder, Independent Builder",
    description:
      "AI engineer and founder of StatViz. I build practical AI tools and full-stack systems end to end, out of Israel. Former software engineer, Unit 8200.",
    type: "website",
    url: "https://ahiya.dev",
    siteName: "ahiya.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahiya Butman · AI Engineer, Founder, Independent Builder",
    description:
      "AI engineer and founder of StatViz. I build practical AI tools and full-stack systems end to end, out of Israel.",
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
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} ${assistant.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
