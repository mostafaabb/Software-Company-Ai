import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findFirst({ where: { id, ownerId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const report = await prisma.report.findFirst({
    where: { projectId: id, type: "MASTER" },
    orderBy: { createdAt: "desc" },
  });
  const documents = await prisma.document.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ report, documents });
}
