import { ClientPortal } from "@/components/projects/client-portal";

export const metadata = { title: "Client Portal" };

export default async function PortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Client Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Share project progress with clients and stakeholders.</p>
      </div>
      <ClientPortal projectId={id} />
    </div>
  );
}