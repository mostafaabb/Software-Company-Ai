import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";

export default async function AdminRevenue() {
  const subs = await prisma.subscription.findMany({ where: { status: "ACTIVE" } });
  const planPrices: Record<string, number> = { FREE: 0, STARTER: 99, PRO: 299, AGENCY: 999, ENTERPRISE: 0 };
  const mrr = subs.reduce((acc, s) => acc + (planPrices[s.plan] || 0), 0);
  const arr = mrr * 12;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Revenue</h1>
        <p className="mt-1 text-sm text-muted-foreground">Live revenue metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="MRR" value={`$${mrr.toLocaleString()}`} icon={DollarSign} />
        <Metric label="ARR" value={`$${arr.toLocaleString()}`} icon={TrendingUp} />
        <Metric label="Paying customers" value={subs.length} icon={Users} />
        <Metric label="Avg. ARPU" value={`$${subs.length ? (mrr / subs.length).toFixed(0) : 0}`} icon={Activity} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by plan</CardTitle>
          <CardDescription>Distribution of MRR across subscription tiers.</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(planPrices).map(([plan, price]) => {
            const count = subs.filter((s) => s.plan === plan).length;
            const revenue = count * price;
            const pct = mrr > 0 ? (revenue / mrr) * 100 : 0;
            return (
              <div key={plan} className="mb-3">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{plan}</span>
                  <span className="text-muted-foreground">${revenue.toLocaleString()} / mo · {count} customers</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{label}</div>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
