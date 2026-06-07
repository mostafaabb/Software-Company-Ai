# Architecture

BuildForge AI is a **monolithic Next.js 15 application** that serves both the frontend UI and the backend API. This is intentional for the MVP — it gives a single deployable artifact, simplifies local development, and removes the need for a separate NestJS service.

For hyperscale, the same codebase can be split: the API routes are isolated under `app/api/*` and the `lib/agents/*` and `lib/db/*` modules are framework-agnostic, so they can be lifted into a NestJS service without rewrites.

## Multi-Agent Orchestrator

The orchestrator (`lib/agents/orchestrator.ts`) follows a **LangGraph-inspired DAG**:

```
User Idea
   ↓
Product Manager ──→ Market Research ──→ Business Analyst
                                            ↓
                                       UX Research
                                            ↓
                                         UI Design
                                            ↓
                                  Database Architect
                                            ↓
                                  Backend Architect
                                            ↓
                                 Frontend Architect
                                            ↓
                                       QA Engineer
                                            ↓
                                    DevOps Engineer
                                            ↓
                                   Security Engineer
                                            ↓
                                  Financial Analyst
                                            ↓
                                  Master Report
```

Each node:
1. Receives the **project context** (name, idea, industry)
2. Receives **all prior outputs** (for hand-off)
3. Generates a **structured JSON output** (validated)
4. Persists a row in `AgentRun` with timing, tokens, confidence
5. Updates the `Document` table for the project

The orchestrator supports both **sequential** and **parallel** execution. In parallel mode, the 5 research-heavy agents (market, UX, QA, DevOps, security) run concurrently after the foundational ones (PM, BA, design, DB, backend) complete sequentially.

## Data Model

22 Prisma models organized into 7 domains:

- **Auth & Users** — User, Account, Session, ApiKey, VerificationToken
- **Organizations** — Organization, Membership, Invitation
- **Projects** — Project, ProjectStatus
- **Agents** — AgentDefinition, AgentRun
- **Knowledge & RAG** — KnowledgeDoc, DocumentChunk, Embedding
- **Chat** — Chat, Message
- **Tasks & Sprints** — Task, Sprint
- **Reports & Documents** — Report, Document
- **Collaboration** — Comment, Mention, Notification
- **Files** — File
- **Billing** — Subscription, Invoice, Payment
- **Analytics** — UsageMetric
- **Audit** — AuditLog

## Security

- **Auth:** NextAuth v5 with JWT + OAuth (Google, GitHub) + Credentials
- **RBAC:** Membership role (OWNER, ADMIN, EDITOR, VIEWER) + global User.role (USER, ADMIN, SUPER_ADMIN)
- **Rate limiting:** In-memory + Redis via `lib/utils/rate-limit.ts`
- **CSP & headers:** Set in `next.config.ts`
- **Encryption:** TLS in transit, encryption at rest via RDS
- **Audit:** All sensitive actions written to `AuditLog`
- **File uploads:** MIME sniffing, size limits, AV scan hooks ready

## Scalability Plan

- **0–10k users:** Single Next.js deployment, RDS Postgres, ElastiCache Redis, 2–4 Fargate tasks
- **10k–100k users:** Multi-AZ, read replicas, CloudFront, 4–20 tasks
- **100k+ users:** Multi-region, Aurora Global, 20–100 tasks, Pinecone for embeddings
