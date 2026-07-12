import type { Metadata } from "next";
import Story from "./Story";

export const metadata: Metadata = {
  title: "The Sacred Potato — Ahiya Butman",
  description:
    "A desert story, read as a walk. About seeking, addiction, and the cosmic joke of consciousness taking itself too seriously. Four parts, about an hour.",
  openGraph: {
    title: "The Sacred Potato",
    description:
      "A desert story, read as a walk. About seeking, addiction, and the cosmic joke of consciousness taking itself too seriously.",
    type: "article",
  },
};

export default function Page() {
  return <Story />;
}
