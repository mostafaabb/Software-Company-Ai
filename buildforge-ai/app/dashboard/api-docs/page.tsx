import { ApiDocs } from "@/components/projects/api-docs";

export const metadata = { title: "API Docs" };

export default function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">API &amp; Developer SDK</h1>
        <p className="mt-1 text-sm text-muted-foreground">Integrate BuildForge into your own applications.</p>
      </div>
      <ApiDocs />
    </div>
  );
}