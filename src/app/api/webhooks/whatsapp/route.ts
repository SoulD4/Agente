import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  sendWhatsAppText,
  markWhatsAppRead,
  type WhatsAppWebhookBody,
} from "@/lib/whatsapp";
import { generateAgentReply } from "@/lib/agent-reply";

// ─── GET: webhook verification (Meta calls this once when you subscribe) ────────

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// ─── Signature verification (X-Hub-Signature-256) ───────────────────────────────

function verifySignature(rawBody: string, signature: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true; // skip if not configured (dev)
  if (!signature) return false;

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ─── POST: incoming messages ────────────────────────────────────────────────────

export async function POST(req: Request) {
  const rawBody = await req.text();

  if (!verifySignature(rawBody, req.headers.get("x-hub-signature-256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let body: WhatsAppWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Always 200 fast so Meta doesn't retry; process inline (Fluid Compute keeps us alive).
  try {
    await processWebhook(body);
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
}

async function processWebhook(body: WhatsAppWebhookBody) {
  if (body.object !== "whatsapp_business_account") return;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      const messages = value.messages;
      if (!messages || messages.length === 0) continue;

      const phoneNumberId = value.metadata?.phone_number_id;
      if (!phoneNumberId) continue;

      // Find the agent bound to this WhatsApp number.
      const agent = await prisma.agent.findFirst({
        where: { whatsappPhoneNumberId: phoneNumberId },
      });
      if (!agent || !agent.whatsappAccessToken) continue;

      const contactName = value.contacts?.[0]?.profile?.name;

      for (const msg of messages) {
        if (msg.type !== "text" || !msg.text) continue;

        const contactPhone = msg.from;
        const incomingText = msg.text.body;

        // Upsert conversation (one open conversation per contact+agent).
        let conversation = await prisma.conversation.findFirst({
          where: { agentId: agent.id, contactPhone, status: "OPEN" },
        });
        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              organizationId: agent.organizationId,
              agentId: agent.id,
              contactPhone,
              contactName: contactName ?? null,
            },
          });
        }

        // Persist inbound message.
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: "USER",
            content: incomingText,
            metadata: { waMessageId: msg.id },
          },
        });

        // Mark read (best-effort).
        await markWhatsAppRead({
          phoneNumberId,
          accessToken: agent.whatsappAccessToken,
          messageId: msg.id,
        });

        // Skip auto-reply if a human has taken over.
        if (conversation.humanTakeover) continue;

        // Build history and generate a reply.
        const history = await prisma.message.findMany({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: "asc" },
          take: 30,
        });

        const reply = await generateAgentReply(agent, history, incomingText);

        await sendWhatsAppText({
          phoneNumberId,
          accessToken: agent.whatsappAccessToken,
          to: contactPhone,
          text: reply,
        });

        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: "ASSISTANT",
            content: reply,
          },
        });

        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
      }
    }
  }
}
