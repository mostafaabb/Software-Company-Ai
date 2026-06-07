import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const [userCount, projectCount, runCount, mrr, activeSubs, totalTokens] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.agentRun.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.findMany({ where: { status: "ACTIVE" } }),
    prisma.usageMetric.aggregate({ _sum: { value: true }, where: { metric: "agent_run" } }),
  ]);

  const mrrCents = activeSubs.reduce((acc, s) => {
    const plan = s.plan as keyof typeof import("@/lib/billing/stripe").PLANS;
    return acc;
  }, 0);

  const recentRuns = await prisma.agentRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: { project: { select: { name: true, id: true } }, triggeredBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json({
    metrics: {
      userCount,
      projectCount,
      runCount,
      activeSubscriptions: activeSubs,
      mrrCents,
      totalAgentRuns: totalTokens._sum.value || 0,
    },
    recentRuns,
  });
}
