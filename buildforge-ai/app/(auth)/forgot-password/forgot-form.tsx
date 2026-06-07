"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotForm() {
  const [done, setDone] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
    toast.success("Check your email for a reset link");
  }

  if (done) {
    return (
      <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
        If an account exists with that email, we've sent instructions to reset your password.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@company.com" />
      </div>
      <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
        {loading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
