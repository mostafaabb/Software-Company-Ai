"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles, FileText, MessageSquare, BookOpen, Layers, Database, Server, Code2,
  Bug, Cloud, Lock, TrendingUp, Compass, Globe, Briefcase, Palette, Brain, Map, BarChart3, Users,
  Download, History, SlidersHorizontal, Share2, Plug,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const sections = [
  { href: "", label: "Overview", icon: Sparkles, match: (p: string) => p === "" },
  { href: "agents", label: "AI Agents", icon: Brain, match: (p: string) => p === "agents" },
  { href: "chat", label: "Chat", icon: MessageSquare, match: (p: string) => p === "chat" },
  { href: "documents", label: "Documents", icon: FileText, match: (p: string) => p === "documents" },
  { href: "knowledge", label: "Knowledge base", icon: BookOpen, match: (p: string) => p === "knowledge" },
  { href: "report", label: "Master report", icon: Layers, match: (p: string) => p === "report" },
  { href: "roadmap", label: "Roadmap", icon: Map, match: (p: string) => p === "roadmap" },
  { href: "team", label: "Team", icon: Users, match: (p: string) => p === "team" },
  { href: "export", label: "Export & Deploy", icon: Download, match: (p: string) => p === "export" },
  { href: "versions", label: "Versions", icon: History, match: (p: string) => p === "versions" },
  { href: "customization", label: "Customize Agents", icon: SlidersHorizontal, match: (p: string) => p === "customization" },
  { href: "portal", label: "Client Portal", icon: Share2, match: (p: string) => p === "portal" },
  { href: "code", label: "Generated Code", icon: Code2, match: (p: string) => p === "code" },
  { href: "integrations", label: "Integrations", icon: Plug, match: (p: string) => p === "integrations" },
];

const agentIcons: Record<string, any> = {
  PRODUCT_MANAGER: Compass, MARKET_RESEARCH: Globe, BUSINESS_ANALYST: Briefcase,
  UX_RESEARCH: Brain, UI_DESIGN: Palette, DATABASE_ARCHITECT: Database,
  BACKEND_ARCHITECT: Server, FRONTEND_ARCHITECT: Code2, QA_ENGINEER: Bug,
  DEVOPS_ENGINEER: Cloud, SECURITY_ENGINEER: Lock, FINANCIAL_ANALYST: TrendingUp,
};

export function ProjectSidebar({ projectId, projectName }: { projectId: string; projectName: string }) {
  const pathname = usePathname() || "";
  const base = `/dashboard/projects/${projectId}`;
  const rest = pathname.replace(base, "").replace(/^\//, "");

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto md:block">
      <div className="mb-4">
        <Link href={base} className="block">
          <div className="text-xs text-muted-foreground">Project</div>
          <div className="font-display text-sm font-semibold">{projectName}</div>
        </Link>
      </div>
      <nav className="space-y-0.5">
        {sections.map((s) => {
          const active = s.match(rest);
          return (
            <Link
              key={s.label}
              href={`${base}${s.href ? `/${s.href}` : ""}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </Link>
          );
        })}
        <div className="mt-5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Agent views
        </div>
        {[
          { type: "PRODUCT_MANAGER", label: "Product" },
          { type: "MARKET_RESEARCH", label: "Market" },
          { type: "BUSINESS_ANALYST", label: "Business" },
          { type: "UX_RESEARCH", label: "UX Research" },
          { type: "UI_DESIGN", label: "UI Design" },
          { type: "DATABASE_ARCHITECT", label: "Database" },
          { type: "BACKEND_ARCHITECT", label: "Backend" },
          { type: "FRONTEND_ARCHITECT", label: "Frontend" },
          { type: "QA_ENGINEER", label: "QA" },
          { type: "DEVOPS_ENGINEER", label: "DevOps" },
          { type: "SECURITY_ENGINEER", label: "Security" },
          { type: "FINANCIAL_ANALYST", label: "Financials" },
        ].map((a) => {
          const Icon = agentIcons[a.type];
          const active = rest === "agents/" + a.type.toLowerCase().replace(/_/g, "-");
          return (
            <Link
              key={a.type}
              href={`${base}/agents/${a.type.toLowerCase().replace(/_/g, "-")}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {a.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
