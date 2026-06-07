import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Free forever. No credit card required.</p>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
