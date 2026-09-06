import { useState, createContext, useContext } from "react";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/logo";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { LockIn } from "@/components/home/lock-in";
import { ProductProof } from "@/components/home/product-proof";
import { Reveal } from "@/components/home/reveal";
import { RotateWord } from "@/components/home/rotate-word";
import { Workflow } from "@/components/home/workflow";
import {
  ChatGptMark,
  ClaudeMark,
  DIRECTORY_MARKS,
  PerplexityMark,
} from "@/components/brand-marks";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { BLOG_POSTS } from "@/lib/content/blog";
import { ASK_PROMPT, AUDIENCES, FAQ, INDUSTRIES, WHY } from "@/lib/site";
import { faqJsonLd, orgJsonLd, softwareJsonLd, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const ask = encodeURIComponent(ASK_PROMPT);

type HomeCopy = { lede: string; trialLine: string; faqs: { q: string; a: string }[] };
const CopyCtx = createContext<HomeCopy | null>(null);

export function HomePage({ copy }: { copy?: HomeCopy }) {
  return (
    <CopyCtx.Provider value={copy ?? null}>
    <main>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={softwareJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Hero />
      <QuickAnswer />
      <LockIn />
      <ProductProof />
      <Workflow />
      <WhySwitch />
      <Industries />
      <FaqSection />
      <Resources />
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
              "Go from messy citations to a governed presence. Unify NAP, close duplicates, and keep Google, Apple, Bing, and directories in lockstep from one workspace."}
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "160ms" }}
          >
            <Button asChild size="lg">
              <Link to="/signup">Create workspace</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <p className="animate-fade-up mt-4 text-sm text-muted" style={{ animationDelay: "220ms" }}>
            {copy?.trialLine ?? "7-day free trial. Then Starter at $49/month or Growth at $149/month."}
          </p>
          <Link
            to="/demo"
            className="animate-fade-up mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            style={{ animationDelay: "280ms" }}
          >
            Or book a walkthrough on a real footprint <ArrowRight className="size-4" />
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
          className="glass-chip inline-flex h-11 items-center gap-2 px-3.5 text-sm font-semibold text-ink"
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
            Business listing management is the practice of creating, verifying, and continuously updating a company’s name, address, phone, hours, and categories across search, maps, and directories so every location stays accurate. BLM does that for Google, Apple, Bing, and the directory network from one workspace.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Best for multi-location brands, franchises, agencies, and local SEO teams.",
              "Built for NAP consistency, duplicate control, and directory coverage you can inspect.",
              "Works across Google, Apple, Bing, and the directory network. Not a single publisher login.",
              "Create a workspace, then Growth and Enterprise when governance and SSO matter.",
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
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-hover"
          >
            Read the full definition <ArrowRight className="size-4" />
          </Link>
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
              s: 61,
              blm: 83,
            },
            {
              t: "Versus Yext",
              d: "Listing health and duplicate control without an enterprise-only sales process.",
              extra: "Health, duplicates, and coverage without a six-figure onboarding.",
              s: 77,
              blm: 90,
            },
            {
              t: "Versus spreadsheets",
              d: "A health score that updates when hours change. Not a quarterly export.",
              extra: "Hours change on Tuesday. The sheet is still last quarter.",
              s: 42,
              blm: 88,
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={120 + i * 80} className="h-full">
              <VersusCube card={c} />
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-faint">
          Median NAP completeness across a 12-storefront sample over the last 30 days. Not a promise for every brand.
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
  card: { t: string; d: string; extra: string; s: number; blm: number };
}) {
  const recovered = card.blm - card.s;

  return (
    <article
      className="versus-card industry-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-paper p-5 pb-9 hairline"
      tabIndex={0}
    >
      <LogoMark className="industry-seal size-8" />
      <h3 className="pr-10 font-semibold text-ink">{card.t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{card.d}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{card.extra}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
        {recovered} points ahead on a 12-store sample
      </p>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          <span>Their coverage</span>
          <span>{card.s}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand">
          <span className="score-fill block h-full rounded-full bg-brand/50" style={{ width: `${card.s}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          <span>BLM</span>
          <span>{card.blm}%</span>
        </div>
        <div className="versus-blm mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-soft">
          <span className="score-fill block h-full rounded-full bg-brand" style={{ width: `${card.blm}%` }} />
        </div>
      </div>
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
    <button type="button" data-tile={tile} className="audience-chip">
      <span className="block text-sm font-semibold">{label}</span>
      <span className="mt-1.5 block text-sm font-normal leading-relaxed">{copy}</span>
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
  return (
    <section className="page-wrap py-16 sm:py-24" aria-labelledby="resources-title">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Learn more</p>
          <h2 id="resources-title" className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Learn more about listing management
          </h2>
        </div>
        <Link to="/resources" className="hidden text-sm font-semibold text-ink-soft hover:text-ink sm:inline">
          All resources
        </Link>
      </Reveal>
      <div className="mt-8 grid items-stretch gap-4 md:grid-cols-3">
        {BLOG_POSTS.slice(0, 6).map((post, i) => (
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
        <div className="cta-band relative overflow-hidden rounded-3xl border border-line px-6 py-14 text-center sm:px-12">
          <span className="live-bar absolute inset-x-0 top-0 h-0.5" aria-hidden="true" />
          <LogoMark className="pointer-events-none absolute -right-4 -top-4 size-28 opacity-80" />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Replace spreadsheet listing ops with a presence your team can govern.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-ink-soft">
            Start a 7-day free trial. See how it works. Book a demo if you already manage a national footprint.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Create workspace</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/demo">Book a demo</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
