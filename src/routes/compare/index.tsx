import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Reveal } from "@/components/home/reveal";
import { LogoMark } from "@/components/logo";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { loadPublicSite } from "@/lib/cms/public";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare/")({
  loader: () => loadPublicSite(),
  head: () =>
    pageHead({
      title: "Compare business listing management software",
      description:
        "Compare business listing management software: BLM vs Yext, BrightLocal, Moz Local, Uberall, and Birdeye by job, with equal-weakness notes and dated vendor sources. Independent guides for US teams.",
      path: "/compare",
    }),
  component: CompareHub,
});

const ROWS = [
  {
    job: "Listing health score",
    yext: "Inside a broader suite",
    bl: "Not the core product",
    blm: "Core desk job",
    note: "Yext packages listings inside Knowledge Graph and related modules. BrightLocal centers local SEO measurement. BLM is built around NAP, coverage, duplicates, and hours. That focus also means BLM does not ship pages, site search, or SERP charts.",
  },
  {
    job: "Way to try",
    yext: "Demo / sales-led",
    bl: "14-day self-serve trial",
    blm: "Create a workspace",
    note: "Yext states there is no standard free trial; evaluation runs through demos and references. BrightLocal offers a 14-day trial with no card. BLM opens a workspace with a work email. Early access still means no promised one-click publisher cutover on day one.",
  },
  {
    job: "Public list price",
    yext: "Custom solution pricing",
    bl: "Yes, plan menu",
    blm: "Yes, listed rates",
    note: "Yext publishes that pricing is custom by solution, location count, and term, with no single sticker price. BrightLocal shows Track, Manage, and Grow with annual discounts. BLM lists Starter at $49/month and Growth at $149/month for 25 locations when billing goes live. Enterprise stays a conversation.",
  },
  {
    job: "Duplicate handling",
    yext: "Verifier / enterprise workflows",
    bl: "Citation accuracy focus",
    blm: "Core radar",
    note: "Yext describes Listings Verifier detecting errors and duplicates against the Knowledge Graph. BrightLocal Citation Tracker flags NAP gaps and missing sites. BLM treats near-matches on phone, place id, and name as first-class tickets. BLM does not claim Yext-scale global publisher breadth.",
  },
  {
    job: "Knowledge graph / pages",
    yext: "Yes",
    bl: "No",
    blm: "No. Listings only",
    note: "If you need a public knowledge graph, pages, or agentic search stack, stay on Yext. BrightLocal and BLM do not pretend to be that product.",
  },
  {
    job: "Rank tracking",
    yext: "Add-on / partner path",
    bl: "Core (Local Rank Tracker)",
    blm: "No",
    note: "BrightLocal is stronger at local rank grids and competitor SERP work. BLM does not mix SERP charts into listing health. Keep a rank tracker if you sell rankings.",
  },
] as const;

const WEAKNESSES = [
  {
    name: "Yext",
    fit: "Enterprise knowledge graph, 200-plus publisher distribution, governance, and modules beyond listings.",
    weak: "Custom solution pricing and a sales-led path. Overkill when the RFP is really NAP, duplicates, and hours for a few dozen locations.",
  },
  {
    name: "BrightLocal",
    fit: "Local SEO workbench: rank tracking, citation audits, GBP audits, white-label reporting, self-serve plans.",
    weak: "Listing sync and review tools sit inside a measurement suite. Citation Builder is pay-as-you-go. Not a franchise-scale listings-only desk.",
  },
  {
    name: "BLM",
    fit: "Listing health desk with public rates, workspace try, and scores for NAP, coverage, duplicates, and hours.",
    weak: "No knowledge graph, no rank tracking, no pages or ads. Narrower publisher story than Yext's 200-plus network claim. Early access: no one-click cutover promise.",
  },
] as const;

function CompareHub() {
  const [row, setRow] = useState(0);
  const active = ROWS[row];
  const extras = Route.useLoaderData().articles.filter((a) => a.kind === "comparison");

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
      />
      <InnerPage
        compact
        eyebrow="Compare"
        title="Listing platforms, compared by job, not a logo wall."
        lede="Business listing management software should be judged by jobs: NAP health, duplicates, coverage, and how you try it. Click a row. See what Yext, BrightLocal, and BLM each do well, and where each is weaker. Deep guides also cover Moz Local, Uberall, and Birdeye. Independent US buying desk, not a scored win-rate chart."
      >
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          New to the category? Read{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>
          , then check{" "}
          <Link to="/pricing" className="font-medium text-ink underline-offset-2 hover:underline">
            BLM pricing
          </Link>{" "}
          and the{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "best-business-listing-management-software-2026" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            best business listing management software
          </Link>{" "}
          guide before you shortlist.
        </p>
        <div className="overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-sand">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Yext</th>
                <th className="px-4 py-3 font-semibold">BrightLocal</th>
                <th className="compare-blm px-4 py-3 font-semibold text-brand">BLM</th>
              </tr>
            </thead>
            <tbody className="bg-cream">
              {ROWS.map((item, i) => (
                <tr
                  key={item.job}
                  className={cn("compare-row border-t border-line", row === i && "is-on")}
                  tabIndex={0}
                  onMouseEnter={() => setRow(i)}
                  onFocus={() => setRow(i)}
                  onClick={() => setRow(i)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{item.job}</td>
                  <td className="px-4 py-3 text-ink-soft">{item.yext}</td>
                  <td className="px-4 py-3 text-ink-soft">{item.bl}</td>
                  <td className="compare-blm px-4 py-3 font-medium text-ink">{item.blm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-2xl bg-cream p-5 hairline">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{active.job}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{active.note}</p>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Equal-weakness notes</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Every shortlist has a fit and a limit. Prefer the product whose weakness you can live with.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {WEAKNESSES.map((w) => (
              <article key={w.name} className="rounded-2xl bg-cream p-5 hairline">
                <h3 className="font-display text-lg font-semibold text-ink">{w.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">Fit: </span>
                  {w.fit}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">Weaker when: </span>
                  {w.weak}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2">
          <Reveal className="h-full">
            <Link
              to="/compare/yext-alternative"
              className="industry-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-cream p-6 pb-10 hairline"
            >
              <LogoMark className="industry-seal size-8" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Enterprise</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Yext alternative</h2>
              <p className="mt-2 flex-1 text-sm text-muted">
                When knowledge-graph breadth is more than you need, and listing health is the actual job. Includes where Yext still wins.
              </p>
              <span className="resource-read mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                Read the guide <ArrowRight className="size-4" />
              </span>
              <div className="industry-tiles" aria-hidden="true">
                <span className="flex-1 bg-[var(--tile-a)]" />
                <span className="flex-1 bg-[var(--tile-b)]" />
                <span className="flex-1 bg-[var(--tile-c)]" />
                <span className="flex-1 bg-[var(--tile-d)]" />
              </div>
            </Link>
          </Reveal>
          <Reveal delay={80} className="h-full">
            <Link
              to="/compare/brightlocal-alternative"
              className="industry-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-cream p-6 pb-10 hairline"
            >
              <LogoMark className="industry-seal size-8" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Agencies</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">BrightLocal alternative</h2>
              <p className="mt-2 flex-1 text-sm text-muted">
                Rank tracking is not the same as keeping NAP, hours, and duplicates honest across publishers. Keep BrightLocal when SERP grids are the product.
              </p>
              <span className="resource-read mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                Read the guide <ArrowRight className="size-4" />
              </span>
              <div className="industry-tiles" aria-hidden="true">
                <span className="flex-1 bg-[var(--tile-a)]" />
                <span className="flex-1 bg-[var(--tile-b)]" />
                <span className="flex-1 bg-[var(--tile-c)]" />
                <span className="flex-1 bg-[var(--tile-d)]" />
              </div>
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {(
            [
              {
                to: "/compare/moz-local-alternative" as const,
                eyebrow: "Local SEO suite",
                title: "Moz Local alternative",
                copy: "When Local Grid and reviews are more than you need, and listing health is the actual job. Includes where Moz Local still wins.",
              },
              {
                to: "/compare/uberall-alternative" as const,
                eyebrow: "Multi-location marketing",
                title: "Uberall alternative",
                copy: "When a full location-marketing suite outgrows a listings-only RFP. Includes where Uberall still wins on 150-plus publishers.",
              },
              {
                to: "/compare/birdeye-alternative" as const,
                eyebrow: "Reputation and CX",
                title: "Birdeye alternative",
                copy: "When reviews, surveys, and agentic marketing are separate from NAP and coverage ops. Includes where Birdeye still wins.",
              },
            ] as const
          ).map((item) => (
            <Link key={item.to} to={item.to} className="rounded-2xl bg-cream px-5 py-4 hairline">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{item.eyebrow}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.copy}</p>
            </Link>
          ))}
        </div>

        {extras.length ? (
          <div className="mt-8 grid gap-3">
            {extras.map((a) => (
              <Link
                key={a.id}
                to="/blog/$slug"
                params={{ slug: a.slug }}
                className="rounded-2xl bg-cream px-5 py-4 hairline"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Comparison</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-muted">{a.answer}</p>
              </Link>
            ))}
          </div>
        ) : null}

        <section className="mt-10 max-w-3xl" aria-labelledby="compare-sources-title">
          <h2 id="compare-sources-title" className="font-display text-2xl font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Vendor and BLM pages checked 2026-09-06. Product UIs and commercial terms move. Confirm the live page before you file a change or sign a contract. Claims below are not a measured win rate.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <a
                href="https://www.yext.com/knowledge-center/yext-faq"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Yext: How much does Yext cost? (custom solution pricing, no standard free trial)
              </a>
            </li>
            <li>
              <a
                href="https://www.yext.com/platform/listings"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Yext Listings (200-plus publishers, Listings Verifier, Knowledge Graph distribution)
              </a>
            </li>
            <li>
              <a
                href="https://www.yext.com/platform/knowledge-graph"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Yext Knowledge Graph (pages, listings, reviews, and social cascade from one graph)
              </a>
            </li>
            <li>
              <a
                href="https://www.brightlocal.com/pricing/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                BrightLocal pricing (Track / Manage / Grow, Citation Builder from $2 per citation, managed SEO from
                $1,299/mo)
              </a>
            </li>
            <li>
              <a
                href="https://www.brightlocal.com/local-seo-tools/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                BrightLocal local SEO tools (rank tracking, citation audit, listings manage path, annual prices from
                $31/mo)
              </a>
            </li>
            <li>
              <a
                href="https://moz.com/products/local/pricing"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Moz Local pricing (Lite / Preferred / Elite per location, Enterprise custom for 50-plus locations)
              </a>
            </li>
            <li>
              <a
                href="https://uberall.com/en-us/products/listings"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Uberall Listings (150-plus directories, duplicate suppression, profile protection)
              </a>
            </li>
            <li>
              <a
                href="https://birdeye.com/listings/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Birdeye Listings (Listings AI Agents, Listing Score, 100-plus sites)
              </a>
            </li>
            <li>
              <Link to="/pricing" className="font-medium text-ink underline-offset-2 hover:underline">
                BLM pricing (Starter $49/month, Growth $149/month, Enterprise custom)
              </Link>
            </li>
          </ul>
        </section>
      </InnerPage>
    </SiteShell>
  );
}
