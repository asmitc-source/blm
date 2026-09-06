import { stripDuplicateHtmlOpener } from "@/lib/content/strip-duplicate-opener";

function sanitize(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function ArticleHtml({ html, answer }: { html: string; answer?: string }) {
  const body = answer ? stripDuplicateHtmlOpener(html, answer) : html;
  return <div className="article-html" dangerouslySetInnerHTML={{ __html: sanitize(body) }} />;
}
