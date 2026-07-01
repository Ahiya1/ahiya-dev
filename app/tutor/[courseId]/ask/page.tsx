import { notFound } from "next/navigation";
import { getCourse } from "../../_lib/courses";
import TutorChat from "../../_components/TutorChat";

export default async function AskPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { courseId } = await params;
  const { q } = await searchParams;
  if (!getCourse(courseId)) notFound();
  return (
    <div className="h-[100dvh] md:h-screen flex flex-col">
      <TutorChat courseId={courseId} seed={q} />
    </div>
  );
}
