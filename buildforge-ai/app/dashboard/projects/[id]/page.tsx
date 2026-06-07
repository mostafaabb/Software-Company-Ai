import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AGENTS } from "@/lib/agents/definitions";
import {
  Sparkles, Zap, Brain, FileText, Rocket, ArrowRight, MessageSquare, BarChart3, Layers, Compass,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/cn";
import { ForgeButton } from "@/components/projects/forge-button";

export default async function ProjectOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({
    where: { id, OR: [{ ownerId: session!.user.id }] },
    include: {
      agentRuns: { orderBy: { createdAt: "desc" }, take: 12 },
      _count: { select: { agentRuns: true, reports: true, documents: true, chats: true } },
      reports: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!project) notFound();

  const completedAgents = new Set(project.agentRuns.filter((r) => r.status === "COMPLETED").map((r) => r.agentType));
  const completion = (completedAgents.size / AGENTS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant={project.status === "COMPLETED" ? "success" : project.status === "IN_PROGRESS" ? "warning" : "secondary"}>
              {project.status.toLowerCase().replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project.idea}</p>
        </div>
        <div className="flex gap-2">
          <ForgeButton projectId={project.id} />
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${project.id}/chat`}><MessageSquare className="h-4 w-4" /> Chat</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Pipeline completion</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {completedAgents.size} of {AGENTS.length} agents have completed
              </div>
            </div>
            <div className="font-display text-2xl font-bold">{Math.round(completion)}%</div>
          </div>
          <Progress value={completion} className="mt-3" />
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Agent runs" value={project._count.agentRuns} icon={Zap} />
        <StatTile label="Documents" value={project._count.documents} icon={FileText} />
        <StatTile label="Reports" value={project._count.reports} icon={Layers} />
        <StatTile label="Chats" value={project._count.chats} icon={MessageSquare} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your AI team</CardTitle>
              <CardDescription>Run any agent individually, or forge the full pipeline.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/projects/${project.id}/agents`}>Open agents <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {AGENTS.map((a) => {
              const done = completedAgents.has(a.type);
              const running = project.agentRuns.find((r) => r.agentType === a.type && r.status === "RUNNING");
              return (
                <Link
                  key={a.type}
                  href={`/dashboard/projects/${project.id}/agents/${a.slug}`}
                  className="group flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-accent/40"
                >
                  <div className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${a.gradient} text-white shadow`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="truncate text-sm font-medium">{a.name}</div>
                      {done ? (
                        <Badge variant="success" className="text-[10px]">Done</Badge>
                      ) : running ? (
                        <Badge variant="warning" className="animate-pulse text-[10px]">Running</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">Idle</Badge>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{a.shortRole}</div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent runs</CardTitle>
            <CardDescription>Latest agent invocations on this project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.agentRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No runs yet. Click "Forge" to start.</p>
            ) : (
              project.agentRuns.slice(0, 8).map((r) => (
                <div key={r.id} className="flex items-start gap-3 rounded-md p-2 text-sm">
                  <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                    r.status === "COMPLETED" ? "bg-emerald-500" :
                    r.status === "RUNNING" ? "bg-amber-500 animate-pulse" :
                    r.status === "FAILED" ? "bg-rose-500" : "bg-zinc-500"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{r.agentType.toLowerCase().replace(/_/g, " ")}</div>
                    <div className="text-[11px] text-muted-foreground">{formatRelativeTime(r.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon: Icon }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{label}</div>
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="mt-1 font-display text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
