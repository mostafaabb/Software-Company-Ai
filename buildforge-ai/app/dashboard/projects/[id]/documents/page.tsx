import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/cn";
import { JsonView } from "@/components/shared/json-view";

export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: session!.user.id } });
  if (!project) notFound();

  const docs = await prisma.document.findMany({ where: { projectId: id }, orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Generated documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">All artifacts produced by your AI team, versioned and exportable.</p>
      </div>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <FileText className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">No documents yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Run agents to generate product specs, schemas, and blueprints.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {docs.map((d) => (
            <Card key={d.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <CardDescription>
                    Created {formatRelativeTime(d.createdAt)} · v{d.version}
                  </CardDescription>
                </div>
                <Badge variant="outline">{d.type}</Badge>
              </CardHeader>
              <CardContent>
                <JsonView data={safeParse(d.content)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function safeParse(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
