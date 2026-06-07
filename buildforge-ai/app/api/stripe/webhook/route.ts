import { NextResponse } from "next/server";
import { stripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.metadata?.userId;
      const plan = s.metadata?.plan;
      if (userId && plan) {
        await prisma.subscription.upsert({
          where: { stripeCustomerId: s.customer as string },
          update: { plan: plan as any, status: "ACTIVE" },
          create: {
            userId,
            plan: plan as any,
            status: "ACTIVE",
            stripeCustomerId: s.customer as string,
            stripeSubscriptionId: s.subscription as string,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const s = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: s.id },
        data: {
          status: s.status.toUpperCase() as any,
          currentPeriodStart: new Date(s.current_period_start * 1000),
          currentPeriodEnd: new Date(s.current_period_end * 1000),
          cancelAtPeriodEnd: s.cancel_at_period_end,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const s = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: s.id },
        data: { status: "CANCELED", canceledAt: new Date() },
      });
      break;
    }
  }
  return NextResponse.json({ received: true });
}
