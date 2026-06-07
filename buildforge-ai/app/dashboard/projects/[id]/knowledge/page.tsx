import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload, FileText, Trash2 } from "lucide-react";
import { KnowledgeUploader } from "@/components/projects/knowledge-uploader";
import { formatRelativeTime } from "@/lib/utils/cn";

export default async function KnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const project = await prisma.project.findFirst({ where: { id, ownerId: session!.user.id } });
  if (!project) notFound();

  const docs = await prisma.knowledgeDoc.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Knowledge base</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload PDFs, docs, and CSVs. Your AI agents will cite them in every response.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload documents</CardTitle>
          <CardDescription>PDF, DOCX, TXT, Markdown, CSV. Max 25 MB per file.</CardDescription>
        </CardHeader>
        <CardContent>
          <KnowledgeUploader projectId={id} />
        </CardContent>
      </Card>

      {docs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-3 font-display font-semibold">No knowledge documents yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Upload your first document to ground agent answers in your data.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <Card key={d.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Badge variant={d.status === "READY" ? "success" : d.status === "FAILED" ? "destructive" : "warning"}>
                    {d.status.toLowerCase()}
                  </Badge>
                </div>
                <h3 className="mt-3 truncate text-sm font-semibold">{d.title}</h3>
                <div className="mt-1 text-xs text-muted-foreground">
                  {(d.size / 1024).toFixed(1)} KB · {d.mimeType}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">{formatRelativeTime(d.createdAt)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
