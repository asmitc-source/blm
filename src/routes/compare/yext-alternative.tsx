import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/yext-alternative")({
  head: () =>
    pageHead({
      title: "Yext alternative",
      description:
        "BLM as a Yext alternative when listing health is the job. Equal-weakness notes, dated Yext primary sources, and where Yext still wins for US teams.",
      path: "/compare/yext-alternative",
    }),
  component: YextPage,
});

const faqs = [
  {
    q: "Is BLM a full Yext replacement?",
    a: "No. BLM focuses on listing health: NAP, coverage, duplicates, and hours across Google, Apple, Bing, and the directory network. Yext is a broader Knowledge Graph platform with listings, pages, reviews, social, and related modules. Many teams only needed the listings layer. If you need the graph and pages stack, stay on Yext.",
  },
  {
    q: "Where does Yext still win?",
    a: "Enterprise knowledge-graph modeling, 200-plus publisher distribution as Yext describes it, Listings Verifier against that graph, global governance, and modules beyond listings. Yext also states there is no standard free trial and pricing is custom by solution. That path fits large footprints that already expect a sales cycle.",
  },
  {
    q: "Can we migrate off Yext?",
    a: "Export locations, run the BLM auditor, then open a Growth or Enterprise workspace. We do not promise a one-click publisher cutover on day one of early access. Confirm live publisher status yourself before you cancel any incumbent contract.",
  },
];

function YextPage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "Yext alternative",
          description: "When BLM fits listing hygiene, and when Yext still wins on knowledge graph breadth.",
          path: "/compare/yext-alternative",
          date: "2026-09-06",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Yext alternative", path: "/compare/yext-alternative" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InnerPage
        eyebrow="Compare · Yext"
        title="A Yext alternative when listing hygiene is the real RFP."
        lede="Yext is excellent at being Yext. A surprising number of US buyers needed narrower business listing management: keep every location accurate on Google, Apple, Bing, and the directory network. This page states both fits and weaknesses. It is not a scored win-rate chart."
      >
        <div className="prose-like max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            If your RFP is really about{" "}
            <strong className="text-ink">business listing management</strong>{" "}
            (NAP consistency, duplicate suppression, and publisher coverage), you do not automatically need a knowledge
            graph that also wants to own pages, search, and listings as a single contract. Yext&apos;s own materials
            describe that broader stack. BLM does not pretend to match it. Start on the{" "}
            <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
              BLM homepage
            </Link>{" "}
            or read{" "}
            <Link
              to="/blog/$slug"
              params={{ slug: "what-is-business-listing-management" }}
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              what is business listing management
            </Link>{" "}
            for the category definition.
          </p>
          <p>
            BLM starts with a workspace and public pricing. Starter unlocks after you sign in. Growth is listed at
            $149/month for 25 locations when billing goes live. Enterprise is for unlimited locations, agency structure,
            and SSO. Yext publishes that pricing is custom by solution, location or provider count, and commitment term,
            with no single sticker price and no standard free trial.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Yext is stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Knowledge Graph as the source of truth, with cascades into listings, pages, reviews, and social.</li>
              <li>Listings distribution Yext describes as 200-plus publishers, plus Listings Verifier against live publisher data.</li>
              <li>Enterprise governance: roles, audit trails, and scale for very large footprints.</li>
              <li>Modules beyond listings (pages, Scout, reviews, social) when one vendor must cover that surface.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is weaker (honest)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>No knowledge graph, no pages product, no site search, no ads layer.</li>
              <li>Narrower publisher story than Yext&apos;s 200-plus network claim. BLM covers Google, Apple, Bing, and the directory network as the desk job.</li>
              <li>Early access: no promised one-click publisher cutover the day you leave an incumbent.</li>
              <li>Not built for agentic marketing or AI citation suites. Listing health only.</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-sand">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Yext</th>
                <th className="px-4 py-3 font-semibold">BLM</th>
              </tr>
            </thead>
            <tbody className="bg-cream">
              {[
                ["Listing health score", "Inside a broader suite", "Core desk job"],
                ["Way to try", "Demo / sales-led (no standard free trial)", "Create a workspace"],
                ["Public list price", "Custom solution pricing", "Yes, listed rates"],
                ["Duplicate handling", "Verifier / enterprise workflows", "Core radar"],
                ["Pages / search / ads", "Yes (platform modules)", "No. Listings only"],
                ["Knowledge graph", "Yes", "No"],
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

        <section className="mt-10 max-w-3xl" aria-labelledby="yext-sources-title">
          <h2 id="yext-sources-title" className="font-display text-2xl font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Primary vendor and BLM pages checked 2026-09-06. Confirm the live page before procurement. These links ground
            the claims above. They are not a measured win rate.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <a
                href="https://www.yext.com/knowledge-center/yext-faq"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Yext FAQ: custom solution pricing, annual billing, no standard free trial
              </a>
            </li>
            <li>
              <a
                href="https://www.yext.com/platform/listings"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Yext Listings: 200-plus publishers, Listings Verifier, distribution from the Knowledge Graph
              </a>
            </li>
            <li>
              <a
                href="https://www.yext.com/platform/knowledge-graph"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Yext Knowledge Graph: one update cascading to listings, pages, reviews, and social
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
            <Link to="/demo">Book a demo</Link>
          </Button>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
