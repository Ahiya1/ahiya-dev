import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, listCourses } from "../_lib/courses";
import { getUnits, getMeta } from "../_lib/coursedata";
import Home from "../_components/Home";

export function generateStaticParams() {
  return listCourses().map((c) => ({ courseId: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourse(courseId);
  return { title: course ? `${course.nameHe} · tutor` : "Tutor · ahiya.dev" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const meta = getMeta();
  const units = getUnits().map((u) => ({
    id: u.id,
    kind: u.kind,
    number: u.number,
    title: u.title,
  }));

  return (
    <Home
      courseId={course.id}
      nameHe={course.nameHe}
      summaryHe={meta.summaryHe}
      units={units}
    />
  );
}
