import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FolderKanban, Zap, DollarSign, TrendingUp, Activity } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function AdminOverview() {
  const [userCount, projectCount, runCount, subCount, totalTokens, recentRuns, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.agentRun.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.usageMetric.aggregate({ _sum: { value: true }, where: { metric: "agent_run" } }),
    prisma.agentRun.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { project: true, triggeredBy: true } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Admin overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time metrics for BuildForge AI.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={userCount} icon={Users} />
        <StatCard label="Projects" value={projectCount} icon={FolderKanban} />
        <StatCard label="Agent runs" value={runCount} icon={Zap} />
        <StatCard label="Active subscriptions" value={subCount} icon={DollarSign} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent agent runs</CardTitle>
            <CardDescription>Latest activity across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentRuns.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-md border border-border/60 p-3 text-sm">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{r.agentType.toLowerCase().replace(/_/g, " ")}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.project?.name || "—"} · {r.triggeredBy?.email || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={r.status === "COMPLETED" ? "success" : r.status === "RUNNING" ? "warning" : "secondary"}>
                    {r.status.toLowerCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(r.createdAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New signups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="rounded-md border border-border/60 p-3 text-sm">
                <div className="font-medium">{u.name || "Anonymous"}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{formatRelativeTime(u.createdAt)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{label}</div>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 font-display text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}
