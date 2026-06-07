"use client";

import * as React from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, MessageSquare, FileText, Zap, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JsonView } from "@/components/shared/json-view";
import type { AgentMeta } from "@/lib/agents/definitions";
import type { AgentRun, Document } from "@prisma/client";
import { formatRelativeTime } from "@/lib/utils/cn";
import Link from "next/link";

export function AgentDetail({ projectId, agent, lastRun, doc }: {
  projectId: string;
  agent: AgentMeta;
  lastRun?: AgentRun;
  doc?: Document | null;
}) {
  const [running, setRunning] = React.useState(false);
  const [output, setOutput] = React.useState<any>(lastRun?.output || null);
  const [thinking, setThinking] = React.useState<string>(lastRun?.thinking || "");

  async function onRun() {
    setRunning(true);
    setOutput(null);
    setThinking("");
    const res = await fetch(`/api/projects/${projectId}/agents/${agent.slug}/run`, { method: "POST", body: "{}" });
    if (!res.ok) {
      toast.error("Run failed");
      setRunning(false);
      return;
    }
    const data = await res.json();
    setOutput(data.result.output);
    setThinking(data.result.thinking || "");
    setRunning(false);
    toast.success(`${agent.name} completed`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className={`h-1 w-full bg-gradient-to-r ${agent.gradient}`} />
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient} text-white shadow-lg`}>
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{agent.name}</h1>
                <div className="text-sm text-muted-foreground">{agent.role}</div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{agent.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/projects/${projectId}/chat?agent=${agent.type}`}><MessageSquare className="h-4 w-4" /> Chat</Link>
              </Button>
              <Button variant="gradient" onClick={onRun} disabled={running}>
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Run {agent.name}
              </Button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {agent.capabilities.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-1 font-medium">
              {running ? "Running" : lastRun ? lastRun.status.toLowerCase() : "Idle"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Last run</div>
            <div className="mt-1 font-medium">{lastRun ? formatRelativeTime(lastRun.createdAt) : "Never"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Tokens used</div>
            <div className="mt-1 font-medium">{lastRun?.tokensUsed?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="output" className="w-full">
        <TabsList>
          <TabsTrigger value="output"><FileText className="h-3.5 w-3.5" /> Output</TabsTrigger>
          <TabsTrigger value="thinking"><Bot className="h-3.5 w-3.5" /> Thinking</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
        </TabsList>
        <TabsContent value="output" className="mt-4">
          <Card>
            <CardContent className="p-5">
              {output ? (
                <JsonView data={output} />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">No output yet. Click "Run {agent.name}" to generate.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="thinking" className="mt-4">
          <Card>
            <CardContent className="p-5">
              {thinking ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{thinking}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No thinking captured for this run yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="capabilities" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-display text-lg font-semibold">Capabilities</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {agent.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                    {c}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 font-display text-lg font-semibold">Outputs produced</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {agent.outputs.map((o) => (
                  <li key={o} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {o}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
