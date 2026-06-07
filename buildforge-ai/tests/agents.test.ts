import { describe, it, expect } from "vitest";
import { AGENTS, getAgent } from "@/lib/agents/definitions";

describe("Agent definitions", () => {
  it("defines exactly 12 agents", () => {
    expect(AGENTS).toHaveLength(12);
  });
  it("every agent has a unique slug", () => {
    const slugs = new Set(AGENTS.map((a) => a.slug));
    expect(slugs.size).toBe(AGENTS.length);
  });
  it("every agent has a unique type", () => {
    const types = new Set(AGENTS.map((a) => a.type));
    expect(types.size).toBe(AGENTS.length);
  });
  it("every agent has at least 1 capability and 1 output", () => {
    for (const a of AGENTS) {
      expect(a.capabilities.length).toBeGreaterThan(0);
      expect(a.outputs.length).toBeGreaterThan(0);
    }
  });
  it("getAgent returns the agent for a known type", () => {
    const a = getAgent("PRODUCT_MANAGER");
    expect(a?.name).toBe("Atlas");
  });
});
