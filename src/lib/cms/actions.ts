import { createServerFn } from "@tanstack/react-start";
import { SITE } from "@/lib/site";
import { deskMiddleware } from "./middleware";
import { newToken } from "./crypto";
import { cleanArticleHtml, extractTitleFromHtml, googleDocExportUrl, googleDocId } from "./gdoc";
import { estimateMinutes, slugify } from "./convert";
import type { ArticleKind, ArticleStatus, SiteCopy } from "./types";

function str(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function requireAdmin(admin: { id: string; username: string } | null | undefined) {
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export const cmsBootstrap = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    try {
    const { pingSupabase, supabaseConfigured, supabaseUrl } = await import("./supabase.server");
    if (!process.env.VERCEL) {
      const { seedCmsIfEmpty } = await import("./store");
      await seedCmsIfEmpty();
    }
    const configured = await supabaseConfigured();
    const ping = configured ? await pingSupabase() : { ok: false as const, reason: "missing-url" };
    return {
      hasAdmin: true,
      admin: context.admin ?? null,
      supabase: {
        configured,
        url: configured ? await supabaseUrl() : "",
        ping,
      },
    };
    } catch (e) {
      return {
        hasAdmin: true,
        admin: null,
        supabase: { configured: false, url: "", ping: { ok: false as const, reason: e instanceof Error ? e.message : "error" } },
      };
    }
  });

export const cmsSetup = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const username = str(o.username).trim().toLowerCase();
    const password = str(o.password);
    const supabaseUrl = str(o.supabaseUrl).trim().replace(/\/$/, "");
    if (username.length < 2) throw new Error("Pick a username.");
    if (password.length < 8) throw new Error("Password needs at least 8 characters.");
    return { username, password, supabaseUrl };
  })
  .handler(async ({ data }) => {
    const { seedCmsIfEmpty, findAdminByUsername, createAdmin, createSession, setSetting } = await import("./store");
    const { getSql } = await import("@/lib/db");
    await seedCmsIfEmpty();
    const sql = await getSql();
    const existing = await sql<{ n: number }>`select count(*)::int as n from cms_admins`;
    if (existing[0]?.n) throw new Error("The desk already has an owner. Log in.");
    if (await findAdminByUsername(data.username)) throw new Error("That username is taken.");
    const admin = await createAdmin(data.username, data.password);
    if (data.supabaseUrl) await setSetting("supabase_url", data.supabaseUrl);
    const token = newToken();
    await createSession(admin.id, token);
    return { token, username: admin.username };
  });

export const cmsLogin = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const username = str(o.username).trim().toLowerCase();
    const password = str(o.password);
    if (!username || !password) throw new Error("Enter your id and password.");
    return { username, password };
  })
  .handler(async ({ data }) => {
    const email = data.username.includes("@") ? data.username : data.username;
    const { supabaseAdmin, supabaseAnon } = await import("./supabase.server");
    const authClient = (await supabaseAnon()) ?? (await supabaseAdmin());
    if (!authClient) throw new Error("Wrong id or password.");
    const { data: auth, error } = await authClient.auth.signInWithPassword({ email, password: data.password });
    if (error || !auth.user || !auth.session?.access_token) {
      throw new Error("Wrong id or password.");
    }
    const username = (auth.user.email ?? email).toLowerCase();
    let deskToken = newToken();
    try {
      const { upsertAdminFromAuth, createSession } = await import("./store");
      await upsertAdminFromAuth(auth.user.id, username);
      await createSession(auth.user.id, deskToken);
    } catch {
      deskToken = auth.session.access_token;
    }
    try {
      const { setCookie } = await import("@tanstack/react-start/server");
      setCookie("blm_desk", deskToken, {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "lax",
        maxAge: 14 * 86400,
      });
    } catch {
      /* client also writes the cookie */
    }
    return { token: deskToken, refresh: auth.session.refresh_token ?? "", username };
  });

export const cmsLogout = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    const { destroySession } = await import("./store");
    await destroySession(context.deskToken);
    try {
      const { setCookie } = await import("@tanstack/react-start/server");
      setCookie("blm_desk", "", { path: "/", maxAge: 0 });
    } catch {
      /* client clears storage */
    }
    return { ok: true };
  });

export const cmsDashboard = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const { dashboardStats, listArticles, listLeads } = await import("./store");
    const [stats, articles, leads] = await Promise.all([dashboardStats(), listArticles(), listLeads()]);
    return {
      stats,
      recent: articles.slice(0, 8),
      drafts: articles.filter((a) => a.status !== "published").slice(0, 6),
      live: articles.filter((a) => a.status === "published").slice(0, 6),
      leads: leads.slice(0, 8),
      admin: context.admin,
    };
  });

export const cmsSeedLibrary = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const { seedLibrary } = await import("./store");
    return seedLibrary();
  });

export const cmsLibraryStatus = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const { listArticles, missingLibrarySlugs, expectedLibrarySlugs } = await import("./store");
    const [articles, missing] = await Promise.all([listArticles(), missingLibrarySlugs()]);
    return {
      total: articles.length,
      expected: expectedLibrarySlugs().length,
      missing,
      complete: missing.length === 0,
    };
  });

export const cmsListArticles = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const { listArticles } = await import("./store");
    return listArticles();
  });

export const cmsGetArticle = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => ({ id: str((d as { id?: string })?.id) }))
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const { getArticle } = await import("./store");
    return getArticle(data.id);
  });

export const cmsSaveArticle = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    const title = str(o.title).trim();
    if (!title) throw new Error("Add a title.");
    const kind = (str(o.kind, "article") as ArticleKind) || "article";
    const status = (str(o.status, "draft") as ArticleStatus) || "draft";
    const tags = str(o.tags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const body_html = cleanArticleHtml(str(o.body_html));
    return {
      id: str(o.id) || undefined,
      title,
      slug: str(o.slug).trim() || slugify(title),
      answer: str(o.answer).trim(),
      description: str(o.description).trim() || str(o.answer).trim(),
      body_html,
      author: str(o.author).trim() || SITE.editorial,
      tags,
      kind: ["article", "comparison", "resource"].includes(kind) ? kind : "article",
      status: status === "published" ? "published" : "draft",
      date: str(o.date) || new Date().toISOString().slice(0, 10),
      minutes: Number(o.minutes) || estimateMinutes(body_html),
    };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const { saveArticle, getArticle } = await import("./store");
    const { syncArticle } = await import("./supabase.server");
    const previous = data.id ? await getArticle(data.id) : null;
    const wasPublished = previous?.status === "published";
    const saved = await saveArticle(data);
    if (saved) await syncArticle(saved).catch(() => undefined);
    if (saved?.status === "published" && !wasPublished) {
      const { notifySubscribersNewArticle } = await import("@/lib/newsletter");
      const excerpt = (saved.description || saved.answer || "").slice(0, 280);
      await notifySubscribersNewArticle({
        title: saved.title,
        slug: saved.slug,
        excerpt: excerpt || saved.title,
      }).catch(() => undefined);
    }
    return saved;
  });

export const cmsDeleteArticle = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => ({ id: str((d as { id?: string })?.id) }))
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const { deleteArticle } = await import("./store");
    const { syncDeleteArticle } = await import("./supabase.server");
    await deleteArticle(data.id);
    await syncDeleteArticle(data.id).catch(() => undefined);
    return { ok: true };
  });

export const cmsImportDoc = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => {
    const o = (d ?? {}) as Record<string, unknown>;
    return { url: str(o.url).trim(), html: str(o.html) };
  })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    let raw = data.html;
    const id = googleDocId(data.url);
    if (id) {
      const res = await fetch(googleDocExportUrl(id), { redirect: "follow" });
      if (!res.ok) throw new Error("Could not open that Google Doc. Set sharing to anyone with the link.");
      raw = await res.text();
    }
    if (!raw.trim()) throw new Error("Drop a Google Doc link, or paste the document.");
    const body_html = cleanArticleHtml(raw);
    const title = extractTitleFromHtml(body_html);
    const text = body_html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const answer = text.split(/(?<=\.)\s/)[0]?.slice(0, 280) ?? "";
    return {
      title,
      answer,
      body_html,
      minutes: estimateMinutes(body_html),
    };
  });

export const cmsGetSite = createServerFn({ method: "GET" })
  .middleware([deskMiddleware])
  .handler(async ({ context }) => {
    requireAdmin(context.admin);
    const { getSiteCopy, listFaqs, seedCmsIfEmpty } = await import("./store");
    await seedCmsIfEmpty();
    const [copy, faqs] = await Promise.all([getSiteCopy(), listFaqs("home")]);
    return { copy, faqs };
  });

export const cmsSaveSite = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => d as { copy: SiteCopy; faqs: { question: string; answer: string }[] })
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const { saveSiteCopy, saveFaqs, listFaqs } = await import("./store");
    const { syncSiteCopy, syncFaqs } = await import("./supabase.server");
    await saveSiteCopy(data.copy);
    await saveFaqs("home", data.faqs);
    const faqs = await listFaqs("home");
    await syncSiteCopy(data.copy).catch(() => undefined);
    await syncFaqs("home", faqs).catch(() => undefined);
    return { ok: true };
  });

export const cmsSaveSettings = createServerFn({ method: "POST" })
  .middleware([deskMiddleware])
  .validator((d: unknown) => ({ supabaseUrl: str((d as { supabaseUrl?: string })?.supabaseUrl).trim().replace(/\/$/, "") }))
  .handler(async ({ context, data }) => {
    requireAdmin(context.admin);
    const { setSetting } = await import("./store");
    const { pingSupabase } = await import("./supabase.server");
    await setSetting("supabase_url", data.supabaseUrl);
    const ping = data.supabaseUrl ? await pingSupabase() : { ok: false as const, reason: "missing-url" };
    return { ping };
  });
