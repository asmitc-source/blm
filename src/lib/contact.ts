import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export type ContactInput = {
  name: string;
  email: string;
  company?: string;
  message: string;
  source?: string;
  userAgent?: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

const recentByKey = new Map<string, number>();

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function parseContact(data: unknown): ContactInput {
  const d = (data ?? {}) as Record<string, unknown>;
  const website = asString(d.website).trim();
  if (website) throw new Error("Could not send. Try again.");
  const email = asString(d.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid work email.");
  }
  const name = asString(d.name).trim();
  if (name.length < 2) throw new Error("Enter your name.");
  const message = asString(d.message).trim();
  if (message.length < 5) throw new Error("Add a short message.");
  if (message.length > 5000) throw new Error("Message is too long.");
  const userAgent = asString(d.userAgent).trim().slice(0, 400) || undefined;
  return {
    name,
    email,
    company: asString(d.company).trim() || undefined,
    message,
    source: asString(d.source).trim() || "contact",
    userAgent,
    website,
  };
}

function rateLimit(key: string, windowMs = 60_000) {
  const now = Date.now();
  const prev = recentByKey.get(key) ?? 0;
  if (now - prev < windowMs) throw new Error("Please wait a moment before sending again.");
  recentByKey.set(key, now);
  if (recentByKey.size > 500) {
    for (const [k, t] of recentByKey) {
      if (now - t > windowMs * 5) recentByKey.delete(k);
    }
  }
}

export const submitContact = createServerFn({ method: "POST" })
  .validator(parseContact)
  .handler(async ({ data }) => {
    rateLimit(`contact:${data.email}`);
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into contact_submissions (id, name, email, company, message, user_agent, source)
      values (
        ${id},
        ${data.name},
        ${data.email},
        ${data.company ?? null},
        ${data.message},
        ${data.userAgent ?? null},
        ${data.source ?? "contact"}
      )
    `;
    return { ok: true as const, id };
  });
