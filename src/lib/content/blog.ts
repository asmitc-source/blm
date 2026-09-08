export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  minutes: number;
  tags: string[];
  excerpt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-is-business-listing-management",
    title: "What is business listing management?",
    description:
      "Business listing management creates, verifies, and syncs NAP, hours, and categories across Google, Apple, Bing, and directories so every US location stays accurate.",
    date: "2026-03-12",
    author: "Asmit Choudhary",
    minutes: 9,
    tags: ["Fundamentals"],
    excerpt:
      "Business listing management is the ongoing process of creating, verifying, and synchronizing a company's name, address, phone (NAP), hours, and categories across search engines, maps, and online directories so every location stays accurate. BLM does that for Google, Apple, Bing, and the directory network from one workspace.",
  },
  {
    slug: "business-listing-management-cost-2026",
    title: "Business listing management cost in 2026",
    description:
      "Business listing management cost in 2026: Starter $49/mo, Growth $149/mo for up to 25 locations, plus labor and the hidden cost of NAP drift.",
    date: "2026-04-02",
    author: "Asmit Choudhary",
    minutes: 8,
    tags: ["Pricing"],
    excerpt:
      "In 2026, business listing management cost is software plus labor: Starter at $49/month for one location after a 7-day trial, Growth at $149/month for up to 25 locations, Enterprise custom, plus the hidden cost of NAP drift when nobody watches Apple, Bing, and the directory network.",
  },
  {
    slug: "best-business-listing-management-software-2026",
    title: "Best business listing management software in 2026",
    description:
      "Best business listing management software in 2026 scores NAP accuracy, Google/Apple/Bing coverage, duplicate workflow, shared workspace, and clear pricing for US teams.",
    date: "2026-05-18",
    author: "Asmit Choudhary",
    minutes: 11,
    tags: ["Comparisons"],
    excerpt:
      "The best business listing management software in 2026 is the system that catches NAP drift, duplicates, and coverage gaps before customers do, not the longest publisher logo wall. Score it on canonical NAP, verified status across Google, Apple, Bing, and the directory network, duplicate workflow that protects reviews, a shared workspace, and public pricing that matches your location count.",
  },
  {
    slug: "google-business-profile-vs-business-listings",
    title: "Google Business Profile vs. business listings",
    description:
      "Google Business Profile vs business listings: GBP is one listing; business listing management covers Apple, Bing, directories, and the full citation graph.",
    date: "2026-02-20",
    author: "Asmit Choudhary",
    minutes: 8,
    tags: ["Google"],
    excerpt:
      "Business listing management covers more than Google Business Profile alone. GBP is one listing; the full citation graph includes Apple Maps, Bing Places, directories, aggregators, and in-car navigation that US customers still use when platforms Google does not control handle the session.",
  },
  {
    slug: "how-to-find-and-fix-duplicate-business-listings",
    title: "How to find and fix duplicate business listings",
    description:
      "How to find and fix duplicate business listings: find, match, suppress, and protect reviews across Google, Apple, Bing, and the directory network.",
    date: "2026-06-09",
    author: "Asmit Choudhary",
    minutes: 10,
    tags: ["Duplicates"],
    excerpt:
      "Finding and fixing duplicate business listings is a core business listing management job: find, match, suppress, and protect reviews across Google, Apple, Bing, and the directory network. Do not delete first. Choose a survivor, merge or report the rest, then re-scan until aggregators catch up.",
  },
  {
    slug: "business-listing-management-for-agencies",
    title: "Business listing management for agencies",
    description:
      "Business listing management for agencies: onboarding, NAP and duplicate SLAs, CMO-ready reporting, and multi-account workspace for US client books.",
    date: "2026-07-21",
    author: "Asmit Choudhary",
    minutes: 9,
    tags: ["Agencies"],
    excerpt:
      "Business listing management for agencies is an operations product, not a monthly screenshot: defined onboarding, SLAs on duplicates and NAP drift, reporting a CMO can read, and a multi-account workspace that scales past 20 brands across Google, Apple, Bing, and the directory network.",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
