"use client";

import * as React from "react";
import {
  FileCode2,
  Folder,
  FolderOpen,
  Download,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

interface ScaffoldData {
  files: FileNode[];
  techStack: string[];
  setupInstructions: string[];
}

interface CodePreviewProps {
  projectId: string;
}

export function CodePreview({ projectId }: CodePreviewProps) {
  const [scaffold, setScaffold] = React.useState<ScaffoldData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  const [copied, setCopied] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/export`);
      if (res.ok) {
        const data = await res.json();
        const files = (data.files || []).map((f: Record<string, string>) => ({
          name: f.path?.split("/").pop() || f.path,
          path: f.path,
          type: "file" as const,
          content: f.content,
        }));
        setScaffold({ files, techStack: data.techStack || [], setupInstructions: data.setupInstructions || [] });
        if (files.length > 0) setExpandedFolders(new Set([""]));
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const copyFile = async (content: string, path: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAll = async () => {
    setDownloading(true);
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
      setDownloading(false);
    }
  };

  const renderTree = (nodes: FileNode[], parentPath = "") => {
    return nodes.map((node) => {
      const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isFolder = node.type === "folder";
      const isExpanded = expandedFolders.has(fullPath);

      return (
        <div key={fullPath}>
          <button
            className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-accent ${
              selectedFile?.path === fullPath ? "bg-accent text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => {
              if (isFolder) {
                toggleFolder(fullPath);
              } else {
                setSelectedFile(node);
              }
            }}
          >
            {isFolder ? (
              <>
                <ChevronRight
                  className={`h-3 w-3 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
                {isExpanded ? (
                  <FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                ) : (
                  <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
              </>
            ) : (
              <FileCode2 className="ml-3.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {isFolder && isExpanded && node.children && (
            <div className="ml-3">
              {renderTree(node.children, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!scaffold) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <FileCode2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
        <p className="text-sm">No scaffold data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileCode2 className="h-5 w-5" />
          Code Preview
        </h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            {scaffold.techStack.join(", ")}
          </div>
          <Button size="sm" onClick={downloadAll} disabled={downloading}>
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download ZIP
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 overflow-hidden rounded-xl border bg-card">
        <div className="col-span-3 border-r bg-muted/30">
          <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">Files</div>
          <ScrollArea className="h-[500px]">
            <div className="p-2">
              {renderTree(scaffold.files)}
            </div>
          </ScrollArea>
        </div>
        <div className="col-span-9">
          {selectedFile ? (
            <div>
              <div className="flex items-center justify-between border-b px-4 py-2">
                <span className="text-sm font-medium">{selectedFile.path}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyFile(selectedFile.content || "", selectedFile.path)}
                >
                  {copied === selectedFile.path ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <ScrollArea className="h-[500px]">
                <pre className="p-4 text-sm font-mono leading-relaxed">
                  <code>{selectedFile.content || "No content available"}</code>
                </pre>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex h-[500px] items-center justify-center text-muted-foreground">
              <p className="text-sm">Select a file to preview</p>
            </div>
          )}
        </div>
      </div>

      {scaffold.setupInstructions.length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Setup Instructions</h3>
          <ol className="space-y-2">
            {scaffold.setupInstructions.map((instruction, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="font-mono text-xs text-primary">{i + 1}.</span>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{instruction}</code>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
