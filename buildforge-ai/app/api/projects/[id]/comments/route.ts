import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const entityType = url.searchParams.get("entityType");
  const entityId = url.searchParams.get("entityId");
  
  const where: Record<string, unknown> = { projectId: id };
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  
  const comments = await prisma.comment.findMany({
    where,
    include: { author: { select: { id: true, name: true, image: true } }, replies: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ comments });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  
  const comment = await prisma.comment.create({
    data: {
      projectId: id,
      authorId: session.user.id,
      body: body.body,
      entityType: body.entityType,
      entityId: body.entityId,
      parentId: body.parentId,
    },
    include: { author: { select: { id: true, name: true, image: true } } },
  });
  
  return NextResponse.json({ comment }, { status: 201 });
}
