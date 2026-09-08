/** Render-time repairs for CMS HTML that would otherwise break on the public blog. */

const ESTUARY_IMG_RE =
  /<img\b[^>]*\bsrc\s*=\s*(?:"[^"]*chatgpt\.com\/backend-api\/estuary[^"]*"|'[^']*chatgpt\.com\/backend-api\/estuary[^']*'|[^\s>]*chatgpt\.com\/backend-api\/estuary[^\s>]*)[^>]*>/gi;

function imgAlt(tag: string) {
  const m = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return (m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim();
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Quick comparison reconstructed from the article's platform sections (Sep 2026). */
export function localSeoPlatformComparisonTableHtml() {
  return `<div class="article-table-wrap" role="region" aria-label="Local SEO Platform Comparison Table"><table class="article-table"><thead><tr><th>Platform</th><th>Best for</th><th>Coverage (vendor claims)</th><th>Pricing model</th></tr></thead><tbody><tr><td>BrightLocal</td><td>SMBs, local SEO consultants, agencies</td><td>Active Sync on major profiles + Citation Builder</td><td>Public plans (Manage from ~$54/mo)</td></tr><tr><td>Yext</td><td>Enterprises, large franchises, regulated orgs</td><td>200+ direct publisher integrations</td><td>Sales-led / custom</td></tr><tr><td>Synup</td><td>Agencies, resellers, multi-client teams</td><td>100+ publishers; listings + local marketing stack</td><td>Public location bands + trial</td></tr><tr><td>Semrush Local</td><td>SEO teams already in Semrush</td><td>70+ US directories via Listing Management</td><td>Per-location (Local Pro for full listings)</td></tr><tr><td>Uberall</td><td>International multi-location brands</td><td>150+ platforms across 194 countries</td><td>Sales-led / custom</td></tr><tr><td>Birdeye</td><td>Multi-location orgs tying listings to reputation</td><td>100+ sites including major networks</td><td>Custom / quote-based</td></tr></tbody></table><p class="article-table-note"><em>Publisher totals should not be compared literally — vendors count directories, integrations, countries, aggregators, and relationships differently. Pricing checked around September 2026.</em></p></div>`;
}

function replacementForEstuaryImg(tag: string) {
  const alt = imgAlt(tag);
  const altKey = alt.toLowerCase();
  if (
    altKey.includes("local seo platform comparison") ||
    altKey.includes("platform comparison table") ||
    (altKey.includes("listing management") && altKey.includes("comparison"))
  ) {
    return localSeoPlatformComparisonTableHtml();
  }
  // Generic dead ChatGPT file URL — drop the broken image; keep a text fallback from alt when present.
  if (alt) {
    return `<p class="article-missing-image"><em>${escapeText(alt)}</em></p>`;
  }
  return "";
}

/** Replace dead chatgpt.com estuary <img> tags; keep surrounding copy intact. */
export function repairEstuaryImages(html: string) {
  if (!html || !/chatgpt\.com\/backend-api\/estuary/i.test(html)) return html;
  return html.replace(ESTUARY_IMG_RE, (tag) => replacementForEstuaryImg(tag));
}

export function repairArticleHtml(html: string) {
  return repairEstuaryImages(html);
}
