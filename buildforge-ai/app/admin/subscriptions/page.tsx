import { prisma } from "@/lib/db/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function AdminSubscriptions() {
  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">All customer subscriptions.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {subs.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{s.plan}</div>
                  <div className="text-xs text-muted-foreground">{s.stripeCustomerId || "—"}</div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant={s.status === "ACTIVE" ? "success" : s.status === "TRIALING" ? "warning" : "outline"}>
                    {s.status.toLowerCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(s.createdAt)}</span>
                </div>
              </div>
            ))}
            {subs.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No subscriptions yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
