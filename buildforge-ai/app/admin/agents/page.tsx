import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AGENTS } from "@/lib/agents/definitions";
import { Sparkles, TrendingUp } from "lucide-react";

export default async function AdminAgents() {
  const runs = await prisma.agentRun.groupBy({
    by: ["agentType", "status"],
    _count: { _all: true },
  });
  const totalTokens = await prisma.agentRun.aggregate({ _sum: { tokensUsed: true, durationMs: true } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Agent monitoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">Per-agent performance and reliability.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total tokens</div>
            <div className="mt-1 font-display text-xl font-bold">{(totalTokens._sum.tokensUsed || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total compute</div>
            <div className="mt-1 font-display text-xl font-bold">{((totalTokens._sum.durationMs || 0) / 1000 / 60).toFixed(1)} min</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => {
          const stats = runs.filter((r) => r.agentType === a.type);
          const total = stats.reduce((s, r) => s + r._count._all, 0);
          const completed = stats.find((s) => s.status === "COMPLETED")?._count._all || 0;
          const failed = stats.find((s) => s.status === "FAILED")?._count._all || 0;
          return (
            <Card key={a.type}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${a.gradient} text-white`}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.shortRole}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-display text-lg font-bold">{total}</div>
                    <div className="text-muted-foreground">Runs</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-emerald-500">{completed}</div>
                    <div className="text-muted-foreground">Done</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-rose-500">{failed}</div>
                    <div className="text-muted-foreground">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
