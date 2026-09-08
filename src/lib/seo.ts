import { SITE } from "@/lib/site";

export const OG_IMAGE_PATH = "/og.png";
export const OG_IMAGE_WIDTH = "1280";
export const OG_IMAGE_HEIGHT = "640";

export function publicOrigin() {
  const explicit = process.env.SITE_URL || process.env.VITE_SITE_URL;
  if (explicit) return String(explicit).replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${String(vercel).replace(/^https?:\/\//, "")}`;
  return SITE.domain;
}

export function defaultShareImage(origin = publicOrigin()) {
  return `${origin}${OG_IMAGE_PATH}`;
}

export function pageTitle(title: string) {
  if (title === SITE.name) return `${SITE.legalName} · ${SITE.name}`;
  return `${title} · ${SITE.name}`;
}

export function shareMeta(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  /** Defaults to website; blog posts should pass "article". */
  type?: string;
  imageAlt?: string;
}) {
  const origin = publicOrigin();
  const url = opts.path ? `${origin}${opts.path}` : origin;
  const image = opts.image ?? defaultShareImage(origin);
  const title = pageTitle(opts.title);
  const imageAlt = (opts.imageAlt || "").trim() || `${SITE.name}: ${SITE.tagline}`;
  return [
    { property: "og:type", content: opts.type || "website" },
    { property: "og:site_name", content: SITE.legalName },
    { property: "og:title", content: title },
    { property: "og:description", content: opts.description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: OG_IMAGE_WIDTH },
    { property: "og:image:height", content: OG_IMAGE_HEIGHT },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
  ];
}

export function pageHead(opts: {
  title: string;
  description: string;
  path?: string;
  /** Absolute canonical override when an article sets canonical_url. */
  canonical?: string;
  /** Optional robots directive, e.g. "noindex, follow" for auth/conversion shells. */
  robots?: string;
  /** Absolute HTTPS share image; defaults to site OG banner. */
  image?: string;
  type?: string;
  imageAlt?: string;
}) {
  const description = (opts.description || "").trim();
  const canonical =
    (opts.canonical || "").trim() ||
    (opts.path ? `${SITE.domain}${opts.path}` : "");
  const image = opts.image || defaultShareImage();
  return {
    meta: [
      { title: pageTitle(opts.title) },
      { name: "description", content: description },
      ...(opts.robots ? [{ name: "robots", content: opts.robots }] : []),
      ...shareMeta({ ...opts, image }),
    ],
    links: [
      { rel: "image_src", href: image },
      ...(canonical ? [{ rel: "canonical", href: canonical }] : []),
    ],
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
    logo: `${SITE.domain}/icon-512.png`,
    image: defaultShareImage(),
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.legalName,
    alternateName: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE.domain,
    description: SITE.description,
    offers: {
      "@type": "Offer",
      price: "149",
      priceCurrency: "USD",
      description: "Growth plan for up to 25 locations. Start a free trial or book a call.",
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
  image?: string;
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
    image: opts.image || defaultShareImage(),
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

export function definedTermJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inDefinedTermSet: `${SITE.domain}/glossary`,
  };
}

export function definedTermSetJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: opts.name,
    description: opts.description,
    url: opts.url,
  };
}

