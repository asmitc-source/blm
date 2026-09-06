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

export const Route = createFileRoute("/compare/")({
  loader: () => loadPublicSite(),
  head: () =>
    pageHead({
      title: "Compare listing software",
      description:
        "Compare BLM with Yext and BrightLocal. Independent guides for teams choosing business listing management software.",
      path: "/compare",
    }),
  component: CompareHub,
});

const ROWS = [
  {
    job: "Listing health score",
    yext: "Part of a larger suite",
    bl: "Not the product",
    blm: "The product",
    note: "BLM is built around NAP, coverage, duplicates, and hours. Not a knowledge graph with listings attached.",
  },
  {
    job: "Way to try",
    yext: "Sales-led",
    bl: "Self-serve reports",
    blm: "Create a workspace",
    note: "Open a workspace with a work email. No procurement theater to see whether the desk fits.",
  },
  {
    job: "Public list price",
    yext: "Usually not",
    bl: "Yes, for audits",
    blm: "Yes",
    note: "Growth is $149 a month for 25 locations. Enterprise is a conversation, not a surprise.",
  },
  {
    job: "Duplicate radar",
    yext: "Yes, enterprise",
    bl: "Limited",
    blm: "Core",
    note: "Near-matches on phone, place id, and name are first-class, including leftover DBA listings.",
  },
  {
    job: "Knowledge graph / pages",
    yext: "Yes",
    bl: "No",
    blm: "No. Listings only",
    note: "If you need a public knowledge graph, stay on Yext. BLM does not pretend to be that product.",
  },
  {
    job: "Rank tracking",
    yext: "Add-on / partner",
    bl: "Yes",
    blm: "No",
    note: "BrightLocal is stronger at rank tracking. BLM does not mix SERP charts into listing health.",
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
        title="Listing platforms, compared without a logo wall."
        lede="Click a job. See what Yext, BrightLocal, and BLM actually do. Use the guides when procurement asks why not Yext."
      >
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
                When knowledge-graph breadth is more than you need, and listing health is the actual job.
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
                Rank tracking is not the same as keeping NAP, hours, and duplicates honest across publishers.
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
      </InnerPage>
    </SiteShell>
  );
}
