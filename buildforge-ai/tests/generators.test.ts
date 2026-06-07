import { describe, it, expect } from "vitest";
import { generateAgentOutput } from "@/lib/agents/generators";

describe("Agent generators", () => {
  const ctx = {
    context: { id: "p1", name: "TestApp", idea: "Build me a CRM with contacts, deals, and analytics" },
  };

  it("product manager returns a vision and roadmap", () => {
    const out = generateAgentOutput("PRODUCT_MANAGER", ctx);
    expect(out.output).toHaveProperty("productVision");
    expect(out.output).toHaveProperty("productRoadmap");
    expect(out.confidenceScore).toBeGreaterThan(0.5);
  });

  it("market research returns competitors and SWOT", () => {
    const out = generateAgentOutput("MARKET_RESEARCH", ctx);
    expect(out.output).toHaveProperty("competitorAnalysis");
    expect(out.output).toHaveProperty("swot");
  });

  it("database architect returns a Prisma-shaped model summary", () => {
    const out = generateAgentOutput("DATABASE_ARCHITECT", ctx);
    expect(out.output).toHaveProperty("tables");
    expect(out.output).toHaveProperty("corePrismaModels");
  });

  it("backend architect returns endpoints and security plan", () => {
    const out = generateAgentOutput("BACKEND_ARCHITECT", ctx);
    expect(out.output).toHaveProperty("restEndpoints");
    expect(out.output).toHaveProperty("securityPlan");
  });

  it("financial analyst returns MRR projection and GTM", () => {
    const out = generateAgentOutput("FINANCIAL_ANALYST", ctx);
    expect(out.output).toHaveProperty("mrrProjection");
    expect(out.output).toHaveProperty("gtmPlan");
  });
});
