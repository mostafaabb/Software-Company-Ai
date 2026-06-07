import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils/cn";

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, security, and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your public information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change photo</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user.name || ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Job title</Label>
              <Input id="jobTitle" defaultValue={user.jobTitle || ""} placeholder="Founder, CTO, ..." />
            </div>
          </div>
          <Button variant="gradient">Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Keep your account safe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <div className="font-medium">Two-factor authentication</div>
              <div className="text-sm text-muted-foreground">Add an extra layer of security.</div>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <div className="font-medium">Active sessions</div>
              <div className="text-sm text-muted-foreground">Sign out of other devices.</div>
            </div>
            <Button variant="outline">View</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-500/40">
        <CardHeader>
          <CardTitle className="text-rose-500">Danger zone</CardTitle>
          <CardDescription>Irreversible actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-rose-500/40 p-4">
            <div>
              <div className="font-medium">Delete account</div>
              <div className="text-sm text-muted-foreground">All your data will be permanently deleted.</div>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
