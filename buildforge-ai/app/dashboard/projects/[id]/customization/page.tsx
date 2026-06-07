import { AgentCustomizer } from "@/components/projects/agent-customizer";

export const metadata = { title: "Customize Agents" };

export default async function CustomizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Customize Agents</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fine-tune each agent's behavior for your project.</p>
      </div>
      <AgentCustomizer projectId={id} />
    </div>
  );
}