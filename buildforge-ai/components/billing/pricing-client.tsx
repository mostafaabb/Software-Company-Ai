"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/billing/stripe";
import { cn } from "@/lib/utils/cn";

export function PricingClient({ currentPlan }: { currentPlan: keyof typeof PLANS }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);

  async function checkout(planKey: "STARTER" | "PRO" | "AGENCY") {
    setLoading(planKey);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not start checkout");
      setLoading(null);
      return;
    }
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { toast.error("Stripe not configured"); setLoading(null); }
  }

  const tiers: Array<{ key: keyof typeof PLANS; highlight?: boolean }> = [
    { key: "FREE" },
    { key: "STARTER" },
    { key: "PRO", highlight: true },
    { key: "AGENCY" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {tiers.map(({ key, highlight }) => {
        const plan = PLANS[key];
        const isCurrent = key === currentPlan;
        return (
          <Card key={key} className={cn("relative h-full border-border/60", highlight && "ring-1 ring-fuchsia-500/30")}>
            {highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="gradient">Most popular</Badge>
              </div>
            )}
            <CardContent className="p-5">
              <div className="font-display text-lg font-semibold">{plan.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">${plan.price > 0 ? (plan.price / 100) : 0}</span>
                <span className="text-sm text-muted-foreground">/ mo</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                variant={highlight ? "gradient" : "outline"}
                disabled={isCurrent || loading !== null}
                onClick={() => key !== "FREE" && checkout(key as any)}
              >
                {isCurrent ? "Current plan" : loading === key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {!isCurrent && key === "FREE" ? "Downgrade" : !isCurrent ? `Upgrade to ${plan.name}` : ""}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
