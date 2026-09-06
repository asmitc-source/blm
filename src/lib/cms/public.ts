import { createServerFn } from "@tanstack/react-start";
import { BLOG_POSTS, type BlogPost } from "@/lib/content/blog";
import { POST_BODY } from "@/lib/content/posts";
import { FAQ, PRICING } from "@/lib/site";
import { markdownToHtml } from "./convert";
import type { CmsArticle, SiteCopy } from "./types";

function fallbackCopy(): SiteCopy {
  return {
    home: {
      lede: "Go from messy citations to a governed presence. Unify NAP, close duplicates, and keep Google, Apple, Bing, and the directory network in lockstep from one workspace.",
      trialLine:
        "Create a workspace. No card required. Listed rates are Starter $49/month and Growth $149/month when billing goes live.",
    },
    pricingTitle: "Starter $49. Growth $149. Billing not live yet.",
    pricingLede:
      "Create a workspace of Starter or Growth. No card required. Listed prices apply when billing goes live.",
    plans: PRICING.map((p) => ({ ...p, features: [...p.features] })),
  };
}

export const loadPublicSite = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { seedCmsIfEmpty, getSiteCopy, listFaqs, listPublished } = await import("./store");
    await seedCmsIfEmpty();
    const [copy, faqs, articles] = await Promise.all([getSiteCopy(), listFaqs("home"), listPublished()]);
    return {
      copy,
      faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
      articles,
    };
  } catch {
    return {
      copy: fallbackCopy(),
      faqs: FAQ.map((f) => ({ q: f.q, a: f.a })),
      articles: [] as CmsArticle[],
    };
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
        article: {
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
          cover_url: null,
          created_at: post.date,
          updated_at: post.date,
        } satisfies CmsArticle,
        markdown,
      };
    }
    try {
      const { getArticleBySlug, seedCmsIfEmpty } = await import("./store");
      await seedCmsIfEmpty();
      const cms = await getArticleBySlug(data.slug, true);
      if (cms) return { source: "cms" as const, article: cms, markdown: "" };
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
