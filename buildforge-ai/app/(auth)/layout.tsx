import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-blob" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>
      <div className="container flex min-h-screen flex-col">
        <header className="flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500" />
              <div className="absolute inset-[2px] flex items-center justify-center rounded-md bg-background">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight">BuildForge AI</span>
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-12">
          {children}
        </main>
        <footer className="py-6 text-center text-xs text-muted-foreground">
          © 2026 BuildForge AI · <Link href="/" className="hover:text-foreground">Home</Link>
        </footer>
      </div>
    </div>
  );
}
