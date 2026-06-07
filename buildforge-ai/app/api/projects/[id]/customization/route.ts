import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customizations = await prisma.agentCustomization.findMany({ where: { projectId: id } });
  return NextResponse.json({ customizations });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  
  const customization = await prisma.agentCustomization.upsert({
    where: { projectId_agentType: { projectId: id, agentType: body.agentType } },
    update: {
      customPrompt: body.customPrompt,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    },
    create: {
      projectId: id,
      agentType: body.agentType,
      customPrompt: body.customPrompt,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    },
  });
  
  return NextResponse.json({ customization });
}
