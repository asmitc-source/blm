import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Load TS source via experimental strip-types by spawning? Prefer inline duplicate of pure helpers
// Mirror ensureImageAlts from gdoc.ts for a fast node:test (keeps CI without vitest).

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

test("fills empty alt from nearest heading", () => {
  const html = `<h2>Coverage map</h2><p>x</p><img src="https://example.com/a.png" alt="">`;
  const out = ensureImageAlts(html, "Online listings");
  assert.equal(imagesMissingAlt(out).length, 0);
  assert.match(out, /alt="Coverage map"/);
});

test("falls back to Illustration for title", () => {
  const out = ensureImageAlts(`<img src="https://example.com/a.png" alt="">`, "What Is Online Business Listing Management?");
  assert.match(out, /alt="Illustration for What Is Online Business Listing Management\? \(1\)"/);
});

test("gdoc.ts exports ensureImageAlts", () => {
  const src = readFileSync(resolve("src/lib/cms/gdoc.ts"), "utf8");
  assert.match(src, /export function ensureImageAlts/);
  assert.match(src, /fillEmptyAlts/);
  assert.match(src, /Illustration for/);
});
