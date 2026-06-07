"use client";

import * as React from "react";
import {
  Code2,
  Copy,
  Check,
  Key,
  AlertTriangle,
  Shield,
  Activity,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const endpoints = [
  {
    method: "GET",
    path: "/api/projects",
    description: "List all projects",
    response: '{ "projects": [{ "id": "...", "name": "..." }] }',
  },
  {
    method: "POST",
    path: "/api/projects",
    description: "Create a new project",
    response: '{ "id": "...", "name": "...", "status": "created" }',
  },
  {
    method: "GET",
    path: "/api/projects/:id",
    description: "Get project details",
    response: '{ "id": "...", "name": "...", "agents": [...] }',
  },
  {
    method: "DELETE",
    path: "/api/projects/:id",
    description: "Delete a project",
    response: '{ "success": true }',
  },
  {
    method: "GET",
    path: "/api/projects/:id/agents",
    description: "List project agents",
    response: '{ "agents": [{ "type": "PRODUCT_MANAGER", "status": "..." }] }',
  },
  {
    method: "POST",
    path: "/api/projects/:id/agents/:type/run",
    description: "Run an agent",
    response: '{ "runId": "...", "status": "running" }',
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-600",
  POST: "bg-blue-500/15 text-blue-600",
  DELETE: "bg-red-500/15 text-red-600",
};

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed?: string;
  createdAt: string;
}

interface ApiDocsProps {
  projectId?: string;
}

export function ApiDocs({ projectId }: ApiDocsProps = {}) {
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [loadingKeys, setLoadingKeys] = React.useState(true);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<number | null>(null);
  const [showKey, setShowKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId || "demo"}/api-keys`);
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.apiKeys || data.keys || []);
      }
    } catch {} finally {
      setLoadingKeys(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (res.ok) {
        const key = await res.json();
        setApiKeys((prev) => [key, ...prev]);
        setNewKeyName("");
      }
    } catch {} finally {
      setCreating(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      await fetch(`/api/projects/${projectId}/api-keys/${id}`, { method: "DELETE" });
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
    } catch {}
  };

  const copySnippet = (endpoint: typeof endpoints[0], index: number) => {
    const curl = `curl -X ${endpoint.method} \\
  https://api.buildforge.ai${endpoint.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
    navigator.clipboard.writeText(curl);
    setCopiedEndpoint(index);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Code2 className="h-5 w-5" />
        API Access & Developer SDK
      </h2>

      <Card className="border-amber-500/20">
        <CardContent className="flex items-center gap-3 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium">API Rate Limit</p>
            <p className="text-xs text-muted-foreground">
              100 requests/minute per API key. Exceeding this will return a 429 status.
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Keys
        </h3>
        <div className="flex items-end gap-2 mb-3">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Key Name</Label>
            <Input
              placeholder="e.g., Production Key"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <Button onClick={createKey} disabled={creating || !newKeyName} className="gradient">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Generate
          </Button>
        </div>

        {loadingKeys ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : apiKeys.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              <Key className="mx-auto mb-2 h-6 w-6 opacity-30" />
              <p className="text-xs">No API keys yet. Generate one above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((k) => (
              <Card key={k.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-medium">{k.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-[11px] text-muted-foreground font-mono">
                        {showKey === k.id ? k.key : k.key.slice(0, 8) + "••••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => setShowKey(showKey === k.id ? null : k.id)}
                      >
                        {showKey === k.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteKey(k.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Endpoints
        </h3>
        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`${methodColors[ep.method]} border-0 text-[10px] font-mono`}>
                      {ep.method}
                    </Badge>
                    <code className="text-sm font-mono">{ep.path}</code>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copySnippet(ep, i)}>
                    {copiedEndpoint === i ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{ep.description}</p>
                <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-[11px] font-mono">
                  {ep.response}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Usage Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Endpoint</th>
                  <th className="pb-2 font-medium">Calls (30d)</th>
                  <th className="pb-2 font-medium">Avg Latency</th>
                  <th className="pb-2 font-medium">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 font-mono">GET /api/projects</td>
                  <td className="py-2">1,247</td>
                  <td className="py-2">45ms</td>
                  <td className="py-2">2</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">POST /api/projects</td>
                  <td className="py-2">38</td>
                  <td className="py-2">120ms</td>
                  <td className="py-2">0</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">GET /api/projects/:id</td>
                  <td className="py-2">3,891</td>
                  <td className="py-2">32ms</td>
                  <td className="py-2">5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
