"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Users, CreditCard, Cpu, BarChart3, FileText, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/agents", label: "Agents", icon: Cpu },
  { href: "/admin/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/admin/audit", label: "Audit logs", icon: FileText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/60 bg-card/30 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
          <Shield className="h-5 w-5 text-fuchsia-500" />
          <span className="text-base font-semibold">Admin panel</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((i) => {
            const active = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <i.icon className="h-4 w-4" />
                {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to app
          </Link>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-6 lg:pl-72 lg:pr-8">{children}</main>
    </div>
  );
}
