import { describe, it, expect } from "vitest";
import { PLANS } from "@/lib/billing/stripe";

describe("Pricing plans", () => {
  it("has 5 plans", () => {
    expect(Object.keys(PLANS)).toHaveLength(5);
  });
  it("Free is $0", () => {
    expect(PLANS.FREE.price).toBe(0);
  });
  it("Starter is $99", () => {
    expect(PLANS.STARTER.price).toBe(9900);
  });
  it("Pro is $299", () => {
    expect(PLANS.PRO.price).toBe(29900);
  });
  it("Agency is $999", () => {
    expect(PLANS.AGENCY.price).toBe(99900);
  });
  it("every plan has features and limits", () => {
    for (const p of Object.values(PLANS)) {
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.limits).toBeDefined();
    }
  });
});
