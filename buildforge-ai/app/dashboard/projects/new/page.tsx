import { Suspense } from "react";
import { NewProjectForm } from "./new-project-form";

export const metadata = { title: "New project" };

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ idea?: string }> }) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Describe your idea</h1>
        <p className="mt-1 text-sm text-muted-foreground">The more context you give, the better your AI team performs.</p>
      </div>
      <Suspense>
        <NewProjectForm initialIdea={params?.idea || undefined} />
      </Suspense>
    </div>
  );
}
