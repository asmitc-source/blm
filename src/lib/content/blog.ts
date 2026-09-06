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
      "A direct definition of business listing management, why NAP consistency matters, and how multi-location brands keep Google, Apple, Bing, and directories accurate.",
    date: "2026-03-12",
    author: "Asmit Choudhary",
    minutes: 9,
    tags: ["Fundamentals"],
    excerpt:
      "Business listing management is how a company keeps every location’s name, address, phone, hours, and categories accurate across maps and directories.",
  },
  {
    slug: "business-listing-management-cost-2026",
    title: "Business listing management cost in 2026",
    description:
      "What teams actually pay for listing management in 2026: Starter after you create a workspace, per-location SaaS, enterprise platforms, and the hidden cost of DIY citations.",
    date: "2026-04-02",
    author: "BLM Editorial",
    minutes: 8,
    tags: ["Pricing"],
    excerpt:
      "Listing software in 2026 ranges from a workspace you create to six-figure enterprise contracts. The real cost is the locations you leave unsynced.",
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
      "The best listing platform is the one that catches NAP drift, duplicates, and coverage gaps before customers do, not the one with the longest publisher logo wall.",
  },
  {
    slug: "google-business-profile-vs-business-listings",
    title: "Google Business Profile vs. business listings",
    description:
      "GBP is one listing. Business listings are the whole citation graph. Why managing only Google leaves Apple, Bing, and directories out of date.",
    date: "2026-02-20",
    author: "BLM Editorial",
    minutes: 8,
    tags: ["Google"],
    excerpt:
      "Google Business Profile is necessary and not sufficient. Customers still search Apple Maps, Bing, Yelp, and in-car navigation.",
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
      "Duplicates split reviews, confuse hours, and suppress the map pack. Here is how operators actually find and close them.",
  },
  {
    slug: "business-listing-management-for-agencies",
    title: "Business listing management for agencies",
    description:
      "How agencies productize listing management: onboarding, reporting, duplicate SLAs, and a workspace model that scales past 20 clients.",
    date: "2026-07-21",
    author: "BLM Editorial",
    minutes: 9,
    tags: ["Agencies"],
    excerpt:
      "Agencies that treat listings as a monthly screenshot lose clients. Treat it as an operations product instead.",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
