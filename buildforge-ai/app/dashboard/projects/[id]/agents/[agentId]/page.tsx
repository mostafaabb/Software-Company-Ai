import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { getAgentBySlug } from "@/lib/agents/definitions";
import { AgentDetail } from "@/components/agents/agent-detail";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string; agentId: string }> }) {
  const { id, agentId } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: session!.user.id } });
  if (!project) notFound();

  const agent = getAgentBySlug(agentId);
  if (!agent) notFound();

  const runs = await prisma.agentRun.findMany({
    where: { projectId: id, agentType: agent.type },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const lastRun = runs[0];
  const docs = await prisma.document.findMany({ where: { projectId: id, type: agent.slug }, orderBy: { createdAt: "desc" }, take: 1 });

  return <AgentDetail projectId={id} agent={agent} lastRun={lastRun} doc={docs[0] || null} />;
}
