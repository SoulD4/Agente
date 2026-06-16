import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateOrg } from "@/lib/current-org";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getOrCreateOrg(userId);
  if (!org) return NextResponse.json({ error: "User not synced yet" }, { status: 404 });

  const agents = await prisma.agent.findMany({
    where: { organizationId: org.id },
    select: {
      id: true,
      name: true,
      agentType: true,
      voiceTone: true,
      greeting: true,
      phoneNumber: true,
      status: true,
      createdAt: true,
      whatsappPhoneNumberId: true,
      whatsappAccessToken: true, // mapped to boolean below, never returned raw
      _count: { select: { conversations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const safe = agents.map(({ whatsappAccessToken, ...a }) => ({
    ...a,
    whatsappConnected: !!whatsappAccessToken && !!a.whatsappPhoneNumberId,
  }));

  return NextResponse.json(safe);
}

function buildSystemPrompt(nome: string, tipo: string, tomDeVoz: string, apresentacao: string) {
  const tone =
    tomDeVoz === "Profissional"
      ? "Mantenha um tom formal e profissional em todas as interações."
      : tomDeVoz === "Amigável"
      ? "Seja amigável, caloroso e próximo, mas ainda assim profissional."
      : "Use um tom descontraído e casual, como uma conversa entre amigos.";

  const intro = apresentacao
    ? `Sua mensagem de abertura padrão é: "${apresentacao}"`
    : "";

  return `Você é ${nome}, um assistente virtual de IA${tipo ? ` especializado em ${tipo}` : ""}. ${tone} ${intro} Responda sempre em português brasileiro.`.trim();
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getOrCreateOrg(userId);
  if (!org) return NextResponse.json({ error: "User not synced yet" }, { status: 404 });

  const body = await req.json();
  const { nome, tipo, tomDeVoz, apresentacao, whatsapp, segSex, segSexInicio, segSexFim, sabado, sabadoInicio, sabadoFim, domingo } = body;

  if (!nome || !tipo) {
    return NextResponse.json({ error: "Nome e tipo são obrigatórios" }, { status: 400 });
  }

  const agent = await prisma.agent.create({
    data: {
      organizationId: org.id,
      name: nome,
      agentType: tipo,
      voiceTone: tomDeVoz,
      greeting: apresentacao || null,
      phoneNumber: whatsapp || null,
      systemPrompt: buildSystemPrompt(nome, tipo, tomDeVoz, apresentacao),
      schedule: { segSex, segSexInicio, segSexFim, sabado, sabadoInicio, sabadoFim, domingo },
    },
  });

  return NextResponse.json(agent, { status: 201 });
}
