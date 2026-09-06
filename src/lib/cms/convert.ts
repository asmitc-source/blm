/** Markdown (existing posts) → HTML for the desk editor. */
export function markdownToHtml(source: string) {
  const blocks = source.trim().split(/\n{2,}/);
  return blocks
    .map((raw) => {
      const text = raw.trim();
      if (text.startsWith("## ")) return `<h2>${inline(text.slice(3))}</h2>`;
      if (text.startsWith("### ")) return `<h3>${inline(text.slice(4))}</h3>`;
      if (text.startsWith("- ")) {
        const items = text.split(/\n/).filter((l) => l.startsWith("- "));
        return `<ul>${items.map((i) => `<li>${inline(i.slice(2))}</li>`).join("")}</ul>`;
      }
      return `<p>${inline(text)}</p>`;
    })
    .join("");
}

function inline(text: string) {
  return text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function estimateMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
}
