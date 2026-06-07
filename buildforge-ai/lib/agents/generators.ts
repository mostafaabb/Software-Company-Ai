/**
 * Agent generators - produce realistic, structured output for each agent
 * based on the project idea. These templates are used both for the live
 * "mock" AI provider and as fallback content when an LLM is unavailable.
 *
 * When an LLM is configured, the orchestrator will replace these with real
 * model output. The structure remains the same.
 *
 * Generators exist for all 14 agents: 12 core + CODE_GENERATOR + DISCOVERY_AGENT.
 */
import type { AgentType } from "@/types/agent";
import type { AgentMeta } from "./definitions";

export interface ProjectContext {
  id: string;
  name: string;
  idea: string;
  description?: string | null;
  industry?: string | null;
  targetMarket?: string | null;
}

export interface AgentRunInput {
  context: ProjectContext;
  previousOutputs?: Partial<Record<AgentType, unknown>>;
  [k: string]: unknown;
}

export interface AgentRunOutput {
  thinking: string;
  output: Record<string, unknown>;
  confidenceScore: number;
}

const IDEATION_KEYWORDS = extractKeywordExtractor();

function extractKeywordExtractor() {
  return (s: string): string[] =>
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3)
      .slice(0, 10);
}

function deriveDomain(idea: string): string {
  const lower = idea.toLowerCase();
  if (lower.includes("restaurant") || lower.includes("food") || lower.includes("menu"))
    return "restaurant-management";
  if (lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("store") || lower.includes("shop"))
    return "ecommerce";
  if (lower.includes("crm") || lower.includes("sales") || lower.includes("customer relationship"))
    return "crm";
  if (lower.includes("education") || lower.includes("learning") || lower.includes("course") || lower.includes("lms"))
    return "lms";
  if (lower.includes("health") || lower.includes("clinic") || lower.includes("patient") || lower.includes("telemedicine"))
    return "healthcare";
  if (lower.includes("fitness") || lower.includes("gym") || lower.includes("workout"))
    return "fitness";
  if (lower.includes("real estate") || lower.includes("property") || lower.includes("rental"))
    return "real-estate";
  if (lower.includes("fintech") || lower.includes("finance") || lower.includes("banking") || lower.includes("payment"))
    return "fintech";
  if (lower.includes("booking") || lower.includes("reservation") || lower.includes("appointment"))
    return "booking";
  if (lower.includes("inventory") || lower.includes("warehouse") || lower.includes("stock"))
    return "inventory";
  if (lower.includes("analytics") || lower.includes("dashboard") || lower.includes("bi"))
    return "analytics";
  return "general-saas";
}

function deriveEntityName(idea: string): string {
  const lower = idea.toLowerCase();
  // Best-effort guess at a project codename
  const m = lower.match(/build (?:me |a |an )?([a-z][a-z0-9-]+)/);
  if (m) return capitalize(m[1].replace(/[^a-z0-9-]/g, ""));
  const words = lower.split(/\s+/).filter((w) => w.length > 3).slice(0, 2);
  return words.map(capitalize).join("") || "ForgeApp";
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// =====================================================
// Product Manager
// =====================================================
export function productManager({ context }: AgentRunInput): AgentRunOutput {
  const domain = deriveDomain(context.idea);
  return {
    thinking: `Analyzing the project idea to identify core value, target users, and MVP scope. Domain detected: ${domain}.`,
    confidenceScore: 0.92,
    output: {
      productVision: `${context.name} is a modern ${domain} platform that turns ${context.idea.split(" ").slice(0, 6).join(" ")}... into a delightful, data-driven product experience.`,
      problemStatement: `Today, teams in the ${domain} space juggle disconnected tools, manual processes, and poor visibility into outcomes. This creates friction, lost revenue, and slow decision-making.`,
      targetAudience: [
        { segment: "Primary", description: "Small to mid-sized operators seeking a unified platform", size: "10k–50k companies" },
        { segment: "Secondary", description: "Enterprise teams needing advanced automation and analytics", size: "500+ companies" },
      ],
      mvpDefinition: {
        scope: "Core workflows end-to-end: auth, dashboard, primary entity CRUD, notifications, billing",
        outOfScope: "Advanced AI features, marketplace, custom integrations, mobile apps",
        successCriteria: [
          "User can sign up and complete the primary workflow in under 5 minutes",
          "Time-to-value is under 10 minutes from signup",
          "Weekly active retention above 40% after week 4",
        ],
        estimatedEffort: "12–16 weeks with a 3-person team",
      },
      productRoadmap: [
        { quarter: "Q1", theme: "Foundation", items: ["Auth + orgs", "Core entities", "Admin dashboard"] },
        { quarter: "Q2", theme: "Growth", items: ["Payments", "Notifications", "Public API"] },
        { quarter: "Q3", theme: "Scale", items: ["AI agents", "Marketplace", "Mobile PWA"] },
        { quarter: "Q4", theme: "Enterprise", items: ["SSO/SCIM", "Audit logs", "Custom roles"] },
      ],
      productRisks: [
        { risk: "Market saturation", severity: "Medium", mitigation: "Niche down to a specific vertical" },
        { risk: "Slow adoption", severity: "High", mitigation: "PLG + freemium + integrations" },
        { risk: "Feature creep", severity: "Medium", mitigation: "Strict MVP gating in roadmap" },
      ],
      successMetrics: [
        { name: "Activation rate", target: "60% in 7 days" },
        { name: "Weekly active users", target: "5k by month 6" },
        { name: "Net revenue retention", target: "110% by month 12" },
        { name: "NPS", target: "50+ by month 6" },
      ],
    },
  };
}

// =====================================================
// Market Research
// =====================================================
export function marketResearch({ context }: AgentRunInput): AgentRunOutput {
  const domain = deriveDomain(context.idea);
  return {
    thinking: `Surveying the ${domain} landscape to identify competitors, demand signals, and positioning.`,
    confidenceScore: 0.85,
    output: {
      marketSize: {
        tam: "$45B",
        sam: "$8.2B",
        som: "$320M",
        notes: "Bottom-up: count of addressable operators × ACV × penetration",
      },
      competitorAnalysis: [
        { name: "Competitor A", positioning: "Enterprise leader", strengths: ["Brand", "Integrations"], weaknesses: ["Price", "Complexity"], pricing: "$499–$2,499/mo" },
        { name: "Competitor B", positioning: "SMB favorite", strengths: ["UX", "Price"], weaknesses: ["Limited analytics", "No API"], pricing: "$49–$199/mo" },
        { name: "Competitor C", positioning: "Vertical specialist", strengths: ["Niche fit"], weaknesses: ["Scale", "Stale UI"], pricing: "$199–$999/mo" },
        { name: "BuildForge entrant", positioning: "AI-native, vertical-agnostic", strengths: ["Agentic automation", "Speed to value"], weaknesses: ["New entrant"], pricing: "$0–$999/mo" },
      ],
      marketOpportunities: [
        "AI-assisted workflow automation is underserved in this segment",
        "Mid-market is stuck between expensive enterprise tools and rigid SMB tools",
        "Compliance + audit is a paid add-on everywhere — opportunity to bundle",
      ],
      marketRisks: [
        "Incumbents adding AI features in next 12 months",
        "Consolidation wave may compress prices",
        "Regulatory changes (data residency)",
      ],
      swot: {
        strengths: ["AI-native architecture", "Fast time-to-value", "Multi-agent orchestration"],
        weaknesses: ["Brand awareness", "Limited integration catalog"],
        opportunities: ["Verticals underserved by AI", "Mid-market gap", "Global expansion"],
        threats: ["Big-tech AI bundling", "Open-source disruption", "Economic downturn"],
      },
      validationScore: 78,
      validationRationale: "Strong demand signals from Reddit, G2 reviews, and Product Hunt. Pain is acute and current solutions are mediocre.",
    },
  };
}

// =====================================================
// Business Analyst
// =====================================================
export function businessAnalyst({ context, previousOutputs }: AgentRunInput): AgentRunOutput {
  const vision = (previousOutputs?.PRODUCT_MANAGER as any)?.productVision || context.idea;
  return {
    thinking: `Synthesizing vision and market data into a formal Business Requirements Document.`,
    confidenceScore: 0.88,
    output: {
      brd: {
        title: `Business Requirements Document — ${context.name}`,
        executiveSummary: vision,
        scope: `Build the ${context.name} platform end-to-end including web app, API, integrations, and billing.`,
        objectives: [
          "Achieve $1M ARR in year 1",
          "Reach 1,000 paying customers by month 12",
          "Maintain gross margin above 75%",
        ],
        requirements: [
          { id: "BR-001", description: "Multi-tenant organization management", priority: "MUST", category: "Functional" },
          { id: "BR-002", description: "Role-based access control", priority: "MUST", category: "Security" },
          { id: "BR-003", description: "Subscription billing via Stripe", priority: "MUST", category: "Billing" },
          { id: "BR-004", description: "Audit logging on all sensitive actions", priority: "SHOULD", category: "Compliance" },
          { id: "BR-005", description: "Public REST + GraphQL API", priority: "MUST", category: "Integration" },
          { id: "BR-006", description: "SSO via Google + Microsoft", priority: "SHOULD", category: "Auth" },
          { id: "BR-007", description: "Webhooks + Zapier integration", priority: "COULD", category: "Integration" },
        ],
      },
      stakeholderMap: [
        { stakeholder: "Founders", interest: "Vision, growth, fundraising", influence: "High" },
        { stakeholder: "Engineering", interest: "Velocity, quality, scale", influence: "High" },
        { stakeholder: "Design", interest: "Brand, UX quality", influence: "Medium" },
        { stakeholder: "Sales", interest: "Pipeline, deal velocity", influence: "High" },
        { stakeholder: "Customers", interest: "Reliability, ROI", influence: "High" },
        { stakeholder: "Investors", interest: "Metrics, growth", influence: "Medium" },
        { stakeholder: "Compliance", interest: "GDPR, SOC2", influence: "Medium" },
      ],
      revenueModel: {
        model: "Tiered SaaS subscription",
        tiers: [
          { name: "Free", price: 0, limits: "2 projects, 5 agent runs / mo" },
          { name: "Starter", price: 99, limits: "10 projects, 100 agent runs / mo" },
          { name: "Pro", price: 299, limits: "Unlimited projects, 1k runs / mo, 5 seats" },
          { name: "Agency", price: 999, limits: "10k runs / mo, 25 seats, white-label" },
        ],
        additionalStreams: ["Custom AI agent marketplace (revenue share)", "Professional services", "Enterprise SSO add-on"],
      },
      costAnalysis: {
        infrastructure: "$2,500 / mo at 1k customers (AWS + Postgres + Redis)",
        aiCosts: "$0.12 average per agent run, projected $8k / mo at scale",
        team: "$45k / mo (3 engineers + 1 PM)",
        tools: "$500 / mo (Stripe, Sentry, Linear, etc.)",
        totalMonthly: "$56k (runway 18 months on $1M seed)",
      },
    },
  };
}

// =====================================================
// UX Research
// =====================================================
export function uxResearch({ context }: AgentRunInput): AgentRunOutput {
  const domain = deriveDomain(context.idea);
  return {
    thinking: `Defining 3 personas, journey maps, and surfacing pain points based on the ${domain} domain.`,
    confidenceScore: 0.83,
    output: {
      personas: [
        {
          name: "Maya — The Operator",
          role: "Small business owner",
          goals: ["Save time", "Get paid faster", "Understand the business"],
          frustrations: ["Drowning in tabs", "Manual reporting", "Spreadsheet sprawl"],
          techSavviness: "Medium",
        },
        {
          name: "Dev — The Power User",
          role: "Technical lead",
          goals: ["Automate everything", "Integrate with stack", "Build internal tools"],
          frustrations: ["Vendor lock-in", "Limited APIs", "Slow release cycles"],
          techSavviness: "High",
        },
        {
          name: "Sam — The Skeptic",
          role: "Mid-market manager",
          goals: ["Consolidate tools", "Reduce vendor count", "Stay compliant"],
          frustrations: ["Buying yet another tool", "Unclear ROI", "Security concerns"],
          techSavviness: "Low",
        },
      ],
      journeyMaps: [
        {
          stage: "Awareness",
          touchpoints: ["Google search", "Reddit", "Twitter", "Word of mouth"],
          emotions: "Curious",
          painPoints: "Hard to evaluate without signup",
        },
        {
          stage: "Signup",
          touchpoints: ["Landing page", "Google OAuth"],
          emotions: "Cautiously optimistic",
          painPoints: "Card required for trial",
        },
        {
          stage: "Activation",
          touchpoints: ["Onboarding wizard", "Sample data", "First AI run"],
          emotions: "Excited / overwhelmed",
          painPoints: "Too many options",
        },
        {
          stage: "Habit",
          touchpoints: ["Daily dashboard", "Notifications", "Reports"],
          emotions: "Productive",
          painPoints: "Notification fatigue",
        },
        {
          stage: "Expansion",
          touchpoints: ["Team invites", "Integrations", "API"],
          emotions: "Invested",
          painPoints: "Permission complexity",
        },
      ],
      painPoints: [
        "Onboarding is too long for cold visitors",
        "Permission model is hard to discover",
        "Reports are buried in nested menus",
      ],
      uxRecommendations: [
        "Replace card-required trial with email-only trial",
        "Add a 'first run' guided tour that completes in < 90 seconds",
        "Surface AI suggestions contextually, not as a separate tab",
        "Use progressive disclosure for advanced settings",
      ],
    },
  };
}

// =====================================================
// UI Design
// =====================================================
export function uiDesign({ context, previousOutputs }: AgentRunInput): AgentRunOutput {
  const personas = (previousOutputs?.UX_RESEARCH as any)?.personas || [];
  return {
    thinking: `Designing a premium, dark-mode-first design system inspired by Linear, Vercel, and Stripe.`,
    confidenceScore: 0.86,
    output: {
      designSystem: {
        typography: {
          display: "Cal Sans / Inter Display",
          body: "Inter",
          mono: "JetBrains Mono",
          scale: ["12", "14", "16", "18", "20", "24", "30", "36", "48", "60"],
        },
        colors: {
          brand: { 50: "#f5f3ff", 500: "#6366f1", 600: "#4f46e5", 900: "#1e1b4b" },
          neutral: { 0: "#ffffff", 50: "#fafafa", 100: "#f4f4f5", 500: "#71717a", 900: "#18181b", 950: "#09090b" },
          semantic: { success: "#10b981", warning: "#f59e0b", danger: "#ef4444", info: "#3b82f6" },
        },
        spacing: ["4", "8", "12", "16", "20", "24", "32", "40", "48", "64", "80", "96"],
        radius: { sm: "6", md: "8", lg: "12", xl: "16", "2xl": "24" },
        shadows: {
          sm: "0 1px 2px rgba(0,0,0,0.05)",
          md: "0 4px 12px rgba(0,0,0,0.08)",
          lg: "0 12px 32px rgba(0,0,0,0.12)",
        },
      },
      screens: [
        { name: "Landing", purpose: "Convert visitor to signup", keyComponents: ["Hero", "Feature grid", "Pricing", "Testimonials", "CTA"] },
        { name: "Auth", purpose: "Fast login/signup", keyComponents: ["OAuth buttons", "Email/password", "Magic link"] },
        { name: "Dashboard", purpose: "At-a-glance project health", keyComponents: ["KPI cards", "Activity feed", "Quick actions"] },
        { name: "Project Workspace", purpose: "All project artifacts", keyComponents: ["Sidebar nav", "Tabbed content", "Agent panel"] },
        { name: "Agent Chat", purpose: "Conversational AI", keyComponents: ["Message list", "Composer", "Citations", "Agent switcher"] },
        { name: "Reports", purpose: "Master report output", keyComponents: ["TOC", "Sectioned content", "Code blocks", "Diagrams"] },
        { name: "Billing", purpose: "Plan & invoices", keyComponents: ["Plan cards", "Usage meter", "Invoices"] },
        { name: "Settings", purpose: "Org + user config", keyComponents: ["Profile", "Team", "API keys", "Audit"] },
      ],
      components: [
        { name: "Button", variants: ["primary", "secondary", "ghost", "destructive", "outline"], sizes: ["sm", "md", "lg", "icon"] },
        { name: "Input", variants: ["default", "error", "success", "with-icon", "with-addon"] },
        { name: "Card", variants: ["default", "elevated", "bordered", "interactive"] },
        { name: "Dialog", variants: ["default", "drawer", "fullscreen"] },
        { name: "Toast", variants: ["default", "success", "warning", "error"] },
        { name: "Table", variants: ["default", "compact", "expandable"] },
        { name: "AgentCard", variants: ["idle", "running", "complete", "error"] },
        { name: "MarkdownView", variants: ["default", "compact", "presentation"] },
      ],
      designTokens: {
        motion: { durations: ["100ms", "200ms", "300ms", "500ms"], easings: ["ease", "ease-in", "ease-out", "spring"] },
        breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
      },
      personaAdaptations: personas.length
        ? personas.map((p: any) => ({
            persona: p.name,
            emphasis: p.techSavviness === "High" ? "Density, keyboard shortcuts, API explorer" : "Friendly onboarding, progress indicators",
          }))
        : [],
    },
  };
}

// =====================================================
// Database Architect
// =====================================================
export function databaseArchitect({ context }: AgentRunInput): AgentRunOutput {
  const entity = deriveEntityName(context.idea);
  const lower = entity.toLowerCase();
  return {
    thinking: `Designing a normalized data model with multi-tenancy, soft deletes, and audit columns.`,
    confidenceScore: 0.94,
    output: {
      erdSummary: "Multi-tenant (org-scoped) with users, organizations, memberships, projects, agent runs, documents, chats, billing, audit logs.",
      tables: [
        { name: "users", description: "End users with credentials and profile" },
        { name: "organizations", description: "Tenants that own projects and memberships" },
        { name: "memberships", description: "Join table: user ↔ org with role" },
        { name: "projects", description: "Top-level product ideas being built" },
        { name: "agent_runs", description: "One row per agent invocation with input/output" },
        { name: "agent_definitions", description: "Catalog of the 12 agents and their config" },
        { name: "messages", description: "Chat messages with role, content, citations" },
        { name: "chats", description: "Chat threads scoped to a project" },
        { name: "knowledge_docs", description: "Uploaded RAG documents" },
        { name: "document_chunks", description: "Chunked text for embedding" },
        { name: "embeddings", description: "Vector records for similarity search" },
        { name: "tasks", description: "Sprint-tied tasks" },
        { name: "sprints", description: "Time-boxed iteration cycles" },
        { name: "reports", description: "Generated markdown reports" },
        { name: "subscriptions", description: "Stripe-backed subscription state" },
        { name: "invoices", description: "Billed invoices" },
        { name: "payments", description: "Payment transactions" },
        { name: "notifications", description: "In-app notifications" },
        { name: "comments", description: "Threaded comments with mentions" },
        { name: "files", description: "File metadata" },
        { name: "audit_logs", description: "Append-only activity trail" },
        { name: "usage_metrics", description: "Aggregated metrics for analytics" },
      ],
      corePrismaModels: {
        Project: {
          fields: ["id", "name", "slug", "idea", "status", "ownerId", "organizationId", "industry", "createdAt"],
          relations: ["owner:User", "organization:Organization", "agentRuns:AgentRun[]", "documents:Document[]", "reports:Report[]"],
        },
        AgentRun: {
          fields: ["id", "projectId", "agentType", "status", "input", "output", "tokensUsed", "durationMs", "createdAt"],
          relations: ["project:Project", "messages:Message[]"],
        },
        Message: {
          fields: ["id", "chatId", "projectId", "role", "content", "agentType", "citations", "tokens"],
          relations: ["chat:Chat", "project:Project"],
        },
      },
      indexes: [
        "projects: (ownerId, slug) unique",
        "agent_runs: (projectId, agentType, status)",
        "messages: (chatId, createdAt)",
        "subscriptions: (organizationId, status)",
        "audit_logs: (userId, createdAt desc)",
        "embeddings: pgvector index using ivfflat (vector) lists=100",
      ],
      constraints: [
        "Cascade delete from projects → agent_runs → messages",
        "Restrict delete on users with active subscriptions",
        "Soft-delete via deletedAt on organizations and projects",
      ],
      entity,
      notes: `Primary business entity is "${entity}" — model the core domain around it with audit columns (createdAt, updatedAt, deletedAt) on every business table.`,
    },
  };
}

// =====================================================
// Backend Architect
// =====================================================
export function backendArchitect({ context, previousOutputs }: AgentRunInput): AgentRunOutput {
  const tables = (previousOutputs?.DATABASE_ARCHITECT as any)?.tables || [];
  return {
    thinking: `Designing a service-oriented API layer with REST + GraphQL, JWT auth, and rate-limited endpoints.`,
    confidenceScore: 0.9,
    output: {
      serviceArchitecture: {
        style: "Modular monolith (deployable as microservices later)",
        runtime: "Node.js 20 / NestJS 10 / TypeScript strict",
        data: "PostgreSQL 16 via Prisma, Redis 7 for cache + queues",
        auth: "JWT (NextAuth) with refresh tokens, OAuth (Google, GitHub)",
        queue: "BullMQ for agent runs, document processing, emails",
        realtime: "Server-Sent Events for streaming agent output",
      },
      restEndpoints: [
        { method: "POST", path: "/api/auth/signup", description: "Register a new user" },
        { method: "POST", path: "/api/auth/login", description: "Authenticate" },
        { method: "GET", path: "/api/projects", description: "List projects for current user" },
        { method: "POST", path: "/api/projects", description: "Create a project from an idea" },
        { method: "GET", path: "/api/projects/:id", description: "Get project details" },
        { method: "POST", path: "/api/projects/:id/agents/:agentType/run", description: "Run a specific agent" },
        { method: "POST", path: "/api/projects/:id/orchestrate", description: "Run the full agent pipeline" },
        { method: "POST", path: "/api/projects/:id/chat", description: "Chat with an agent (streaming)" },
        { method: "GET", path: "/api/projects/:id/reports/:type", description: "Fetch a generated report" },
        { method: "POST", path: "/api/projects/:id/knowledge", description: "Upload a knowledge doc" },
        { method: "POST", path: "/api/stripe/checkout", description: "Start a subscription" },
        { method: "POST", path: "/api/stripe/webhook", description: "Stripe events" },
        { method: "GET", path: "/api/admin/metrics", description: "Admin metrics" },
      ],
      graphqlEndpoints: [
        { name: "Query.projects", description: "List projects with pagination" },
        { name: "Query.project(id)", description: "Get project by ID" },
        { name: "Query.agentRuns(projectId)", description: "List agent runs" },
        { name: "Mutation.runAgent", description: "Trigger an agent" },
        { name: "Subscription.agentRunUpdated", description: "Realtime agent run status" },
      ],
      eventFlows: [
        { name: "project.created", consumers: ["Audit", "Analytics", "Welcome email"] },
        { name: "agent.run.completed", consumers: ["Notification", "Report aggregator"] },
        { name: "document.uploaded", consumers: ["Parser", "Embedder", "Indexer"] },
        { name: "subscription.updated", consumers: ["Billing", "Feature flag service"] },
      ],
      securityPlan: {
        authentication: "JWT in httpOnly cookies, refresh via rotating tokens",
        authorization: "RBAC enforced at API layer + Postgres RLS for defense-in-depth",
        secrets: "Vault or AWS Secrets Manager; never in env",
        transport: "TLS 1.3, HSTS, secure cookies",
        rateLimit: "100 req/min per IP for public, 1000/min for authenticated",
        uploads: "Pre-signed URLs, MIME sniffing, AV scan, size limits",
        observability: "Sentry for errors, Pino logs to Loki, OpenTelemetry traces",
      },
      openApiSummary: "OpenAPI 3.1 spec generated from Zod schemas via @asteasolutions/zod-to-openapi. Served at /api/docs.",
    },
  };
}

// =====================================================
// Frontend Architect
// =====================================================
export function frontendArchitect({ context }: AgentRunInput): AgentRunOutput {
  return {
    thinking: `Planning a Next.js 15 App Router structure with route groups, server components, and Zustand for client state.`,
    confidenceScore: 0.91,
    output: {
      stack: {
        framework: "Next.js 15 (App Router) + React 19",
        language: "TypeScript strict",
        styling: "TailwindCSS 3 + shadcn/ui + Radix Primitives",
        state: "Zustand for client state, React Query (TanStack Query) for server state",
        forms: "React Hook Form + Zod",
        motion: "Framer Motion",
        charts: "Recharts",
        markdown: "react-markdown + remark-gfm + react-syntax-highlighter",
      },
      folderStructure: {
        "app/": "App Router pages, route groups for (auth) (marketing) (dashboard) (admin)",
        "app/api/": "API routes (REST endpoints + webhooks)",
        "components/ui/": "shadcn primitives (Button, Card, Dialog, etc.)",
        "components/dashboard/": "Dashboard-specific composed components",
        "components/agents/": "Agent cards, agent detail, agent run views",
        "components/chat/": "Chat interface, message bubbles, streaming",
        "lib/": "Server-only utilities: prisma, auth, AI, billing, storage",
        "lib/agents/": "Agent definitions, prompts, generators, orchestrator",
        "hooks/": "Reusable client hooks (useProjects, useAgent, useChat)",
        "stores/": "Zustand stores (UI store, workspace store)",
        "types/": "Shared TypeScript types",
        "prisma/": "Schema, migrations, seed",
      },
      routeMap: [
        { path: "/", purpose: "Public landing" },
        { path: "/login", purpose: "Login" },
        { path: "/signup", purpose: "Signup" },
        { path: "/dashboard", purpose: "User home" },
        { path: "/dashboard/projects", purpose: "Project list" },
        { path: "/dashboard/projects/:id", purpose: "Project overview" },
        { path: "/dashboard/projects/:id/agents", purpose: "Run / review all 12 agents" },
        { path: "/dashboard/projects/:id/chat", purpose: "Chat with agents" },
        { path: "/dashboard/projects/:id/documents", purpose: "Generated docs" },
        { path: "/dashboard/projects/:id/knowledge", purpose: "Uploaded knowledge" },
        { path: "/dashboard/projects/:id/architecture", purpose: "Backend + system architecture" },
        { path: "/dashboard/projects/:id/database", purpose: "DB schema + ERD" },
        { path: "/dashboard/projects/:id/api", description: "OpenAPI explorer", path_alias: "/dashboard/projects/:id/api" } as any,
        { path: "/dashboard/projects/:id/roadmap", purpose: "Sprint + tasks" },
        { path: "/dashboard/projects/:id/report", purpose: "Master report" },
        { path: "/dashboard/billing", purpose: "Plans + invoices" },
        { path: "/dashboard/team", purpose: "Members + invitations" },
        { path: "/admin", purpose: "Admin panel" },
      ],
      stateArchitecture: {
        clientState: "Zustand stores: ui (theme, sidebar, modals), workspace (current project, agent selection)",
        serverState: "TanStack Query: useProjects, useProject, useAgentRuns, useChats, useBilling",
        formState: "React Hook Form per form, validated with Zod",
        realtimeState: "EventSource for SSE streams, optimistic updates for mutations",
      },
      performancePlan: [
        "Server Components by default, Client Components only when needed",
        "Prefetch on hover for navigation",
        "Image optimization via next/image",
        "Edge runtime for static routes",
        "Code-split by route (automatic with App Router)",
        "Streaming SSR for heavy pages",
      ],
    },
  };
}

// =====================================================
// QA Engineer
// =====================================================
export function qaEngineer({ context }: AgentRunInput): AgentRunOutput {
  return {
    thinking: `Building a layered testing strategy: unit (Vitest), integration (Vitest + Supertest), E2E (Playwright).`,
    confidenceScore: 0.87,
    output: {
      strategy: {
        pyramid: "70% unit, 20% integration, 10% E2E",
        coverageTarget: "80% lines, 70% branches",
        ciIntegration: "Tests run on every PR; coverage gate at 80%",
      },
      unitTests: [
        "lib/agents/* — generator output shape validation",
        "lib/validations/* — schema edge cases",
        "lib/auth/* — credential hashing and token logic",
        "lib/billing/* — plan limit calculations",
      ],
      integrationTests: [
        "POST /api/projects creates a row and runs an agent",
        "POST /api/projects/:id/agents/:agent/run returns structured output",
        "GET /api/projects returns only owned projects (RLS-style check)",
        "Stripe webhook updates subscription status idempotently",
      ],
      e2eTests: [
        "User can sign up, create a project, and run the full pipeline",
        "User can chat with an agent and see streaming tokens",
        "User can upload a knowledge doc and ask a RAG question",
        "Free user is rate-limited after 5 agent runs",
        "Pro user can invite a team member and assign a role",
      ],
      edgeCases: [
        "Empty idea string rejected at validation",
        "Agent run timeout (60s) returns a clear error",
        "Concurrent runs on the same project serialized via BullMQ",
        "Stripe webhook replay protected by idempotency key",
        "Knowledge doc with no extractable text marked as failed",
      ],
      regressionPlan: "Nightly full E2E on staging, smoke suite on every deploy to prod, manual exploratory testing before each release.",
    },
  };
}

// =====================================================
// DevOps Engineer
// =====================================================
export function devopsEngineer({ context }: AgentRunInput): AgentRunOutput {
  return {
    thinking: `Designing a production-grade infrastructure with multi-AZ, autoscaling, and full observability.`,
    confidenceScore: 0.89,
    output: {
      infrastructure: {
        cloud: "AWS (multi-region ready)",
        compute: "ECS Fargate behind ALB, autoscaling 2–20 tasks",
        database: "RDS Postgres 16 (Multi-AZ), read replica for analytics",
        cache: "ElastiCache Redis 7 cluster mode",
        queue: "SQS + BullMQ workers on Fargate",
        storage: "S3 with CloudFront CDN, lifecycle rules to Glacier",
        cdn: "CloudFront with edge caching and image optimization",
      },
      docker: {
        frontend: "Multi-stage Next.js image, standalone output, non-root user, healthcheck",
        backend: "Multi-stage Node image, prisma generated in build, distroless runtime",
        worker: "Same image as backend with worker entrypoint",
      },
      kubernetes: {
        ready: "K8s manifests included for portability",
        components: ["Deployment", "Service", "HPA", "Ingress", "ConfigMap", "Secret", "PDB"],
        tooling: "Helm chart + Kustomize overlays for staging/prod",
      },
      cicd: {
        provider: "GitHub Actions",
        stages: ["lint", "typecheck", "test", "build", "scan", "deploy-staging", "smoke", "deploy-prod"],
        strategy: "Trunk-based, feature flags via LaunchDarkly or Unleash",
        artifacts: "Images pushed to ECR with semantic tags + digest",
      },
      monitoring: {
        metrics: "Prometheus + Grafana dashboards (Golden Signals)",
        logs: "Loki / CloudWatch with structured Pino JSON",
        traces: "OpenTelemetry → Tempo / X-Ray",
        errors: "Sentry with source maps and release tracking",
        alerts: "PagerDuty rotation for SEV1, Slack for SEV2/3",
      },
      backupStrategy: {
        database: "Daily automated snapshots, PITR enabled, 35-day retention",
        files: "S3 cross-region replication, versioned, lifecycle to Glacier",
        secrets: "Backed up in AWS Secrets Manager with rotation",
        rto: "1 hour",
        rpo: "15 minutes",
      },
      scalingPlan: [
        "Phase 1 (0–10k users): Single region, RDS + Redis, 2–4 tasks",
        "Phase 2 (10k–100k): Multi-AZ, read replicas, 4–20 tasks, CDN",
        "Phase 3 (100k+): Multi-region active-passive, Aurora Global, 20–100 tasks",
      ],
    },
  };
}

// =====================================================
// Security Engineer
// =====================================================
export function securityEngineer({ context }: AgentRunInput): AgentRunOutput {
  return {
    thinking: `Running a STRIDE-style threat model and mapping controls to OWASP ASVS L2.`,
    confidenceScore: 0.84,
    output: {
      threatModel: {
        methodology: "STRIDE",
        assets: ["User PII", "API keys", "Billing data", "Agent prompts", "Knowledge docs"],
        threats: [
          { id: "T-01", category: "Spoofing", threat: "JWT theft via XSS", likelihood: "Medium", impact: "High", mitigation: "httpOnly cookies, CSP, output encoding" },
          { id: "T-02", category: "Tampering", threat: "SQL injection", likelihood: "Low", impact: "Critical", mitigation: "Prisma parameterization, WAF, code review" },
          { id: "T-03", category: "Repudiation", threat: "Users deny actions", likelihood: "Low", impact: "Medium", mitigation: "Append-only audit log with hash chain" },
          { id: "T-04", category: "Information Disclosure", threat: "Knowledge doc leakage between orgs", likelihood: "Medium", impact: "High", mitigation: "Org-scoped queries enforced at API + DB RLS" },
          { id: "T-05", category: "Denial of Service", threat: "Expensive agent run abuse", likelihood: "High", impact: "Medium", mitigation: "Plan-based quotas, queue with concurrency limits" },
          { id: "T-06", category: "Elevation of Privilege", threat: "Viewer escalates to Admin", likelihood: "Low", impact: "Critical", mitigation: "RBAC checks at API + UI, regular pen tests" },
        ],
      },
      vulnerabilityAnalysis: [
        { area: "Auth", findings: ["Refresh token rotation recommended", "Add MFA for Admins"], severity: "Medium" },
        { area: "API", findings: ["Add per-endpoint rate limits", "OpenAPI schema validation"], severity: "Medium" },
        { area: "Uploads", findings: ["AV scan uploads", "Enforce MIME sniffing"], severity: "High" },
        { area: "AI", findings: ["Prompt injection filter on user docs", "Strip system tags from RAG context"], severity: "High" },
        { area: "Billing", findings: ["Stripe webhook signature verification (done)", "Idempotency keys"], severity: "Low" },
      ],
      riskAssessment: {
        overallRisk: "Medium",
        topRisks: ["T-04 Information Disclosure", "T-05 DoS", "AI-1 Prompt Injection"],
        residualRisk: "Low after recommended controls",
      },
      compliance: {
        frameworks: ["OWASP ASVS L2", "SOC 2 Type II (target)", "GDPR"],
        controls: ["Encryption at rest (RDS, S3)", "Encryption in transit (TLS 1.3)", "Right to erasure", "Data Processing Agreement"],
      },
      recommendations: [
        "Adopt CSP with nonce-based inline script policy",
        "Add MFA via TOTP for Admins",
        "Run quarterly pen tests",
        "Implement bug bounty program after GA",
        "Add SBOM generation in CI",
      ],
    },
  };
}

// =====================================================
// Financial Analyst
// =====================================================
export function financialAnalyst({ context, previousOutputs }: AgentRunInput): AgentRunOutput {
  const tiers = (previousOutputs?.BUSINESS_ANALYST as any)?.revenueModel?.tiers || [];
  return {
    thinking: `Modeling SaaS economics with conservative, base, and optimistic scenarios over 36 months.`,
    confidenceScore: 0.82,
    output: {
      assumptions: {
        startingCustomers: 0,
        monthlyGrowthRate: { conservative: "8%", base: "15%", optimistic: "25%" },
        averageARPU: "$148 blended",
        grossMargin: "78%",
        churn: { monthly: "2.5%", annual: "26%" },
      },
      revenueForecast: {
        year1: { conservative: 78_000, base: 240_000, optimistic: 612_000 },
        year2: { conservative: 612_000, base: 1_950_000, optimistic: 4_800_000 },
        year3: { conservative: 2_100_000, base: 6_400_000, optimistic: 18_000_000 },
      },
      mrrProjection: [
        { month: 1, mrr: 1200, customers: 8 },
        { month: 3, mrr: 5800, customers: 39 },
        { month: 6, mrr: 22_000, customers: 148 },
        { month: 12, mrr: 89_000, customers: 600 },
        { month: 18, mrr: 215_000, customers: 1450 },
        { month: 24, mrr: 480_000, customers: 3240 },
        { month: 36, mrr: 1_350_000, customers: 9100 },
      ],
      unitEconomics: {
        cac: "$420 blended",
        ltv: "$5_800",
        ltvCacRatio: 13.8,
        paybackPeriod: "5.6 months",
        magicNumber: 1.4,
      },
      pricingRecommendations: tiers.length
        ? tiers
        : [
            { plan: "Free", price: 0 },
            { plan: "Starter", price: 99 },
            { plan: "Pro", price: 299 },
            { plan: "Agency", price: 999 },
          ],
      costAnalysis: {
        fixed: { salaries: 180_000, tools: 24_000, office: 12_000 },
        variable: { infrastructurePerCustomer: 4, aiPerRun: 0.12, supportPerCustomer: 8 },
        totalYear1: 540_000,
        totalYear2: 1_900_000,
        totalYear3: 5_100_000,
      },
      gtmPlan: [
        { phase: "Pre-launch (M-2 → M-1)", activities: ["Build waitlist", "Content engine (12 SEO articles)", "Beta with 50 design partners"], budget: 12_000 },
        { phase: "Launch (M-1 → M+2)", activities: ["Product Hunt launch", "Hacker News post", "Cold outreach to 500 founders", "Twitter build-in-public"], budget: 18_000 },
        { phase: "Growth (M+2 → M+12)", activities: ["SEO content engine", "Partnerships with no-code communities", "Affiliate program (20% rev share)", "Webinar series"], budget: 240_000 },
        { phase: "Scale (M+12 → M+24)", activities: ["Outbound SDR team", "Paid ads (Google, LinkedIn)", "Channel partnerships", "Agency program"], budget: 1_400_000 },
      ],
      keyMetrics: [
        { name: "MRR", target: "$480k by month 24" },
        { name: "Net Revenue Retention", target: "115%" },
        { name: "Gross Margin", target: ">75%" },
        { name: "Magic Number", target: ">1.0" },
        { name: "Rule of 40", target: ">40" },
      ],
    },
  };
}

// =====================================================
// Code Generator
// =====================================================
export function codeGenerator({ context }: AgentRunInput): AgentRunOutput {
  const domain = deriveDomain(context.idea);
  return {
    thinking: `Analyzing all agent deliverables to generate a production-ready project scaffold for a ${domain} application.`,
    confidenceScore: 0.88,
    output: {
      projectStructure: [
        { path: "app/page.tsx", description: "Landing page with hero, features, and CTA" },
        { path: "app/(auth)/login/page.tsx", description: "Login page with OAuth and email/password" },
        { path: "app/(auth)/signup/page.tsx", description: "Signup page with form validation" },
        { path: "app/(dashboard)/dashboard/page.tsx", description: "Main dashboard with KPI cards" },
        { path: "app/(dashboard)/dashboard/projects/page.tsx", description: "Project list view" },
        { path: "app/(dashboard)/dashboard/projects/[id]/page.tsx", description: "Project detail overview" },
        { path: "app/api/projects/route.ts", description: "REST endpoint for project CRUD" },
        { path: "app/api/projects/[id]/agents/[agentType]/run/route.ts", description: "Agent run trigger endpoint" },
        { path: "app/api/projects/[id]/orchestrate/route.ts", description: "Full pipeline orchestration endpoint" },
        { path: "app/api/stripe/webhook/route.ts", description: "Stripe webhook handler" },
        { path: "components/ui/button.tsx", description: "Reusable Button component (shadcn)" },
        { path: "components/ui/card.tsx", description: "Card component for content sections" },
        { path: "components/dashboard/project-card.tsx", description: "Project summary card" },
        { path: "components/agents/agent-card.tsx", description: "Agent status card with run trigger" },
        { path: "components/chat/chat-interface.tsx", description: "Streaming chat with agent" },
        { path: "lib/db/prisma.ts", description: "Prisma client singleton" },
        { path: "lib/auth.ts", description: "NextAuth configuration" },
        { path: "lib/ai/provider.ts", description: "AI provider abstraction" },
        { path: "lib/agents/orchestrator.ts", description: "Agent pipeline orchestrator" },
        { path: "lib/billing/stripe.ts", description: "Stripe client and helpers" },
        { path: "prisma/schema.prisma", description: "Full Prisma schema with all models" },
        { path: "docker-compose.yml", description: "Postgres, Redis, and app services" },
        { path: "Dockerfile", description: "Multi-stage production build" },
        { path: "package.json", description: "Dependencies and scripts" },
        { path: "tailwind.config.ts", description: "TailwindCSS configuration" },
        { path: "tsconfig.json", description: "TypeScript strict configuration" },
        { path: ".env.example", description: "Required environment variables template" },
      ],
      techStack: {
        framework: "Next.js 15 (App Router)",
        language: "TypeScript",
        styling: "TailwindCSS + shadcn/ui",
        database: "PostgreSQL 16 with Prisma ORM",
        auth: "NextAuth.js with Google + Email providers",
      },
      keyFiles: {
        packageJson: `{
  "name": "${context.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "framer-motion": "^10.0.0",
    "stripe": "^14.0.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  },
  "prisma": {
    "seed": "prisma/seed.ts"
  }
}`,
        dockerCompose: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/${context.name.toLowerCase().replace(/\s+/g, '_')}
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
      - redis
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${context.name.toLowerCase().replace(/\s+/g, '_')}
    volumes:
      - pgdata:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
volumes:
  pgdata:`,
        prismaSchema: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  passwordHash  String?
  role          UserRole       @default(USER)
  avatarUrl     String?
  onboardingDone Boolean       @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  deletedAt     DateTime?
  organizations Membership[]
  projects      Project[]
  agentRuns     AgentRun[]
  sessions      Session[]
}

model Organization {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  deletedAt   DateTime?
  memberships Membership[]
  projects    Project[]
}

model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           MembershipRole @default(EDITOR)
  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())

  @@unique([userId, organizationId])
}

model Project {
  id             String      @id @default(cuid())
  name           String
  slug           String
  idea           String
  description    String?
  industry       String?
  targetMarket   String?
  status         ProjectStatus @default(DRAFT)
  ownerId        String
  organizationId String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  deletedAt      DateTime?
  owner          User        @relation(fields: [ownerId], references: [id])
  organization   Organization? @relation(fields: [organizationId], references: [id])
  agentRuns      AgentRun[]
  documents      Document[]
  reports        Report[]
  chats          Chat[]

  @@index([ownerId, slug], unique: true)
}

model AgentRun {
  id             String      @id @default(cuid())
  projectId      String
  agentType      String
  status         AgentRunStatus @default(PENDING)
  input          Json?
  output         Json?
  thinking       String?
  confidenceScore Float?
  tokensUsed     Int?
  durationMs     Int?
  errorMessage   String?
  modelProvider  String?
  modelName      String?
  triggeredById  String?
  startedAt      DateTime?
  completedAt    DateTime?
  createdAt      DateTime    @default(now())
  project        Project     @relation(fields: [projectId], references: [id])
  messages       Message[]

  @@index([projectId, agentType, status])
}

model Message {
  id        String   @id @default(cuid())
  chatId    String?
  projectId String
  role      String
  content   String
  agentType String?
  citations Json?
  tokens    Int?
  createdAt DateTime @default(now())
  chat      Chat?    @relation(fields: [chatId], references: [id])
  project   Project  @relation(fields: [projectId], references: [id])

  @@index([chatId, createdAt])
}

model Chat {
  id        String    @id @default(cuid())
  projectId String
  title     String?
  createdAt DateTime  @default(now())
  project   Project   @relation(fields: [projectId], references: [id])
  messages  Message[]
}

model Document {
  id        String       @id @default(cuid())
  projectId String
  title     String
  type      String
  content   String?
  version   Int          @default(1)
  status    DocumentStatus @default(READY)
  createdAt DateTime     @default(now())
  project   Project      @relation(fields: [projectId], references: [id])
}

model Report {
  id        String     @id @default(cuid())
  projectId String
  type      ReportType
  title     String
  content   String
  summary   String?
  createdAt DateTime   @default(now())
  project   Project    @relation(fields: [projectId], references: [id])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])
}

model Subscription {
  id        String             @id @default(cuid())
  userId    String
  stripeId  String?            @unique
  plan      PlanTier           @default(FREE)
  status    SubscriptionStatus @default(ACTIVE)
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  createdAt DateTime           @default(now())
}

model UsageMetric {
  id        String   @id @default(cuid())
  userId    String
  metric    String
  value     Float
  metadata  Json?
  createdAt DateTime @default(now())
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum MembershipRole {
  OWNER
  ADMIN
  EDITOR
  VIEWER
}

enum ProjectStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
  ARCHIVED
}

enum AgentRunStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

enum PlanTier {
  FREE
  STARTER
  PRO
  AGENCY
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  TRIALING
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
}

enum DocumentStatus {
  UPLOADING
  PROCESSING
  READY
  FAILED
}

enum ReportType {
  PRD
  MARKET_RESEARCH
  BUSINESS_ANALYSIS
  UX_RESEARCH
  UI_DESIGN
  DATABASE
  BACKEND
  FRONTEND
  QA
  DEVOPS
  SECURITY
  FINANCIAL
  CODE
  DISCOVERY
  MASTER
}`,
        readme: `# ${context.name}

> ${context.description || context.idea}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Initialize database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js
- **State:** Zustand + TanStack Query

## Project Structure

\`\`\`
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Authentication routes
│   ├── (dashboard)/  # Dashboard routes
│   └── api/          # API routes
├── components/       # React components
│   ├── ui/           # UI primitives
│   └── dashboard/    # Dashboard components
├── lib/              # Server utilities
├── prisma/           # Database schema & migrations
├── public/           # Static assets
└── docker-compose.yml
\`\`\`

## Docker

\`\`\`bash
docker-compose up -d
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start dev server |
| \`npm run build\` | Production build |
| \`npm run start\` | Start production server |
| \`npm run lint\` | Lint code |
| \`npm run test\` | Run unit tests |
| \`npm run test:e2e\` | Run E2E tests |
| \`npx prisma studio\` | Open Prisma Studio |
`,
      },
      setupInstructions: [
        "1. Clone the repository and run `npm install`",
        "2. Copy `.env.example` to `.env.local` and fill in your database URL, NextAuth secret, and Stripe keys",
        "3. Run `npx prisma db push` to create the database schema",
        "4. Run `npx prisma db seed` to seed sample data",
        "5. Run `npm run dev` to start the development server on port 3000",
        "6. For Docker: run `docker-compose up -d` to start Postgres and Redis",
        "7. Set up your OAuth providers (Google, GitHub) in the NextAuth dashboard",
        "8. Configure Stripe webhook endpoint to `/api/stripe/webhook`",
      ],
    },
  };
}

// =====================================================
// Discovery Agent
// =====================================================
export function discoveryAgent({ context }: AgentRunInput): AgentRunOutput {
  const keywords = IDEATION_KEYWORDS(context.idea);
  return {
    thinking: `Conducting a structured discovery interview to deeply understand the vision behind "${context.name}". Analyzing the raw idea for clarity, completeness, and hidden assumptions.`,
    confidenceScore: 0.91,
    output: {
      keyQuestions: [
        {
          question: "What is the single biggest pain point you are solving for your users?",
          category: "Problem Validation",
          importance: "Critical",
        },
        {
          question: "Who are your ideal first 100 customers? Be as specific as possible.",
          category: "Target Audience",
          importance: "Critical",
        },
        {
          question: "What existing solutions do your users currently use, and why are they insufficient?",
          category: "Competitive Landscape",
          importance: "High",
        },
        {
          question: "What does the MVP look like if you have only 4 weeks to build it?",
          category: "Scope Definition",
          importance: "High",
        },
        {
          question: "How will users discover and adopt your product?",
          category: "Go-to-Market",
          importance: "Medium",
        },
        {
          question: "What is your primary revenue model and target price point?",
          category: "Monetization",
          importance: "High",
        },
        {
          question: "Are there any regulatory or compliance requirements specific to this domain?",
          category: "Compliance",
          importance: "Medium",
        },
        {
          question: "What technical constraints or preferences do you have (framework, cloud, team size)?",
          category: "Technical Context",
          importance: "Medium",
        },
      ],
      assumptions: [
        {
          assumption: "The primary user is a technical or semi-technical operator who values speed over customization",
          risk: "Medium — if target is non-technical, onboarding needs more hand-holding",
        },
        {
          assumption: "A SaaS subscription model is the right monetization approach",
          risk: "Low — most B2B tools in this space use SaaS, but usage-based pricing could be explored",
        },
        {
          assumption: "PostgreSQL is sufficient for the data model requirements",
          risk: "Low — may need vector store extension (pgvector) for AI features",
        },
        {
          assumption: "The market has not reached saturation and there is room for a new entrant",
          risk: "Medium — incumbent AI features are evolving rapidly",
        },
      ],
      enrichedBrief: `${context.name} is a focused ${deriveDomain(context.idea)} platform aimed at solving real operational pain points. ${context.idea}. The core value proposition centers on reducing complexity and saving time for operators. The MVP should deliver the most critical workflow end-to-end within 4 weeks, with a clear path to monetization via tiered SaaS pricing. Key differentiators will be speed-to-value, AI-native features, and a delightful user experience.`,
      clarifications: [
        {
          topic: "User Identity",
          insight: `Keywords extracted from the idea suggest the product targets users interested in: ${keywords.join(", ")}. These should be validated with real user interviews.`,
        },
        {
          topic: "MVP Boundary",
          insight: "The idea mentions multiple features. A strict MVP should focus on the single core workflow that delivers the most value, with everything else deferred to post-launch iterations.",
        },
        {
          topic: "Market Positioning",
          insight: "Position this as a specialized, AI-enhanced tool rather than a generic platform. Vertical depth beats horizontal breadth at launch.",
        },
        {
          topic: "Technical Foundation",
          insight: "Based on the project scope, a Next.js + PostgreSQL stack is recommended for rapid development with room to scale.",
        },
      ],
      discoveryScore: Math.floor(Math.random() * 11) + 85,
    },
  };
}

// =====================================================
// Master Report
// =====================================================
export function masterReport({ context, previousOutputs }: AgentRunInput): AgentRunOutput {
  return {
    thinking: `Aggregating all 12 agent outputs into a single cohesive master report.`,
    confidenceScore: 0.95,
    output: {
      projectName: context.name,
      generatedAt: new Date().toISOString(),
      executiveSummary: `${context.name} is a ${deriveDomain(context.idea)} platform with strong product–market fit signals. The full agent pipeline has produced a validated product vision, market analysis, business model, UX research, design system, database schema, backend architecture, frontend blueprint, QA strategy, DevOps plan, security review, and financial model. The plan below shows a clear path to $480k MRR by month 24 with a 78% gross margin and a 13.8x LTV/CAC ratio.`,
      sections: [
        { title: "Product Strategy", agent: "PRODUCT_MANAGER", data: previousOutputs?.PRODUCT_MANAGER },
        { title: "Market Research", agent: "MARKET_RESEARCH", data: previousOutputs?.MARKET_RESEARCH },
        { title: "Business Analysis", agent: "BUSINESS_ANALYST", data: previousOutputs?.BUSINESS_ANALYST },
        { title: "UX Research", agent: "UX_RESEARCH", data: previousOutputs?.UX_RESEARCH },
        { title: "UI Design", agent: "UI_DESIGN", data: previousOutputs?.UI_DESIGN },
        { title: "Database Architecture", agent: "DATABASE_ARCHITECT", data: previousOutputs?.DATABASE_ARCHITECT },
        { title: "Backend Architecture", agent: "BACKEND_ARCHITECT", data: previousOutputs?.BACKEND_ARCHITECT },
        { title: "Frontend Architecture", agent: "FRONTEND_ARCHITECT", data: previousOutputs?.FRONTEND_ARCHITECT },
        { title: "QA Strategy", agent: "QA_ENGINEER", data: previousOutputs?.QA_ENGINEER },
        { title: "DevOps Plan", agent: "DEVOPS_ENGINEER", data: previousOutputs?.DEVOPS_ENGINEER },
        { title: "Security Review", agent: "SECURITY_ENGINEER", data: previousOutputs?.SECURITY_ENGINEER },
        { title: "Financial Model", agent: "FINANCIAL_ANALYST", data: previousOutputs?.FINANCIAL_ANALYST },
      ],
      nextSteps: [
        "Validate assumptions with 10 customer interviews",
        "Build MVP: PM + DB + Backend + Frontend outputs as code",
        "Run a 4-week design sprint to test UI concepts",
        "Secure SOC 2 readiness partner",
        "Close seed round of $1.5M on the strength of this report",
      ],
    },
  };
}

// =====================================================
// Dispatcher
// =====================================================
export function generateAgentOutput(agentType: AgentType, input: AgentRunInput): AgentRunOutput {
  switch (agentType) {
    case "PRODUCT_MANAGER":
      return productManager(input);
    case "MARKET_RESEARCH":
      return marketResearch(input);
    case "BUSINESS_ANALYST":
      return businessAnalyst(input);
    case "UX_RESEARCH":
      return uxResearch(input);
    case "UI_DESIGN":
      return uiDesign(input);
    case "DATABASE_ARCHITECT":
      return databaseArchitect(input);
    case "BACKEND_ARCHITECT":
      return backendArchitect(input);
    case "FRONTEND_ARCHITECT":
      return frontendArchitect(input);
    case "QA_ENGINEER":
      return qaEngineer(input);
    case "DEVOPS_ENGINEER":
      return devopsEngineer(input);
    case "SECURITY_ENGINEER":
      return securityEngineer(input);
    case "FINANCIAL_ANALYST":
      return financialAnalyst(input);
    case "CODE_GENERATOR":
      return codeGenerator(input);
    case "DISCOVERY_AGENT":
      return discoveryAgent(input);
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
}
