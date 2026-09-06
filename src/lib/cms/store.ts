import { getSql } from "@/lib/db";
import { FAQ, PRICING, SITE } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/content/blog";
import { POST_BODY } from "@/lib/content/posts";
import { markdownToHtml } from "./convert";
import { hashPassword } from "./crypto";
import type { ArticleKind, ArticleStatus, CmsArticle, CmsFaq, PricingPlan, SiteCopy } from "./types";

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
    lede: "Go from messy citations to a governed presence. Unify NAP, close duplicates, and keep Google, Apple, Bing, and directories in lockstep from one workspace.",
    trialLine: "7-day free trial. Then Starter at $49/month or Growth at $149/month.",
  },
  pricingTitle: "Starter $49. Growth $149. Seven days free.",
  pricingLede: "Start a free trial of Starter or Growth. After seven days, pick the plan that matches the footprint.",
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
  const sql = await getSql();
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
  const articles = await sql<{ n: number }>`select count(*)::int as n from cms_articles`;
  if (!articles[0]?.n) {
    for (const post of BLOG_POSTS) {
      const id = crypto.randomUUID();
      const body = markdownToHtml(POST_BODY[post.slug] ?? "");
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
          ${post.tags.join(",")},
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
  const sql = await getSql();
  const rows = await sql<{ id: string; username: string }>`
    select id, username from cms_admins where id = ${id} or username = ${username} limit 1
  `;
  if (!rows[0]) {
    await sql`insert into cms_admins (id, username, password_hash) values (${id}, ${username}, ${"supabase-auth"})`;
  }
  try {
    const { supabaseAdmin } = await import("./supabase.server");
    const sb = await supabaseAdmin();
    await sb?.from("cms_admins").upsert({ id: rows[0]?.id ?? id, username, password_hash: "supabase-auth" });
  } catch {
    /* local is enough for preview */
  }
  return rows[0] ?? { id, username };
}

export async function createAdmin(username: string, password: string) {
  const sql = await getSql();
  const id = crypto.randomUUID();
  const password_hash = await hashPassword(password);
  await sql`insert into cms_admins (id, username, password_hash) values (${id}, ${username}, ${password_hash})`;
  return { id, username };
}

export async function findAdminByUsername(username: string) {
  const sql = await getSql();
  const rows = await sql<{ id: string; username: string; password_hash: string }>`
    select id, username, password_hash from cms_admins where username = ${username} limit 1
  `;
  return rows[0] ?? null;
}

export async function createSession(adminId: string, token: string, days = 14) {
  const sql = await getSql();
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  await sql`
    insert into cms_sessions (id, admin_id, token, expires_at)
    values (${crypto.randomUUID()}, ${adminId}, ${token}, ${expires})
  `;
}

export async function sessionAdmin(token: string | null | undefined) {
  if (!token) return null;
  try {
    const { supabaseAdmin } = await import("./supabase.server");
    const sb = await supabaseAdmin();
    if (sb) {
      const remote = await sb
        .from("cms_sessions")
        .select("admin_id, cms_admins(id, username)")
        .eq("token", token)
        .gt("expires_at", new Date().toISOString())
        .limit(1)
        .maybeSingle();
      const joined = remote.data as
        | { admin_id: string; cms_admins: { id: string; username: string } | { id: string; username: string }[] | null }
        | null;
      const admin = Array.isArray(joined?.cms_admins) ? joined?.cms_admins[0] : joined?.cms_admins;
      if (admin?.username) return { id: admin.id, username: admin.username };
      if (joined?.admin_id) {
        const row = await sb.from("cms_admins").select("id, username").eq("id", joined.admin_id).maybeSingle();
        if (row.data) return { id: String(row.data.id), username: String(row.data.username) };
      }
    }
  } catch {
    /* fall through to local */
  }
  const sql = await getSql();
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
  const sql = await getSql();
  await sql`delete from cms_sessions where token = ${token}`;
}

export async function listArticles() {
  const sql = await getSql();
  const rows = await sql`select * from cms_articles order by date desc, updated_at desc`;
  return rows.map(asArticle);
}

export async function getArticle(id: string) {
  const sql = await getSql();
  const rows = await sql`select * from cms_articles where id = ${id} limit 1`;
  return rows[0] ? asArticle(rows[0]) : null;
}

export async function getArticleBySlug(slug: string, onlyPublished = false) {
  const sql = await getSql();
  const rows = onlyPublished
    ? await sql`select * from cms_articles where slug = ${slug} and status = ${"published"} limit 1`
    : await sql`select * from cms_articles where slug = ${slug} limit 1`;
  return rows[0] ? asArticle(rows[0]) : null;
}

export async function listPublished(kind?: ArticleKind) {
  const sql = await getSql();
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
  const sql = await getSql();
  const id = input.id || crypto.randomUUID();
  const existing = await sql<{ id: string }>`select id from cms_articles where id = ${id} limit 1`;
  const tags = input.tags.join(",");
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
      where id = ${id}
    `;
  } else {
    await sql`
      insert into cms_articles (id, slug, title, answer, description, body_html, author, tags, kind, status, date, minutes)
      values (
        ${id}, ${input.slug}, ${input.title}, ${input.answer}, ${input.description},
        ${input.body_html}, ${input.author}, ${tags}, ${input.kind}, ${input.status},
        ${input.date}, ${input.minutes}
      )
    `;
  }
  return getArticle(id);
}

export async function deleteArticle(id: string) {
  const sql = await getSql();
  await sql`delete from cms_articles where id = ${id}`;
}

export async function listFaqs(page = "home") {
  const sql = await getSql();
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
  const sql = await getSql();
  await sql`delete from cms_faqs where page = ${page}`;
  for (const [i, item] of items.entries()) {
    await sql`
      insert into cms_faqs (id, question, answer, page, sort)
      values (${crypto.randomUUID()}, ${item.question}, ${item.answer}, ${page}, ${i})
    `;
  }
}

export async function getSiteCopy(): Promise<SiteCopy> {
  const sql = await getSql();
  const rows = await sql<{ value: string }>`select value from cms_settings where key = ${"site"} limit 1`;
  if (!rows[0]?.value) return defaultCopy();
  try {
    return { ...defaultCopy(), ...JSON.parse(rows[0].value) } as SiteCopy;
  } catch {
    return defaultCopy();
  }
}

export async function saveSiteCopy(copy: SiteCopy) {
  const sql = await getSql();
  const value = JSON.stringify(copy);
  const existing = await sql<{ key: string }>`select key from cms_settings where key = ${"site"} limit 1`;
  if (existing[0]) await sql`update cms_settings set value = ${value}, updated_at = now() where key = ${"site"}`;
  else await sql`insert into cms_settings (key, value) values (${"site"}, ${value})`;
}

export async function getSetting(key: string) {
  const sql = await getSql();
  const rows = await sql<{ value: string }>`select value from cms_settings where key = ${key} limit 1`;
  return rows[0]?.value ?? "";
}

export async function setSetting(key: string, value: string) {
  const sql = await getSql();
  const existing = await sql<{ key: string }>`select key from cms_settings where key = ${key} limit 1`;
  if (existing[0]) await sql`update cms_settings set value = ${value}, updated_at = now() where key = ${key}`;
  else await sql`insert into cms_settings (key, value) values (${key}, ${value})`;
}

export async function dashboardStats() {
  const sql = await getSql();
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

export type { PricingPlan };
