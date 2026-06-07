"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Loader2, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AgentMeta } from "@/lib/agents/definitions";
import type { AgentRun } from "@prisma/client";

export function AgentCard({ projectId, agent, lastRun }: { projectId: string; agent: AgentMeta; lastRun?: AgentRun }) {
  const [running, setRunning] = React.useState(false);
  async function onRun() {
    setRunning(true);
    const res = await fetch(`/api/projects/${projectId}/agents/${agent.slug}/run`, { method: "POST", body: "{}" });
    if (!res.ok) {
      toast.error("Run failed");
      setRunning(false);
      return;
    }
    toast.success(`${agent.name} complete`);
    setRunning(false);
  }
  return (
    <Card className="group relative h-full overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-lg">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${agent.gradient}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient} text-white shadow-lg`}>
            <Sparkles className="h-5 w-5" />
          </div>
          {lastRun?.status === "COMPLETED" ? (
            <Badge variant="success">Completed</Badge>
          ) : lastRun?.status === "RUNNING" ? (
            <Badge variant="warning" className="animate-pulse">Running</Badge>
          ) : lastRun?.status === "FAILED" ? (
            <Badge variant="destructive">Failed</Badge>
          ) : (
            <Badge variant="outline">Idle</Badge>
          )}
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">{agent.name}</h3>
        <div className="text-xs text-muted-foreground">{agent.shortRole}</div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{agent.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {agent.outputs.slice(0, 2).map((o) => (
            <Badge key={o} variant="secondary" className="text-[10px] font-normal">{o}</Badge>
          ))}
          {agent.outputs.length > 2 && (
            <Badge variant="secondary" className="text-[10px] font-normal">+{agent.outputs.length - 2}</Badge>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onRun} disabled={running}>
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            Run
          </Button>
          <Button variant="default" size="sm" asChild className="flex-1">
            <Link href={`/dashboard/projects/${projectId}/agents/${agent.slug}`}>
              Open <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
