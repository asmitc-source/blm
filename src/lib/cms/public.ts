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

type PublicSitePayload = {
  copy: SiteCopy;
  faqs: { q: string; a: string }[];
  articles: CmsArticle[];
};

let publicSiteCache: { at: number; data: PublicSitePayload } | null = null;
const PUBLIC_SITE_TTL_MS = 45_000;

export function invalidatePublicSiteCache() {
  publicSiteCache = null;
}

export const loadPublicSite = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (publicSiteCache && now - publicSiteCache.at < PUBLIC_SITE_TTL_MS) {
    return publicSiteCache.data;
  }
  try {
    const { seedCmsIfEmpty, getSiteCopy, listFaqs, listPublished } = await import("./store");
    await seedCmsIfEmpty();
    const [copy, faqs, articles] = await Promise.all([getSiteCopy(), listFaqs("home"), listPublished()]);
    const data: PublicSitePayload = {
      copy,
      faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
      articles: articles.map(ensureArticleDescription),
    };
    publicSiteCache = { at: now, data };
    return data;
  } catch {
    const data: PublicSitePayload = {
      copy: fallbackCopy(),
      faqs: FAQ.map((f) => ({ q: f.q, a: f.a })),
      articles: [] as CmsArticle[],
    };
    publicSiteCache = { at: now, data };
    return data;
  }
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
      const { getArticleBySlug, seedCmsIfEmpty } = await import("./store");
      await seedCmsIfEmpty();
      const cms = await getArticleBySlug(data.slug, true);
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
