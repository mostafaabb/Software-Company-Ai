import { AnalyticsDashboard } from "@/components/projects/analytics-dashboard";

export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Usage Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your AI team activity, token usage, and costs.</p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}