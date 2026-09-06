import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Markdown } from "@/components/markdown";
import { ArticleHtml } from "@/components/article-html";
import { JsonLd } from "@/components/json-ld";
import { loadPublicArticle } from "@/lib/cms/public";
import { articleJsonLd, breadcrumbJsonLd, definedTermJsonLd, faqJsonLd, pageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const data = await loadPublicArticle({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.article.title ?? "Article",
      description: loaderData?.article.description ?? "",
      path: `/blog/${loaderData?.article.slug ?? ""}`,
    }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { article, markdown, source } = Route.useLoaderData();
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          path: `/blog/${article.slug}`,
          date: article.date,
          author: article.author,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path: `/blog/${article.slug}` },
        ])}
      />
      <JsonLd
        data={faqJsonLd([
          {
            q: article.title,
            a: article.answer,
          },
        ])}
      />
      {article.slug === "what-is-business-listing-management" ? (
        <JsonLd
          data={definedTermJsonLd({
            name: "Business listing management",
            description:
              "Business listing management is the ongoing process of creating, verifying, and synchronizing a company's name, address, phone (NAP), hours, and categories across search engines, maps, and online directories so every location stays accurate.",
            url: `${SITE.domain}/blog/what-is-business-listing-management`,
          })}
        />
      ) : null}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{article.tags[0]}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-faint">
          {article.author} · {article.date} · {article.minutes} min read
        </p>
        {article.answer ? (
          <p className="mt-6 rounded-2xl bg-sand px-4 py-3 text-[17px] leading-relaxed text-ink-soft">
            {article.answer}
          </p>
        ) : null}
        <div className="mt-8">
          {source === "static" && markdown ? <Markdown source={markdown} /> : <ArticleHtml html={article.body_html} />}
        </div>
        <div className="mt-12 rounded-3xl bg-mint-soft px-6 py-8">
          <h2 className="font-display text-2xl font-semibold">Run this against a real location</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Start a free trial to run this against a real location. The auditor lives behind sign-in so the score is yours.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/trial">Start free trial</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
