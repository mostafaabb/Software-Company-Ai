import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatRelativeTime } from "@/lib/utils/cn";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { projects: true, agentRuns: true } } },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">All registered users on the platform.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{u.name || "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{u._count.projects} projects · {u._count.agentRuns} runs</span>
                  <Badge variant={u.role === "ADMIN" || u.role === "SUPER_ADMIN" ? "gradient" : "outline"}>
                    {u.role.toLowerCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
