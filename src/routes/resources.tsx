import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Reveal } from "@/components/home/reveal";
import { LogoMark } from "@/components/logo";
import { BLOG_POSTS } from "@/lib/content/blog";
import { loadPublicSite, toCard } from "@/lib/cms/public";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/resources")({
  loader: () => loadPublicSite(),
  head: () =>
    pageHead({
      title: "Resources",
      description:
        "Guides, comparisons, and glossary entries on business listing management, NAP, duplicates, Google Business Profile, and directory coverage.",
      path: "/resources",
    }),
  component: ResourcesPage,
});

const HUBS = [
  { to: "/blog" as const, title: "Blog", copy: "Cornerstone articles on listing management, cost, Google vs the rest, and agency ops.", tile: "a" },
  { to: "/compare" as const, title: "Compare", copy: "Independent alternatives to Yext and BrightLocal: what to keep, what to drop.", tile: "b" },
  { to: "/glossary" as const, title: "Glossary", copy: "NAP, citations, GBP, Apple Business Connect, duplicates, and the rest of the vocabulary.", tile: "c" },
];

function ResourcesPage() {
  const data = Route.useLoaderData();
  const posts = (data.articles.length ? data.articles : BLOG_POSTS).map(toCard);
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ])}
      />
      <InnerPage
        compact
        eyebrow="Resources"
        title="The citation engine for listing operators."
        lede="Direct-answer guides written so humans and models can quote them. Start with the definition, then cost, then duplicates."
      >
        {featured ? (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="industry-card group relative mb-8 flex flex-col overflow-hidden rounded-3xl p-6 pb-12 hairline sm:p-8"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 0% 0%, color-mix(in oklab, var(--tile-a) 38%, transparent), transparent 62%), radial-gradient(ellipse 60% 70% at 100% 100%, color-mix(in oklab, var(--tile-b) 32%, transparent), transparent 60%), var(--cream)",
            }}
          >
            <LogoMark className="industry-seal size-10" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Start here</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold">{featured.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{featured.excerpt}</p>
            <span className="resource-read mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink">
              Read article <ArrowRight className="size-4" />
            </span>
            <div className="industry-tiles" aria-hidden="true">
              <span className="flex-1 bg-[var(--tile-a)]" />
              <span className="flex-1 bg-[var(--tile-b)]" />
              <span className="flex-1 bg-[var(--tile-c)]" />
              <span className="flex-1 bg-[var(--tile-d)]" />
            </div>
          </Link>
        ) : null}
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {HUBS.map((hub) => (
            <Link key={hub.to} to={hub.to} data-tile={hub.tile} className="audience-chip">
              <span className="block font-display text-2xl font-semibold">{hub.title}</span>
              <span className="mt-2 block text-sm font-normal leading-relaxed">{hub.copy}</span>
            </Link>
          ))}
        </div>
        <h2 className="mt-12 font-display text-2xl font-semibold">Cornerstone reading</h2>
        <div className="mt-4 grid items-stretch gap-4 md:grid-cols-2">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 50} className="h-full">
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="industry-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-cream p-5 pb-10 hairline"
              >
                <LogoMark className="industry-seal size-8" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{post.tags[0]}</p>
                <h3 className="mt-2 pr-10 font-display text-xl font-semibold text-ink">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
                <span className="resource-read mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                  Read article <ArrowRight className="size-4" />
                </span>
                <div className="industry-tiles" aria-hidden="true">
                  <span className="flex-1 bg-[var(--tile-a)]" />
                  <span className="flex-1 bg-[var(--tile-b)]" />
                  <span className="flex-1 bg-[var(--tile-c)]" />
                  <span className="flex-1 bg-[var(--tile-d)]" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </InnerPage>
    </SiteShell>
  );
}
