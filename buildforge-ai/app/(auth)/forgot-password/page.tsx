import type { Metadata } from "next";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">We'll email you a secure link to reset it.</p>
        <ForgotForm />
      </div>
    </div>
  );
}
