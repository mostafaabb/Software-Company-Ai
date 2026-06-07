# BuildForge AI

> **Your AI Software Company.**  
> 12 specialized AI agents collaborate to turn your idea into a complete product blueprint.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

---

## What is BuildForge AI?

BuildForge AI is not a chatbot. It's a complete AI software company.

You describe your software idea in plain English. BuildForge spins up **12 specialized AI agents** — a Product Manager, Market Researcher, Business Analyst, UX Researcher, UI Designer, Database Architect, Backend Architect, Frontend Architect, QA Engineer, DevOps Engineer, Security Engineer, and Financial Analyst — that collaborate like a real product team.

In under 5 minutes you get a **120-page product blueprint** containing:

- Product vision, MVP scope, and roadmap
- Market research, SWOT, and TAM/SAM/SOM
- Business Requirements Document, stakeholder map, and revenue model
- User personas, journey maps, and UX recommendations
- A complete design system and screen specifications
- A production-ready Prisma schema with relationships and indexes
- A backend architecture with REST + GraphQL endpoints
- A frontend architecture with route maps and state design
- A QA strategy with test cases across all layers
- A DevOps plan with Docker, Kubernetes, and CI/CD
- A security review with threat models and risk assessment
- A financial model with MRR, LTV/CAC, pricing, and a GTM plan

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                  │
│   Landing · Auth · Dashboard · Project Workspace · Chat  │
│        (App Router, RSC, Tailwind, shadcn/ui)             │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                    API ROUTES (REST + SSE)                │
│   /api/auth · /api/projects · /api/agents · /api/chat    │
│              /api/stripe · /api/admin                    │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│              MULTI-AGENT ORCHESTRATOR                     │
│  LangGraph-inspired pipeline · Sequential / Parallel     │
│  RAG · Streaming · Memory · Tool Handoffs                 │
└──────────────────────────────────────────────────────────┘
          │              │             │            │
          ▼              ▼             ▼            ▼
   ┌─────────┐    ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  PM     │    │ Market   │  │  UX/UI   │  │  DB / API│
   └─────────┘    └──────────┘  └──────────┘  └──────────┘
          │              │             │            │
          └──────────────┴─────────────┴────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│             DATA LAYER (PostgreSQL + Prisma)              │
│   Users · Orgs · Projects · Agents · Runs · Reports      │
│   Subscriptions · Invoices · Embeddings · Audit · ...    │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                         │
│  Redis · BullMQ · S3 · Pinecone · OpenAI/Anthropic/Gemini│
│  Sentry · Prometheus · Grafana · CloudFront              │
└──────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer    | Tech                                                                |
| -------- | ------------------------------------------------------------------- |
| Frontend | Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, Zustand, TanStack Query, Framer Motion, react-markdown |
| Backend  | Next.js API Routes, NextAuth v5, Prisma, BullMQ, Pino, Zod          |
| AI       | OpenAI, Anthropic, Google Gemini (with mock fallback)               |
| Database | PostgreSQL 16, Prisma 5, Redis 7, Pinecone (vector)                 |
| Billing  | Stripe (Checkout + Billing Portal + Webhooks)                       |
| Storage  | S3 (uploads), CloudFront (CDN)                                      |
| Auth     | NextAuth v5 (JWT + OAuth Google/GitHub + Credentials)                |
| Infra    | Docker, Kubernetes, GitHub Actions, Prometheus, Grafana, Sentry     |

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- Docker (for Postgres + Redis)
- An OpenAI / Anthropic API key (or use the bundled mock provider)

### 2. Install
```bash
git clone <repo>
cd buildforge-ai
npm install
cp .env.example .env
```

### 3. Start the database
```bash
docker-compose up -d postgres redis
```

### 4. Migrate and seed
```bash
npx prisma migrate dev
npm run prisma:seed
```

### 5. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

**Demo credentials:** `demo@buildforge.ai` / `admin12345`  
**Admin credentials:** `admin@buildforge.ai` / `admin12345`

### 6. Run with Docker (full stack)
```bash
docker-compose up
```

---

## The 12 Agents

| # | Agent             | Codename  | What it produces                                                        |
|---|-------------------|-----------|-------------------------------------------------------------------------|
| 1 | Product Manager   | Atlas     | Vision, MVP scope, roadmap, success metrics                            |
| 2 | Market Research   | Scout     | Competitor analysis, SWOT, TAM/SAM/SOM, validation score               |
| 3 | Business Analyst  | Ledger    | BRD, stakeholder map, revenue model, cost analysis                     |
| 4 | UX Research       | Empathy   | Personas, journey maps, pain points, UX recommendations                |
| 5 | UI Design         | Pixel     | Design system, wireframes, screen specs, design tokens                 |
| 6 | Database Architect| Schema    | ERD, tables, Prisma schema, indexes, constraints                       |
| 7 | Backend Architect | Forge     | REST + GraphQL APIs, service architecture, security plan, OpenAPI      |
| 8 | Frontend Architect| Reacto    | Route map, components, state design, folder structure                  |
| 9 | QA Engineer       | Sherlock  | Test strategy, unit/integration/E2E tests, edge cases                  |
| 10| DevOps Engineer   | Helm      | Docker, K8s, CI/CD, monitoring, backup strategy                        |
| 11| Security Engineer | Sentinel  | Threat model, vulnerability analysis, risk assessment, compliance     |
| 12| Financial Analyst | Capital   | Revenue forecast, MRR/ARR, LTV/CAC, pricing, GTM plan                  |

Each agent has its own **system prompt**, **goal**, **memory**, **input/output schemas**, **capabilities**, and **confidence score**. The orchestrator runs them in sequence (or in parallel where appropriate) and aggregates their outputs into a single master report.

---

## Project Structure

```
buildforge-ai/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # login, signup, forgot-password
│   ├── dashboard/                # user dashboard
│   │   ├── projects/
│   │   │   ├── [id]/             # project workspace
│   │   │   │   ├── agents/       # all 12 agents
│   │   │   │   ├── chat/         # streaming chat
│   │   │   │   ├── documents/    # generated docs
│   │   │   │   ├── knowledge/    # uploaded RAG docs
│   │   │   │   ├── report/       # master report
│   │   │   │   ├── roadmap/      # PM roadmap
│   │   │   │   └── team/         # members
│   │   ├── billing/
│   │   ├── settings/
│   │   └── team/
│   ├── admin/                    # admin panel
│   ├── api/                      # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # marketing landing
│
├── components/                   # shadcn/ui + custom
│   ├── ui/                       # primitives
│   ├── layout/                   # sidebar, topbar
│   ├── marketing/                # landing components
│   ├── projects/                 # project workspace
│   ├── agents/                   # agent cards, detail
│   ├── chat/                     # chat interface
│   ├── billing/
│   └── admin/
│
├── lib/
│   ├── agents/                   # 12 agents + orchestrator
│   │   ├── definitions.ts        # agent metadata
│   │   ├── generators.ts         # structured output
│   │   ├── orchestrator.ts       # pipeline
│   │   └── chat.ts               # streaming chat
│   ├── ai/provider.ts            # multi-LLM wrapper
│   ├── auth/                     # NextAuth config
│   ├── billing/                  # Stripe helpers
│   ├── db/                       # Prisma client
│   ├── storage/                  # file storage
│   ├── utils/                    # cn, rate-limit, etc.
│   └── validations/              # Zod schemas
│
├── prisma/
│   ├── schema.prisma             # 22 models
│   └── seed.ts
│
├── hooks/                        # reusable hooks
├── stores/                       # Zustand stores
├── types/                        # shared types
│
├── k8s/                          # K8s manifests
├── .github/workflows/            # CI/CD
├── docker-compose.yml
├── Dockerfile
│
└── docs/                         # additional docs
    ├── ARCHITECTURE.md
    ├── AGENTS.md
    ├── DEPLOYMENT.md
    └── API.md
```

---

## Environment Variables

See `.env.example`. Critical ones:

```env
# Database
DATABASE_URL=postgresql://...

# Auth
AUTH_SECRET=replace-with-openssl-rand-base64-32

# AI provider (use 'mock' for local dev with no API key)
DEFAULT_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## API Reference

| Endpoint                                                      | Method | Description                          |
| ------------------------------------------------------------- | ------ | ------------------------------------ |
| `/api/auth/signup`                                            | POST   | Register a new user                  |
| `/api/projects`                                               | GET    | List projects                        |
| `/api/projects`                                               | POST   | Create a project from an idea        |
| `/api/projects/:id`                                           | GET    | Get project details                  |
| `/api/projects/:id/orchestrate`                               | POST   | Run the full 12-agent pipeline       |
| `/api/projects/:id/agents/:agentType/run`                     | POST   | Run a single agent                   |
| `/api/projects/:id/agents/:agentType/chat`                    | POST   | Streaming chat with an agent (SSE)   |
| `/api/projects/:id/chat`                                      | POST   | Streamed chat at project level       |
| `/api/projects/:id/report`                                    | GET    | Get the master report                |
| `/api/projects/:id/knowledge`                                 | GET    | List knowledge docs                  |
| `/api/upload`                                                 | POST   | Upload a knowledge doc               |
| `/api/stripe/checkout`                                        | POST   | Create a checkout session            |
| `/api/stripe/portal`                                          | POST   | Open the billing portal              |
| `/api/stripe/webhook`                                         | POST   | Stripe webhook receiver              |
| `/api/admin`                                                  | GET    | Admin metrics                        |
| `/api/admin/users`                                            | GET    | List users                           |
| `/api/health`                                                 | GET    | Health check                         |

---

## Pricing Tiers

| Plan      | Price      | Projects | Agent runs / mo | Seats | Features                              |
| --------- | ---------- | -------- | --------------- | ----- | ------------------------------------- |
| Free      | $0         | 2        | 5               | 1     | Core agents                           |
| Starter   | $99 / mo   | 10       | 100             | 1     | All 12 agents, knowledge base         |
| Pro       | $299 / mo  | Unlimited| 1,000           | 5     | Orchestration, team collaboration     |
| Agency    | $999 / mo  | Unlimited| 10,000          | 25    | White-label, dedicated CSM            |
| Enterprise| Custom     | Custom   | Custom          | Custom| SSO, SCIM, on-prem option             |

---

## Roadmap

- **Phase 1 (MVP)** ✅ — Auth, projects, PM/DB/Backend/Frontend agents, master report
- **Phase 2** — Full code generation from blueprint
- **Phase 3** — Full codebase export (zip / GitHub push)
- **Phase 4** — AI QA automation (auto-run tests)
- **Phase 5** — One-click deployment (Vercel, AWS, GCP)
- **Phase 6** — AI Development Teams (autonomous sprints)
- **Phase 7** — Autonomous Software Creation (idea → deployed app)

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT © BuildForge AI
