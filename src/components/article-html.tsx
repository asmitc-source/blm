function sanitize(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function ArticleHtml({ html }: { html: string }) {
  return <div className="article-html" dangerouslySetInnerHTML={{ __html: sanitize(html) }} />;
}
