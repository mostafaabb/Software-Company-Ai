import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { stripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });

  const sub = await prisma.subscription.findFirst({ where: { userId: session.user.id } });
  if (!sub?.stripeCustomerId) return NextResponse.json({ error: "No active subscription" }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
