/** Turn Google-exported / pasted HTML into clean article HTML (bold, italic, lists, headings, images). */

const ALLOWED = new Set(["P", "H1", "H2", "H3", "H4", "UL", "OL", "LI", "STRONG", "B", "EM", "I", "A", "BR", "BLOCKQUOTE", "IMG"]);

function classStyles(html: string) {
  const block = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1] ?? "";
  const map = new Map<string, { bold?: boolean; italic?: boolean }>();
  for (const m of block.matchAll(/\.([A-Za-z0-9_-]+)\s*\{([^}]+)\}/g)) {
    const body = m[2].toLowerCase();
    map.set(m[1], {
      bold: /font-weight\s*:\s*(bold|[6-9]00)/.test(body),
      italic: /font-style\s*:\s*italic/.test(body),
    });
  }
  return map;
}

function applyGoogleSpans(html: string, styles: Map<string, { bold?: boolean; italic?: boolean }>) {
  return html.replace(/<span([^>]*)>([\s\S]*?)<\/span>/gi, (_all, attrs: string, inner: string) => {
    const cls = (attrs.match(/class="([^"]+)"/)?.[1] ?? "").split(/\s+/);
    let out = inner;
    const hit = cls.map((c) => styles.get(c)).find(Boolean);
    const styleAttr = attrs.match(/style="([^"]+)"/)?.[1]?.toLowerCase() ?? "";
    const bold = hit?.bold || /font-weight\s*:\s*(bold|[6-9]00)/.test(styleAttr);
    const italic = hit?.italic || /font-style\s*:\s*italic/.test(styleAttr);
    if (bold) out = `<strong>${out}</strong>`;
    if (italic) out = `<em>${out}</em>`;
    return out;
  });
}

/** Images in body HTML missing a non-empty alt attribute. */
export function imagesMissingAlt(html: string): string[] {
  const missing: string[] = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const altMatch = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const alt = (altMatch?.[1] ?? altMatch?.[2] ?? altMatch?.[3] ?? "").trim();
    if (!alt) {
      const src = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      missing.push((src?.[1] ?? src?.[2] ?? src?.[3] ?? "image").slice(0, 120));
    }
  }
  return missing;
}

function cleanImgTag(attrs: string) {
  const src = attrs.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  const alt = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  const srcVal = (src?.[1] ?? src?.[2] ?? src?.[3] ?? "").trim();
  const altVal = (alt?.[1] ?? alt?.[2] ?? alt?.[3] ?? "").trim();
  if (!srcVal) return "";
  const safeSrc = srcVal.replace(/"/g, "&quot;");
  const safeAlt = altVal.replace(/"/g, "&quot;");
  return `<img src="${safeSrc}" alt="${safeAlt}">`;
}

export function cleanArticleHtml(raw: string) {
  if (!raw.trim()) return "";
  let html = raw;
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1];
  if (body) html = body;
  const styles = classStyles(raw);
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<meta[^>]*>/gi, "");
  html = applyGoogleSpans(html, styles);
  // Preserve real lists: never rewrite div/section wrappers that sit inside ul/ol.
  html = html.replace(/<(ul|ol)(\s[^>]*)?>[\s\S]*?<\/\1>/gi, (block) =>
    block
      .replace(/<\/?(?:span|font)[^>]*>/gi, "")
      .replace(/<\/?(?:div|section|article|header|footer|main)[^>]*>/gi, ""),
  );
  html = html.replace(/<\/?(span|font|div|section|article|header|footer|main)[^>]*>/gi, (tag) =>
    /^<\/?(div|section|article)/i.test(tag) ? (tag.startsWith("</") ? "</p>" : "<p>") : "",
  );
  html = html.replace(/<b(\s|>)/gi, "<strong$1").replace(/<\/b>/gi, "</strong>");
  html = html.replace(/<i(\s|>)/gi, "<em$1").replace(/<\/i>/gi, "</em>");
  html = html.replace(/<h1[^>]*>/gi, "<h2>").replace(/<\/h1>/gi, "</h2>");
  html = html.replace(/<h4[^>]*>/gi, "<h3>").replace(/<\/h4>/gi, "</h3>");
  html = html.replace(/<p[^>]*>/gi, "<p>").replace(/<h2[^>]*>/gi, "<h2>").replace(/<h3[^>]*>/gi, "<h3>");
  html = html.replace(/<a [^>]*href="([^"]+)"[^>]*>/gi, '<a href="$1">');
  html = html.replace(/<li[^>]*>/gi, "<li>");
  html = html.replace(/<ul[^>]*>/gi, "<ul>").replace(/<ol[^>]*>/gi, "<ol>");
  html = html.replace(/<img([^>]*)\/?>/gi, (_all, attrs: string) => cleanImgTag(attrs));
  html = html.replace(/&nbsp;/g, " ");
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");
  html = html.replace(/\n{3,}/g, "\n\n");
  void ALLOWED;
  return html.trim();
}

export function extractTitleFromHtml(html: string) {
  const h = html.match(/<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/i);
  if (!h) return "";
  return h[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function googleDocId(input: string) {
  const m = input.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  return m?.[1] ?? "";
}

export function googleDocExportUrl(id: string) {
  return `https://docs.google.com/document/d/${id}/export?format=html`;
}
