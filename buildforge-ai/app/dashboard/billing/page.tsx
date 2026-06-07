import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/billing/stripe";
import { Check, Sparkles, CreditCard } from "lucide-react";
import { PricingClient } from "@/components/billing/pricing-client";

export default async function BillingPage() {
  const session = await auth();
  const sub = await prisma.subscription.findFirst({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });
  const invoices = await prisma.invoice.findMany({
    where: { subscription: { userId: session!.user.id } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const currentPlan = (sub?.plan || "FREE") as keyof typeof PLANS;
  const plan = PLANS[currentPlan];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your plan, payment, and invoices.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-3 p-6 sm:flex-row sm:items-center">
          <div>
            <Badge variant="gradient" className="mb-2">Current plan</Badge>
            <div className="font-display text-2xl font-bold">{plan.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {plan.price > 0 ? `$${plan.price / 100} / ${plan.interval}` : "Free forever"}
            </div>
          </div>
          {sub?.stripeCustomerId && (
            <form action="/api/stripe/portal" method="post">
              <Button variant="outline"><CreditCard className="h-4 w-4" /> Manage in Stripe</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <PricingClient currentPlan={currentPlan} />

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Past invoices for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {invoices.map((i) => (
                <div key={i.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{i.number || i.id}</div>
                    <div className="text-xs text-muted-foreground">{new Date(i.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono">${(i.amount / 100).toFixed(2)}</span>
                    <Badge variant={i.status === "PAID" ? "success" : "warning"}>{i.status.toLowerCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
