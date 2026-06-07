import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET(req: Request, { params }: { params: Promise<{ id: string; versionId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, versionId } = await params;
  const version = await prisma.versionSnapshot.findFirst({ where: { id: versionId, projectId: id } });
  if (!version) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ version: { ...version, agentOutputs: JSON.parse(version.agentOutputs) } });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; versionId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, versionId } = await params;
  await prisma.versionSnapshot.deleteMany({ where: { id: versionId, projectId: id } });
  return NextResponse.json({ ok: true });
}
