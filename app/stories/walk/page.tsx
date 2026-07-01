import type { Metadata } from "next";
import Walk from "./Walk";

export const metadata: Metadata = {
  title: "The walk — a probe",
  description: "Beneath, only legs, forward, only sand and air.",
};

export default function Page() {
  return <Walk />;
}
