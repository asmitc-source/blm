/** Collapse whitespace for opener comparison. */
export function normalizeOpenerText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * True when the first body paragraph duplicates the answer/excerpt callout:
 * equal after normalize, or either is a prefix of the other.
 */
export function isDuplicateOpener(paragraph: string, answer: string) {
  const p = normalizeOpenerText(paragraph);
  const a = normalizeOpenerText(answer);
  if (!p || !a) return false;
  return p === a || p.startsWith(a) || a.startsWith(p);
}

/** Strip the first markdown paragraph when it duplicates `answer`. */
export function stripDuplicateMarkdownOpener(markdown: string, answer: string) {
  if (!answer || !markdown) return markdown;
  const blocks = markdown.trim().split(/\n{2,}/);
  if (blocks.length < 2) return markdown;
  const first = blocks[0].trim();
  if (first.startsWith("#")) return markdown;
  if (!isDuplicateOpener(first, answer)) return markdown;
  return blocks.slice(1).join("\n\n");
}

/** Strip tags from a fragment for text comparison. */
function htmlToText(fragment: string) {
  return fragment
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

/**
 * Strip the first `<p>...</p>` when its text duplicates `answer`.
 * Uses a simple regex (CMS bodies are sanitized paragraph HTML).
 */
export function stripDuplicateHtmlOpener(html: string, answer: string) {
  if (!answer || !html) return html;
  const re = /<p\b[^>]*>[\s\S]*?<\/p>/i;
  const match = html.match(re);
  if (!match || match.index === undefined) return html;
  const text = htmlToText(match[0]);
  if (!isDuplicateOpener(text, answer)) return html;
  const before = html.slice(0, match.index);
  const after = html.slice(match.index + match[0].length).replace(/^\s+/, "");
  return `${before}${after}`;
}
