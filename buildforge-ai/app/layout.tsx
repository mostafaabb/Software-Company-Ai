import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Calistoga } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const cal = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-cal", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "BuildForge AI — Your AI Software Company",
    template: "%s · BuildForge AI",
  },
  description:
    "BuildForge AI is a complete AI-powered software company. 12 specialized agents collaborate to turn your idea into a full product blueprint — strategy, design, architecture, code, deployment, financials.",
  keywords: [
    "AI software company",
    "AI agents",
    "PRD generator",
    "system architecture AI",
    "AI startup",
    "AI consulting",
    "BuildForge",
  ],
  authors: [{ name: "BuildForge AI" }],
  openGraph: {
    title: "BuildForge AI — Your AI Software Company",
    description: "From idea to blueprint. 12 AI agents build your software company in minutes.",
    type: "website",
    siteName: "BuildForge AI",
  },
  twitter: { card: "summary_large_image", title: "BuildForge AI" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} ${cal.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
