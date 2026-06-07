import { VersionHistory } from "@/components/projects/version-history";

export const metadata = { title: "Versions" };

export default async function VersionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Version History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track changes to your agent outputs over time.</p>
      </div>
      <VersionHistory projectId={id} />
    </div>
  );
}