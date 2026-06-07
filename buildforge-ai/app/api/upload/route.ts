import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { saveFile } from "@/lib/storage/local";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const projectId = (form.get("projectId") as string) || "";
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 413 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await saveFile(buffer, file.name, `uploads/${projectId || "general"}`);

  const doc = await prisma.knowledgeDoc.create({
    data: {
      projectId: projectId || null as any,
      title: file.name,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      status: "READY",
      storageKey: stored.key,
      url: stored.url,
      uploadedBy: session.user.id,
    },
  });
  return NextResponse.json({ document: doc });
}
