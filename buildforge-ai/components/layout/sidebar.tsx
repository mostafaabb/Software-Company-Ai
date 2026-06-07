"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles, LayoutDashboard, FolderKanban, CreditCard, Users, Settings, Shield,
  Compass, Globe, Briefcase, Brain, Palette, Database, Server, Code2, Bug, Cloud, Lock, TrendingUp, Layers,
  LayoutTemplate, BarChart3, Gift, FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
  { href: "/dashboard/api-docs", label: "API Docs", icon: FileCode },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/60 bg-card/30 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500" />
          <div className="absolute inset-[2px] flex items-center justify-center rounded-md bg-background">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <span className="text-base font-semibold tracking-tight">BuildForge AI</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 text-foreground ring-1 ring-fuchsia-500/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {item.label === "Projects" && (
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">
                  12
                </Badge>
              )}
            </Link>
          );
        })}

        <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Agents
        </div>
        {[
          { label: "All agents", icon: Layers, href: "/dashboard/agents" },
          { label: "Product Manager", icon: Compass, color: "text-violet-500" },
          { label: "Market Research", icon: Globe, color: "text-blue-500" },
          { label: "Business Analyst", icon: Briefcase, color: "text-emerald-500" },
          { label: "Database Architect", icon: Database, color: "text-cyan-500" },
          { label: "Backend Architect", icon: Server, color: "text-indigo-500" },
          { label: "Frontend Architect", icon: Code2, color: "text-sky-500" },
          { label: "QA Engineer", icon: Bug, color: "text-rose-500" },
          { label: "DevOps Engineer", icon: Cloud, color: "text-slate-500" },
          { label: "Security Engineer", icon: Lock, color: "text-red-500" },
          { label: "Financial Analyst", icon: TrendingUp, color: "text-yellow-500" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href || "#"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <a.icon className={cn("h-4 w-4 shrink-0", a.color)} />
            <span>{a.label}</span>
          </Link>
        ))}
      </nav>
      <div className="border-t border-border/60 p-3">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-fuchsia-500" />
            <span className="text-xs font-medium">Free plan</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">2 / 2 projects used</p>
          <Link
            href="/dashboard/billing"
            className="mt-3 block rounded-md bg-foreground py-1.5 text-center text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </aside>
  );
}
