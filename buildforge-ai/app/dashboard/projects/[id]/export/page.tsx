import { ExportPanel } from "@/components/projects/export-panel";

export const metadata = { title: "Export" };

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Export &amp; Deploy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Download your project or deploy it to the cloud.</p>
      </div>
      <ExportPanel projectId={id} />
    </div>
  );
}