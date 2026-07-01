import { notFound } from "next/navigation";
import { getCourse } from "../../_lib/courses";
import { getCheatsheets } from "../../_lib/content";
import Cheatsheets from "../../_components/Cheatsheets";

export default async function CheatsheetsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  if (!getCourse(courseId)) notFound();
  return <Cheatsheets sections={getCheatsheets()} />;
}
