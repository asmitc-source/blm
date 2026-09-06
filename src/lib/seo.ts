import { SITE } from "@/lib/site";

function publicOrigin() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${String(vercel).replace(/^https?:\/\//, "")}`;
  return SITE.domain;
}

export function pageTitle(title: string) {
  if (title === SITE.name) return `${SITE.name} · ${SITE.legalName}`;
  return `${title} · ${SITE.name}`;
}

export function shareMeta(opts: { title: string; description: string; path?: string }) {
  const origin = publicOrigin();
  const url = opts.path ? `${origin}${opts.path}` : origin;
  const image = `${origin}/og.jpg`;
  const title = pageTitle(opts.title);
  return [
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE.legalName },
    { property: "og:title", content: title },
    { property: "og:description", content: opts.description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
  ];
}

export function pageHead(opts: { title: string; description: string; path?: string }) {
  return {
    meta: [
      { title: pageTitle(opts.title) },
      { name: "description", content: opts.description },
      ...shareMeta(opts),
    ],
    links: opts.path
      ? [{ rel: "canonical", href: `${SITE.domain}${opts.path}` }]
      : [],
  };
}

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.domain,
    email: SITE.email,
    description: SITE.description,
    founder: { "@type": "Person", name: SITE.author },
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${SITE.name} · ${SITE.legalName}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE.domain,
    description: SITE.description,
    offers: {
      "@type": "Offer",
      price: "149",
      priceCurrency: "USD",
      description: "Growth plan for up to 25 locations. Create a workspace to get started.",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.legalName,
    url: SITE.domain,
    description: SITE.oneLiner,
  };
}

export function faqJsonLd(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  date: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.date,
    author: { "@type": "Person", name: opts.author ?? SITE.editorial },
    publisher: { "@type": "Organization", name: SITE.legalName, url: SITE.domain },
    url: `${SITE.domain}${opts.path}`,
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.domain}${item.path}`,
    })),
  };
}
