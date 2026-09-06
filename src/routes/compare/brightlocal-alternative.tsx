import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/brightlocal-alternative")({
  head: () =>
    pageHead({
      title: "BrightLocal alternative",
      description:
        "BLM as a BrightLocal alternative when listing ops matter more than rank grids. Equal-weakness notes and dated BrightLocal primary sources for US teams.",
      path: "/compare/brightlocal-alternative",
    }),
  component: BrightPage,
});

const faqs = [
  {
    q: "Do you replace BrightLocal rank tracking?",
    a: "No. BLM is listing management. Keep a rank tracker if you sell rankings. Use BLM when the job is NAP, coverage, duplicates, and hours. BrightLocal remains stronger at Local Rank Tracker and Local Search Grid work.",
  },
  {
    q: "Where does BrightLocal still win?",
    a: "Self-serve local SEO measurement: rank tracking, geo grids, citation audits, GBP audits, white-label reporting, and a published plan menu with a 14-day trial. Citation Builder is available pay-as-you-go. That toolkit is the right buy when listings are one chapter of a retainer, not the whole desk.",
  },
  {
    q: "Is this for agencies?",
    a: "Yes. Enterprise includes multi-account structure. Read the agency guide on the blog. Many agencies keep BrightLocal for SERP reporting and add BLM when the painful object is ongoing NAP and duplicate ops.",
  },
];

function BrightPage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "BrightLocal alternative",
          description: "When listing operations need more than a citation report, and when BrightLocal still wins on rank tracking.",
          path: "/compare/brightlocal-alternative",
          date: "2026-09-06",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "BrightLocal alternative", path: "/compare/brightlocal-alternative" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InnerPage
        eyebrow="Compare · BrightLocal"
        title="A BrightLocal alternative when citations are the product, not a PDF."
        lede="BrightLocal is a staple for local SEO reporting. Listing management is a different job: keep publishers accurate after the report is sent. This page states both fits and weaknesses for US teams. It is not a scored win-rate chart."
      >
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            Agencies often buy rank tracking and a citation checker, then still log into Google, Apple, and Yelp by hand.
            BLM is the workspace that sits on that last mile: health scores, duplicate risk, hours gaps, with an auditor
            you can run after you sign in.
          </p>
          <p>
            If you need keyword grids, keep your tracker. BrightLocal publishes Track, Manage, and Grow plans, annual
            discounts, a 14-day trial with no card, Citation Builder starting at $2 per citation with bulk credits, and
            managed SEO from $1,299/month. BLM lists Starter at $49/month and Growth at $149/month for up to 25 locations
            when billing goes live. Different jobs, overlapping category language.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BrightLocal is stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Local Rank Tracker and Local Search Grid for pack, organic, and map visibility.</li>
              <li>Citation Tracker, GBP Audit, and Local Search Audit as self-serve measurement.</li>
              <li>White-label reporting and agency-friendly packaging with a published plan menu.</li>
              <li>Citation Builder as pay-as-you-go human submission, separate from the subscription.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is weaker (honest)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>No rank tracking, no geo grid, no SERP competitor charts.</li>
              <li>No white-label PDF suite meant to replace a local SEO reporting stack.</li>
              <li>No pay-as-you-go citation building service of the BrightLocal Citation Builder style.</li>
              <li>Early access listing desk: narrower than a full local SEO platform on purpose.</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-sand">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">BrightLocal</th>
                <th className="px-4 py-3 font-semibold">BLM</th>
              </tr>
            </thead>
            <tbody className="bg-cream">
              {[
                ["Local rank tracking", "Core", "Not the job"],
                ["Citation / listing audit", "Reports and Citation Tracker", "Interactive health score"],
                ["Ongoing NAP ops", "Manage plan Active Sync path", "Core desk job"],
                ["Duplicate / near-match radar", "Partial (citation accuracy)", "Core"],
                ["Client-facing auditor", "Dashboard / white-label reports", "Live tool after sign-in"],
                ["Review generation suite", "Grow plan", "Not the product"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((c) => (
                    <td key={c} className="px-4 py-3">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="mt-10 grid gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl bg-cream px-5 py-4 hairline">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 text-sm text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-10 max-w-3xl" aria-labelledby="bl-sources-title">
          <h2 id="bl-sources-title" className="font-display text-2xl font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Primary vendor and BLM pages checked 2026-09-06. Confirm the live page before procurement. These links ground
            the claims above. They are not a measured win rate.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <a
                href="https://www.brightlocal.com/pricing/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                BrightLocal pricing: Track / Manage / Grow, Citation Builder from $2 per citation, managed SEO from
                $1,299/mo, 14-day trial
              </a>
            </li>
            <li>
              <a
                href="https://www.brightlocal.com/local-seo-tools/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                BrightLocal local SEO tools: rank tracking, citation audit, listings manage path, annual prices from
                $31/mo
              </a>
            </li>
            <li>
              <a
                href="https://www.brightlocal.com/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                BrightLocal home: platform, citation building, APIs, and managed services overview
              </a>
            </li>
            <li>
              <Link to="/pricing" className="font-medium text-ink underline-offset-2 hover:underline">
                BLM pricing: Starter $49/month, Growth $149/month, Enterprise custom
              </Link>
            </li>
            <li>
              <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
                Compare hub: equal-weakness matrix for Yext, BrightLocal, and BLM
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/signup">Create workspace</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/blog/$slug" params={{ slug: "business-listing-management-for-agencies" }}>
              Agency guide
            </Link>
          </Button>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
