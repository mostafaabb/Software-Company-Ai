import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });
  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  
  if (body.markAllRead) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  }
  
  if (body.id) {
    await prisma.notification.update({ where: { id: body.id }, data: { isRead: true } });
    return NextResponse.json({ ok: true });
  }
  
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
