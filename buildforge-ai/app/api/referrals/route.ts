import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";
import { nanoid } from "nanoid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  let referral = await prisma.referral.findFirst({ where: { referrerId: session.user.id } });
  if (!referral) {
    referral = await prisma.referral.create({
      data: { referrerId: session.user.id, code: nanoid(10).toUpperCase() },
    });
  }
  
  const referralCount = await prisma.referral.count({
    where: { referrerId: session.user.id, status: "COMPLETED" },
  });
  
  return NextResponse.json({ referral, referralCount });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  
  let referral = await prisma.referral.findFirst({ where: { referrerId: session.user.id } });
  if (!referral) {
    referral = await prisma.referral.create({
      data: { referrerId: session.user.id, code: nanoid(10).toUpperCase() },
    });
  }
  
  await prisma.referral.update({
    where: { id: referral.id },
    data: { referredEmail: body.email },
  });
  
  return NextResponse.json({ ok: true });
}
