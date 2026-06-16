import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type UserData = { id: string; email_addresses: Array<{ email_address: string }>; first_name?: string; last_name?: string; image_url?: string };
type ClerkEvent = { type: string; data: Record<string, unknown> };

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerStore = await headers();
  const svixId = headerStore.get("svix-id");
  const svixTimestamp = headerStore.get("svix-timestamp");
  const svixSignature = headerStore.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: ClerkEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const d = event.data as unknown as UserData;
    const email = d.email_addresses[0]?.email_address;
    if (!email) return new Response("No email", { status: 400 });

    const name = [d.first_name, d.last_name].filter(Boolean).join(" ") || undefined;

    await prisma.user.upsert({
      where: { id: d.id },
      update: { email, name, imageUrl: d.image_url },
      create: { id: d.id, email, name, imageUrl: d.image_url },
    });
  }

  if (event.type === "user.deleted") {
    const id = event.data.id as string;
    await prisma.user.delete({ where: { id } }).catch(() => null);
  }

  return new Response("OK", { status: 200 });
}
