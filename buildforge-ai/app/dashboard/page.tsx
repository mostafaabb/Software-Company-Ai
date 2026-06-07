import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, TrendingUp, Activity, Zap, FolderKanban, Users, MessageSquare, Plus } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function DashboardHome() {
  const session = await auth();
  const userId = session!.user.id;
  const [projects, runs, recentRuns, totalReports] = await Promise.all([
    prisma.project.findMany({ where: { ownerId: userId }, orderBy: { updatedAt: "desc" }, take: 6 }),
    prisma.agentRun.count({ where: { project: { ownerId: userId } } }),
    prisma.agentRun.findMany({ where: { project: { ownerId: userId } }, take: 6, orderBy: { createdAt: "desc" }, include: { project: { select: { name: true, id: true } } } }),
    prisma.report.count({ where: { project: { ownerId: userId } } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back, {session!.user.name?.split(" ")[0] || "Founder"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening across your AI software team.</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/projects/new"><Plus className="h-4 w-4" /> New project</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} trend="+2 this month" />
        <StatCard label="Agent runs" value={runs} icon={Zap} trend="+18% this week" />
        <StatCard label="Reports" value={totalReports} icon={Sparkles} trend="3 master reports" />
        <StatCard label="Active sessions" value={1} icon={Activity} trend="Across 12 agents" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your projects</CardTitle>
              <CardDescription>Recent software products being built by your AI team.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {projects.length === 0 ? (
              <EmptyProjects />
            ) : (
              projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  className="group rounded-xl border border-border/60 p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-display font-semibold">{p.name}</div>
                    <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "IN_PROGRESS" ? "warning" : "secondary"}>
                      {p.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.idea}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Updated {formatRelativeTime(p.updatedAt)}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest agent runs across your projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet. Create a project and run an agent!</p>
            ) : (
              recentRuns.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/projects/${r.project.id}/agents`}
                  className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                >
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${
                    r.status === "COMPLETED" ? "bg-emerald-500" :
                    r.status === "RUNNING" ? "bg-amber-500 animate-pulse" :
                    r.status === "FAILED" ? "bg-rose-500" : "bg-zinc-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">
                      <span className="font-medium">{r.agentType.replace(/_/g, " ").toLowerCase()}</span>
                      <span className="text-muted-foreground"> · {r.project.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatRelativeTime(r.createdAt)}</div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="grid gap-6 p-8 md:grid-cols-2 md:p-12">
          <div>
            <Badge variant="gradient" className="mb-3">Try a sample</Badge>
            <h2 className="font-display text-3xl font-bold">See your AI team in action</h2>
            <p className="mt-3 text-muted-foreground">
              Try one of these prompts to see how the 12 agents collaborate to build a complete product blueprint.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Build me an AI-powered CRM",
                "Restaurant management SaaS with QR ordering",
                "Modern LMS for online schools",
                "Healthcare appointment booking platform",
                "AI code review tool for GitHub",
              ].map((p) => (
                <Button key={p} variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/projects/new?idea=${encodeURIComponent(p)}`}>{p}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
            <div className="relative rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground">buildforge.ai/dashboard</span>
              </div>
              <pre className="mt-4 overflow-x-auto text-xs leading-relaxed">
{`$ forge run --idea "Restaurant management SaaS"

[1/12] Atlas (PM)            ✓ 12.3s · 1842 tokens
[2/12] Scout (Market)        ✓ 9.1s · 1430 tokens
[3/12] Ledger (BA)           ✓ 7.8s · 1102 tokens
[4/12] Empathy (UX)          ✓ 6.2s · 982 tokens
[5/12] Pixel (UI)            ✓ 8.4s · 1240 tokens
[6/12] Schema (DB)           ✓ 11.6s · 1680 tokens
[7/12] Forge (Backend)       ✓ 14.1s · 2120 tokens
[8/12] Reacto (Frontend)     ✓ 9.8s · 1450 tokens
[9/12] Sherlock (QA)         ✓ 5.2s · 870 tokens
[10/12] Helm (DevOps)        ✓ 7.4s · 1020 tokens
[11/12] Sentinel (Security)  ✓ 6.1s · 920 tokens
[12/12] Capital (Finance)    ✓ 8.9s · 1310 tokens
[✓] Master report generated · 124 pages`}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyProjects() {
  return (
    <Link
      href="/dashboard/projects/new"
      className="col-span-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 p-10 text-center transition-colors hover:border-border hover:bg-accent/50"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display font-semibold">No projects yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Describe your idea and let 12 AI agents build your blueprint.</p>
      <Button variant="gradient" size="sm" className="mt-4">Create your first project</Button>
    </Link>
  );
}
