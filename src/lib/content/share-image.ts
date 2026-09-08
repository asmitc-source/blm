/** Client-safe absolute share-image URL helpers (no node builtins). */

export function absoluteShareImage(image: string | null | undefined, origin: string, fallback: string) {
  const raw = (image || "").trim();
  if (!raw) return fallback;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (raw.startsWith("/")) return `${origin.replace(/\/+$/, "")}${raw}`;
  return fallback;
}

export function firstContentImageUrl(html: string) {
  if (!html) return null;
  const m = html.match(/\bsrc\s*=\s*["'](https:\/\/[^"']+\/media\/cms\/by-hash\/[^"']+)["']/i);
  return m?.[1]?.trim() || null;
}
