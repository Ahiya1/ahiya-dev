import { notFound } from "next/navigation";
import Rail from "../_components/Rail";
import { getCourse } from "../_lib/courses";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col md:flex-row"
      style={{ background: "var(--color-paper)", fontFamily: "var(--font-sans)" }}
    >
      <Rail courseId={course.id} nameHe={course.nameHe} number={course.number} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
