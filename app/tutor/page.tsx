import type { Metadata } from "next";
import Landing from "./_components/Landing";
import { listCourses } from "./_lib/courses";

export const metadata: Metadata = {
  title: "Tutor · ahiya.dev",
  description:
    "An AI tutor grounded in your real course — lectures, tutorials, and past exams. מורה פרטי מבוסס AI לקורס שלך.",
};

export default function TutorLandingPage() {
  return <Landing courses={listCourses()} />;
}
