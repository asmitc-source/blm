import { getSql } from "@/lib/db";
import { FAQ, PRICING, SITE } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/content/blog";
import { POST_BODY } from "@/lib/content/posts";
import { markdownToHtml } from "./convert";
import { hashPassword } from "./crypto";
import type { ArticleKind, ArticleStatus, CmsArticle, CmsFaq, PricingPlan, SiteCopy } from "./types";

function serverless() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

async function sbAdmin() {
  const { supabaseAdmin } = await import("./supabase.server");
  return supabaseAdmin();
}

async function localSql() {
  if (serverless()) return null;
  try {
    return await getSql();
  } catch {
    return null;
  }
}

function tagsFrom(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

function asArticle(row: Record<string, unknown>): CmsArticle {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    answer: String(row.answer ?? ""),
    description: String(row.description ?? ""),
    body_html: String(row.body_html ?? ""),
    author: String(row.author ?? SITE.editorial),
    tags: tagsFrom(row.tags),
    kind: (String(row.kind ?? "article") as ArticleKind) || "article",
    status: (String(row.status ?? "draft") as ArticleStatus) || "draft",
    date: String(row.date ?? "").slice(0, 10),
    minutes: Number(row.minutes ?? 6) || 6,
    cover_url: row.cover_url ? String(row.cover_url) : null,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

const defaultCopy = (): SiteCopy => ({
  home: {
    lede: "Business listing management without the spreadsheet: unify NAP, close duplicates, and keep Google, Apple, Bing, and the directory network in lockstep from one BLM workspace.",
    trialLine:
      "Start a free trial for product access, or book a call if you already manage a national footprint. Listed rates are Starter $49/month and Growth $149/month when billing goes live.",
  },
  pricingTitle: "Business listing management pricing: Starter $49. Growth $149.",
  pricingLede:
    "Business listing management cost for BLM: Starter listed at $49/month, Growth at $149/month, Enterprise custom. Start a free trial or book a call. Listed prices apply when billing goes live.",
  plans: PRICING.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    cadence: p.cadence,
    blurb: p.blurb,
    cta: p.cta,
    href: p.href,
    featured: p.featured,
    features: [...p.features],
  })),
});

export async function seedCmsIfEmpty() {
  const sql = await localSql();
  if (!sql) return { hasAdmin: true };
  try {
    await sql`select 1 from cms_admins limit 1`;
  } catch {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const ddl = readFileSync(join(process.cwd(), "migrations/0004_cms.sql"), "utf8");
    for (const stmt of ddl.split(";").map((s) => s.trim()).filter((s) => s && !s.startsWith("--"))) {
      await sql.query(stmt);
    }
  }
  const admins = await sql<{ n: number }>`select count(*)::int as n from cms_admins`;
  for (const post of BLOG_POSTS) {
    const body = markdownToHtml(POST_BODY[post.slug] ?? "");
    const tags = post.tags.join(",");
    const found = await sql<{ id: string }>`select id from cms_articles where slug = ${post.slug} limit 1`;
    if (found[0]) {
      await sql`
        update cms_articles set
          title = ${post.title},
          answer = ${post.excerpt},
          description = ${post.description},
          body_html = ${body},
          author = ${post.author},
          tags = ${tags},
          kind = ${"article"},
          status = ${"published"},
          date = ${post.date},
          minutes = ${post.minutes},
          updated_at = now()
        where id = ${found[0].id}
      `;
    } else {
      const id = crypto.randomUUID();
      await sql`
        insert into cms_articles (id, slug, title, answer, description, body_html, author, tags, kind, status, date, minutes)
        values (
          ${id},
          ${post.slug},
          ${post.title},
          ${post.excerpt},
          ${post.description},
          ${body},
          ${post.author},
          ${tags},
          ${"article"},
          ${"published"},
          ${post.date},
          ${post.minutes}
        )
      `;
    }
  }
  const settings = await sql<{ n: number }>`select count(*)::int as n from cms_settings`;
  if (!settings[0]?.n) {
    const copy = defaultCopy();
    await sql`insert into cms_settings (key, value) values (${"site"}, ${JSON.stringify(copy)})`;
  }
  const faqs = await sql<{ n: number }>`select count(*)::int as n from cms_faqs`;
  if (!faqs[0]?.n) {
    for (const [i, f] of FAQ.entries()) {
      await sql`
        insert into cms_faqs (id, question, answer, page, sort)
        values (${crypto.randomUUID()}, ${f.q}, ${f.a}, ${"home"}, ${i})
      `;
    }
  }
  return { hasAdmin: Boolean(admins[0]?.n) };
}

export async function upsertAdminFromAuth(id: string, username: string) {
  const sql = await localSql();
  if (sql) {
    const rows = await sql<{ id: string; username: string }>`
      select id, username from cms_admins where id = ${id} or username = ${username} limit 1
    `;
    if (!rows[0]) {
      await sql`insert into cms_admins (id, username, password_hash) values (${id}, ${username}, ${"supabase-auth"})`;
    }
  }
  try {
    const sb = await sbAdmin();
    await sb?.from("cms_admins").upsert({ id, username, password_hash: "supabase-auth" });
  } catch {
    /* jwt login does not need a row */
  }
  return { id, username };
}

export async function createAdmin(username: string, password: string) {
  const sql = await localSql();
  const id = crypto.randomUUID();
  const password_hash = await hashPassword(password);
  if (sql) {
    await sql`insert into cms_admins (id, username, password_hash) values (${id}, ${username}, ${password_hash})`;
  }
  return { id, username };
}

export async function findAdminByUsername(username: string) {
  const sql = await localSql();
  if (!sql) return null;
  const rows = await sql<{ id: string; username: string; password_hash: string }>`
    select id, username, password_hash from cms_admins where username = ${username} limit 1
  `;
  return rows[0] ?? null;
}

export async function createSession(adminId: string, token: string, days = 14) {
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  const sql = await localSql();
  if (sql) {
    await sql`
      insert into cms_sessions (id, admin_id, token, expires_at)
      values (${crypto.randomUUID()}, ${adminId}, ${token}, ${expires})
    `;
  }
  const sb = await sbAdmin();
  if (!sb) return;
  const { error } = await sb.from("cms_sessions").insert({
    id: crypto.randomUUID(),
    admin_id: adminId,
    token,
    expires_at: expires,
  });
  if (error) throw new Error(error.message);
}

export async function sessionAdmin(token: string | null | undefined) {
  if (!token) return null;
  try {
    const { supabaseAnon, supabaseAdmin } = await import("./supabase.server");
    const authClient = (await supabaseAnon()) ?? (await supabaseAdmin());
    if (authClient && token.split(".").length === 3) {
      const { data } = await authClient.auth.getUser(token);
      if (data.user?.email) return { id: data.user.id, username: data.user.email };
    }
    const sb = await supabaseAdmin();
    if (sb) {
      const remote = await sb.from("cms_sessions").select("admin_id").eq("token", token).limit(1).maybeSingle();
      if (remote.data?.admin_id) {
        const row = await sb.from("cms_admins").select("id, username").eq("id", remote.data.admin_id).maybeSingle();
        if (row.data) return { id: String(row.data.id), username: String(row.data.username) };
      }
    }
  } catch {
    /* fall through */
  }
  const sql = await localSql();
  if (!sql) return null;
  const rows = await sql<{ id: string; username: string }>`
    select a.id, a.username
    from cms_sessions s
    join cms_admins a on a.id = s.admin_id
    where s.token = ${token} and s.expires_at > now()
    limit 1
  `;
  return rows[0] ?? null;
}

export async function destroySession(token: string | null | undefined) {
  if (!token) return;
  const sql = await localSql();
  if (sql) await sql`delete from cms_sessions where token = ${token}`;
  try {
    const sb = await sbAdmin();
    await sb?.from("cms_sessions").delete().eq("token", token);
  } catch {
    /* ignore */
  }
}

export async function listArticles() {
  const sb = await sbAdmin();
  if (sb) {
    const { data } = await sb.from("cms_articles").select("*").order("date", { ascending: false });
    return (data ?? []).map((row) => asArticle(row as Record<string, unknown>));
  }
  const sql = await localSql();
  if (!sql) return [];
  const rows = await sql`select * from cms_articles order by date desc, updated_at desc`;
  return rows.map(asArticle);
}

export async function getArticle(id: string) {
  const sb = await sbAdmin();
  if (sb) {
    const { data } = await sb.from("cms_articles").select("*").eq("id", id).maybeSingle();
    return data ? asArticle(data as Record<string, unknown>) : null;
  }
  const sql = await localSql();
  if (!sql) return null;
  const rows = await sql`select * from cms_articles where id = ${id} limit 1`;
  return rows[0] ? asArticle(rows[0]) : null;
}

export async function getArticleBySlug(slug: string, onlyPublished = false) {
  const sb = await sbAdmin();
  if (sb) {
    let q = sb.from("cms_articles").select("*").eq("slug", slug);
    if (onlyPublished) q = q.eq("status", "published");
    const { data } = await q.maybeSingle();
    return data ? asArticle(data as Record<string, unknown>) : null;
  }
  const sql = await localSql();
  if (!sql) return null;
  const rows = onlyPublished
    ? await sql`select * from cms_articles where slug = ${slug} and status = ${"published"} limit 1`
    : await sql`select * from cms_articles where slug = ${slug} limit 1`;
  return rows[0] ? asArticle(rows[0]) : null;
}

export async function listPublished(kind?: ArticleKind) {
  const sb = await sbAdmin();
  if (sb) {
    let q = sb.from("cms_articles").select("*").eq("status", "published").order("date", { ascending: false });
    if (kind) q = q.eq("kind", kind);
    const { data } = await q;
    return (data ?? []).map((row) => asArticle(row as Record<string, unknown>));
  }
  const sql = await localSql();
  if (!sql) return [];
  const rows = kind
    ? await sql`select * from cms_articles where status = ${"published"} and kind = ${kind} order by date desc`
    : await sql`select * from cms_articles where status = ${"published"} order by date desc`;
  return rows.map(asArticle);
}

export type ArticleInput = {
  id?: string;
  slug: string;
  title: string;
  answer: string;
  description: string;
  body_html: string;
  author: string;
  tags: string[];
  kind: ArticleKind;
  status: ArticleStatus;
  date: string;
  minutes: number;
};

export async function saveArticle(input: ArticleInput) {
  const id = input.id || crypto.randomUUID();
  const payload = {
    id,
    slug: input.slug,
    title: input.title,
    answer: input.answer,
    description: input.description,
    body_html: input.body_html,
    author: input.author,
    tags: input.tags.join(","),
    kind: input.kind,
    status: input.status,
    date: input.date,
    minutes: input.minutes,
    updated_at: new Date().toISOString(),
  };
  const sb = await sbAdmin();
  if (sb) {
    if (!input.id) {
      const { data: bySlug } = await sb.from("cms_articles").select("id").eq("slug", input.slug).maybeSingle();
      if (bySlug?.id) payload.id = String(bySlug.id);
    }
    await sb.from("cms_articles").upsert(payload);
    return getArticle(String(payload.id));
  }
  const sql = await localSql();
  if (!sql) return getArticle(id);
  let existing = await sql<{ id: string }>`select id from cms_articles where id = ${id} limit 1`;
  if (!existing[0]) {
    existing = await sql<{ id: string }>`select id from cms_articles where slug = ${input.slug} limit 1`;
    if (existing[0]) payload.id = existing[0].id;
  }
  const resolvedId = existing[0]?.id ?? id;
  const tags = payload.tags;
  if (existing[0]) {
    await sql`
      update cms_articles set
        slug = ${input.slug},
        title = ${input.title},
        answer = ${input.answer},
        description = ${input.description},
        body_html = ${input.body_html},
        author = ${input.author},
        tags = ${tags},
        kind = ${input.kind},
        status = ${input.status},
        date = ${input.date},
        minutes = ${input.minutes},
        updated_at = now()
      where id = ${resolvedId}
    `;
  } else {
    await sql`
      insert into cms_articles (id, slug, title, answer, description, body_html, author, tags, kind, status, date, minutes)
      values (
        ${resolvedId}, ${input.slug}, ${input.title}, ${input.answer}, ${input.description},
        ${input.body_html}, ${input.author}, ${tags}, ${input.kind}, ${input.status},
        ${input.date}, ${input.minutes}
      )
    `;
  }
  return getArticle(resolvedId);
}

export async function deleteArticle(id: string) {
  const sb = await sbAdmin();
  if (sb) {
    await sb.from("cms_articles").delete().eq("id", id);
    return;
  }
  const sql = await localSql();
  if (sql) await sql`delete from cms_articles where id = ${id}`;
}

export async function listFaqs(page = "home") {
  const sb = await sbAdmin();
  if (sb) {
    const { data } = await sb.from("cms_faqs").select("*").eq("page", page).order("sort", { ascending: true });
    return (data ?? []).map((r) => ({
      id: String(r.id),
      question: String(r.question),
      answer: String(r.answer),
      page: String(r.page),
      sort: Number(r.sort ?? 0),
    })) as CmsFaq[];
  }
  const sql = await localSql();
  if (!sql) return [];
  const rows = await sql`select * from cms_faqs where page = ${page} order by sort asc`;
  return rows.map((r) => ({
    id: String(r.id),
    question: String(r.question),
    answer: String(r.answer),
    page: String(r.page),
    sort: Number(r.sort ?? 0),
  })) as CmsFaq[];
}

export async function saveFaqs(page: string, items: { question: string; answer: string }[]) {
  const rows = items.map((item, i) => ({
    id: crypto.randomUUID(),
    question: item.question,
    answer: item.answer,
    page,
    sort: i,
  }));
  const sb = await sbAdmin();
  if (sb) {
    await sb.from("cms_faqs").delete().eq("page", page);
    if (rows.length) await sb.from("cms_faqs").insert(rows);
    return;
  }
  const sql = await localSql();
  if (!sql) return;
  await sql`delete from cms_faqs where page = ${page}`;
  for (const row of rows) {
    await sql`
      insert into cms_faqs (id, question, answer, page, sort)
      values (${row.id}, ${row.question}, ${row.answer}, ${row.page}, ${row.sort})
    `;
  }
}

export async function getSiteCopy(): Promise<SiteCopy> {
  const sb = await sbAdmin();
  if (sb) {
    const { data } = await sb.from("cms_settings").select("value").eq("key", "site").maybeSingle();
    if (!data?.value) return defaultCopy();
    try {
      return { ...defaultCopy(), ...JSON.parse(String(data.value)) } as SiteCopy;
    } catch {
      return defaultCopy();
    }
  }
  const sql = await localSql();
  if (!sql) return defaultCopy();
  const rows = await sql<{ value: string }>`select value from cms_settings where key = ${"site"} limit 1`;
  if (!rows[0]?.value) return defaultCopy();
  try {
    return { ...defaultCopy(), ...JSON.parse(rows[0].value) } as SiteCopy;
  } catch {
    return defaultCopy();
  }
}

export async function saveSiteCopy(copy: SiteCopy) {
  const value = JSON.stringify(copy);
  const sb = await sbAdmin();
  if (sb) {
    await sb.from("cms_settings").upsert({ key: "site", value, updated_at: new Date().toISOString() });
    return;
  }
  const sql = await localSql();
  if (!sql) return;
  const existing = await sql<{ key: string }>`select key from cms_settings where key = ${"site"} limit 1`;
  if (existing[0]) await sql`update cms_settings set value = ${value}, updated_at = now() where key = ${"site"}`;
  else await sql`insert into cms_settings (key, value) values (${"site"}, ${value})`;
}

export async function getSetting(key: string) {
  const sb = await sbAdmin();
  if (sb) {
    const { data } = await sb.from("cms_settings").select("value").eq("key", key).maybeSingle();
    return data?.value ? String(data.value) : "";
  }
  const sql = await localSql();
  if (!sql) return "";
  const rows = await sql<{ value: string }>`select value from cms_settings where key = ${key} limit 1`;
  return rows[0]?.value ?? "";
}

export async function setSetting(key: string, value: string) {
  const sb = await sbAdmin();
  if (sb) {
    await sb.from("cms_settings").upsert({ key, value, updated_at: new Date().toISOString() });
    return;
  }
  const sql = await localSql();
  if (!sql) return;
  const existing = await sql<{ key: string }>`select key from cms_settings where key = ${key} limit 1`;
  if (existing[0]) await sql`update cms_settings set value = ${value}, updated_at = now() where key = ${key}`;
  else await sql`insert into cms_settings (key, value) values (${key}, ${value})`;
}

export async function dashboardStats() {
  const sb = await sbAdmin();
  if (sb) {
    const articles = await sb.from("cms_articles").select("id", { count: "exact", head: true });
    const live = await sb.from("cms_articles").select("id", { count: "exact", head: true }).eq("status", "published");
    const drafts = await sb.from("cms_articles").select("id", { count: "exact", head: true }).eq("status", "draft");
    let leads = 0;
    try {
      const l = await sb.from("leads").select("id", { count: "exact", head: true });
      leads = l.count ?? 0;
    } catch {
      leads = 0;
    }
    return {
      articles: articles.count ?? 0,
      published: live.count ?? 0,
      drafts: drafts.count ?? 0,
      leads,
    };
  }
  const sql = await localSql();
  if (!sql) return { articles: 0, published: 0, drafts: 0, leads: 0 };
  const arts = await sql<{ n: number }>`select count(*)::int as n from cms_articles`;
  const live = await sql<{ n: number }>`select count(*)::int as n from cms_articles where status = ${"published"}`;
  const drafts = await sql<{ n: number }>`select count(*)::int as n from cms_articles where status = ${"draft"}`;
  let leads = 0;
  try {
    const l = await sql<{ n: number }>`select count(*)::int as n from leads`;
    leads = l[0]?.n ?? 0;
  } catch {
    leads = 0;
  }
  return {
    articles: arts[0]?.n ?? 0,
    published: live[0]?.n ?? 0,
    drafts: drafts[0]?.n ?? 0,
    leads,
  };
}

export async function listLeads() {
  const sb = await sbAdmin();
  if (sb) {
    const { data, error } = await sb.from("leads").select("id, kind, email, name, company, created_at").order("created_at", { ascending: false }).limit(20);
    if (error) return [];
    return (data ?? []).map((r) => ({
      id: String(r.id),
      kind: String(r.kind ?? "signup"),
      email: String(r.email ?? ""),
      name: r.name ? String(r.name) : "",
      company: r.company ? String(r.company) : "",
      created_at: String(r.created_at ?? ""),
    }));
  }
  const sql = await localSql();
  if (!sql) return [];
  try {
    const rows = await sql<{ id: string; kind: string; email: string; name: string | null; company: string | null; created_at: string }>`
      select id, kind, email, name, company, created_at from leads order by created_at desc limit 20
    `;
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      email: r.email,
      name: r.name ?? "",
      company: r.company ?? "",
      created_at: r.created_at,
    }));
  } catch {
    return [];
  }
}

/** Slugs that should exist in the desk library (live polished blog posts). */
export function expectedLibrarySlugs() {
  return BLOG_POSTS.map((p) => p.slug);
}

/** Which of the six live blog posts are missing from CMS (by slug). */
export async function missingLibrarySlugs() {
  const existing = await listArticles();
  const have = new Set(existing.map((a) => a.slug));
  return BLOG_POSTS.filter((p) => !have.has(p.slug)).map((p) => p.slug);
}

/**
 * Upsert the six live blog posts into CMS by slug.
 * Source of truth: BLOG_POSTS + POST_BODY (same modules that power /blog/$slug).
 * Adds missing rows; refreshes body/metadata for existing slugs.
 */
export async function seedLibrary() {
  const existing = await listArticles();
  const bySlug = new Map(existing.map((a) => [a.slug, a]));
  let added = 0;
  let updated = 0;
  for (const post of BLOG_POSTS) {
    const body_html = markdownToHtml(POST_BODY[post.slug] ?? "");
    const prev = bySlug.get(post.slug);
    await saveArticle({
      id: prev?.id,
      slug: post.slug,
      title: post.title,
      answer: post.excerpt,
      description: post.description,
      body_html,
      author: post.author,
      tags: post.tags,
      kind: "article",
      status: "published",
      date: post.date,
      minutes: post.minutes,
    });
    if (prev) updated += 1;
    else added += 1;
  }
  const total = (await listArticles()).length;
  return { added, updated, total, expected: BLOG_POSTS.length };
}

export type { PricingPlan };
