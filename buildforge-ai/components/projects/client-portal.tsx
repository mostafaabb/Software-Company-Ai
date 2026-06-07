"use client";

import * as React from "react";
import {
  Share2,
  Link2,
  Copy,
  Check,
  Lock,
  Clock,
  Eye,
  Plus,
  Loader2,
  QrCode,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SharedLink {
  id: string;
  token: string;
  url: string;
  hasPassword: boolean;
  expiresAt?: string;
  viewCount: number;
  createdAt: string;
}

interface ClientPortalProps {
  projectId: string;
}

export function ClientPortal({ projectId }: ClientPortalProps) {
  const [links, setLinks] = React.useState<SharedLink[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [expiry, setExpiry] = React.useState("7");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showQr, setShowQr] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchLinks();
  }, [projectId]);

  const fetchLinks = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/share`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const createLink = async () => {
    setCreating(true);
    try {
      const body: any = {};
      if (password) body.password = password;
      if (expiry) body.expiryDays = Number(expiry);
      const res = await fetch(`/api/projects/${projectId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const link = await res.json();
        setLinks((prev) => [link, ...prev]);
        setPassword("");
      }
    } catch {} finally {
      setCreating(false);
    }
  };

  const copyLink = (link: SharedLink) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Share2 className="h-5 w-5" />
        Client Portal
      </h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Create Shared Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Password (optional)
              </Label>
              <Input
                type="password"
                placeholder="Leave blank for no password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expires after (days)
              </Label>
              <Input
                type="number"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                min={1}
                max={90}
              />
            </div>
          </div>
          <Button onClick={createLink} disabled={creating} className="gradient">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Link
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : links.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Link2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">No shared links yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <Card key={link.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Link2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-mono text-xs">{link.url}</p>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      {link.hasPassword && (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Protected
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {link.viewCount} views
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowQr(showQr === link.id ? null : link.id)}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyLink(link)}
                  >
                    {copiedId === link.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
              {showQr === link.id && (
                <div className="border-t p-4 flex justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-lg border bg-white">
                    <div className="grid grid-cols-5 gap-0.5">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 w-4 rounded-sm ${
                            Math.random() > 0.5 ? "bg-black" : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
