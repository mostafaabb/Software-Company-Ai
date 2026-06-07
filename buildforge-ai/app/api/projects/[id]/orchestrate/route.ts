import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { OrchestrateSchema } from "@/lib/validations/schemas";
import { orchestrate } from "@/lib/agents/orchestrator";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({ where: { id, ownerId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data = OrchestrateSchema.parse(body);

  try {
    const result = await orchestrate({
      projectId: id,
      userId: session.user.id,
      agents: data.agents as any,
      parallel: data.parallel,
    });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("[orchestrate]", err);
    return NextResponse.json({ error: "Orchestration failed" }, { status: 500 });
  }
}
