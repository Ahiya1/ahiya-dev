import { getCourse } from "../../../tutor/_lib/courses";
import { buildSystemPrompt, buildCourseContext } from "../../../tutor/_lib/prompt";
import { streamTutor, type ChatMessage } from "../../../tutor/_lib/inference";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 40;
const MAX_CHARS = 8000;

export async function POST(req: Request) {
  let body: { courseId?: string; messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const course = body.courseId ? getCourse(body.courseId) : null;
  if (!course) {
    return Response.json({ error: "unknown course" }, { status: 404 });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "no user message" }, { status: 400 });
  }

  const system = buildSystemPrompt(course);
  const courseContext = buildCourseContext(course);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of streamTutor({
          system,
          courseContext,
          messages,
        })) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "inference error";
        controller.enqueue(
          encoder.encode(`\n\n[שגיאה: ${msg}]`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
