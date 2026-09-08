/**
 * One-shot: fill empty img alts in published cms_articles.body_html via Supabase REST.
 * Uses SUPABASE_URL + SUPABASE_SECRET_KEY when set; else fallback URL + publishable key
 * (same defaults as src/lib/cms/supabase.server.ts).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v.includes("SENSITIVE")) continue;
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env.supabase"));

const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://zchubgizclrdjlvgqzsi.supabase.co")
  .trim()
  .replace(/\/$/, "");
const key =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable__yhWiRcZAf4cH-ujwbJT-A_9GOwE45S";

function imgAltValue(tag) {
  const altMatch = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return (altMatch?.[1] ?? altMatch?.[2] ?? altMatch?.[3] ?? "").trim();
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function imagesMissingAlt(html) {
  const missing = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!imgAltValue(m[0])) missing.push("img");
  }
  return missing;
}

function ensureImageAlts(html, articleTitle = "article") {
  if (!html.trim()) return html;
  const title = stripTags(articleTitle) || "article";
  let lastHeading = "";
  let lastFigcaption = "";
  let illustrationIndex = 0;
  return html.replace(
    /(<h([1-4])\b[^>]*>([\s\S]*?)<\/h\2>)|(<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>)|(<img\b[^>]*>)/gi,
    (match, _hAll, _hLevel, hInner, _figAll, figInner, imgTag) => {
      if (imgTag) {
        if (imgAltValue(imgTag)) return match;
        illustrationIndex += 1;
        const nextAlt = (
          lastFigcaption.trim() ||
          lastHeading.trim() ||
          `Illustration for ${title} (${illustrationIndex})`
        ).slice(0, 200);
        const safeAlt = nextAlt.replace(/"/g, "&quot;");
        if (/\balt\s*=/i.test(imgTag)) {
          return imgTag.replace(/\balt\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, `alt="${safeAlt}"`);
        }
        return imgTag.replace(/<img\b/i, `<img alt="${safeAlt}"`);
      }
      if (figInner != null) {
        lastFigcaption = stripTags(String(figInner));
        return match;
      }
      if (hInner != null) {
        lastHeading = stripTags(String(hInner));
        lastFigcaption = "";
        return match;
      }
      return match;
    },
  );
}

const headers = { apikey: key, Authorization: `Bearer ${key}` };

const listRes = await fetch(
  `${url}/rest/v1/cms_articles?or=(status.eq.published,status.eq.scheduled)&select=id,slug,title,status,body_html`,
  { headers },
);
if (!listRes.ok) {
  console.error("list failed", listRes.status, await listRes.text());
  process.exit(1);
}
const rows = await listRes.json();
let updated = 0;
let skipped = 0;
for (const row of rows) {
  const missing = imagesMissingAlt(row.body_html || "");
  if (!missing.length) {
    console.log("skip", row.slug, "imgs_ok");
    skipped += 1;
    continue;
  }
  const body_html = ensureImageAlts(row.body_html || "", row.title || "article");
  const still = imagesMissingAlt(body_html).length;
  if (still) {
    console.error("still empty after ensure", row.slug, still);
    skipped += 1;
    continue;
  }
  const patch = await fetch(`${url}/rest/v1/cms_articles?id=eq.${row.id}`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ body_html, updated_at: new Date().toISOString() }),
  });
  if (!patch.ok) {
    console.error("patch fail", row.slug, patch.status, await patch.text());
    skipped += 1;
    continue;
  }
  console.log("updated", row.slug, "filled", missing.length);
  updated += 1;
}
console.log(JSON.stringify({ updated, skipped, scanned: rows.length }));
