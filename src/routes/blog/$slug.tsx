import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Markdown } from "@/components/markdown";
import { JsonLd } from "@/components/json-ld";
import { getPost } from "@/lib/content/blog";
import { POST_BODY } from "@/lib/content/posts";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    const body = POST_BODY[params.slug];
    if (!post || !body) throw notFound();
    return { post, body };
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData?.post.title ?? "Article",
      description: loaderData?.post.description ?? "",
      path: `/blog/${loaderData?.post.slug ?? ""}`,
    }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, body } = Route.useLoaderData();
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          date: post.date,
          author: post.author,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={faqJsonLd([
          {
            q: post.title,
            a: post.excerpt,
          },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{post.tags[0]}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-faint">
          {post.author} · {post.date} · {post.minutes} min read
        </p>
        <p className="mt-6 rounded-2xl bg-sand px-4 py-3 text-[17px] leading-relaxed text-ink-soft">
          {post.excerpt}
        </p>
        <div className="mt-8">
          <Markdown source={body} />
        </div>
        <div className="mt-12 rounded-3xl bg-mint-soft px-6 py-8">
          <h2 className="font-display text-2xl font-semibold">Run this against a real location</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Create a workspace to run this against a real footprint. The auditor lives behind sign-in so the score is yours.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/signup">Create workspace</Link>
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
