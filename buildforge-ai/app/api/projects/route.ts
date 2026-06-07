import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { CreateProjectSchema } from "@/lib/validations/schemas";
import { auth } from "@/lib/auth/config";
import { slugify } from "@/lib/utils/cn";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { organization: { memberships: { some: { userId: session.user.id } } } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        _count: { select: { agentRuns: true, reports: true, documents: true } },
      },
    });
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("[projects GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = CreateProjectSchema.parse(body);

    // Free plan limit check
    const userProjectCount = await prisma.project.count({ where: { ownerId: session.user.id } });
    const sub = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "TRIALING"] } },
    });
    const plan = sub?.plan || "FREE";
    const limits: Record<string, number> = { FREE: 2, STARTER: 10, PRO: 100, AGENCY: 1000, ENTERPRISE: 999999 };
    if (userProjectCount >= (limits[plan] || 2) && plan === "FREE") {
      return NextResponse.json(
        { error: "Free plan limit reached. Upgrade to create more projects." },
        { status: 402 },
      );
    }

    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let i = 1;
    while (await prisma.project.findFirst({ where: { ownerId: session.user.id, slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug,
        idea: data.idea,
        description: data.description,
        industry: data.industry,
        targetMarket: data.targetMarket,
        visibility: data.visibility,
        ownerId: session.user.id,
        organizationId: data.organizationId,
        tags: data.tags ? JSON.stringify(data.tags) : "",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "project.create",
        resource: "Project",
        resourceId: project.id,
        metadata: JSON.stringify({ name: project.name }),
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: err.issues }, { status: 400 });
    }
    console.error("[projects POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
