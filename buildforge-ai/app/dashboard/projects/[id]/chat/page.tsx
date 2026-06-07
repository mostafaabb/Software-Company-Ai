import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { ChatInterface } from "@/components/chat/chat-interface";
import { AGENTS } from "@/lib/agents/definitions";

export default async function ChatPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ agent?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const session = await auth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: session!.user.id } });
  if (!project) notFound();

  const initialAgent = (sp.agent || "PRODUCT_MANAGER") as any;
  return <ChatInterface projectId={id} agents={AGENTS} initialAgent={initialAgent} />;
}
