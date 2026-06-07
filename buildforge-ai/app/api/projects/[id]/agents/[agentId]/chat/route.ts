import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { chatStream } from "@/lib/agents/chat";
import type { AgentType } from "@/types/agent";

export async function POST(req: Request, ctx: { params: Promise<{ id: string; agentId: string }> }) {
  const { id, agentId } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, chatId } = await req.json();
  if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of chatStream({
          projectId: id,
          userId: session.user.id,
          agentType: agentId.toUpperCase() as AgentType,
          chatId,
          content,
        })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: String(err) })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
