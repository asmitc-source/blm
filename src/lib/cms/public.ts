import { createServerFn } from "@tanstack/react-start";
import { BLOG_POSTS, type BlogPost } from "@/lib/content/blog";
import { POST_BODY } from "@/lib/content/posts";
import { FAQ, PRICING } from "@/lib/site";
import { markdownToHtml } from "./convert";
import type { CmsArticle, SiteCopy } from "./types";

function fallbackCopy(): SiteCopy {
  return {
    home: {
      lede: "Go from messy citations to a governed presence. Unify NAP, close duplicates, and keep Google, Apple, Bing, and directories in lockstep from one workspace.",
      trialLine: "7-day free trial. Then Starter at $49/month or Growth at $149/month.",
    },
    pricingTitle: "Starter $49. Growth $149. Seven days free.",
    pricingLede: "Start a free trial of Starter or Growth. After seven days, pick the plan that matches the footprint.",
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
    try {
      const { getArticleBySlug, seedCmsIfEmpty } = await import("./store");
      await seedCmsIfEmpty();
      const cms = await getArticleBySlug(data.slug, true);
      if (cms) return { source: "cms" as const, article: cms, markdown: "" };
    } catch {
      /* fall through to bundled posts */
    }
    const post = BLOG_POSTS.find((p) => p.slug === data.slug);
    const markdown = POST_BODY[data.slug];
    if (!post || !markdown) return null;
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
