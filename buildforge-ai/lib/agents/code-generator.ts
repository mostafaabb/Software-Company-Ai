import type { AgentType } from "@/types/agent";

export interface GeneratedFile {
  path: string;
  content: string;
  description: string;
}

export interface CodeScaffold {
  projectName: string;
  files: GeneratedFile[];
  packageJson: Record<string, unknown>;
  dockerCompose: string;
  readme: string;
  setupInstructions: string[];
}

export function generateCodeScaffold(
  projectName: string,
  agentOutputs: Partial<Record<AgentType, unknown>>
): CodeScaffold {
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const files: GeneratedFile[] = [
    {
      path: "package.json",
      content: JSON.stringify({
        name: slug,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
          "db:push": "prisma db push",
          "db:studio": "prisma studio",
          seed: "tsx prisma/seed.ts",
        },
        dependencies: {
          next: "^15.0.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "@prisma/client": "^5.0.0",
          nextauth: "^5.0.0",
          stripe: "^17.0.0",
          zod: "^3.22.0",
          "react-hook-form": "^7.50.0",
          "@hookform/resolvers": "^3.9.0",
          "class-variance-authority": "^0.7.0",
          clsx: "^2.1.0",
          "tailwind-merge": "^2.2.0",
          "lucide-react": "^0.400.0",
          "framer-motion": "^11.0.0",
        },
        devDependencies: {
          typescript: "^5.5.0",
          "@types/node": "^22.0.0",
          "@types/react": "^19.0.0",
          prisma: "^5.0.0",
          tailwindcss: "^3.4.0",
          autoprefixer: "^10.4.0",
          postcss: "^8.4.0",
        },
      }, null, 2),
      description: "Project dependencies and scripts",
    },
    {
      path: "next.config.ts",
      content: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`,
      description: "Next.js configuration",
    },
    {
      path: "tsconfig.json",
      content: JSON.stringify({
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          increment: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      }, null, 2),
      description: "TypeScript configuration",
    },
    {
      path: "tailwind.config.ts",
      content: `import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
`,
      description: "Tailwind CSS configuration",
    },
    {
      path: "prisma/schema.prisma",
      content: generatePrismaSchema(projectName, agentOutputs),
      description: "Database schema (Prisma)",
    },
    {
      path: "docker-compose.yml",
      content: `version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/${slug}
      - NEXTAUTH_SECRET=change-me-in-production
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${slug}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
`,
      description: "Docker Compose for app + PostgreSQL",
    },
    {
      path: "Dockerfile",
      content: `FROM node:20-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
`,
      description: "Multi-stage Dockerfile for production",
    },
    {
      path: ".env.example",
      content: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${slug}"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me-in-production"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
OPENAI_API_KEY="sk-..."
`,
      description: "Environment variable template",
    },
    {
      path: "src/app/layout.tsx",
      content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Built with BuildForge AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      description: "Root layout",
    },
    {
      path: "src/app/page.tsx",
      content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">${projectName}</h1>
      <p className="mt-4 text-lg text-gray-600">Your app is ready.</p>
    </main>
  );
}
`,
      description: "Home page",
    },
    {
      path: "src/app/globals.css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
      description: "Global styles",
    },
    {
      path: ".gitignore",
      content: `node_modules
.next
.env
.env.local
*.db
dist
`,
      description: "Git ignore rules",
    },
    {
      path: "README.md",
      content: `# ${projectName}

> Generated by BuildForge AI

## Getting Started

\`\`\`bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Payments:** Stripe
`,
      description: "Project README",
    },
  ];

  return {
    projectName,
    files,
    packageJson: JSON.parse(files[0].content),
    dockerCompose: files[5].content,
    readme: files[files.length - 1].content,
    setupInstructions: [
      "npm install",
      "npx prisma db push",
      "npx prisma db seed",
      "npm run dev",
    ],
  };
}

function generatePrismaSchema(projectName: string, _outputs: Partial<Record<AgentType, unknown>>): string {
  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?
  role          String    @default("USER")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Add your models here based on the ${projectName} schema.
// Run \`npx prisma db push\` after modifying this file.
`;
}
