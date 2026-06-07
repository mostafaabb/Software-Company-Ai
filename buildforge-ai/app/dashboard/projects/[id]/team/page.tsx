import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Users, Mail, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils/cn";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({
    where: { id, OR: [{ ownerId: session!.user.id }] },
    include: { owner: true },
  });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">Collaborate with co-founders, designers, and engineers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Invite a teammate</CardTitle>
          <CardDescription>Send an email invitation with a role.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2 sm:flex-row">
            <Input type="email" placeholder="teammate@company.com" className="flex-1" />
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
            <Button variant="gradient" type="submit"><Mail className="h-4 w-4" /> Send invite</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <MemberRow name={project.owner.name || "Owner"} email={project.owner.email} role="Owner" you />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MemberRow({ name, email, role, you }: { name: string; email: string; role: string; you?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">
            {name} {you && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
          </div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {role === "Owner" && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
        <span className="text-muted-foreground">{role}</span>
      </div>
    </div>
  );
}
