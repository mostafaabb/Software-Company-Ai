import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const docs = await prisma.knowledgeDoc.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ documents: docs });
}
