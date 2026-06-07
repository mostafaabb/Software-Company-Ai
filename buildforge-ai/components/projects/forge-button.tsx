"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Rocket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ForgeButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function onClick() {
    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}/orchestrate`, { method: "POST", body: "{}" });
    if (!res.ok) {
      toast.error("Forge failed");
      setLoading(false);
      return;
    }
    toast.success("Forge complete! Opening the master report…");
    router.push(`/dashboard/projects/${projectId}/report`);
    router.refresh();
  }

  return (
    <Button variant="gradient" onClick={onClick} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
      Forge full pipeline
    </Button>
  );
}
