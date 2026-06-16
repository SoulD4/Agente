// Meta WhatsApp Cloud API helpers
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

const GRAPH_VERSION = "v21.0";

interface SendTextParams {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  text: string;
}

export async function sendWhatsAppText({ phoneNumberId, accessToken, to, text }: SendTextParams) {
  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp send failed (${res.status}): ${err}`);
  }

  return res.json();
}

// Mark an inbound message as read (blue ticks) — optional, best-effort.
export async function markWhatsAppRead({
  phoneNumberId,
  accessToken,
  messageId,
}: {
  phoneNumberId: string;
  accessToken: string;
  messageId: string;
}) {
  try {
    await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
  } catch {
    // non-critical
  }
}

// ─── Inbound payload types (subset we care about) ──────────────────────────────

export interface WhatsAppInboundMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

export interface WhatsAppValue {
  messaging_product: string;
  metadata: { display_phone_number: string; phone_number_id: string };
  contacts?: Array<{ profile: { name: string }; wa_id: string }>;
  messages?: WhatsAppInboundMessage[];
}

export interface WhatsAppWebhookBody {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{ value: WhatsAppValue; field: string }>;
  }>;
}
