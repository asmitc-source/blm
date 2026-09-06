export type ArticleKind = "article" | "comparison" | "resource";
export type ArticleStatus = "draft" | "published";

export type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  answer: string;
  description: string;
  body_html: string;
  author: string;
  tags: string[];
  kind: ArticleKind;
  status: ArticleStatus;
  date: string;
  minutes: number;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CmsFaq = {
  id: string;
  question: string;
  answer: string;
  page: string;
  sort: number;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  href: string;
  featured: boolean;
  features: string[];
};

export type HomeCopy = {
  lede: string;
  trialLine: string;
};

export type SiteCopy = {
  home: HomeCopy;
  pricingTitle: string;
  pricingLede: string;
  plans: PricingPlan[];
};

export type CmsAdmin = {
  id: string;
  username: string;
};
