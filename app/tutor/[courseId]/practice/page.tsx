import { notFound } from "next/navigation";
import { getCourse } from "../../_lib/courses";
import { getPractice } from "../../_lib/content";
import Practice from "../../_components/Practice";

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { courseId } = await params;
  const { topic } = await searchParams;
  if (!getCourse(courseId)) notFound();
  return <Practice courseId={courseId} questions={getPractice()} initialTopic={topic} />;
}
