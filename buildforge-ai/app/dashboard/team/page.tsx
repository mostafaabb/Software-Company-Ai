import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatRelativeTime } from "@/lib/utils/cn";
import { Users, UserPlus, Mail } from "lucide-react";

export default async function TeamPage() {
  const session = await auth();
  const userId = session!.user.id;
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { organization: { include: { memberships: { include: { user: true } } } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your organizations and members.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Invite a teammate</CardTitle>
          <CardDescription>They'll get an email to join your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2 sm:flex-row">
            <Input type="email" placeholder="teammate@company.com" className="flex-1" />
            <Button variant="gradient" type="submit"><Mail className="h-4 w-4" /> Send invite</Button>
          </form>
        </CardContent>
      </Card>

      {memberships.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-3 font-display font-semibold">No organization yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create or join an organization to collaborate with your team.</p>
            <Button variant="gradient" className="mt-4">Create organization</Button>
          </CardContent>
        </Card>
      ) : (
        memberships.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>{m.organization.name}</CardTitle>
              <CardDescription>{m.organization.memberships.length} members · Joined {formatRelativeTime(m.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {m.organization.memberships.map((mm) => (
                  <div key={mm.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials(mm.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{mm.user.name}</div>
                        <div className="text-xs text-muted-foreground">{mm.user.email}</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{mm.role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
