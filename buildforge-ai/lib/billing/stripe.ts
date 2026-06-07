/**
 * Stripe client and helpers
 */
import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" as any })
  : null;

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    interval: "month" as const,
    features: [
      "2 active projects",
      "5 agent runs / month",
      "Basic agents (PM, DB, Backend, Frontend)",
      "Community support",
    ],
    limits: { projects: 2, agentRuns: 5, storage: 100 * 1024 * 1024 },
  },
  STARTER: {
    name: "Starter",
    price: 9900,
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRICE_STARTER,
    features: [
      "10 active projects",
      "100 agent runs / month",
      "All 12 agents",
      "Knowledge base (RAG)",
      "Email support",
    ],
    limits: { projects: 10, agentRuns: 100, storage: 5 * 1024 * 1024 * 1024 },
  },
  PRO: {
    name: "Pro",
    price: 29900,
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRICE_PRO,
    features: [
      "Unlimited projects",
      "1,000 agent runs / month",
      "All 12 agents + orchestration",
      "Knowledge base (RAG)",
      "Team collaboration (5 seats)",
      "Priority support",
    ],
    limits: { projects: -1, agentRuns: 1000, storage: 50 * 1024 * 1024 * 1024 },
  },
  AGENCY: {
    name: "Agency",
    price: 99900,
    interval: "month" as const,
    stripePriceId: process.env.STRIPE_PRICE_AGENCY,
    features: [
      "Unlimited projects",
      "10,000 agent runs / month",
      "All 12 agents + orchestration",
      "Knowledge base (RAG) with custom embeddings",
      "Team collaboration (25 seats)",
      "White-label reports",
      "Dedicated support",
    ],
    limits: { projects: -1, agentRuns: 10000, storage: 500 * 1024 * 1024 * 1024 },
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: -1,
    interval: "month" as const,
    features: [
      "Custom everything",
      "Dedicated infrastructure",
      "SLA + DPA",
      "SSO + SCIM",
      "On-prem deployment option",
    ],
    limits: { projects: -1, agentRuns: -1, storage: -1 },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
