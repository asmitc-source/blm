import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { deskMiddleware } from "./middleware";

export type DeskLeadKind =
  | "all"
  | "audit"
  | "contact"
  | "demo"
  | "signup"
  | "early-access"
  | "login";

export type DeskLead = {
  id: string;
  kind: string;
  email: string;
  name: string;
  company: string;
  locations: string;
  message: string;
  source: string;
  created_at: string;
};

export type LeadsHubSummary = {
  total: number;
  byKind: Record<string, number>;
  subscribersActive: number;
  subscribersTotal: number;
};

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function requireAdmin(admin: { id: string; username: string } | null | undefined) {
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function mapLead(r: Record<string, unknown>): DeskLead {
  const message = str(r.message);
  let source = "";
  const srcMatch = message.match(/(?:^|·\s*)source:([^\s·]+)/i);
  if (srcMatch) source = srcMatch[1];
  return {
    id: str(r.id),
    kind: str(r.kind, "contact"),
    email: str(r.email),
    name: str(r.name),
    company: str(r.company),
    locations: str(r.locations),
    message,
    source,
    created_at:
      r.created_at instanceof Date ? r.created_at.toISOString() : str(r.created_at),
  };
}

const KIND_SET = new Set([
  "all",
  "audit",
  "contact",
  "demo",
  "signup",
  "early-access",
  "login",
]);

export const listDeskLeads = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const kind = str(o.kind).trim().toLowerCase() || "all";
    if (!KIND_SET.has(kind)) throw new Error("Invalid kind filter.");
    return {
      kind: kind as DeskLeadKind,
      q: str(o.q).trim().toLowerCase(),
    };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    try {
      const rows =
        data.kind === "all"
          ? await sql`
              select id, kind, email, name, company, locations, message, created_at
              from leads
              order by created_at desc
              limit 500
            `
          : await sql`
              select id, kind, email, name, company, locations, message, created_at
              from leads
              where kind = ${data.kind}
              order by created_at desc
              limit 500
            `;
      let list = rows.map((r) => mapLead(r as Record<string, unknown>));
      if (data.q) {
        list = list.filter(
          (l) =>
            l.email.toLowerCase().includes(data.q) ||
            l.name.toLowerCase().includes(data.q) ||
            l.company.toLowerCase().includes(data.q) ||
            l.message.toLowerCase().includes(data.q),
        );
      }
      return list;
    } catch {
      return [] as DeskLead[];
    }
  });

export const leadsHubSummary = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    const summary: LeadsHubSummary = {
      total: 0,
      byKind: {},
      subscribersActive: 0,
      subscribersTotal: 0,
    };
    try {
      const kinds = await sql<{ kind: string; n: number }>`
        select kind, count(*)::int as n from leads group by kind
      `;
      for (const row of kinds) {
        summary.byKind[row.kind] = row.n;
        summary.total += row.n;
      }
    } catch {
      /* empty */
    }
    try {
      const subs = await sql<{ total: number; active: number }>`
        select
          count(*)::int as total,
          count(*) filter (where status = 'active')::int as active
        from newsletter_subscribers
      `;
      summary.subscribersTotal = subs[0]?.total ?? 0;
      summary.subscribersActive = subs[0]?.active ?? 0;
    } catch {
      /* empty */
    }
    return summary;
  });

function csvEscape(v: string) {
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export const exportLeadsCsv = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      kind: string;
      email: string;
      name: string | null;
      company: string | null;
      locations: string | null;
      message: string | null;
      created_at: string | Date;
    }>`
      select id, kind, email, name, company, locations, message, created_at
      from leads
      order by created_at desc
      limit 5000
    `;
    const header = ["id", "kind", "email", "name", "company", "locations", "message", "created_at"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.id,
          r.kind,
          r.email,
          r.name ?? "",
          r.company ?? "",
          r.locations ?? "",
          r.message ?? "",
          r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ""),
        ]
          .map((c) => csvEscape(String(c)))
          .join(","),
      );
    }
    return { csv: lines.join("\n") + "\n", count: rows.length };
  });
