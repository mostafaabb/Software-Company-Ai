import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const versions = await prisma.versionSnapshot.findMany({
    where: { projectId: id },
    orderBy: { version: "desc" },
  });
  return NextResponse.json({ versions: versions.map(v => ({ ...v, agentOutputs: JSON.parse(v.agentOutputs) })) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  
  const latest = await prisma.versionSnapshot.findFirst({
    where: { projectId: id },
    orderBy: { version: "desc" },
  });
  const nextVersion = (latest?.version || 0) + 1;
  
  const runs = await prisma.agentRun.findMany({
    where: { projectId: id, status: "COMPLETED" },
    orderBy: { createdAt: "asc" },
  });
  
  const agentOutputs: Record<string, unknown> = {};
  for (const run of runs) {
    if (run.output) agentOutputs[run.agentType] = JSON.parse(run.output);
  }
  
  const snapshot = await prisma.versionSnapshot.create({
    data: {
      projectId: id,
      version: nextVersion,
      label: body.label || `Version ${nextVersion}`,
      agentOutputs: JSON.stringify(agentOutputs),
    },
  });
  
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "version.create",
      resource: "VersionSnapshot",
      resourceId: snapshot.id,
      metadata: JSON.stringify({ version: nextVersion }),
    },
  });
  
  return NextResponse.json({ version: { ...snapshot, agentOutputs } }, { status: 201 });
}
