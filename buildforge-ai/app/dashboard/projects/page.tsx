import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderKanban, Sparkles, ArrowRight } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function ProjectsList() {
  const session = await auth();
  const userId = session!.user.id;
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { agentRuns: true, reports: true, documents: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/projects/new"><Plus className="h-4 w-4" /> New project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <FolderKanban className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">No projects yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Describe your software idea. We'll spin up 12 AI agents to build a complete product blueprint.
            </p>
            <Button variant="gradient" size="lg" className="mt-6" asChild>
              <Link href="/dashboard/projects/new"><Sparkles className="h-4 w-4" /> Create your first project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
                  <FolderKanban className="h-5 w-5 text-fuchsia-500" />
                </div>
                <Badge variant={p.status === "COMPLETED" ? "success" : p.status === "IN_PROGRESS" ? "warning" : "secondary"}>
                  {p.status.toLowerCase().replace("_", " ")}
                </Badge>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.idea}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex gap-3">
                  <span>{p._count.agentRuns} runs</span>
                  <span>{p._count.reports} reports</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-3 text-[11px] text-muted-foreground">Updated {formatRelativeTime(p.updatedAt)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
