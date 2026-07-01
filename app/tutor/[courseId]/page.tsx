import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, listCourses } from "../_lib/courses";
import TutorChat from "../_components/TutorChat";

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
  if (!course) return { title: "Tutor · ahiya.dev" };
  return { title: `${course.nameHe} · tutor` };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  return (
    <TutorChat
      courseId={course.id}
      number={course.number}
      nameHe={course.nameHe}
      nameEn={course.nameEn}
    />
  );
}
