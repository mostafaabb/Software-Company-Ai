"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function KnowledgeUploader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [drag, setDrag] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function upload(files: FileList | File[]) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", projectId);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        toast.error(`Failed to upload ${file.name}`);
      } else {
        toast.success(`${file.name} uploaded`);
      }
    }
    setUploading(false);
    router.refresh();
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files) upload(e.dataTransfer.files); }}
        className={cn(
          "rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          drag ? "border-fuchsia-500 bg-fuchsia-500/5" : "border-border/60",
        )}
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
          <Upload className="h-5 w-5 text-fuchsia-500" />
        </div>
        <h3 className="mt-3 font-display font-semibold">Drag & drop files here</h3>
        <p className="mt-1 text-sm text-muted-foreground">or click to browse. We support PDF, DOCX, TXT, MD, CSV.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv"
          onChange={(e) => e.target.files && upload(e.target.files)}
          className="hidden"
        />
        <Button variant="gradient" className="mt-4" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Choose files
        </Button>
      </div>
    </div>
  );
}
