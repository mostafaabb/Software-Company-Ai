import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/config";
import { rateLimit } from "@/lib/utils/rate-limit";
import { SignupSchema } from "@/lib/validations/schemas";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const limit = await rateLimit({ key: `signup:${ip}`, limit: 5, windowMs: 60_000 });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const data = SignupSchema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: await hashPassword(data.password),
      },
      select: { id: true, email: true, name: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "user.signup",
        resource: "User",
        resourceId: user.id,
        ipAddress: ip,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: err.issues }, { status: 400 });
    }
    console.error("[signup]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
