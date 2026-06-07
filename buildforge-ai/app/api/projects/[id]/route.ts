import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { organization: { memberships: { some: { userId: session.user.id } } } },
      ],
    },
    include: {
      owner: { select: { id: true, name: true, image: true, email: true } },
      agentRuns: { orderBy: { createdAt: "desc" }, take: 20 },
      reports: { orderBy: { createdAt: "desc" } },
      _count: { select: { agentRuns: true, documents: true, reports: true, chats: true } },
    },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({ where: { id, ownerId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.project.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { userId: session.user.id, action: "project.delete", resource: "Project", resourceId: id },
  });
  return NextResponse.json({ ok: true });
}
