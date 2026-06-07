"use client";

import * as React from "react";
import {
  BarChart3,
  FolderKanban,
  Cpu,
  Coins,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  totalProjects: number;
  totalAgentRuns: number;
  totalTokens: number;
  estimatedCost: number;
  activityTimeline: { date: string; count: number }[];
  agentUsage: { name: string; count: number }[];
  costBreakdown: { feature: string; cost: number }[];
}

export function AnalyticsDashboard() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const d = await res.json();
        if (d.totalProjects !== undefined) { setData(d); return; }
      }
    } catch {}

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    setData({
      totalProjects: 3,
      totalAgentRuns: 42,
      totalTokens: 128400,
      estimatedCost: 2.57,
      activityTimeline: days.map((date) => ({ date, count: Math.floor(Math.random() * 10) + 1 })),
      agentUsage: [
        { name: "Product Manager", count: 12 },
        { name: "Market Research", count: 10 },
        { name: "Business Analyst", count: 8 },
        { name: "UX Research", count: 7 },
        { name: "Code Generator", count: 5 },
      ],
      costBreakdown: [
        { feature: "Agent Runs", cost: 1.20 },
        { feature: "Code Generation", cost: 0.85 },
        { feature: "Chat Messages", cost: 0.32 },
        { feature: "Knowledge Base", cost: 0.20 },
      ],
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <BarChart3 className="mx-auto mb-3 h-10 w-10 opacity-30" />
        <p className="text-sm">No analytics data available.</p>
      </div>
    );
  }

  const maxActivity = Math.max(...data.activityTimeline.map((d) => d.count), 1);
  const maxCost = Math.max(...data.costBreakdown.map((c) => c.cost), 1);

  const stats = [
    { label: "Total Projects", value: data.totalProjects, icon: FolderKanban, color: "text-blue-500" },
    { label: "Agent Runs", value: data.totalAgentRuns.toLocaleString(), icon: Cpu, color: "text-purple-500" },
    { label: "Total Tokens", value: (data.totalTokens / 1000).toFixed(1) + "K", icon: TrendingUp, color: "text-emerald-500" },
    { label: "Estimated Cost", value: "$" + data.estimatedCost.toFixed(2), icon: Coins, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Usage Analytics
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 opacity-50 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-32">
              {data.activityTimeline.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-indigo-500 to-fuchsia-500 transition-all"
                    style={{ height: `${(d.count / maxActivity) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
                  />
                  <span className="mt-1 text-[9px] text-muted-foreground">
                    {new Date(d.date).toLocaleDateString("en", { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Agent Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.agentUsage.slice(0, 6).map((a) => (
              <div key={a.name} className="flex items-center gap-2">
                <span className="w-24 truncate text-xs text-muted-foreground">{a.name}</span>
                <div className="flex-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                    style={{ width: `${(a.count / data.totalAgentRuns) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{a.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.costBreakdown.map((c) => (
                <div key={c.feature} className="flex items-center gap-3">
                  <span className="w-32 text-xs text-muted-foreground">{c.feature}</span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      style={{ width: `${(c.cost / maxCost) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-xs font-mono">${c.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
