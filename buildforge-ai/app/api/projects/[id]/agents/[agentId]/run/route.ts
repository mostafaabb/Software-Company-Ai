import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { RunAgentSchema } from "@/lib/validations/schemas";
import { runSingleAgent } from "@/lib/agents/orchestrator";

export async function POST(req: Request, ctx: { params: Promise<{ id: string; agentId: string }> }) {
  const { id, agentId } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({ where: { id, ownerId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data = RunAgentSchema.parse({ ...body, agentType: agentId.toUpperCase() });

  try {
    const result = await runSingleAgent({
      projectId: id,
      userId: session.user.id,
      agentType: data.agentType as any,
    });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[agent run]", err);
    return NextResponse.json({ error: "Agent run failed" }, { status: 500 });
  }
}
