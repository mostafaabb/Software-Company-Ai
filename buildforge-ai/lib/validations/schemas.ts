import { z } from "zod";

// =====================================================
// Auth
// =====================================================
export const SignupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(128),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// =====================================================
// Projects
// =====================================================
export const CreateProjectSchema = z.object({
  name: z.string().min(2).max(80),
  idea: z.string().min(20).max(2000),
  description: z.string().max(500).optional(),
  industry: z.string().max(60).optional(),
  targetMarket: z.string().max(60).optional(),
  visibility: z.enum(["PRIVATE", "TEAM", "PUBLIC"]).default("PRIVATE"),
  organizationId: z.string().optional(),
  tags: z.array(z.string()).max(10).default([]),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// =====================================================
// Agent runs
// =====================================================
export const RunAgentSchema = z.object({
  agentType: z.enum([
    "PRODUCT_MANAGER",
    "MARKET_RESEARCH",
    "BUSINESS_ANALYST",
    "UX_RESEARCH",
    "UI_DESIGN",
    "DATABASE_ARCHITECT",
    "BACKEND_ARCHITECT",
    "FRONTEND_ARCHITECT",
    "QA_ENGINEER",
    "DEVOPS_ENGINEER",
    "SECURITY_ENGINEER",
    "FINANCIAL_ANALYST",
  ]),
  input: z.record(z.any()).default({}),
});

export const OrchestrateSchema = z.object({
  agents: z
    .array(z.string())
    .default([
      "PRODUCT_MANAGER",
      "MARKET_RESEARCH",
      "BUSINESS_ANALYST",
      "UX_RESEARCH",
      "UI_DESIGN",
      "DATABASE_ARCHITECT",
      "BACKEND_ARCHITECT",
      "FRONTEND_ARCHITECT",
      "QA_ENGINEER",
      "DEVOPS_ENGINEER",
      "SECURITY_ENGINEER",
      "FINANCIAL_ANALYST",
    ]),
  parallel: z.boolean().default(false),
});

// =====================================================
// Chat
// =====================================================
export const CreateChatSchema = z.object({
  title: z.string().min(1).max(120).default("New chat"),
  mode: z.enum(["ORCHESTRATOR", "AGENT", "TEAM"]).default("AGENT"),
  agentType: z.string().optional(),
});

export const SendMessageSchema = z.object({
  chatId: z.string().optional(),
  projectId: z.string(),
  agentType: z.string().optional(),
  content: z.string().min(1).max(8000),
  stream: z.boolean().default(false),
});

// =====================================================
// Knowledge base
// =====================================================
export const CreateKnowledgeDocSchema = z.object({
  title: z.string().min(1).max(200),
  storageKey: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
});

// =====================================================
// Comments
// =====================================================
export const CreateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  parentId: z.string().optional(),
});

// =====================================================
// Organization
// =====================================================
export const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().max(500).optional(),
  website: z.string().url().optional(),
});

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]).default("VIEWER"),
});

// =====================================================
// Billing
// =====================================================
export const CheckoutSchema = z.object({
  plan: z.enum(["STARTER", "PRO", "AGENCY"]),
  interval: z.enum(["month", "year"]).default("month"),
});
