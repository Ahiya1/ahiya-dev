import type { Metadata } from "next";
import Experience from "./Experience";

export const metadata: Metadata = {
  title: "The Sacred Potato · Part I — Ahiya Butman",
  description:
    "An immersive desert story. Walk with Kai across sand that remembers nothing, to the lone tree and the first bite. Part I — The Hollow Place.",
  openGraph: {
    title: "The Sacred Potato · Part I — The Hollow Place",
    description:
      "An immersive desert story about seeking, addiction, and the cosmic joke of consciousness taking itself too seriously.",
    type: "article",
  },
};

export default function Page() {
  return <Experience />;
}
