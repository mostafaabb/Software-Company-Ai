import { TemplateGallery } from "@/components/projects/template-gallery";

export const metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Project Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start with a pre-built template and let AI customize it for you.</p>
      </div>
      <TemplateGallery />
    </div>
  );
}