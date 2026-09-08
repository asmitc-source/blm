import { createServerFn } from "@tanstack/react-start";
import { BLOG_POSTS, type BlogPost } from "@/lib/content/blog";
import { POST_BODY } from "@/lib/content/posts";
import { FAQ, PRICING } from "@/lib/site";
import { markdownToHtml } from "./convert";
import type { CmsArticle, SiteCopy } from "./types";

function ensureArticleDescription(article: CmsArticle): CmsArticle {
  const description = (
    article.description?.trim() ||
    article.answer?.trim() ||
    `A BLM guide to ${article.title}.`
  ).slice(0, 170);
  return { ...article, description };
}


function fallbackCopy(): SiteCopy {
  return {
    home: {
      lede: "Business listing management without the spreadsheet: unify NAP, close duplicates, and keep Google, Apple, Bing, and the directory network in lockstep from one BLM workspace.",
      trialLine: "",
    },
    pricingTitle: "Business listing management pricing: Starter $49. Growth $149.",
    pricingLede:
      "Business listing management cost for BLM: Starter listed at $49/month, Growth at $149/month, Enterprise custom. Start a free trial or book a call. Listed prices apply when billing goes live.",
    plans: PRICING.map((p) => ({ ...p, features: [...p.features] })),
  };
}

function staticArticles(): CmsArticle[] {
  return BLOG_POSTS.map((post) =>
    ensureArticleDescription({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      answer: post.excerpt,
      description: post.description,
      body_html: "",
      author: post.author,
      tags: post.tags,
      kind: "article",
      status: "published",
      date: post.date,
      minutes: post.minutes,
      meta_title: "",
      canonical_url: "",
      category: post.tags[0] ?? "",
      published_at: post.date,
      cover_url: null,
      cover_alt: "",
      created_at: post.date,
      updated_at: post.date,
    } satisfies CmsArticle),
  );
}

type PublicSitePayload = {
  copy: SiteCopy;
  faqs: { q: string; a: string }[];
  articles: CmsArticle[];
};

let publicSiteCache: { at: number; data: PublicSitePayload } | null = null;
/** Warm instances: serve cache for 10 minutes. */
const PUBLIC_SITE_TTL_MS = 10 * 60_000;
/** Stale-while-revalidate window after TTL. */
const PUBLIC_SITE_STALE_MS = 20 * 60_000;

export function invalidatePublicSiteCache() {
  publicSiteCache = null;
}

async function refreshPublicSite(): Promise<PublicSitePayload> {
  const now = Date.now();
  const fallback: PublicSitePayload = {
    copy: fallbackCopy(),
    faqs: FAQ.map((f) => ({ q: f.q, a: f.a })),
    articles: staticArticles(),
  };
  try {
    const { getSiteCopy, listFaqs, listPublished } = await import("./store");
    // Do not await seedCmsIfEmpty on the public path — it is a no-op on Vercel
    // and slows every cold navigation when a local DB exists in other envs.
    const timed = Promise.race([
      Promise.all([getSiteCopy(), listFaqs("home"), listPublished()]) as Promise<
        [SiteCopy, { question: string; answer: string }[], CmsArticle[]]
      >,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 4_000)),
    ]);
    const result = await timed;
    if (!result) {
      publicSiteCache = { at: now, data: publicSiteCache?.data ?? fallback };
      return publicSiteCache.data;
    }
    const [copy, faqs, articles] = result;
    const data: PublicSitePayload = {
      copy,
      faqs: faqs.map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer })),
      articles: (articles.length ? articles : staticArticles()).map(ensureArticleDescription),
    };
    publicSiteCache = { at: now, data };
    return data;
  } catch {
    publicSiteCache = { at: now, data: publicSiteCache?.data ?? fallback };
    return publicSiteCache.data;
  }
}

export const loadPublicSite = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (publicSiteCache && now - publicSiteCache.at < PUBLIC_SITE_TTL_MS) {
    return publicSiteCache.data;
  }
  if (publicSiteCache && now - publicSiteCache.at < PUBLIC_SITE_STALE_MS) {
    void refreshPublicSite().catch(() => undefined);
    return publicSiteCache.data;
  }
  return refreshPublicSite();
});

export const loadPublicArticle = createServerFn({ method: "GET" })
  .validator((d: unknown) => ({ slug: String((d as { slug?: string })?.slug ?? "") }))
  .handler(async ({ data }) => {
    // Bundled library posts win over CMS so content-lane git updates publish without a DB rewrite.
    const post = BLOG_POSTS.find((p) => p.slug === data.slug);
    const markdown = POST_BODY[data.slug];
    if (post && markdown) {
      return {
        source: "static" as const,
        article: ensureArticleDescription({
          id: post.slug,
          slug: post.slug,
          title: post.title,
          answer: post.excerpt,
          description: post.description,
          body_html: markdownToHtml(markdown),
          author: post.author,
          tags: post.tags,
          kind: "article" as const,
          status: "published" as const,
          date: post.date,
          minutes: post.minutes,
          meta_title: "",
          canonical_url: "",
          category: post.tags[0] ?? "",
          published_at: post.date,
          cover_url: null,
          cover_alt: "",
          created_at: post.date,
          updated_at: post.date,
        } satisfies CmsArticle),
        markdown,
      };
    }
    try {
      const { getArticleBySlug } = await import("./store");
      // Skip seedCmsIfEmpty on public article path for snappy TTFB.
      const cms = await Promise.race([
        getArticleBySlug(data.slug, true),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 4_000)),
      ]);
      if (cms) return { source: "cms" as const, article: ensureArticleDescription(cms), markdown: "" };
    } catch {
      /* no CMS article */
    }
    return null;
  });

export function toCard(post: CmsArticle | BlogPost) {
  if ("excerpt" in post) {
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      author: post.author,
      minutes: post.minutes,
      tags: post.tags,
    };
  }
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.answer || post.description,
    date: post.date,
    author: post.author,
    minutes: post.minutes,
    tags: post.tags,
  };
}
