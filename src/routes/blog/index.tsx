import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { loadPublicSite, toCard } from "@/lib/cms/public";
import { BLOG_POSTS } from "@/lib/content/blog";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/blog/")({
  loader: () => loadPublicSite(),
  head: () =>
    pageHead({
      title: "Business listing management blog",
      description:
        "Business listing management blog from BLM: guides covering NAP, duplicates, Google Business Profile, cost, and agency operations.",
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const data = Route.useLoaderData();
  const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, toCard(p)]));
  for (const article of data.articles) {
    if (article.status !== "published") continue;
    bySlug.set(article.slug, toCard(article)); // CMS wins on slug collision
  }
  const posts = [...bySlug.values()].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <InnerPage
        eyebrow="Blog"
        title="Listing operations, written in complete sentences."
        lede="Business listing management guides without recycled tool roundups. Each piece starts with a definition you can cite."
      >
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Start with{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>{" "}
          or return to the{" "}
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            BLM homepage
          </Link>
          .
        </p>
        <div className="grid gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="blog-card group relative grid gap-2 overflow-hidden rounded-3xl bg-cream p-6 hairline md:grid-cols-[8rem_1fr]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{post.date}</p>
              <div>
                <h2 className="blog-card-title font-display text-2xl font-semibold text-ink">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                <p className="mt-2 text-xs text-faint">
                  {post.author} · {post.minutes} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </InnerPage>
    </SiteShell>
  );
}
