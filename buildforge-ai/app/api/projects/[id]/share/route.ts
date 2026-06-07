import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { nanoid } from "nanoid";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  
  const link = await prisma.sharedLink.create({
    data: {
      projectId: id,
      token: nanoid(32),
      password: body.password || null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  });
  
  return NextResponse.json({ link }, { status: 201 });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const links = await prisma.sharedLink.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ links });
}
