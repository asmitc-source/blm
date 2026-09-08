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

function coverAltMissing(coverUrl, coverAlt) {
  // Nuclear: alt required even when cover URL empty (mirror gdoc.ts).
  void coverUrl;
  return !String(coverAlt ?? "").trim();
}

test("coverAltMissing blocks blank alt even with empty cover URL", () => {
  assert.equal(coverAltMissing("https://x.test/a.png", "   "), true);
  assert.equal(coverAltMissing("https://x.test/a.png", "A cover"), false);
  assert.equal(coverAltMissing("", ""), true);
  assert.equal(coverAltMissing("  ", ""), true);
  assert.equal(coverAltMissing("", "   "), true);
  assert.equal(coverAltMissing("", "Desk cover"), false);
  assert.equal(coverAltMissing(null, "ok"), false);
});

test("gdoc.ts exports nuclear coverAltMissing", () => {
  const src = readFileSync(resolve("src/lib/cms/gdoc.ts"), "utf8");
  assert.match(src, /export function coverAltMissing/);
  assert.match(src, /Nuclear publish bar/);
  assert.doesNotMatch(src, /Boolean\(url\) && !alt/);
});

test("write.tsx never returns null blank and hard-gates cover alt", () => {
  const src = readFileSync(resolve("src/routes/admin/write.tsx"), "utf8");
  assert.doesNotMatch(src, /if \(!ready\) return null/);
  assert.match(src, /loader: \(\) => cmsBootstrap\(\)/);
  assert.match(src, /pendingComponent:/);
  assert.match(src, /pendingMs:\s*0/);
  assert.match(src, /WriteSkeleton/);
  assert.match(src, /Cover image alt is required to publish or schedule/);
  assert.match(src, /disabled=\{saving \|\| coverNeedsAlt\}/);
});

test("server save throws always-required cover alt string", () => {
  const src = readFileSync(resolve("src/lib/cms/actions.ts"), "utf8");
  assert.match(src, /Cover image alt is required to publish or schedule/);
  assert.match(src, /!str\(o\.cover_alt\)\.trim\(\)/);
});
