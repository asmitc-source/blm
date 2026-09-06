import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Crosshair, Scale, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { pageHead, breadcrumbJsonLd, orgJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { COVERAGE, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About BLM — business listing management",
      description:
        "About BLM: independent business listing management software founded by Asmit Choudhary. Keep every location accurate across Google, Apple, Bing, and the directory network.",
      path: "/about",
    }),
  component: AboutPage,
});

const BELIEFS = [
  {
    title: "Accurate listings are infrastructure",
    copy: "NAP, hours, and categories are not a quarterly cleanup. They are how customers find the right door — and how map packs stay honest.",
    Icon: Crosshair,
    soft: "bg-coral-soft text-coral",
  },
  {
    title: "Cite primary sources",
    copy: "We would rather link a publisher rule or a field guide than invent certainty. Reviews and comparisons stay equal-weakness on purpose.",
    Icon: BookOpen,
    soft: "bg-sky-soft text-sky",
  },
  {
    title: "Honest tradeoffs over theater",
    copy: "Prefer clear ceilings and real gaps over “best of” lists. Ship the definition of business listing management so a human or an LLM can quote it without guessing.",
    Icon: Scale,
    soft: "bg-butter-soft text-butter",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Audit what is wrong",
    copy: "Fingerprint each location, then score publishers for NAP drift, missing coverage, duplicates, and stale hours.",
  },
  {
    n: "02",
    title: "Show the ceiling after you fix it",
    copy: "A health score that moves when you unify the canonical record — not a screenshot of one Google login.",
  },
  {
    n: "03",
    title: "Keep the footprint consistent",
    copy: `Govern ${COVERAGE} from one workspace so the next hours change does not fork a second pin.`,
  },
] as const;

const FACTS = [
  { label: "Status", value: "Independent product" },
  { label: "Category", value: "Business listing management" },
  { label: "Built for", value: "Multi-location, franchise, agency, local SEO" },
  { label: "Access", value: "Free trial · early access" },
] as const;

function AboutPage() {
  return (
    <SiteShell>
      <JsonLd data={orgJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <main>
        <Hero />
        <WhyExist />
        <HowWeWork />
        <Independence />
        <Founder />
        <FactsStrip />
        <ClosingCta />
      </main>
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="hero-wash relative overflow-hidden border-b border-line">
      <div
        className="pointer-events-none absolute -right-8 top-10 hidden gap-2 sm:flex lg:right-16 lg:top-16"
        aria-hidden="true"
      >
        <span className="size-14 rounded-2xl bg-[var(--tile-a)] opacity-90" />
        <span className="size-14 rounded-2xl bg-[var(--tile-b)] opacity-90" />
        <span className="mt-8 size-14 rounded-2xl bg-[var(--tile-c)] opacity-90" />
        <span className="mt-8 size-14 rounded-2xl bg-[var(--tile-d)] opacity-90" />
      </div>
      <div className="page-wrap py-14 sm:py-20 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Company</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
          About BLM
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
          {SITE.legalName} builds software that keeps every location’s name, address, phone, hours, and
          categories accurate across Google, Apple, Bing, and the directories that matter — from one
          workspace.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link to="/trial">Start free trial</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/book">Book a call</Link>
          </Button>
        </div>
        <Link
          to="/contact"
          className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline"
        >
          Or say hello <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function WhyExist() {
  return (
    <section className="page-wrap py-16 sm:py-20" aria-labelledby="why-title">
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Why we exist</p>
            <h2 id="why-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Local search still breaks when NAP drifts.
            </h2>
          </div>
          <p className="text-[17px] leading-relaxed text-ink-soft">
            Multi-location teams shouldn’t need five logins and a spreadsheet to prove a storefront is
            correct. BLM exists to make business listing management boring again: audit what is wrong, show
            the ceiling after you fix it, and keep the footprint consistent.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {BELIEFS.map((b, i) => (
          <Reveal key={b.title} delay={i * 70}>
            <article className="flex h-full flex-col rounded-3xl bg-cream p-6 hairline">
              <span className={cn("inline-flex size-11 items-center justify-center rounded-2xl", b.soft)}>
                <b.Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{b.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{b.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section className="border-y border-line bg-cream/60" aria-labelledby="how-title">
      <div className="page-wrap py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">How we work</p>
              <h2 id="how-title" className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Three beats. No spreadsheet theater.
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline"
            >
              Full workflow <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <ol className="mt-10 grid gap-4 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <li className="relative h-full overflow-hidden rounded-3xl bg-paper p-6 hairline">
                <span
                  className="absolute -right-1 -top-3 font-display text-7xl font-semibold leading-none text-sand/90"
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-muted">Step {s.n}</p>
                <h3 className="relative mt-3 font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">{s.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Independence() {
  return (
    <section className="page-wrap py-16 sm:py-20" aria-labelledby="independence-title">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-cream sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 50% 60% at 0% 0%, color-mix(in oklab, var(--tile-a) 55%, transparent), transparent 60%), radial-gradient(ellipse 40% 50% at 100% 100%, color-mix(in oklab, var(--tile-c) 45%, transparent), transparent 55%)",
            }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <div className="flex items-center gap-3">
              <LogoMark className="size-12" />
              <Sparkles className="size-5 text-[var(--tile-b)]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tile-b)]">Independence</p>
              <h2 id="independence-title" className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                BLM is an independent product.
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream/85">
                We are not a Synup or Nakama reseller, and we do not publish as their affiliate. Reviews and
                comparisons stay equal-weakness on purpose — so operators can trust the page, not the
                partnership logo.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Founder() {
  const initials = SITE.author
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="page-wrap pb-16 sm:pb-20" aria-labelledby="founder-title">
      <Reveal>
        <div className="grid overflow-hidden rounded-3xl bg-cream hairline lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative flex flex-col justify-between gap-8 border-b border-line bg-sand/50 p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Who builds it</p>
              <div
                className="mt-6 flex size-24 items-center justify-center rounded-3xl font-display text-3xl font-semibold text-[var(--on-tile)] shadow-soft"
                style={{
                  background:
                    "linear-gradient(135deg, var(--tile-a), var(--tile-b) 45%, var(--tile-c) 75%, var(--tile-d))",
                }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <h2 id="founder-title" className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink">
                {SITE.author}
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-soft">Founder, {SITE.name}</p>
            </div>
            <p className="text-sm text-muted">
              Editorial publishes as {SITE.editorial} when a piece is collaborative.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
            <p className="text-[17px] leading-relaxed text-ink-soft">
              {SITE.author} founded BLM. He holds a B.Tech in Mechanical Engineering from IIT Roorkee (2026)
              and has interned at Ninjacart and Deloitte. He also edits the independent{" "}
              <a
                href="https://locallistingsmanagement.co"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Local Listings Management
              </a>{" "}
              publication.
            </p>
            <p className="text-[17px] leading-relaxed text-ink-soft">
              The brief is simple: build business listing management software operators actually open on a
              Monday — not another overlay that rents someone else’s directory graph.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/trial">Start free trial</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/book">Book a call</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FactsStrip() {
  return (
    <section className="border-y border-line bg-paper" aria-label="Company facts">
      <div className="page-wrap py-10 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 50}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{f.label}</p>
                <p className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">{f.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="page-wrap py-16 sm:py-20">
      <Reveal>
        <div className="cta-band relative overflow-hidden rounded-3xl border-x border-b border-line px-6 py-14 text-center sm:px-12">
          <LogoMark className="pointer-events-none absolute -right-4 -top-4 size-28 opacity-80" />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Ready to govern the footprint?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-ink-soft">
            Start a free trial for early product access, or book a call if you already run a multi-location
            set of pins. Prefer email?{" "}
            <Link to="/contact" className="font-semibold text-ink underline-offset-2 hover:underline">
              Contact us
            </Link>
            .
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/trial">Start free trial</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/book">Book a call</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
