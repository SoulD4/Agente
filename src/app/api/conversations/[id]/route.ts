import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateOrg } from "@/lib/current-org";

async function getConversation(userId: string, convId: string) {
  const org = await getOrCreateOrg(userId);
  if (!org) return null;
  return prisma.conversation.findFirst({
    where: { id: convId, organizationId: org.id },
    include: { agent: { select: { id: true, name: true } } },
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const conv = await getConversation(userId, id);
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json({ ...conv, messages });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const conv = await getConversation(userId, id);
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  const updated = await prisma.conversation.update({
    where: { id },
    data: {
      ...(body.humanTakeover !== undefined ? { humanTakeover: body.humanTakeover } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    },
  });

  return NextResponse.json(updated);
}
