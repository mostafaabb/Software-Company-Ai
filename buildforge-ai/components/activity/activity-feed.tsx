"use client";

import * as React from "react";
import {
  Plus,
  Edit,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  GitBranch,
  Settings,
  Filter,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const actionIcons: Record<string, any> = {
  created: Plus,
  updated: Edit,
  deleted: Trash2,
  deployed: Play,
  completed: CheckCircle2,
  error: AlertCircle,
  comment: MessageSquare,
  document: FileText,
  version: GitBranch,
  settings: Settings,
};

const actionColors: Record<string, string> = {
  created: "text-emerald-500",
  updated: "text-blue-500",
  deleted: "text-red-500",
  deployed: "text-purple-500",
  completed: "text-emerald-500",
  error: "text-red-500",
  comment: "text-amber-500",
  document: "text-cyan-500",
  version: "text-indigo-500",
  settings: "text-gray-500",
};

interface ActivityEntry {
  id: string;
  action: string;
  description: string;
  user: { name: string; avatar?: string };
  resource?: { type: string; name: string; link?: string };
  createdAt: string;
}

const actionTypes = [
  { value: "all", label: "All Actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deployed", label: "Deployed" },
  { value: "completed", label: "Completed" },
  { value: "error", label: "Errors" },
  { value: "comment", label: "Comments" },
];

export function ActivityFeed() {
  const [activities, setActivities] = React.useState<ActivityEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    fetchActivities();
  }, [filter]);

  const fetchActivities = async (append = false) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (filter !== "all") params.set("action", filter);
      const res = await fetch(`/api/activity?${params}`);
      if (res.ok) {
        const data = await res.json();
        setActivities((prev) => (append ? [...prev, ...data] : data));
      }
    } catch {} finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    setPage((p) => p + 1);
    setLoadingMore(true);
    fetchActivities(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activity Feed</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="rounded-md border bg-background px-3 py-1.5 text-sm"
          >
            {actionTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {activities.map((entry) => {
              const Icon = actionIcons[entry.action] || Settings;
              const iconColor = actionColors[entry.action] || "text-gray-500";
              return (
                <div key={entry.id} className="relative flex gap-4 pl-0">
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm">{entry.description}</p>
                        {entry.resource && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {entry.resource.link ? (
                              <a href={entry.resource.link} className="underline hover:text-foreground">
                                {entry.resource.name}
                              </a>
                            ) : (
                              entry.resource.name
                            )}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && activities.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore}>
            {loadingMore && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
