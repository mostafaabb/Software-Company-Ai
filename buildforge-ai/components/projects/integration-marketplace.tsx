"use client";

import * as React from "react";
import {
  Search,
  Plug,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const integrations = [
  {
    id: "jira",
    name: "Jira",
    description: "Sync issues and track project progress with Jira.",
    category: "project-management",
    icon: "🟦",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Modern issue tracking for software teams.",
    category: "project-management",
    icon: "◼️",
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for docs and project management.",
    category: "productivity",
    icon: "📝",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications and updates in your Slack channels.",
    category: "communication",
    icon: "💬",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Push code, sync issues, and manage pull requests.",
    category: "development",
    icon: "🐙",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Import designs and sync with your design system.",
    category: "design",
    icon: "🎨",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5000+ apps via automated workflows.",
    category: "automation",
    icon: "⚡",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send updates to your Discord server.",
    category: "communication",
    icon: "🤖",
  },
];

const integrationCategories = [
  { id: "all", label: "All" },
  { id: "project-management", label: "Project Management" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "development", label: "Development" },
  { id: "design", label: "Design" },
  { id: "automation", label: "Automation" },
];

export function IntegrationMarketplace() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [connected, setConnected] = React.useState<Set<string>>(new Set());
  const [toggling, setToggling] = React.useState<string | null>(null);

  const filtered = integrations.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleConnection = async (id: string) => {
    setToggling(id);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setConnected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } catch {} finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Plug className="h-5 w-5" />
          Integrations
        </h2>
        <Badge variant="outline">
          {connected.size} connected
        </Badge>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {integrationCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((integration) => {
          const isConnected = connected.has(integration.id);
          return (
            <Card key={integration.id} className="transition-all hover:border-primary/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{integration.name}</p>
                      {isConnected && (
                        <Badge variant="success" className="text-[10px]">
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{integration.description}</p>
                  </div>
                </div>
                <Button
                  variant={isConnected ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleConnection(integration.id)}
                  disabled={toggling === integration.id}
                >
                  {toggling === integration.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isConnected ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
