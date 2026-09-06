import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { SITE } from "@/lib/site";

export type SubscribeInput = {
  email: string;
  name?: string;
  source?: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

const recentByKey = new Map<string, number>();

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function parseSubscribe(data: unknown): SubscribeInput {
  const d = (data ?? {}) as Record<string, unknown>;
  if (asString(d.website).trim()) throw new Error("Could not subscribe. Try again.");
  const email = asString(d.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email.");
  }
  return {
    email,
    name: asString(d.name).trim() || undefined,
    source: asString(d.source).trim() || "homepage",
  };
}

function rateLimit(key: string, windowMs = 60_000) {
  const now = Date.now();
  const prev = recentByKey.get(key) ?? 0;
  if (now - prev < windowMs) throw new Error("Please wait a moment before trying again.");
  recentByKey.set(key, now);
}

function unsubscribeUrl(token: string) {
  const base = (process.env.BETTER_AUTH_URL || process.env.SITE_URL || SITE.domain).replace(
    /\/$/,
    "",
  );
  return `${base}/unsubscribe?token=${encodeURIComponent(token)}`;
}

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(parseSubscribe)
  .handler(async ({ data }) => {
    rateLimit(`news:${data.email}`);
    const sql = await getSql();
    const existing = await sql<{
      id: string;
      status: string;
      unsubscribe_token: string;
      name: string | null;
    }>`
      select id, status, unsubscribe_token, name from newsletter_subscribers
      where email = ${data.email} limit 1
    `;

    let token = existing[0]?.unsubscribe_token;
    let created = false;

    if (existing[0]) {
      if (existing[0].status !== "active") {
        await sql`
          update newsletter_subscribers
          set status = ${"active"},
              unsubscribed_at = null,
              name = coalesce(${data.name ?? null}, name),
              source = ${data.source ?? "homepage"},
              subscribed_at = now()
          where id = ${existing[0].id}
        `;
        created = true;
      }
      token = existing[0].unsubscribe_token;
    } else {
      const id = crypto.randomUUID();
      const { randomBytes } = await import("node:crypto");
      token = randomBytes(24).toString("hex");
      await sql`
        insert into newsletter_subscribers (id, email, name, status, source, unsubscribe_token)
        values (
          ${id},
          ${data.email},
          ${data.name ?? null},
          ${"active"},
          ${data.source ?? "homepage"},
          ${token}
        )
      `;
      created = true;
    }

    const { welcomeNewsletterEmail } = await import("@/lib/mail/templates");
    const { trySendMail } = await import("@/lib/mail/smtp");
    const mail = welcomeNewsletterEmail({
      name: data.name ?? existing[0]?.name ?? undefined,
      unsubscribeUrl: unsubscribeUrl(token as string),
    });
    const sent = await trySendMail({ to: data.email, ...mail });

    return {
      ok: true as const,
      created,
      emailSent: sent.ok,
      emailSkipped: Boolean(sent.skipped),
    };
  });

export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>;
    const token = asString(d.token).trim();
    const email = asString(d.email).trim().toLowerCase();
    if (!token && !email) throw new Error("Missing unsubscribe token.");
    return { token: token || undefined, email: email || undefined };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.token) {
      await sql`
        update newsletter_subscribers
        set status = ${"unsubscribed"}, unsubscribed_at = now()
        where unsubscribe_token = ${data.token} and status = ${"active"}
      `;
    } else if (data.email) {
      await sql`
        update newsletter_subscribers
        set status = ${"unsubscribed"}, unsubscribed_at = now()
        where email = ${data.email} and status = ${"active"}
      `;
    }
    return { ok: true as const };
  });

export type ArticleNotifyInput = {
  title: string;
  slug: string;
  excerpt: string;
};

/** Fan-out new-article mail to every active subscriber. Best-effort. */
export async function notifySubscribersNewArticle(article: ArticleNotifyInput) {
  const sql = await getSql();
  const rows = await sql<{ email: string; unsubscribe_token: string }>`
    select email, unsubscribe_token from newsletter_subscribers
    where status = ${"active"}
  `;
  if (!rows.length) return { sent: 0, failed: 0, skipped: 0 };

  const base = (process.env.BETTER_AUTH_URL || process.env.SITE_URL || SITE.domain).replace(
    /\/$/,
    "",
  );
  const url = `${base}/blog/${article.slug}`;
  const { newArticleEmail } = await import("@/lib/mail/templates");
  const { trySendMail } = await import("@/lib/mail/smtp");
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of rows) {
    const mail = newArticleEmail({
      title: article.title,
      excerpt: article.excerpt,
      url,
      unsubscribeUrl: unsubscribeUrl(row.unsubscribe_token),
    });
    const result = await trySendMail({ to: row.email, ...mail });
    if (result.ok) sent += 1;
    else if (result.skipped) skipped += 1;
    else failed += 1;
  }
  return { sent, failed, skipped };
}
