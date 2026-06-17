import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateOrg } from "@/lib/current-org";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getOrCreateOrg(userId);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") as "OPEN" | "CLOSED" | "PENDING" | null;
  const agentId = url.searchParams.get("agentId");
  const q = url.searchParams.get("q");
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = 25;

  const where = {
    organizationId: org.id,
    ...(status ? { status } : {}),
    ...(agentId ? { agentId } : {}),
    ...(q
      ? {
          OR: [
            { contactName: { contains: q, mode: "insensitive" as const } },
            { contactPhone: { contains: q } },
          ],
        }
      : {}),
  };

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        agent: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, role: true, createdAt: true },
        },
      },
    }),
    prisma.conversation.count({ where }),
  ]);

  const result = conversations.map((c) => ({
    id: c.id,
    contactName: c.contactName,
    contactPhone: c.contactPhone,
    status: c.status,
    humanTakeover: c.humanTakeover,
    updatedAt: c.updatedAt,
    createdAt: c.createdAt,
    agent: c.agent,
    lastMessage: c.messages[0] ?? null,
  }));

  return NextResponse.json({ conversations: result, total, page, limit });
}
