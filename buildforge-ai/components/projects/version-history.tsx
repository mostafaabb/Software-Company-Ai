"use client";

import * as React from "react";
import {
  History,
  Tag,
  Plus,
  Eye,
  GitBranch,
  Clock,
  Users,
  Loader2,
  ArrowLeftRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Version {
  id: string;
  number: number;
  label?: string;
  agentCount: number;
  createdAt: string;
}

interface VersionHistoryProps {
  projectId: string;
}

export function VersionHistory({ projectId }: VersionHistoryProps) {
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [compareMode, setCompareMode] = React.useState(false);
  const [compareA, setCompareA] = React.useState<string | null>(null);
  const [compareB, setCompareB] = React.useState<string | null>(null);
  const [diff, setDiff] = React.useState<any>(null);

  React.useEffect(() => {
    fetchVersions();
  }, [projectId]);

  const fetchVersions = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const createSnapshot = async () => {
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`, { method: "POST" });
      if (res.ok) {
        const v = await res.json();
        setVersions((prev) => [v, ...prev]);
      }
    } catch {} finally {
      setCreating(false);
    }
  };

  const viewDiff = async (versionId: string) => {
    setSelected(versionId);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions/${versionId}`);
      if (res.ok) {
        const data = await res.json();
        setDiff(data.version || data);
      }
    } catch {}
  };

  const handleCompareSelect = (id: string) => {
    if (!compareA) {
      setCompareA(id);
    } else if (!compareB && id !== compareA) {
      setCompareB(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </h2>
        <div className="flex gap-2">
          {compareMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setCompareMode(false); setCompareA(null); setCompareB(null); }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => { setCompareMode(!compareMode); setCompareA(null); setCompareB(null); }}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Compare
          </Button>
          <Button size="sm" onClick={createSnapshot} disabled={creating} className="gradient">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Snapshot
          </Button>
        </div>
      </div>

      {compareMode && compareA && compareB && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Comparing Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Comparing version {versions.find((v) => v.id === compareA)?.number} with version{" "}
              {versions.find((v) => v.id === compareB)?.number}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-xs font-medium mb-2">Version {versions.find((v) => v.id === compareA)?.number}</p>
                <p className="text-xs text-muted-foreground">
                  {compareA && versions.find((v) => v.id === compareA)?.label || "No label"}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-xs font-medium mb-2">Version {versions.find((v) => v.id === compareB)?.number}</p>
                <p className="text-xs text-muted-foreground">
                  {compareB && versions.find((v) => v.id === compareB)?.label || "No label"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : versions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GitBranch className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No versions yet. Create your first snapshot.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {versions.map((v) => (
            <Card
              key={v.id}
              className={`transition-colors ${
                compareMode
                  ? "cursor-pointer hover:border-primary"
                  : selected === v.id
                  ? "border-primary"
                  : ""
              }`}
              onClick={() => {
                if (compareMode) {
                  handleCompareSelect(v.id);
                } else {
                  viewDiff(v.id);
                }
              }}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Version {v.number}
                      {v.label && <span className="ml-2 text-muted-foreground">- {v.label}</span>}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {v.agentCount} agents
                      </span>
                    </div>
                  </div>
                </div>
                {!compareMode && (
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {compareMode && (
                  <Badge variant={compareA === v.id || compareB === v.id ? "default" : "outline"}>
                    {compareA === v.id ? "A" : compareB === v.id ? "B" : ""}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {diff && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-xs font-mono">
              {JSON.stringify(diff, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
