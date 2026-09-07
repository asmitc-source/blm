import { useState, createContext, useContext } from "react";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/logo";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { LockIn } from "@/components/home/lock-in";
import { ProductProof } from "@/components/home/product-proof";
import { Reveal } from "@/components/home/reveal";
import { RotateWord } from "@/components/home/rotate-word";
import { Workflow } from "@/components/home/workflow";
import { NewsletterSection } from "@/components/home/newsletter-section";
import {
  ChatGptMark,
  ClaudeMark,
  DIRECTORY_MARKS,
  PerplexityMark,
} from "@/components/brand-marks";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { BLOG_POSTS } from "@/lib/content/blog";
import { toCard } from "@/lib/cms/public";
import type { CmsArticle } from "@/lib/cms/types";
import { ASK_PROMPT, AUDIENCES, COVERAGE, FAQ, INDUSTRIES, SITE, WHY } from "@/lib/site";
import { definedTermJsonLd, faqJsonLd, orgJsonLd, softwareJsonLd, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const ask = encodeURIComponent(ASK_PROMPT);

type HomeCopy = { lede: string; trialLine: string; faqs: { q: string; a: string }[]; articles?: CmsArticle[] };
const CopyCtx = createContext<HomeCopy | null>(null);

export function HomePage({ copy }: { copy?: HomeCopy }) {
  return (
    <CopyCtx.Provider value={copy ?? null}>
    <main>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={softwareJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={definedTermJsonLd({
          name: "Business listing management",
          description:
            "Business listing management is the ongoing process of creating, verifying, and synchronizing a company's name, address, phone (NAP), hours, and categories across search engines, maps, and online directories so every location stays accurate.",
          url: `${SITE.domain}/blog/what-is-business-listing-management`,
        })}
      />
      <Hero />
      <QuickAnswer />
      <LockIn />
      <ProductProof />
      <Workflow />
      <WhySwitch />
      <Industries />
      <FaqSection />
      <Resources />
      <NewsletterSection />
      <FinalCta />
    </main>
    </CopyCtx.Provider>
  );
}

function Hero() {
  const copy = useContext(CopyCtx);
  return (
    <section className="relative">
      <div className="page-wrap pb-12 pt-16 sm:pt-20 lg:pb-16 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-up mx-auto font-display text-[2.2rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12] [text-wrap:unset]">
            <span className="block">Keep every location</span>
            <span className="mt-1 block">
              <RotateWord />
            </span>
            <span className="mt-1 block">without the spreadsheet.</span>
          </h1>
          <p
            id="home-hero-description"
            className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "90ms" }}
          >
            {copy?.lede ??
              `Business listing management without the spreadsheet: unify NAP, close duplicates, and keep ${COVERAGE} in lockstep from one BLM workspace.`}
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "160ms" }}
          >
            <Button asChild size="lg">
              <Link to="/trial">Start free trial</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <Link
            to="/book"
            className="group animate-fade-up mt-3 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline focus-visible:text-ink focus-visible:underline"
            style={{ animationDelay: "280ms" }}
          >
            Or book a call about your listings{" "}
            <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </Link>
          <AskRow />
        </div>
      </div>
      <DirectoryRail />
    </section>
  );
}

function AskRow() {
  const links = [
    { href: `https://chatgpt.com/?q=${ask}`, label: "Ask ChatGPT", Mark: ChatGptMark },
    { href: `https://claude.ai/new?q=${ask}`, label: "Ask Claude", Mark: ClaudeMark },
    { href: `https://www.perplexity.ai/search/new?q=${ask}`, label: "Ask Perplexity", Mark: PerplexityMark },
  ];
  return (
    <div
      className="animate-fade-up mt-8 flex flex-wrap justify-center gap-2"
      style={{ animationDelay: "340ms" }}
    >
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="glass-chip inline-flex h-11 min-h-11 min-w-[10.5rem] items-center justify-center gap-2 px-3.5 text-sm font-semibold text-ink"
        >
          <l.Mark label={false} className="[&_svg]:size-[1.125rem]" />
          {l.label}
        </a>
      ))}
    </div>
  );
}

function DirectoryRail() {
  const copies = [0, 1] as const;
  const sequence = [...DIRECTORY_MARKS, ...DIRECTORY_MARKS];
  return (
    <div className="border-y border-line bg-cream py-5" aria-label="Publishers BLM covers">

      <div className="overflow-hidden">
        <div className="marquee-track">
          {copies.map((copy) => (
            <div key={copy} className="marquee-group">
              {sequence.map((Mark, i) => (
                <Mark key={`${copy}-${i}`} className="shrink-0" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickAnswer() {
  return (
    <section className="page-wrap py-12 sm:py-16" aria-labelledby="quick-answer-title">
      <Reveal>
        <div className="rounded-3xl border border-line bg-cream px-5 py-8 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Quick answer</p>
          <h2 id="quick-answer-title" className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            What is business listing management?
          </h2>
          <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-ink-soft">
            Business listing management is the ongoing process of creating, verifying, and synchronizing a company’s name, address, phone (NAP), hours, and categories across search engines, maps, and online directories so every location stays accurate. BLM does that for {COVERAGE} from one workspace.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Best for multi-location brands, franchises, agencies, and local SEO teams.",
              "Built for NAP consistency, duplicate control, and directory coverage you can inspect.",
              `Works across ${COVERAGE}. Not a single publisher login.`,
              "Start a free trial, then Growth and Enterprise when governance and SSO matter.",
            ].map((item, i) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
            <Link
              to="/blog/$slug"
              params={{ slug: "what-is-business-listing-management" }}
              className="inline-flex cursor-pointer items-center gap-1 text-brand underline-offset-2 hover:text-brand-hover hover:underline focus-visible:underline"
            >
              Full definition <ArrowRight className="size-4" />
            </Link>
            <Link to="/compare" className="inline-flex cursor-pointer items-center gap-1 text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline focus-visible:text-ink focus-visible:underline">
              Compare listing software
            </Link>
            <Link to="/pricing" className="inline-flex cursor-pointer items-center gap-1 text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline focus-visible:text-ink focus-visible:underline">
              Business listing management cost
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "best-business-listing-management-software-2026" }}
              className="inline-flex cursor-pointer items-center gap-1 text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline focus-visible:text-ink focus-visible:underline"
            >
              Best software guide
            </Link>
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
            Sources checked 2026-09-06:{" "}
            <a className="underline-offset-2 hover:underline" href="https://support.google.com/business/" target="_blank" rel="noreferrer">
              Google Business Profile Help
            </a>
            ,{" "}
            <a className="underline-offset-2 hover:underline" href="https://businessconnect.apple.com/" target="_blank" rel="noreferrer">
              Apple Business Connect
            </a>
            ,{" "}
            <a className="underline-offset-2 hover:underline" href="https://www.bingplaces.com/" target="_blank" rel="noreferrer">
              Bing Places for Business
            </a>
            ,{" "}
            <a className="underline-offset-2 hover:underline" href="https://moz.com/learn/seo/local" target="_blank" rel="noreferrer">
              Moz Local SEO
            </a>
            . Publisher UIs move; confirm the live help article before you file a change.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function WhySwitch() {
  const [open, setOpen] = useState(0);

  return (
    <section className="border-y border-line bg-cream py-16 sm:py-24">
      <div className="page-wrap">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Why teams switch</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            More credible than another gray dashboard
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            BLM is designed for teams that need listings to be fast to fix, reviewable, and ready for a QBR. Not another login to Google.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {WHY.map((card, i) => (
            <Reveal key={card.title} delay={i * 70} className="h-full">
              <article
                className={cn(
                  "h-full rounded-2xl border bg-paper p-6 transition-[border-color,box-shadow,transform] duration-300",
                  open === i ? "border-brand shadow-[var(--shadow-soft)]" : "border-line hover:border-line-strong",
                )}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">0{i + 1}</p>
                  <span className={cn("h-1 w-8 rounded-full", open === i ? "live-bar" : "bg-sand")} />
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{card.copy}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-ink-soft">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-3">
          {[
            {
              t: "Versus Google-only",
              d: "GBP is one publisher. Drift lives on Apple, Bing, and directories you never opened.",
              extra: "Apple Maps, Bing Places, and Yelp still serve last week’s NAP.",
            },
            {
              t: "Versus Yext",
              d: "Listing health and duplicate control without an enterprise-only sales process.",
              extra: "Health, duplicates, and coverage without a six-figure onboarding.",
            },
            {
              t: "Versus spreadsheets",
              d: "A health score that updates when hours change. Not a quarterly export.",
              extra: "Hours change on Tuesday. The sheet is still last quarter.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={120 + i * 80} className="h-full">
              <VersusCube card={c} />
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-faint">
          Illustrative contrasts, not a measured win rate or a promise for every brand.
        </p>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section id="industries" className="page-wrap py-16 sm:py-24" aria-labelledby="industries-title">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Built for operators</p>
        <h2 id="industries-title" className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for teams that need speed and scrutiny
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((item) => (
          <article key={item.title} className="industry-card relative h-full overflow-hidden rounded-2xl bg-cream p-5 pb-9 hairline">
            <LogoMark className="industry-seal size-9" />
            <div className="relative pr-12">
              <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
            </div>
            <div className="industry-tiles" aria-hidden="true">
              <span className="flex-1 bg-[var(--tile-a)]" />
              <span className="flex-1 bg-[var(--tile-b)]" />
              <span className="flex-1 bg-[var(--tile-c)]" />
              <span className="flex-1 bg-[var(--tile-d)]" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((a) => (
          <AudienceChip key={a.id} label={a.label} copy={a.copy} tile={a.tile} />
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const copy = useContext(CopyCtx);
  const items = copy?.faqs?.length ? copy.faqs : FAQ;
  return (
    <section className="border-y border-line bg-cream py-16 sm:py-24" aria-labelledby="faq-title">
      <div className="page-wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">FAQ</p>
          <h2 id="faq-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Common questions
          </h2>
          <p className="mt-4 text-ink-soft">Citation-ready answers for buyers, analysts, and models.</p>
        </Reveal>
        <div>
          {items.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VersusCube({
  card,
}: {
  card: { t: string; d: string; extra: string };
}) {
  return (
    <article
      className="versus-card industry-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper p-5 pb-9 hairline"
      tabIndex={0}
    >
      <LogoMark className="industry-seal size-8" />
      <h3 className="pr-10 font-semibold text-ink">{card.t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{card.d}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{card.extra}</p>
      <div className="industry-tiles" aria-hidden="true">
        <span className="flex-1 bg-[var(--tile-a)]" />
        <span className="flex-1 bg-[var(--tile-b)]" />
        <span className="flex-1 bg-[var(--tile-c)]" />
        <span className="flex-1 bg-[var(--tile-d)]" />
      </div>
    </article>
  );
}

function AudienceChip({
  label,
  copy,
  tile,
}: {
  label: string;
  copy: string;
  tile: "a" | "b" | "c" | "d";
}) {
  return (
    <button type="button" data-tile={tile} className="audience-chip min-h-[10.5rem]">
      <span className="block text-sm font-semibold">{label}</span>
      <span className="mt-1.5 block line-clamp-4 text-sm font-normal leading-relaxed">{copy}</span>
    </button>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-ink">{q}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <p className="overflow-hidden text-sm leading-relaxed text-ink-soft">
          <span className="block pb-5">{a}</span>
        </p>
      </div>
    </div>
  );
}

function Resources() {
  const copy = useContext(CopyCtx);
  const cms = (copy?.articles ?? [])
    .filter((a) => a.status === "published" && a.kind === "article")
    .slice()
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate) return byDate;
      return (b.updated_at || "").localeCompare(a.updated_at || "");
    });
  const cards =
    cms.length > 0
      ? cms.slice(0, 6).map(toCard)
      : BLOG_POSTS.slice(0, 6).map(toCard);
  // If CMS has some but fewer than 6, fill from bundled posts not already listed.
  if (cms.length > 0 && cards.length < 6) {
    const have = new Set(cards.map((c) => c.slug));
    for (const post of BLOG_POSTS) {
      if (cards.length >= 6) break;
      if (have.has(post.slug)) continue;
      cards.push(toCard(post));
      have.add(post.slug);
    }
  }

  return (
    <section className="page-wrap py-16 sm:py-24" aria-labelledby="resources-title">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Learn more</p>
          <h2 id="resources-title" className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Learn more about business listing management
          </h2>
        </div>
        <Link to="/resources" className="hidden cursor-pointer text-sm font-semibold text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline focus-visible:text-ink focus-visible:underline sm:inline">
          All resources
        </Link>
      </Reveal>
      <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
        {cards.map((post, i) => (
          <Reveal key={post.slug} delay={i * 60} className="h-full">
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="industry-card group relative flex h-full flex-col overflow-hidden rounded-2xl bg-cream p-5 pb-10 hairline"
            >
              <LogoMark className="industry-seal size-8" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{post.tags[0]}</p>
              <h3 className="mt-2 pr-10 font-display text-xl font-semibold text-ink">{post.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                Read article <ArrowRight className="size-4" />
              </span>
              <div className="industry-tiles" aria-hidden="true">
                <span className="flex-1 bg-[var(--tile-a)]" />
                <span className="flex-1 bg-[var(--tile-b)]" />
                <span className="flex-1 bg-[var(--tile-c)]" />
                <span className="flex-1 bg-[var(--tile-d)]" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function FinalCta() {
  return (
    <section className="page-wrap pb-20">
      <Reveal>
        <div className="cta-band relative overflow-hidden rounded-3xl border-x border-b border-line px-6 py-14 text-center sm:px-12">
          <LogoMark className="pointer-events-none absolute -right-4 -top-4 size-28 opacity-80" />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Replace spreadsheet listing ops with a presence your team can govern.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-ink-soft">
            Tell us about your locations and we will point you to the right next step.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
