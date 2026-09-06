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
      title: "Blog",
      description:
        "BLM blog: business listing management guides covering NAP, duplicates, Google Business Profile, cost, and agency operations.",
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const data = Route.useLoaderData();
  const posts = (data.articles.length ? data.articles : BLOG_POSTS).map(toCard);

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
        lede="No recycled ‘10 tools’ roundups. Each piece starts with a definition you can cite."
      >
        <div className="grid gap-5">
          {posts.map((post) => (
            <article key={post.slug} className="grid gap-2 rounded-3xl bg-cream p-6 hairline md:grid-cols-[8rem_1fr]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{post.date}</p>
              <div>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="font-display text-2xl font-semibold text-ink"
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                <p className="mt-2 text-xs text-faint">
                  {post.author} · {post.minutes} min
                </p>
              </div>
            </article>
          ))}
        </div>
      </InnerPage>
    </SiteShell>
  );
}
