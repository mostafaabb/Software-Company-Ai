import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForgeButton } from "@/components/projects/forge-button";
import { Sparkles, FileText, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/cn";
import { JsonView } from "@/components/shared/json-view";

export default async function MasterReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: session!.user.id } });
  if (!project) notFound();

  const [report, documents] = await Promise.all([
    prisma.report.findFirst({ where: { projectId: id, type: "MASTER" }, orderBy: { createdAt: "desc" } }),
    prisma.document.findMany({ where: { projectId: id }, orderBy: { createdAt: "asc" } }),
  ]);

  if (!report) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Master report</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your complete product blueprint, generated from all 12 agents.</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">No master report yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Forge the full pipeline to generate a master report with all 12 agent outputs assembled into a single document.
            </p>
            <div className="mt-6">
              <ForgeButton projectId={project.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const content = report.content as any;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <Badge variant="gradient" className="mb-2">Master report</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight">{report.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated {formatRelativeTime(report.createdAt)} · {documents.length} sections
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4" /> Export PDF</Button>
          <ForgeButton projectId={project.id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Executive summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{report.summary || content.executiveSummary}</p>
        </CardContent>
      </Card>

      {content.sections && (
        <div className="space-y-4">
          {content.sections.map((sec: any, i: number) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{sec.title}</CardTitle>
                  <CardDescription>Agent: {sec.agent}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/projects/${id}/agents/${sec.agent?.toLowerCase().replace(/_/g, "-") || "product-manager"}`}>
                    Open agent <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <JsonView data={sec.data} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pipeline metrics</CardTitle>
          <CardDescription>Token usage and run timing across the 12 agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 p-3">
              <div className="text-xs text-muted-foreground">Total tokens</div>
              <div className="mt-1 font-display text-xl font-bold">{content.totals?.totalTokens?.toLocaleString() || 0}</div>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="text-xs text-muted-foreground">Total duration</div>
              <div className="mt-1 font-display text-xl font-bold">{((content.totals?.totalDurationMs || 0) / 1000).toFixed(1)}s</div>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <div className="text-xs text-muted-foreground">Agents</div>
              <div className="mt-1 font-display text-xl font-bold">{content.pipeline?.length || 0}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
