"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SAMPLE = "Build me a restaurant management SaaS with inventory management, QR ordering, employee scheduling, analytics, and customer loyalty.";

export function NewProjectForm({ initialIdea }: { initialIdea?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const formRef = React.useRef<HTMLFormElement>(null);
  const runAfterRef = React.useRef(false);
  const [loading, setLoading] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [idea, setIdea] = React.useState((params.get("idea") as string) || SAMPLE);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const runAfter = runAfterRef.current;
    runAfterRef.current = false;
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      idea: form.get("idea") as string,
      industry: (form.get("industry") as string) || undefined,
      targetMarket: (form.get("targetMarket") as string) || undefined,
    };
    if (!payload.name || !payload.idea) {
      toast.error("Please provide a name and an idea");
      return;
    }
    (runAfter ? setRunning : setLoading)(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not create project");
      (runAfter ? setRunning : setLoading)(false);
      return;
    }
    const { project } = await res.json();
    if (runAfter) {
      toast.success("Project created. Spinning up your AI team…");
      const r = await fetch(`/api/projects/${project.id}/orchestrate`, { method: "POST", body: "{}" });
      if (!r.ok) {
        toast.error("Orchestration failed — you can retry from the project page.");
      } else {
        toast.success("Master report generated!");
      }
      router.push(`/dashboard/projects/${project.id}/report`);
    } else {
      toast.success("Project created");
      router.push(`/dashboard/projects/${project.id}`);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" name="name" required placeholder="e.g. RestaurantOS" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="idea">Your idea</Label>
            <Textarea
              id="idea"
              name="idea"
              required
              rows={6}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe the software you want to build. Mention features, target users, and any constraints."
            />
            <p className="text-xs text-muted-foreground">
              Tip: Include users, features, and success criteria. 20+ characters.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry (optional)</Label>
              <Input id="industry" name="industry" placeholder="e.g. Hospitality" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetMarket">Target market (optional)</Label>
              <Input id="targetMarket" name="targetMarket" placeholder="e.g. SMB restaurants" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" variant="outline" size="lg" disabled={loading || running}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Save and customize
        </Button>
        <Button
          type="button"
          variant="gradient"
          size="lg"
          disabled={loading || running}
          onClick={() => { runAfterRef.current = true; formRef.current?.requestSubmit(); }}
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Forging your blueprint…
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" /> Forge now
            </>
          )}
        </Button>
      </div>

      <Card className="border-dashed bg-card/40">
        <CardContent className="p-4 text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-2">Heads up</Badge>
          <span>Forging runs the full 12-agent pipeline. Takes 2–5 minutes. You can keep working while it runs.</span>
        </CardContent>
      </Card>
    </form>
  );
}
