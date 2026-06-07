import { IntegrationMarketplace } from "@/components/projects/integration-marketplace";

export const metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connect your favorite tools to BuildForge.</p>
      </div>
      <IntegrationMarketplace />
    </div>
  );
}