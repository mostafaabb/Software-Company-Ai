import { CodePreview } from "@/components/projects/code-preview";

export const metadata = { title: "Generated Code" };

export default async function CodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Generated Code</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and download the AI-generated project scaffold.</p>
      </div>
      <CodePreview projectId={id} />
    </div>
  );
}