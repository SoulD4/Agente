import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateOrg } from "@/lib/current-org";

async function getAgent(userId: string, agentId: string) {
  const org = await getOrCreateOrg(userId);
  if (!org) return null;
  return prisma.agent.findFirst({ where: { id: agentId, organizationId: org.id } });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const agent = await getAgent(userId, id);
  if (!agent) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { whatsappAccessToken, ...safe } = agent;
  return NextResponse.json({ ...safe, whatsappConnected: !!whatsappAccessToken && !!agent.whatsappPhoneNumberId });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getAgent(userId, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // Enforce WhatsApp number uniqueness at the application layer (no DB @unique):
  // a phone_number_id may only be bound to one agent, otherwise webhook routing
  // would be ambiguous.
  if (body.whatsappPhoneNumberId) {
    const clash = await prisma.agent.findFirst({
      where: { whatsappPhoneNumberId: body.whatsappPhoneNumberId, id: { not: id } },
      select: { id: true },
    });
    if (clash) {
      return NextResponse.json(
        { error: "Este número de WhatsApp já está conectado a outro agente." },
        { status: 409 },
      );
    }
  }

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      name: body.nome ?? existing.name,
      agentType: body.tipo ?? existing.agentType,
      voiceTone: body.tomDeVoz ?? existing.voiceTone,
      greeting: body.apresentacao ?? existing.greeting,
      phoneNumber: body.whatsapp ?? existing.phoneNumber,
      status: body.status ?? existing.status,
      ...(body.schedule ? { schedule: body.schedule } : {}),
      ...(body.whatsappPhoneNumberId !== undefined ? { whatsappPhoneNumberId: body.whatsappPhoneNumberId || null } : {}),
      ...(body.whatsappAccessToken !== undefined ? { whatsappAccessToken: body.whatsappAccessToken || null } : {}),
    },
  });

  return NextResponse.json(agent);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getAgent(userId, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.agent.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
