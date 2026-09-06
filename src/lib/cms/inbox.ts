import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { deskMiddleware } from "./middleware";

export type ContactStatus = "new" | "read" | "closed";
export type SubscriberStatus = "active" | "unsubscribed";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  source: string;
  status: ContactStatus;
  created_at: string;
  replied_at: string | null;
  reply_note: string | null;
};

export type SubscriberRow = {
  id: string;
  email: string;
  name: string;
  status: SubscriberStatus;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function requireAdmin(admin: { id: string; username: string } | null | undefined) {
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function asContactStatus(v: unknown): ContactStatus {
  const s = str(v).trim().toLowerCase();
  if (s === "new" || s === "read" || s === "closed") return s;
  throw new Error("Status must be new, read, or closed.");
}

function asSubscriberStatus(v: unknown): SubscriberStatus {
  const s = str(v).trim().toLowerCase();
  if (s === "active" || s === "unsubscribed") return s;
  throw new Error("Status must be active or unsubscribed.");
}

function mapContact(r: Record<string, unknown>): ContactMessage {
  const statusRaw = str(r.status, "new").toLowerCase();
  const status: ContactStatus =
    statusRaw === "read" || statusRaw === "closed" ? statusRaw : "new";
  return {
    id: str(r.id),
    name: str(r.name),
    email: str(r.email),
    company: str(r.company),
    message: str(r.message),
    source: str(r.source, "contact"),
    status,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : str(r.created_at),
    replied_at:
      r.replied_at == null
        ? null
        : r.replied_at instanceof Date
          ? r.replied_at.toISOString()
          : str(r.replied_at),
    reply_note: r.reply_note == null ? null : str(r.reply_note),
  };
}

function mapSubscriber(r: Record<string, unknown>): SubscriberRow {
  const statusRaw = str(r.status, "active").toLowerCase();
  const status: SubscriberStatus = statusRaw === "unsubscribed" ? "unsubscribed" : "active";
  return {
    id: str(r.id),
    email: str(r.email),
    name: str(r.name),
    status,
    source: str(r.source, "homepage"),
    subscribed_at:
      r.subscribed_at instanceof Date ? r.subscribed_at.toISOString() : str(r.subscribed_at),
    unsubscribed_at:
      r.unsubscribed_at == null
        ? null
        : r.unsubscribed_at instanceof Date
          ? r.unsubscribed_at.toISOString()
          : str(r.unsubscribed_at),
  };
}

export const listContactMessages = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const status = str(o.status).trim().toLowerCase();
    if (status && status !== "all" && status !== "new" && status !== "read" && status !== "closed") {
      throw new Error("Invalid filter.");
    }
    return { status: (status || "all") as "all" | ContactStatus };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    try {
      const rows =
        data.status === "all"
          ? await sql`
              select id, name, email, company, message, source,
                     coalesce(status, 'new') as status, created_at, replied_at, reply_note
              from contact_submissions
              order by created_at desc
              limit 200
            `
          : await sql`
              select id, name, email, company, message, source,
                     coalesce(status, 'new') as status, created_at, replied_at, reply_note
              from contact_submissions
              where coalesce(status, 'new') = ${data.status}
              order by created_at desc
              limit 200
            `;
      return rows.map((r) => mapContact(r as Record<string, unknown>));
    } catch {
      const rows = await sql`
        select id, name, email, company, message, source, created_at
        from contact_submissions
        order by created_at desc
        limit 200
      `;
      return rows.map((r) =>
        mapContact({
          ...(r as Record<string, unknown>),
          status: "new",
          replied_at: null,
          reply_note: null,
        }),
      );
    }
  });

export const updateContactStatus = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const id = str(o.id).trim();
    if (!id) throw new Error("Missing message id.");
    return { id, status: asContactStatus(o.status) };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    await sql`
      update contact_submissions
      set status = ${data.status}
      where id = ${data.id}
    `;
    return { ok: true as const };
  });

export const replyContactMessage = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const id = str(o.id).trim();
    const subject = str(o.subject).trim();
    const body = str(o.body).trim();
    if (!id) throw new Error("Missing message id.");
    if (subject.length < 2) throw new Error("Add a subject.");
    if (body.length < 2) throw new Error("Write a reply.");
    if (subject.length > 200) throw new Error("Subject is too long.");
    if (body.length > 10000) throw new Error("Reply is too long.");
    const mark: ContactStatus =
      str(o.markStatus).trim().toLowerCase() === "closed" ? "closed" : "read";
    return { id, subject, body, mark };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      email: string;
      message: string;
    }>`
      select id, name, email, message from contact_submissions where id = ${data.id} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Message not found.");

    const { contactReplyEmail } = await import("@/lib/mail/templates");
    const { trySendMail, isMailConfigured } = await import("@/lib/mail/resend");
    if (!isMailConfigured()) {
      throw new Error("Email is not configured (RESEND_API_KEY).");
    }
    const mail = contactReplyEmail({
      toName: row.name,
      subject: data.subject,
      body: data.body,
      originalMessage: row.message,
    });
    const sent = await trySendMail({
      to: row.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (!sent.ok) {
      throw new Error(sent.error || "Could not send reply.");
    }

    try {
      await sql`
        update contact_submissions
        set status = ${data.mark},
            replied_at = now(),
            reply_note = ${data.subject.slice(0, 200)}
        where id = ${data.id}
      `;
    } catch {
      await sql`
        update contact_submissions
        set status = ${data.mark}
        where id = ${data.id}
      `;
    }

    return { ok: true as const, email: row.email };
  });

export const listSubscribers = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    return { q: str(o.q).trim().toLowerCase() };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    const rows = await sql`
      select id, email, name, status, source, subscribed_at, unsubscribed_at
      from newsletter_subscribers
      order by subscribed_at desc
      limit 500
    `;
    let list = rows.map((r) => mapSubscriber(r as Record<string, unknown>));
    if (data.q) {
      list = list.filter(
        (s) =>
          s.email.toLowerCase().includes(data.q) ||
          s.name.toLowerCase().includes(data.q),
      );
    }
    return list;
  });

export const updateSubscriberStatus = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const id = str(o.id).trim();
    if (!id) throw new Error("Missing subscriber id.");
    return { id, status: asSubscriberStatus(o.status) };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    if (data.status === "unsubscribed") {
      await sql`
        update newsletter_subscribers
        set status = ${"unsubscribed"}, unsubscribed_at = now()
        where id = ${data.id}
      `;
    } else {
      await sql`
        update newsletter_subscribers
        set status = ${"active"}, unsubscribed_at = null, subscribed_at = coalesce(subscribed_at, now())
        where id = ${data.id}
      `;
    }
    return { ok: true as const };
  });

export const exportSubscribersCsv = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    const rows = await sql<{
      email: string;
      name: string | null;
      status: string;
      source: string;
      subscribed_at: string | Date;
      unsubscribed_at: string | Date | null;
    }>`
      select email, name, status, source, subscribed_at, unsubscribed_at
      from newsletter_subscribers
      order by subscribed_at desc
    `;

    const escape = (v: string) => {
      if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
      return v;
    };
    const iso = (v: string | Date | null | undefined) => {
      if (v == null) return "";
      if (v instanceof Date) return v.toISOString();
      return String(v);
    };

    const lines = [
      "email,name,status,source,subscribed_at,unsubscribed_at",
      ...rows.map((r) =>
        [
          escape(r.email),
          escape(r.name ?? ""),
          escape(r.status),
          escape(r.source),
          escape(iso(r.subscribed_at)),
          escape(iso(r.unsubscribed_at)),
        ].join(","),
      ),
    ];
    return { csv: lines.join("\n") + "\n", count: rows.length };
  });

export async function loadInboxStats() {
  const sql = await getSql();
  let messagesTotal = 0;
  let messagesNew = 0;
  let subscribersActive = 0;
  let subscribersTotal = 0;
  let recentNew: ContactMessage[] = [];

  try {
    const tot = await sql<{ n: number }>`select count(*)::int as n from contact_submissions`;
    messagesTotal = tot[0]?.n ?? 0;
    const neu = await sql<{ n: number }>`
      select count(*)::int as n from contact_submissions where coalesce(status, 'new') = ${"new"}
    `;
    messagesNew = neu[0]?.n ?? 0;
    const recent = await sql`
      select id, name, email, company, message, source,
             coalesce(status, 'new') as status, created_at, replied_at, reply_note
      from contact_submissions
      where coalesce(status, 'new') = ${"new"}
      order by created_at desc
      limit 5
    `;
    recentNew = recent.map((r) => mapContact(r as Record<string, unknown>));
  } catch {
    try {
      const tot = await sql<{ n: number }>`select count(*)::int as n from contact_submissions`;
      messagesTotal = tot[0]?.n ?? 0;
      messagesNew = messagesTotal;
    } catch {
      /* tables may not exist yet */
    }
  }

  try {
    const act = await sql<{ n: number }>`
      select count(*)::int as n from newsletter_subscribers where status = ${"active"}
    `;
    subscribersActive = act[0]?.n ?? 0;
    const all = await sql<{ n: number }>`select count(*)::int as n from newsletter_subscribers`;
    subscribersTotal = all[0]?.n ?? 0;
  } catch {
    /* ignore */
  }

  return {
    messagesTotal,
    messagesNew,
    subscribersActive,
    subscribersTotal,
    recentNew,
  };
}

export const inboxStats = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    return loadInboxStats();
  });
