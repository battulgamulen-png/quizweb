import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) return new Response("Server error", { status: 500 });

  const payload = await req.text();

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing headers", { status: 400 });
  }

  let event: WebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "user.created") {
    return new Response("Ignored", { status: 200 });
  }

  const {
    id,
    email_addresses,
    primary_email_address_id,
    first_name,
    last_name,
  } = event.data;

  const email = email_addresses.find(
    (e) => e.id === primary_email_address_id
  )?.email_address;

  if (!email) return new Response("No email", { status: 400 });

  try {
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        clerkId: id,
        email,
        name: [first_name, last_name].filter(Boolean).join(" "),
      },
    });
  } catch (err) {
    console.error("DB error:", err);

    return new Response("DB error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
