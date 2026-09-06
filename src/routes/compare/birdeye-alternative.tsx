import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/birdeye-alternative")({
  head: () =>
    pageHead({
      title: "Birdeye alternative",
      description:
        "BLM as a Birdeye alternative when listing health is the job. Equal-weakness notes, dated Birdeye primary sources, and where Birdeye still wins for US teams.",
      path: "/compare/birdeye-alternative",
    }),
  component: BirdeyePage,
});

const faqs = [
  {
    q: "Is BLM a full Birdeye replacement?",
    a: "No. BLM focuses on listing health: NAP, coverage, duplicates, and hours across Google, Apple, Bing, and the directory network. Birdeye is an agentic marketing platform for multi-location brands with listings AI agents plus reviews, social, search AI, surveys, and CX workflows. If reputation and CX are the painful object, stay on Birdeye.",
  },
  {
    q: "Where does Birdeye still win?",
    a: "Listings AI Agents that scan and optimize profiles across Google, Apple, Facebook, Yelp, and more, duplicate suppression, Listing Score, and distribution Birdeye describes across 100-plus sites. Reviews AI, Social AI, Search AI, messaging, and surveys sit in the same platform. Pricing is outcome- and location-band based with a get-pricing form rather than a public sticker menu.",
  },
  {
    q: "Can we migrate off Birdeye?",
    a: "Export locations, run the BLM auditor, then open a Growth or Enterprise workspace. We do not promise a one-click publisher cutover on day one of early access. Confirm live publisher status yourself before you cancel any incumbent contract.",
  },
];

function BirdeyePage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "Birdeye alternative",
          description:
            "When BLM fits listing hygiene, and when Birdeye still wins on reviews, CX, and agentic multi-location marketing.",
          path: "/compare/birdeye-alternative",
          date: "2026-09-06",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Birdeye alternative", path: "/compare/birdeye-alternative" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InnerPage
        eyebrow="Compare · Birdeye"
        title="A Birdeye alternative when listing hygiene is the desk job."
        lede="Birdeye is built as an agentic marketing platform for multi-location brands. Listing management is one chapter inside reviews, social, search AI, and CX. This page states both fits and weaknesses for US teams. It is not a scored win-rate chart."
      >
        <div className="prose-like max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            If your RFP is really about{" "}
            <strong className="text-ink">NAP consistency, duplicate suppression, and publisher coverage</strong>, you do
            not automatically need review generation, surveys, messaging, and social AI in the same contract.
            Birdeye&apos;s own materials describe that broader agentic stack. BLM does not pretend to match it.
          </p>
          <p>
            BLM starts with a workspace and public pricing. Starter unlocks after you sign in. Growth is listed at
            $149/month for 25 locations when billing goes live. Enterprise is for unlimited locations, agency structure,
            and SSO. Birdeye pricing is framed around outcomes and location bands, with a get-pricing form instead of a
            public per-plan sticker menu. Enterprise demos are the evaluation path on the live site.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Birdeye is stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Listings AI Agents for scan, optimize, and guarded auto-updates across major publishers Birdeye names.</li>
              <li>Duplicate suppression, Listing Score, and distribution Birdeye describes across 100-plus sites.</li>
              <li>Reviews AI, Social AI, Search AI, messaging, and surveys as first-class product surfaces.</li>
              <li>Enterprise multi-location packaging with industry workflows and a large integration surface.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is weaker (honest)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>No review generation suite, no surveys, no messaging inbox, no social AI calendar.</li>
              <li>No agentic marketing coworkers or Search AI visibility product.</li>
              <li>Narrower publisher story than Birdeye&apos;s 100-plus sites claim. BLM covers Google, Apple, Bing, and the directory network as the desk job.</li>
              <li>Early access: no promised one-click publisher cutover the day you leave an incumbent.</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-sand">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Birdeye</th>
                <th className="px-4 py-3 font-semibold">BLM</th>
              </tr>
            </thead>
            <tbody className="bg-cream">
              {[
                ["Listing health score", "Listing Score inside a broader suite", "Core desk job"],
                ["Way to try", "Demo / get pricing form", "Create a workspace"],
                ["Public list price", "Location-band quote (no sticker menu)", "Yes, listed rates"],
                ["Duplicate handling", "Duplicate suppression workflows", "Core radar"],
                ["Reviews / CX / surveys", "Yes (platform modules)", "No. Listings only"],
                ["Agentic marketing / Search AI", "Yes", "No"],
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

        <section className="mt-10 max-w-3xl" aria-labelledby="birdeye-sources-title">
          <h2 id="birdeye-sources-title" className="font-display text-2xl font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Primary vendor and BLM pages checked 2026-09-06. Confirm the live page before procurement. These links ground
            the claims above. They are not a measured win rate.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <a
                href="https://birdeye.com/listings/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Birdeye Listings: Listings AI Agents, Listing Score, duplicate suppression, 100-plus sites, Google /
                Apple / Yelp surfaces
              </a>
            </li>
            <li>
              <a
                href="https://birdeye.com/pricing/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Birdeye pricing: outcome-based quotes by location band, get-pricing form (no public sticker menu)
              </a>
            </li>
            <li>
              <a
                href="https://birdeye.com/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Birdeye home: agentic marketing platform overview for multi-location brands
              </a>
            </li>
            <li>
              <Link to="/pricing" className="font-medium text-ink underline-offset-2 hover:underline">
                BLM pricing: Starter $49/month, Growth $149/month, Enterprise custom
              </Link>
            </li>
            <li>
              <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
                Compare hub: equal-weakness matrix and related alternative guides
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/signup">Create workspace</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/demo">Book a demo</Link>
          </Button>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
