import Anthropic from "@anthropic-ai/sdk";
import type { Agent, Message } from "@prisma/client";

const anthropic = new Anthropic();

export async function generateAgentReply(
  agent: Agent,
  history: Message[],
  _incomingText: string,
): Promise<string> {
  const isFirstContact = history.filter((m) => m.role === "ASSISTANT").length === 0;
  if (isFirstContact && agent.greeting) return agent.greeting;

  // Map Prisma messages to Anthropic format, ensuring alternation starts with user.
  const messages: Anthropic.MessageParam[] = [];
  for (const m of history) {
    const role = m.role === "USER" ? "user" : m.role === "ASSISTANT" ? "assistant" : null;
    if (!role) continue;
    // Anthropic requires strict alternation — merge consecutive same-role messages.
    if (messages.length > 0 && messages[messages.length - 1].role === role) {
      const last = messages[messages.length - 1];
      if (typeof last.content === "string") {
        last.content = last.content + "\n" + m.content;
      }
    } else {
      messages.push({ role, content: m.content });
    }
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return agent.greeting ?? `Olá! Sou ${agent.name}. Como posso te ajudar?`;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: agent.systemPrompt,
      messages,
    });

    const block = response.content.find((b: { type: string }) => b.type === "text") as { type: "text"; text: string } | undefined;
    return block?.text ?? fallback(agent);
  } catch (err) {
    console.error("Claude API error:", err);
    return fallback(agent);
  }
}

function fallback(agent: Agent): string {
  return `Olá! Sou ${agent.name}. Recebi sua mensagem e responderei em breve.`;
}
