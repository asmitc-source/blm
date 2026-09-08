import { ensureImageAlts } from "@/lib/cms/gdoc";
import { stripDuplicateHtmlOpener } from "@/lib/content/strip-duplicate-opener";

function sanitize(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function ArticleHtml({
  html,
  answer,
  title,
}: {
  html: string;
  answer?: string;
  title?: string;
}) {
  const stripped = answer ? stripDuplicateHtmlOpener(html, answer) : html;
  const body = ensureImageAlts(stripped, title || "article");
  return <div className="article-html" dangerouslySetInnerHTML={{ __html: sanitize(body) }} />;
}
