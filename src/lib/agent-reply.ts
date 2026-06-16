import type { Agent, Message } from "@prisma/client";

// Generates the agent's reply to an inbound message.
// NOTE: This is the transport-layer placeholder. The AI brain (Claude) plugs in
// here next — it will receive `agent.systemPrompt` + `history` and stream a reply.
export async function generateAgentReply(
  agent: Agent,
  history: Message[],
  _incomingText: string,
): Promise<string> {
  const isFirstContact = history.filter((m) => m.role === "ASSISTANT").length === 0;

  if (isFirstContact && agent.greeting) {
    return agent.greeting;
  }

  return `Olá! Sou ${agent.name}. Recebi sua mensagem e em breve poderei te ajudar com mais detalhes. 🙂`;
}
