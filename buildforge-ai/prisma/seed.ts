import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BuildForge AI…");

  // Admin user
  const passwordHash = await bcrypt.hash("admin12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@buildforge.ai" },
    update: {},
    create: {
      email: "admin@buildforge.ai",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Demo user
  const demo = await prisma.user.upsert({
    where: { email: "demo@buildforge.ai" },
    update: {},
    create: {
      email: "demo@buildforge.ai",
      name: "Demo Founder",
      passwordHash,
      onboardingDone: true,
    },
  });

  // Agent definitions
/* eslint-disable */
  const agentDefs: Array<{ type: string; name: string; role: string; description: string; icon: string }> = [
    { type: "PRODUCT_MANAGER", name: "Atlas", role: "Senior Product Manager", description: "Defines product vision and roadmap", icon: "Compass" },
    { type: "MARKET_RESEARCH", name: "Scout", role: "Market Research Analyst", description: "Analyzes competitors and market", icon: "Globe" },
    { type: "BUSINESS_ANALYST", name: "Ledger", role: "Business Analyst", description: "Models business requirements", icon: "Briefcase" },
    { type: "UX_RESEARCH", name: "Empathy", role: "UX Research Lead", description: "Builds personas and journeys", icon: "Users" },
    { type: "UI_DESIGN", name: "Pixel", role: "Product Designer", description: "Designs screens and design system", icon: "Palette" },
    { type: "DATABASE_ARCHITECT", name: "Schema", role: "Database Architect", description: "Designs data layer", icon: "Database" },
    { type: "BACKEND_ARCHITECT", name: "Forge", role: "Backend Architect", description: "Designs APIs and services", icon: "Server" },
    { type: "FRONTEND_ARCHITECT", name: "Reacto", role: "Frontend Architect", description: "Designs frontend architecture", icon: "Layout" },
    { type: "QA_ENGINEER", name: "Sherlock", role: "QA Engineer", description: "Builds test strategy", icon: "Bug" },
    { type: "DEVOPS_ENGINEER", name: "Helm", role: "DevOps Engineer", description: "Designs infrastructure", icon: "Cloud" },
    { type: "SECURITY_ENGINEER", name: "Sentinel", role: "Security Engineer", description: "Threat modeling and reviews", icon: "Shield" },
    { type: "FINANCIAL_ANALYST", name: "Capital", role: "Financial Analyst", description: "Models SaaS economics", icon: "TrendingUp" },
    { type: "CODE_GENERATOR", name: "Forge Coder", role: "Senior Full-Stack Engineer", description: "Generates starter code from agent outputs", icon: "Code2" },
    { type: "DISCOVERY_AGENT", name: "Oracle", role: "Product Discovery Specialist", description: "Interviews users to refine their idea", icon: "Eye" },
  ];
  for (const a of agentDefs) {
    await prisma.agentDefinition.upsert({
      where: { type: a.type },
      update: {},
      create: {
        type: a.type,
        name: a.name,
        role: a.role,
        description: a.description,
        goal: a.description,
        systemPrompt: `You are ${a.name}, ${a.role}.`,
        icon: a.icon,
        color: "text-violet-500",
        capabilities: "",
        order: 0,
      },
    });
  }

  // Demo project
  const existing = await prisma.project.findFirst({ where: { ownerId: demo.id, slug: "restaurantos" } });
  if (!existing) {
    await prisma.project.create({
      data: {
        name: "RestaurantOS",
        slug: "restaurantos",
        idea: "Build me a restaurant management SaaS with inventory management, QR ordering, employee scheduling, analytics, and customer loyalty.",
        description: "All-in-one restaurant operations platform",
        industry: "Hospitality",
        targetMarket: "SMB restaurants",
        ownerId: demo.id,
        status: "DRAFT",
      },
    });
  }

  // Subscription
  await prisma.subscription.create({
    data: {
      userId: demo.id,
      plan: "FREE",
      status: "ACTIVE",
    },
  }).catch(() => {});

  console.log("Seed complete.");
  console.log("Demo credentials: demo@buildforge.ai / admin12345");
  console.log("Admin credentials: admin@buildforge.ai / admin12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
