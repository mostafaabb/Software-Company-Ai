import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const action = url.searchParams.get("action");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  
  const where: Record<string, unknown> = {};
  if (projectId) where.resourceId = projectId;
  if (action) where.action = action;
  
  const logs = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  
  return NextResponse.json({ logs });
}
