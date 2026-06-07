export type AgentType =
  | "PRODUCT_MANAGER"
  | "MARKET_RESEARCH"
  | "BUSINESS_ANALYST"
  | "UX_RESEARCH"
  | "UI_DESIGN"
  | "DATABASE_ARCHITECT"
  | "BACKEND_ARCHITECT"
  | "FRONTEND_ARCHITECT"
  | "QA_ENGINEER"
  | "DEVOPS_ENGINEER"
  | "SECURITY_ENGINEER"
  | "FINANCIAL_ANALYST"
  | "CODE_GENERATOR"
  | "DISCOVERY_AGENT";

export type AgentRunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type DocumentStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
export type ChatMode = "ORCHESTRATOR" | "AGENT" | "TEAM";
export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MembershipRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type PlanTier = "FREE" | "STARTER" | "PRO" | "AGENCY" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "UNPAID" | "INCOMPLETE";
export type ProjectStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
export type ReportType =
  | "PRD" | "MARKET_RESEARCH" | "BUSINESS_ANALYSIS" | "UX_RESEARCH" | "UI_DESIGN"
  | "DATABASE" | "BACKEND" | "FRONTEND" | "QA" | "DEVOPS" | "SECURITY" | "FINANCIAL"
  | "CODE" | "DISCOVERY" | "MASTER";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  idea: string;
  industry: string;
  targetMarket: string;
  tags: string[];
  icon: string;
  popular: boolean;
}

export interface VersionSnapshot {
  id: string;
  projectId: string;
  version: number;
  label: string;
  agentOutputs: Record<string, unknown>;
  createdAt: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  connected: boolean;
  config?: Record<string, string>;
}
