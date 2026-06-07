import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { stripe, PLANS } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";
import { CheckoutSchema } from "@/lib/validations/schemas";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });

  const body = await req.json();
  const data = CheckoutSchema.parse(body);
  const plan = PLANS[data.plan];
  if (!plan || !("stripePriceId" in plan) || !plan.stripePriceId) {
    return NextResponse.json({ error: "Plan not available" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=1`,
    metadata: { userId: user.id, plan: data.plan },
  });
  return NextResponse.json({ url: checkout.url });
}
