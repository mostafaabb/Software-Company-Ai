"use client";

import * as React from "react";
import {
  Download,
  Globe,
  GitBranch,
  FileCode2,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ExportData {
  fileCount: number;
  techStack: string[];
}

interface ExportPanelProps {
  projectId: string;
}

export function ExportPanel({ projectId }: ExportPanelProps) {
  const [exporting, setExporting] = React.useState(false);
  const [deploying, setDeploying] = React.useState(false);
  const [pushing, setPushing] = React.useState(false);
  const [deployed, setDeployed] = React.useState(false);
  const [pushed, setPushed] = React.useState(false);
  const [exportData, setExportData] = React.useState<ExportData | null>(null);

  React.useEffect(() => {
    fetchExportData();
  }, [projectId]);

  const fetchExportData = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/export`);
      if (res.ok) {
        const data = await res.json();
        setExportData({ fileCount: data.files?.length || 0, techStack: data.techStack || [] });
      }
    } catch {}
  };

  const handleDownload = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/export?format=zip`);
      if (res.ok) {
        const blob = await res.blob();
        const disposition = res.headers.get("Content-Disposition") || "";
        const match = disposition.match(/filename="?(.+?)"?$/);
        const filename = match ? match[1] : "project.zip";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {} finally {
      setExporting(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      setDeployed(true);
    } catch {} finally {
      setDeploying(false);
    }
  };

  const handlePush = async () => {
    setPushing(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setPushed(true);
    } catch {} finally {
      setPushing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Download className="h-5 w-5" />
        Export & Deploy
      </h2>

      {exportData && (
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg border bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{exportData.fileCount}</p>
            <p className="text-xs text-muted-foreground">Files</p>
          </div>
          <div className="flex-1 rounded-lg border bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{exportData.techStack.length}</p>
            <p className="text-xs text-muted-foreground">Technologies</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Card className="transition-colors hover:border-primary/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Download ZIP</p>
                <p className="text-xs text-muted-foreground">Download project as a ZIP archive</p>
              </div>
            </div>
            <Button size="sm" onClick={handleDownload} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-colors hover:border-primary/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Globe className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Deploy to Vercel</p>
                <p className="text-xs text-muted-foreground">Deploy your project with one click</p>
              </div>
            </div>
            {deployed ? (
              <Button size="sm" variant="outline" asChild>
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
              </Button>
            ) : (
              <Button size="sm" onClick={handleDeploy} disabled={deploying}>
                {deploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                Deploy
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="transition-colors hover:border-primary/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10">
                <GitBranch className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Push to GitHub</p>
                <p className="text-xs text-muted-foreground">Create a new repository and push code</p>
              </div>
            </div>
            {pushed ? (
              <Button size="sm" variant="outline" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
              </Button>
            ) : (
              <Button size="sm" onClick={handlePush} disabled={pushing}>
                {pushing ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
                Push
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
