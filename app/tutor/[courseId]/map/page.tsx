import { notFound } from "next/navigation";
import { getCourse } from "../../_lib/courses";
import { getUnits } from "../../_lib/coursedata";
import CourseMap from "../../_components/CourseMap";

export default async function MapPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  if (!getCourse(courseId)) notFound();
  const units = getUnits().map((u) => ({
    id: u.id,
    kind: u.kind,
    number: u.number,
    title: u.title,
    topics: u.topics,
  }));
  return <CourseMap courseId={courseId} units={units} />;
}
