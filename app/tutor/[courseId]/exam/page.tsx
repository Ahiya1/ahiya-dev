import { notFound } from "next/navigation";
import { getCourse } from "../../_lib/courses";
import { getMockExams } from "../../_lib/content";
import MockExam from "../../_components/MockExam";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  if (!getCourse(courseId)) notFound();
  return <MockExam courseId={courseId} exams={getMockExams()} />;
}
