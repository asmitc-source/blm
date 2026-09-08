/**
 * Run with: npx tsx scripts/repair-article-html.test.mjs
 * (imports the TypeScript source directly)
 */
import assert from "node:assert/strict";
import test from "node:test";
import { repairArticleHtml } from "../src/lib/content/repair-article-html.ts";

test("replaces estuary comparison img with HTML table", () => {
  const html = `<h2>Quick Comparison</h2><p><img src="https://chatgpt.com/backend-api/estuary/content?id=file_abc&amp;sig=1" alt="Local SEO Platform Comparison Table"></p>`;
  const out = repairArticleHtml(html);
  assert.equal(/chatgpt\.com/.test(out), false);
  assert.match(out, /<table class="article-table">/);
  assert.match(out, /BrightLocal/);
  assert.match(out, /Yext/);
  assert.match(out, /Synup/);
});

test("leaves normal images alone", () => {
  const html = `<p><img src="https://businesslistingmanagement.com/og.png" alt="OG"></p>`;
  assert.equal(repairArticleHtml(html), html);
});

test("generic estuary img falls back to alt text", () => {
  const html = `<img src="https://chatgpt.com/backend-api/estuary/content?id=x" alt="Diagram of sync">`;
  const out = repairArticleHtml(html);
  assert.equal(/chatgpt\.com/.test(out), false);
  assert.match(out, /Diagram of sync/);
});
