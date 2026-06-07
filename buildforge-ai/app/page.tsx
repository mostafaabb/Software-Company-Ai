"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Zap, Brain, Check, Star, ChevronRight, PlayCircle, Sparkle, Wand2, Rocket,
  CheckCircle2, MessageSquare, FileText, Layers, Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNav, MarketingFooter } from "@/components/marketing/nav-footer";
import { AGENTS } from "@/lib/agents/definitions";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

const SAMPLE_IDEA =
  "Build me a restaurant management SaaS with inventory, QR ordering, employee scheduling, analytics, and customer loyalty.";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundOrbs />
      <MarketingNav />
      <Hero />
      <SocialProof />
      <AgentsGrid />
      <HowItWorks />
      <Features />
      <UseCases />
      <WhatsNew />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}

function BackgroundOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-blob" />
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute left-1/3 top-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-blob animation-delay-4000" />
      <div className="absolute inset-0 grid-pattern opacity-50 dark:opacity-100" />
    </div>
  );
}

function Hero() {
  const [idea, setIdea] = React.useState(SAMPLE_IDEA);
  return (
    <section className="relative pt-20 pb-24">
      <div className="container">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-6 gap-1.5 border-border/60 bg-background/60 px-3 py-1 backdrop-blur">
            <Sparkles className="h-3 w-3 text-fuchsia-500" />
            <span className="text-xs font-medium">14 AI agents. One software company. Zero overhead.</span>
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Your idea.
            <br />
            <span className="gradient-text">An entire AI software company.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Describe your software idea in plain English. BuildForge AI spins up 14 specialized AI agents — Discovery, Product, Architecture, Design, Database, DevOps, Security, Finance, Code Generator — that collaborate to build a complete product blueprint and generate starter code.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1} className="mx-auto mt-10 max-w-3xl">
          <Card className="group relative overflow-hidden border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
            <div className="absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-pink-500/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground">buildforge.ai/new-project</span>
              </div>
            </div>
            <CardContent className="space-y-4 p-6">
              <label className="text-sm font-medium text-muted-foreground">Describe your software idea</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-background/80 p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Brain className="h-3.5 w-3.5" />
                  <span>Discovery · PM · Market · UX · DB · API · QA · DevOps · Security · Finance · Code</span>
                </div>
                <Button variant="gradient" size="lg" asChild>
                  <Link href="/signup?next=/dashboard/projects/new">
                    Forge my company <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2} className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Avg. generation time", value: "3.4 min" },
            { label: "AI agents", value: "14" },
            { label: "Pages of output", value: "150+" },
            { label: "Generated code files", value: "20+" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SocialProof() {
  const companies = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "Anthropic", "OpenAI", "Cloudflare"];
  return (
    <section className="border-y border-border/40 bg-background/40 py-10">
      <div className="container">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by 2,000+ founders and teams worldwide
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {companies.map((c) => (
            <span key={c} className="font-display text-xl font-semibold tracking-tight text-muted-foreground">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentsGrid() {
  return (
    <section id="agents" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gradient" className="mb-4">Meet the team</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            12 AI specialists. Working as one.
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Each agent is a domain expert with its own goal, system prompt, and tools. They hand off work to each other like a real product team.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {AGENTS.map((agent, i) => {
            const Icon = (require("lucide-react") as any)[agent.icon] || Sparkles;
            return (
              <motion.div
                key={agent.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:border-border hover:shadow-xl hover:shadow-fuchsia-500/5">
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${agent.gradient}`} />
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${agent.gradient} text-white shadow-lg`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {agent.shortRole}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">{agent.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{agent.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {agent.outputs.slice(0, 3).map((o) => (
                        <Badge key={o} variant="secondary" className="text-[10px] font-normal">
                          {o}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, icon: MessageSquare, title: "Describe your idea", body: "Type a paragraph in plain English. No templates, no forms." },
    { n: 2, icon: Brain, title: "Discovery agent interviews you", body: "Oracle asks targeted questions to deeply understand your vision." },
    { n: 3, icon: Layers, title: "14 agents collaborate", body: "They execute in sequence, handing off outputs the way a real team would." },
    { n: 4, icon: FileText, title: "Get code + blueprint", body: "PRD, architecture, ERD, API, UX, GTM, financials — plus generated starter code." },
  ];
  return (
    <section id="how-it-works" className="border-y border-border/40 bg-background/40 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">How it works</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            From paragraph to product plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            In under 5 minutes, go from a fuzzy idea to a 150-page blueprint and starter code.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/30">
                {s.n}
              </div>
              <s.icon className="absolute right-0 top-0 h-5 w-5 text-muted-foreground/30" />
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Sparkle, title: "14-agent orchestration", body: "LangGraph-inspired DAG with sequential, parallel, and conditional workflows." },
    { icon: MessageSquare, title: "Streaming chat with any agent", body: "Talk to the PM, ask the architect, or debate the security lead — with citations." },
    { icon: FileText, title: "Knowledge base + RAG", body: "Upload PDFs, docs, and CSVs. Agents cite your sources in every answer." },
    { icon: Wand2, title: "Production-ready code", body: "Generate starter code with Prisma schemas, OpenAPI specs, Dockerfiles, and k8s manifests." },
    { icon: Rocket, title: "One-click deploy", body: "Export as ZIP, deploy to Vercel, or push to GitHub — from blueprint to running app." },
    { icon: Cpu, title: "Multi-model support", body: "Bring your own key: OpenAI, Anthropic, or Google — or run fully on the bundled mock." },
    { icon: CheckCircle2, title: "Enterprise security", body: "SOC 2 ready. RBAC, audit logs, encryption at rest, SSO and SCIM on Agency plans." },
    { icon: Layers, title: "Version control + collaboration", body: "Version snapshots, diff outputs, leave comments, invite your team, share with clients." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Built like a real product team</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:bg-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20">
                <f.icon className="h-5 w-5 text-fuchsia-500" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    { title: "Validate a startup idea", body: "Get a market analysis, MVP scope, and pricing model in minutes." },
    { title: "Plan a new product", body: "Hand the output to your engineers. They get a database schema, APIs, and starter code on day one." },
    { title: "Pitch investors", body: "Export a polished 150-page blueprint with generated code. Use it as a discussion doc." },
    { title: "Replace consulting", body: "Save $50k–$200k of upfront discovery, design, and architecture fees." },
  ];
  return (
    <section className="border-y border-border/40 bg-background/40 py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="gradient" className="mb-4">Use cases</Badge>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              For founders, freelancers, and Fortune 500s.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              BuildForge AI is the fastest way to turn a software idea into a credible, shareable plan.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Replace weeks of discovery with a 5-minute agent run.",
                "Use the output as a spec for your engineering team.",
                "Spin up unlimited side-project plans without paying a consultant.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/signup">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#how-it-works">See a demo</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cases.map((c) => (
              <Card key={c.title} className="border-border/60 bg-card/60">
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsNew() {
  const items = [
    { icon: "🔍", title: "Discovery Agent", desc: "Oracle interviews you before the pipeline runs — better input, better output." },
    { icon: "💻", title: "Code Generator", desc: "Forge Coder produces actual starter code: Next.js pages, Prisma schemas, Docker configs." },
    { icon: "📋", title: "Project Templates", desc: "8 pre-built templates: SaaS, E-Commerce, Marketplace, LMS, and more." },
    { icon: "🔀", title: "Version Control", desc: "Snapshot agent outputs, diff versions, rollback to any point." },
    { icon: "🚀", title: "Export & Deploy", desc: "Download as ZIP, deploy to Vercel, or push to GitHub — blueprint to running app." },
    { icon: "🎨", title: "Agent Customization", desc: "Tweak each agent's prompt, temperature, and token limits per project." },
    { icon: "📊", title: "Analytics Dashboard", desc: "Track token usage, agent activity, and cost breakdown in real-time." },
    { icon: "🤝", title: "Client Portal", desc: "Share branded project views with clients. Password-protected, trackable links." },
  ];
  return (
    <section className="border-y border-border/40 bg-background/40 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gradient" className="mb-4">What&apos;s New</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Now a full AI software company
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From discovery to deployment — 14 agents, version control, code generation, and more.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:bg-card">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-3 font-display font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", period: "forever", cta: "Start free", features: ["2 projects", "5 agent runs / month", "Core agents", "Community support"], highlight: false },
    { name: "Starter", price: "$99", period: "/ month", cta: "Start trial", features: ["10 projects", "100 agent runs", "All 14 agents", "Knowledge base", "Templates", "Email support"], highlight: false },
    { name: "Pro", price: "$299", period: "/ month", cta: "Start trial", features: ["Unlimited projects", "1,000 agent runs", "All agents + orchestration", "Code generation", "Version control", "Team (5 seats)", "Priority support"], highlight: true },
    { name: "Agency", price: "$999", period: "/ month", cta: "Start trial", features: ["10,000 agent runs", "25 seats", "White-label reports", "Client portal", "API access", "Dedicated CSM"], highlight: false },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Simple, usage-friendly plans</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you need more agents, more runs, or a team.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <Card
              key={t.name}
              className={
                "relative h-full border-border/60 " +
                (t.highlight
                  ? "bg-gradient-to-b from-indigo-500/10 via-fuchsia-500/5 to-transparent ring-1 ring-fuchsia-500/30"
                  : "bg-card/60")
              }
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="gradient" className="shadow-lg shadow-fuchsia-500/30">Most popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{t.price}</span>
                  <span className="text-sm text-muted-foreground">{t.period}</span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={t.highlight ? "gradient" : "outline"} asChild>
                  <Link href="/signup?plan={t.name.toLowerCase()}">{t.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      name: "Sarah K.",
      role: "Founder, Mentorly",
      quote: "BuildForge saved us 3 months of consulting fees. The PRD it generated was better than what a $20k agency gave us.",
      stars: 5,
    },
    {
      name: "Daniel R.",
      role: "CTO, Stacklend",
      quote: "I use it to spin up architecture and DB schemas for every new project. It's like having a staff engineer on call.",
      stars: 5,
    },
    {
      name: "Priya M.",
      role: "Product Lead, Hexa",
      quote: "The market research and pricing recommendations were eerily accurate. We used them verbatim in our seed deck.",
      stars: 5,
    },
  ];
  return (
    <section className="border-y border-border/40 bg-background/40 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Loved by builders</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">What customers are saying</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {quotes.map((q) => (
            <Card key={q.name} className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <div className="flex gap-0.5 text-yellow-500">
                  {Array.from({ length: q.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-foreground/90">"{q.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
                  <div>
                    <div className="text-sm font-medium">{q.name}</div>
                    <div className="text-xs text-muted-foreground">{q.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How does BuildForge AI work?", a: "Describe your software idea in plain English. Our orchestrator spins up 12 specialized AI agents (Product, Market Research, UX, Design, Database, Backend, Frontend, QA, DevOps, Security, Finance) that collaborate to produce a complete product blueprint." },
    { q: "What models do you use?", a: "We support OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet), and Google Gemini. You can bring your own API keys or use the bundled mock provider during development." },
    { q: "Can I export the output?", a: "Yes. Every project includes a Master Report that you can view in-app or export as Markdown. Pro and Agency plans also support PDF export and white-label reports." },
    { q: "Is my data secure?", a: "Yes. All data is encrypted at rest and in transit. We never train on your data. SOC 2 Type II is in progress. Enterprise plans include SSO, SCIM, and DPA." },
    { q: "Can I invite my team?", a: "Pro plans include 5 seats, Agency plans include 25 seats. Each seat gets their own chat history, permissions, and notifications." },
    { q: "What's the difference vs. just using ChatGPT?", a: "ChatGPT is a single model in a chat box. BuildForge is a 12-agent system that follows a real software company's process — PM defines vision, Architect designs system, DevOps plans deployment, Finance models the GTM — and produces a 120-page document." },
  ];
  return (
    <section id="faq" className="py-24">
      <div className="container max-w-3xl">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Questions, answered.</h2>
        </div>
        <div className="mt-12 divide-y divide-border/60 rounded-xl border border-border/60 bg-card/40">
          {faqs.map((f) => (
            <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-6">
                <h3 className="text-base font-medium">{f.q}</h3>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="container">
        <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/15 to-pink-500/20 p-12 text-center">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Ready to forge your software company?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Start free. No credit card. Get your first blueprint in 5 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="gradient" size="xl" asChild>
                <Link href="/signup">
                  Start free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/login">I have an account</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
