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
      "Business listing management defined for US teams: the ongoing process of creating, verifying, and synchronizing name, address, phone (NAP), hours, and categories across search, maps, and directories so every location stays accurate on Google, Apple, Bing, and the directory network.",
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
      "What teams actually pay for listing management in 2026: Starter after you create a workspace, per-location SaaS, enterprise platforms, and the hidden cost of DIY citations.",
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
      "How to evaluate listing management software in 2026: coverage, duplicates, workflow, agency needs, and where BLM fits versus Yext and BrightLocal.",
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
      "GBP is one listing. Business listings are the whole citation graph. Why managing only Google leaves Apple, Bing, and directories out of date.",
    date: "2026-02-20",
    author: "Asmit Choudhary",
    minutes: 8,
    tags: ["Google"],
    excerpt:
      "Google Business Profile is one listing. Business listings are the full citation graph: Apple Maps, Bing Places, Facebook, Yelp, aggregators, in-car navigation, and the directory network underneath. Managing only GBP is necessary and not sufficient when US customers still search and navigate on platforms Google does not control.",
  },
  {
    slug: "how-to-find-and-fix-duplicate-business-listings",
    title: "How to find and fix duplicate business listings",
    description:
      "A practical playbook for finding duplicate listings on Google, Apple, Bing, and directories, and suppressing them without wrecking reviews.",
    date: "2026-06-09",
    author: "Asmit Choudhary",
    minutes: 10,
    tags: ["Duplicates"],
    excerpt:
      "Duplicate business listings split reviews, confuse hours, and suppress the map pack. The operator playbook is find, match, suppress, and protect reviews, in that order, across Google, Apple, Bing, and the directory network. Do not delete first. Do not create a \"clean\" new profile and hope the old one dies. Choose a survivor, merge or report the rest, then re-scan until aggregators catch up.",
  },
  {
    slug: "business-listing-management-for-agencies",
    title: "Business listing management for agencies",
    description:
      "How agencies productize listing management: onboarding, reporting, duplicate SLAs, and a workspace model that scales past 20 clients.",
    date: "2026-07-21",
    author: "Asmit Choudhary",
    minutes: 9,
    tags: ["Agencies"],
    excerpt:
      "Agencies that treat listings as a monthly screenshot lose clients. Treat listing management as an operations product: defined onboarding, SLAs on duplicates and NAP drift, reporting a CMO can read, and a multi-account workspace that scales past 20 brands across Google, Apple, Bing, and the directory network.",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
