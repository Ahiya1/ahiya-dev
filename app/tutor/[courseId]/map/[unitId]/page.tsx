import { notFound } from "next/navigation";
import { getCourse } from "../../../_lib/courses";
import { getUnit, getUnits } from "../../../_lib/coursedata";
import Lesson from "../../../_components/Lesson";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string }>;
}) {
  const { courseId, unitId } = await params;
  if (!getCourse(courseId)) notFound();
  const unit = getUnit(unitId);
  if (!unit) notFound();
  return <Lesson courseId={courseId} unit={unit} />;
}

export function generateStaticParams() {
  return getUnits().map((u) => ({ courseId: "234124", unitId: u.id }));
}
