import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AGENTS, getAgentBySlug } from "@/lib/agents/definitions";
import { AgentCard } from "@/components/agents/agent-card";
import { Sparkles, Brain, Zap } from "lucide-react";
import { ForgeButton } from "@/components/projects/forge-button";

export default async function AgentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: session!.user.id } });
  if (!project) notFound();

  const runs = await prisma.agentRun.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } });
  const lastByType = new Map<string, typeof runs[number]>();
  for (const r of runs) if (!lastByType.has(r.agentType)) lastByType.set(r.agentType, r);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Your AI team</h1>
          <p className="mt-1 text-sm text-muted-foreground">Run any agent individually, or forge the full pipeline.</p>
        </div>
        <ForgeButton projectId={project.id} />
      </div>

      <Card className="border-dashed bg-gradient-to-br from-indigo-500/5 to-fuchsia-500/5">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-fuchsia-500" />
              <span>Pipeline: {AGENTS.length} agents · {runs.length} runs so far</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Powered by multi-agent orchestration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((a) => {
          const lastRun = lastByType.get(a.type);
          return <AgentCard key={a.type} projectId={id} agent={a} lastRun={lastRun} />;
        })}
      </div>
    </div>
  );
}
