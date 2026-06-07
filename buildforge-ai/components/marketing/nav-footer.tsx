"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Users,
  Code2,
  Cloud,
  Shield,
  TrendingUp,
  Check,
  Github,
  Twitter,
  Linkedin,
  Star,
  ChevronRight,
  PlayCircle,
  Cpu,
  Database,
  Palette,
  Server,
  Bug,
  Lock,
  Briefcase,
  Globe,
  Compass,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AGENTS } from "@/lib/agents/definitions";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass, Globe, Briefcase, Users, Palette, Database, Server, Code2, Bug, Cloud, Shield, TrendingUp,
};

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500" />
            <div className="absolute inset-[2px] flex items-center justify-center rounded-md bg-background">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
          </div>
          <span className="text-lg font-semibold tracking-tight">BuildForge AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="#agents" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Agents
          </Link>
          <Link href="#how-it-works" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link href="#features" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="#faq" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/signup">
              Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/40">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500" />
                <div className="absolute inset-[2px] flex items-center justify-center rounded-md bg-background">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <span className="text-lg font-semibold">BuildForge AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The complete AI software company. 12 specialized agents that turn your idea into a full product blueprint in minutes.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="https://twitter.com" className="rounded-md border border-border p-2 transition-colors hover:bg-accent">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="https://github.com" className="rounded-md border border-border p-2 transition-colors hover:bg-accent">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="https://linkedin.com" className="rounded-md border border-border p-2 transition-colors hover:bg-accent">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {[
            { title: "Product", links: ["Agents", "Pricing", "Roadmap", "Changelog"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Resources", links: ["Docs", "API", "Status", "Security"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© 2026 BuildForge AI. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Made with care · SOC 2 Type II in progress</p>
        </div>
      </div>
    </footer>
  );
}
