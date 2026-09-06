import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CmsArticle, CmsFaq, SiteCopy } from "./types";

const FALLBACK_URL = "https://zchubgizclrdjlvgqzsi.supabase.co";
function envSecret() {
  return process.env.SUPABASE_SECRET_KEY || "";
}

function cleanUrl(value: string) {
  return value.trim().replace(/\/$/, "").replace(/\/rest\/v1\/?$/, "");
}

function envUrl() {
  return cleanUrl(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || FALLBACK_URL);
}

function envSecret() {
  return process.env.SUPABASE_SECRET_KEY || "";
}

export function supabasePublishable() {
  return process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";
}

export async function supabaseUrl() {
  return envUrl() || FALLBACK_URL;
}

export async function supabaseConfigured() {
  return Boolean((await supabaseUrl()) && envSecret());
}

export async function supabaseAdmin(): Promise<SupabaseClient | null> {
  const url = await supabaseUrl();
  const key = envSecret();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function supabaseAnon(): Promise<SupabaseClient | null> {
  const url = await supabaseUrl();
  const key = supabasePublishable();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function pingSupabase() {
  const sb = await supabaseAdmin();
  if (!sb) return { ok: false as const, reason: "missing-url" };
  const { error } = await sb.from("cms_articles").select("id").limit(1);
  if (error) return { ok: false as const, reason: error.message };
  return { ok: true as const };
}

function tagsJoin(tags: string[]) {
  return tags.join(",");
}

export async function syncArticle(article: CmsArticle) {
  const sb = await supabaseAdmin();
  if (!sb) return;
  await sb.from("cms_articles").upsert({
    id: article.id,
    slug: article.slug,
    title: article.title,
    answer: article.answer,
    description: article.description,
    body_html: article.body_html,
    author: article.author,
    tags: tagsJoin(article.tags),
    kind: article.kind,
    status: article.status,
    date: article.date,
    minutes: article.minutes,
    cover_url: article.cover_url,
    updated_at: new Date().toISOString(),
  });
}

export async function syncDeleteArticle(id: string) {
  const sb = await supabaseAdmin();
  if (!sb) return;
  await sb.from("cms_articles").delete().eq("id", id);
}

export async function syncFaqs(page: string, items: CmsFaq[]) {
  const sb = await supabaseAdmin();
  if (!sb) return;
  await sb.from("cms_faqs").delete().eq("page", page);
  if (items.length) await sb.from("cms_faqs").insert(items);
}

export async function syncSiteCopy(copy: SiteCopy) {
  const sb = await supabaseAdmin();
  if (!sb) return;
  await sb.from("cms_settings").upsert({ key: "site", value: JSON.stringify(copy), updated_at: new Date().toISOString() });
}

export async function fetchPublishedFromSupabase(slug: string) {
  const sb = await supabaseAdmin();
  if (!sb) return null;
  const { data } = await sb.from("cms_articles").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  return data;
}
