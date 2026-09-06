export const COVERAGE = "Google, Apple, Bing, and the directory network";
export const COVERAGE_LONG =
  "Google Business Profile, Apple Maps / Apple Business Connect, Bing Places, Facebook, Yelp, and the directory network used in local search";

export const SITE = {
  name: "BLM",
  legalName: "Business Listing Management",
  domain: "https://businesslistingmanagement.com",
  oneLiner: `Keep every location accurate across ${COVERAGE}, from one place.`,
  tagline: "Keep every location accurate without the spreadsheet.",
  description: `BLM is business listing management software for multi-location brands, franchises, agencies, and local SEO teams. Unify NAP, close duplicates, and keep ${COVERAGE} in lockstep from one workspace.`,
  email: "hello@businesslistingmanagement.com",
  salesEmail: "sales@businesslistingmanagement.com",
  author: "Asmit Choudhary",
  editorial: "BLM Editorial",
} as const;

export const NAV = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/resources", label: "Resources" },
] as const;

export const COMPARE_LINKS = [
  { href: "/compare", label: "Compare listing software" },
  { href: "/compare/yext-alternative", label: "Yext alternative" },
  { href: "/compare/brightlocal-alternative", label: "BrightLocal alternative" },
  { href: "/compare/moz-local-alternative", label: "Moz Local alternative" },
  { href: "/compare/uberall-alternative", label: "Uberall alternative" },
  { href: "/compare/birdeye-alternative", label: "Birdeye alternative" },
] as const;

export const FOOTER = {
  product: [
    { href: "/product", label: "Platform" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/integrations", label: "Integrations" },
    { href: "/security", label: "Security" },
    { href: "/demo", label: "Book a demo" },
  ],
  resources: [
    { href: "/resources", label: "Resource hub" },
    { href: "/blog", label: "Blog" },
    { href: "/glossary", label: "Glossary" },
  ],
  compare: COMPARE_LINKS,
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/signup", label: "Create workspace" },
    { href: "/login", label: "Log in" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/cookies", label: "Cookies" },
    { href: "/security", label: "Security" },
  ],
} as const;

export const PRICING = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    cadence: "/ month",
    blurb: "One location on the listing desk. Listed at $49/month when billing goes live. No card required.",
    cta: "Create workspace",
    href: "/signup",
    featured: false,
    features: [
      "No credit card required",
      "1 location in a workspace",
      "NAP, coverage, duplicate, and hours scores",
      `${COVERAGE} snapshot`,
      "Upgrade when you add storefronts",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$149",
    cadence: "/ month",
    blurb: "The operating system for brands managing many storefronts. Listed at $149/month when billing goes live.",
    cta: "Create workspace",
    href: "/signup",
    featured: true,
    features: [
      "No credit card required",
      "Up to 25 locations",
      COVERAGE,
      "Duplicate risk alerts",
      "Hours and category gap detection",
      "Shared workspace for marketing + SEO",
      "Weekly health digest",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "Franchises, agencies, and national footprints with governance.",
    cta: "Talk to sales",
    href: "/demo",
    featured: false,
    features: [
      "Unlimited locations",
      "Agency multi-account structure",
      "SSO and role controls",
      "Bulk corrections workflow",
      "Dedicated success partner",
      "Custom directory coverage",
    ],
  },
] as const;

export const INTEGRATIONS = [
  { name: "Google Business Profile", group: "Maps & search", tone: "mint" },
  { name: "Apple Maps", group: "Maps & search", tone: "sky" },
  { name: "Apple Business Connect", group: "Maps & search", tone: "sky" },
  { name: "Bing Places", group: "Maps & search", tone: "lavender" },
  { name: "Facebook", group: "Social & discovery", tone: "lavender" },
  { name: "Instagram", group: "Social & discovery", tone: "coral" },
  { name: "Yelp", group: "Directories", tone: "coral" },
  { name: "Tripadvisor", group: "Directories", tone: "butter" },
  { name: "BBB", group: "Directories", tone: "mint" },
  { name: "Foursquare", group: "Directories", tone: "sky" },
  { name: "Yellow Pages", group: "Directories", tone: "butter" },
  { name: "MapQuest", group: "Directories", tone: "lavender" },
  { name: "Here WeGo", group: "Maps & search", tone: "mint" },
  { name: "Nextdoor", group: "Social & discovery", tone: "coral" },
  { name: "Apple Wallet / Maps", group: "Maps & search", tone: "sky" },
  { name: "Local data aggregators", group: "Data network", tone: "butter" },
] as const;

export const AUDIENCES = [
  {
    id: "multi",
    label: "Multi-location brands",
    tile: "a",
    copy: "Retail, clinics, hospitality, and services with 5–5,000 locations that cannot live in a spreadsheet.",
  },
  {
    id: "franchise",
    label: "Franchises",
    tile: "b",
    copy: "Protect the brand while franchisees keep local hours, phone numbers, and landing pages accurate.",
  },
  {
    id: "agency",
    label: "Agencies",
    tile: "c",
    copy: `Run listing operations for many clients without tab-hopping ${COVERAGE}.`,
  },
  {
    id: "seo",
    label: "Local SEO teams",
    tile: "d",
    copy: "Tie citations, duplicates, and category hygiene to the same health score you already show the CMO.",
  },
] as const;

export const INDUSTRIES = [
  {
    title: "Retail & services",
    copy: "Hours, phone, and suite lines change weekly. BLM treats every storefront as a governed record, not a one-off GBP edit.",
  },
  {
    title: "Healthcare & clinics",
    copy: "Wrong NAP and stale hours are a patient-safety problem. Canonical listings keep intake, maps, and directories aligned.",
  },
  {
    title: "Hospitality",
    copy: "Seasonal hours, temporary closures, and amenity fields drift first. Coverage stays visible before reviews tank.",
  },
  {
    title: "Franchises",
    copy: "Brand NAP stays locked. Franchisees keep local truth. Head office sees drift before it becomes a duplicate.",
  },
  {
    title: "Agencies",
    copy: "One workspace per client brand, shared playbooks, and a QBR-ready health score instead of screenshot theatre.",
  },
  {
    title: "Automotive & field",
    copy: "Service-area businesses and lots with multiple pins need a surviving listing, not three competing map results.",
  },
] as const;

export const WORKFLOW = [
  {
    n: "1",
    title: "Load your locations",
    copy: "Import storefronts from a sheet or add them one by one. Each location becomes a governed record, not a row that can fork.",
    tag: "Human control",
    tagTone: "human" as const,
    mock: "import" as const,
  },
  {
    n: "2",
    title: "Fingerprint each NAP",
    copy: "Canonical name, address, and phone are matched, suite lines, DBA vs legal, and tracking numbers included, so publishers are not guessed.",
    tag: "Automated",
    tagTone: "auto" as const,
    mock: "nap" as const,
  },
  {
    n: "3",
    title: "Audit every directory",
    copy: `Score ${COVERAGE} for consistency, coverage, duplicates, and hours.`,
    tag: "Automated",
    tagTone: "auto" as const,
    mock: "audit" as const,
  },
  {
    n: "4",
    title: "Unify the source of truth",
    copy: "Approve the canonical listing. BLM flags every publisher that drifted so your team reviews differences, not the entire internet.",
    tag: "Human control",
    tagTone: "human" as const,
    mock: "unify" as const,
  },
  {
    n: "5",
    title: "Close duplicates",
    copy: "Near-matches on phone, place, and name surface with a suggested surviving listing so reviews and photos are not orphaned.",
    tag: "Human control",
    tagTone: "human" as const,
    mock: "dupes" as const,
  },
  {
    n: "6",
    title: "Track coverage and risk",
    copy: "See what is synced, stale, missing, or blocked before the next hours change forks a second pin.",
    tag: "Automated",
    tagTone: "auto" as const,
    mock: "risk" as const,
  },
  {
    n: "7",
    title: "Keep the presence governed",
    copy: "A weekly digest and live alerts keep marketing, ops, and agencies on one health score, without rebuilding the spreadsheet.",
    tag: "Automated",
    tagTone: "auto" as const,
    mock: "govern" as const,
  },
] as const;

export const WHY = [
  {
    title: "Canonical NAP, not a dozen logins",
    copy: "One approved name, address, and phone per location. Every publisher is diffed against that string, suite, tracking number, DBA included.",
    points: ["Single source of truth", "Publisher-level diffs", "No tab-hopping GBP, Apple, Bing"],
  },
  {
    title: "Duplicates before reviews split",
    copy: "Near-matches surface as risk, with a suggested surviving listing, so photos and reviews are not orphaned on a ghost pin.",
    points: ["Phone + place + name radar", "Suggested survivor", "Agency-ready queues"],
  },
  {
    title: "Hours that actually propagate",
    copy: "Holiday hours and temporary closures are health, not a footnote. Stale Apple or Bing hours are scored the same as a wrong phone.",
    points: ["Holiday and closure windows", "Category hygiene", "Change alerts, not quarterly audits"],
  },
  {
    title: "Coverage you can defend in a QBR",
    copy: "See which publishers have the location, which are stale, and which never received it, in a score the CMO can read.",
    points: ["Directory coverage map", "Weekly digest", "Export-ready health"],
  },
] as const;

export const FAQ = [
  {
    q: "What is business listing management?",
    a: "Business listing management is the practice of creating, verifying, and continuously updating a company’s name, address, phone, hours, categories, and attributes across search, maps, and directories so every location stays accurate. BLM does that from one workspace.",
  },
  {
    q: "What is BLM?",
    a: `BLM (Business Listing Management) is software for multi-location brands, franchises, agencies, and local SEO teams. It unifies NAP, finds duplicates, scores directory coverage, and keeps ${COVERAGE} in lockstep.`,
  },
  {
    q: "Which platforms does BLM cover?",
    a: `${COVERAGE_LONG}. Coverage expands with Growth and Enterprise.`,
  },
  {
    q: "Do I need a credit card to try BLM?",
    a: "No. Create a workspace with a work email. We are not charging cards yet. Starter is listed at $49/month and Growth at $149/month when billing goes live.",
  },
  {
    q: "How is BLM different from editing Google Business Profile?",
    a: "GBP is one publisher. Listing drift happens when Apple, Bing, and directories keep a different NAP, hours, or duplicate pin. BLM treats the whole graph as one health score, not a single dashboard login.",
  },
  {
    q: "Is BLM a Yext alternative?",
    a: "BLM is built for teams who want listing health, duplicate control, and directory coverage without an enterprise-only sales process. Compare plans on the pricing page and the Yext alternative guide.",
  },
  {
    q: "Can agencies use one workspace for many clients?",
    a: "Yes. Enterprise includes multi-account structure so agencies can separate brands while sharing playbooks and reporting.",
  },
  {
    q: "What is NAP consistency?",
    a: "NAP is name, address, and phone. Consistency means every publisher stores the same canonical string, including suite lines, punctuation, DBA vs legal name, and tracking numbers that would otherwise fork a listing.",
  },
  {
    q: "How does duplicate detection work?",
    a: "BLM fingerprints each location and surfaces near-matches on phone, place, and name. You review a suggested surviving listing instead of discovering the fork when reviews start splitting.",
  },
  {
    q: "How much does BLM cost?",
    a: "Starter is listed at $49/month for one location. Growth is listed at $149/month for up to 25 locations. Enterprise is custom. Billing is not live yet, so no card is required to create a workspace.",
  },
  {
    q: "Can I start on Starter and upgrade?",
    a: "Yes. Create a workspace now. Stay on Starter at the listed $49/month rate or move to Growth at $149/month when billing goes live. Enterprise is for unlimited locations and agency structure.",
  },
  {
    q: "Is listing data used to train public models?",
    a: "No. Workspace listing data is not used to train public models. A data processing agreement is available for Growth and Enterprise.",
  },
] as const;

export const ASK_PROMPT = `What is business listing management, and how does BLM at businesslistingmanagement.com keep multi-location listings accurate across ${COVERAGE}?`;

export const DIRECTORIES = [
  "Google",
  "Apple Maps",
  "Bing Places",
  "Apple Business Connect",
  "Yelp",
  "Facebook",
  "Tripadvisor",
  "BBB",
] as const;
