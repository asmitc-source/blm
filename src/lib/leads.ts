import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type LeadKind = "audit" | "contact" | "demo" | "signup" | "early-access";

export type LeadInput = {
  kind: LeadKind;
  name?: string;
  email: string;
  company?: string;
  role?: string;
  locations?: string;
  message?: string;
  source?: string;
  payload?: string;
};

export const TRIAL_DAYS = 7;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function parseLead(data: unknown): LeadInput {
  const d = (data ?? {}) as Record<string, unknown>;
  const email = asString(d.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid work email.");
  }
  const kind = asString(d.kind, "contact") as LeadKind;
  const allowed: LeadKind[] = ["audit", "contact", "demo", "signup", "early-access"];
  if (!allowed.includes(kind)) throw new Error("Unknown form.");
  return {
    kind,
    email,
    name: asString(d.name).trim() || undefined,
    company: asString(d.company).trim() || undefined,
    role: asString(d.role).trim() || undefined,
    locations: asString(d.locations).trim() || undefined,
    message: asString(d.message).trim() || undefined,
    source: asString(d.source).trim() || undefined,
    payload: asString(d.payload).trim() || undefined,
  };
}

function leadNote(data: LeadInput) {
  const bits = [
    data.message,
    data.role ? `role:${data.role}` : "",
    data.source ? `source:${data.source}` : "",
    data.payload ? data.payload : "trial:7d",
  ].filter(Boolean);
  return bits.join(" · ") || null;
}

async function insertLead(sql: Awaited<ReturnType<typeof getSql>>, data: LeadInput) {
  const id = crypto.randomUUID();
  await sql`
    insert into leads (id, kind, name, email, company, locations, message)
    values (
      ${id},
      ${data.kind},
      ${data.name ?? null},
      ${data.email},
      ${data.company ?? null},
      ${data.locations ?? null},
      ${leadNote(data)}
    )
  `;
}

async function captureSignupLead(
  sql: Awaited<ReturnType<typeof getSql>>,
  data: Omit<LeadInput, "kind"> & { kind?: LeadKind },
) {
  const email = data.email.trim().toLowerCase();
  const existing = await sql<{ id: string }>`
    select id from leads where email = ${email} and kind = 'signup' limit 1
  `;
  if (existing[0]) return { created: false as const };
  await insertLead(sql, { ...data, email, kind: "signup" });
  return { created: true as const };
}

export const submitLead = createServerFn({ method: "POST" })
  .validator(parseLead)
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.kind === "signup") {
      await captureSignupLead(sql, data);
    } else {
      await insertLead(sql, data);
    }
    return { ok: true as const };
  });

export type WorkspaceInput = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  locationsCount?: string;
};

function parseWorkspace(data: unknown): WorkspaceInput {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    name: asString(d.name).trim() || undefined,
    email: asString(d.email).trim() || undefined,
    company: asString(d.company).trim() || undefined,
    role: asString(d.role).trim() || undefined,
    locationsCount: asString(d.locationsCount).trim() || undefined,
  };
}

export type WorkspaceRow = {
  user_id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  locations_count: string | null;
  plan: string | null;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trialActive: boolean;
  trialDaysLeft: number;
};

type NoteShape = {
  name?: string;
  email?: string;
  role?: string;
  locationsCount?: string;
  plan?: string;
  trialStarted?: string;
  trialEnds?: string;
};

function parseNotes(raw: string | null | undefined): NoteShape {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as NoteShape;
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

function withTrial(row: {
  user_id: string;
  brand?: string | null;
  notes?: string | null;
  updated_at?: string | Date | null;
  name?: string | null;
  email?: string | null;
  company?: string | null;
  role?: string | null;
  locations_count?: string | null;
  plan?: string | null;
  trial_started_at?: string | Date | null;
  trial_ends_at?: string | Date | null;
}): WorkspaceRow {
  const notes = parseNotes(row.notes ?? null);
  const startedRaw = row.trial_started_at ?? notes.trialStarted ?? row.updated_at;
  const endsRaw = row.trial_ends_at ?? notes.trialEnds;
  const started = startedRaw ? new Date(startedRaw).getTime() : Date.now();
  const end = endsRaw ? new Date(endsRaw).getTime() : started + TRIAL_DAYS * 86400000;
  const left = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
  const plan = row.plan ?? notes.plan ?? "trial";
  const trialActive = plan !== "growth" && plan !== "enterprise" && end > Date.now();
  return {
    user_id: row.user_id,
    name: row.name ?? notes.name ?? null,
    email: row.email ?? notes.email ?? null,
    company: row.company ?? row.brand ?? null,
    role: row.role ?? notes.role ?? null,
    locations_count: row.locations_count ?? notes.locationsCount ?? null,
    plan,
    trial_started_at: new Date(started).toISOString(),
    trial_ends_at: new Date(end).toISOString(),
    trialActive,
    trialDaysLeft: trialActive ? Math.max(1, left) : 0,
  };
}

function trialNotes(data: WorkspaceInput, existing?: NoteShape) {
  const started = existing?.trialStarted ?? new Date().toISOString();
  const ends =
    existing?.trialEnds ?? new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString();
  return JSON.stringify({
    name: data.name ?? existing?.name,
    email: data.email ?? existing?.email,
    role: data.role ?? existing?.role,
    locationsCount: data.locationsCount ?? existing?.locationsCount,
    plan: existing?.plan ?? "trial",
    trialStarted: started,
    trialEnds: ends,
  });
}

export const upsertWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(parseWorkspace)
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const current = await sql<{ notes: string | null }>`
      select notes from workspaces where user_id = ${context.userId} limit 1
    `;
    const notes = trialNotes(data, parseNotes(current[0]?.notes));
    await sql`
      insert into workspaces (user_id, brand, notes, updated_at)
      values (${context.userId}, ${data.company ?? null}, ${notes}, now())
      on conflict (user_id) do update set
        brand = coalesce(excluded.brand, workspaces.brand),
        notes = excluded.notes,
        updated_at = now()
    `;
    if (data.email) {
      await captureSignupLead(sql, {
        email: data.email,
        name: data.name,
        company: data.company,
        role: data.role,
        locations: data.locationsCount,
        source: "signup",
        payload: "trial:7d",
      });
    }
    return { ok: true as const };
  });

export const getWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ user_id: string; brand: string | null; notes: string | null; updated_at: string }>`
      select user_id, brand, notes, updated_at
      from workspaces
      where user_id = ${context.userId}
      limit 1
    `;
    return rows[0] ? withTrial(rows[0]) : null;
  });

export const ensureTrialWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const existing = await sql<{ user_id: string; brand: string | null; notes: string | null; updated_at: string }>`
      select user_id, brand, notes, updated_at
      from workspaces
      where user_id = ${context.userId}
      limit 1
    `;
    if (existing[0]) {
      const row = withTrial(existing[0]);
      if (row.email) {
        await captureSignupLead(sql, {
          email: row.email,
          name: row.name ?? undefined,
          company: row.company ?? undefined,
          role: row.role ?? undefined,
          locations: row.locations_count ?? undefined,
          source: "workspace",
          payload: "trial:7d",
        });
      }
      return row;
    }

    const users = await sql<{ name: string; email: string }>`
      select name, email from "user" where id = ${context.userId} limit 1
    `;
    const user = users[0];
    const notes = trialNotes({
      name: user?.name,
      email: user?.email,
    });
    await sql`
      insert into workspaces (user_id, brand, notes, updated_at)
      values (${context.userId}, ${user?.name ?? null}, ${notes}, now())
      on conflict (user_id) do nothing
    `;
    if (user?.email) {
      await captureSignupLead(sql, {
        email: user.email,
        name: user.name,
        source: "google-signup",
        payload: "trial:7d",
      });
    }
    const rows = await sql<{ user_id: string; brand: string | null; notes: string | null; updated_at: string }>`
      select user_id, brand, notes, updated_at
      from workspaces
      where user_id = ${context.userId}
      limit 1
    `;
    return rows[0] ? withTrial(rows[0]) : null;
  });
