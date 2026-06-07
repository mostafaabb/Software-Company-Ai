import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue building with your AI team.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to BuildForge?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
