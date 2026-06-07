import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function AdminAudit() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Audit logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Append-only trail of security-relevant events.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {logs.map((l) => (
              <div key={l.id} className="grid grid-cols-12 gap-2 p-3 text-sm">
                <div className="col-span-3 font-mono text-xs">{l.action}</div>
                <div className="col-span-3 truncate text-muted-foreground">{l.user?.email || "system"}</div>
                <div className="col-span-3 truncate text-muted-foreground">{l.resource}</div>
                <div className="col-span-2 truncate text-muted-foreground">{l.ipAddress || "—"}</div>
                <div className="col-span-1 text-right text-xs text-muted-foreground">{formatRelativeTime(l.createdAt)}</div>
              </div>
            ))}
            {logs.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No audit events yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
