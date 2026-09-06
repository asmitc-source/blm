import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/moz-local-alternative")({
  head: () =>
    pageHead({
      title: "Moz Local alternative",
      description:
        "BLM as a Moz Local alternative when listing health is the job. Equal-weakness notes, dated Moz Local primary sources, and where Moz Local still wins for US teams.",
      path: "/compare/moz-local-alternative",
    }),
  component: MozLocalPage,
});

const faqs = [
  {
    q: "Is BLM a full Moz Local replacement?",
    a: "No. BLM focuses on listing health: NAP, coverage, duplicates, and hours across Google, Apple, Bing, and the directory network. Moz Local is an all-in-one local SEO suite with directory sync, Local Grid map-pack ranking, review workflows, and social posting on higher plans. If you need Local Grid and social in the same seat, stay on Moz Local.",
  },
  {
    q: "Where does Moz Local still win?",
    a: "Published per-location plans (Lite, Preferred, Elite), 90-plus listing directories on the product page, Local Grid for local map-pack ranking, review monitoring on Lite and responding on Preferred-plus, plus social posting and reporting on higher tiers. Enterprise is custom for 50-plus locations. That toolkit fits teams buying local SEO and listings together.",
  },
  {
    q: "Can we migrate off Moz Local?",
    a: "Export locations, run the BLM auditor, then open a Growth or Enterprise workspace. We do not promise a one-click publisher cutover on day one of early access. Confirm live publisher status yourself before you cancel any incumbent contract.",
  },
];

function MozLocalPage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "Moz Local alternative",
          description:
            "When BLM fits listing hygiene, and when Moz Local still wins on Local Grid, reviews, and published per-location plans.",
          path: "/compare/moz-local-alternative",
          date: "2026-09-06",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Moz Local alternative", path: "/compare/moz-local-alternative" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InnerPage
        eyebrow="Compare · Moz Local"
        title="A Moz Local alternative when listing hygiene is the desk job."
        lede="Moz Local is a strong all-in-one local SEO toolkit. A lot of US buyers only needed business listing management: keep every location accurate on Google, Apple, Bing, and the directory network. This page states both fits and weaknesses. It is not a scored win-rate chart."
      >
        <div className="prose-like max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            If your RFP is really about{" "}
            <strong className="text-ink">business listing management</strong>{" "}
            (NAP consistency, duplicate suppression, and publisher coverage), you do not automatically need Local Grid
            heatmaps, review AI add-ons, and social calendars in the same seat. Moz Local&apos;s own materials describe
            that broader local SEO surface. BLM does not pretend to match it. Start on the{" "}
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
            and SSO. Moz Local publishes Lite, Preferred, and Elite per location (from $20/month monthly or $16/month
            billed yearly on Lite), with Listings AI and Reviews AI as add-ons on some tiers, and custom Enterprise for
            50-plus locations.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Moz Local is stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Auto-sync listings across search, directories, social, apps, and aggregators, with listing health monitoring.</li>
              <li>Local Grid for local map-pack ranking and competitor context Moz describes as hyper-local.</li>
              <li>Review monitoring on Lite, with responding, sentiment, and AI add-ons on higher plans.</li>
              <li>Social posting, content libraries, and reporting suites on Preferred and Elite packages.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is weaker (honest)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>No Local Grid, no map-pack rank heatmaps, no SERP competitor charts.</li>
              <li>No review response inbox, no social calendar, no Listings AI or Reviews AI add-ons.</li>
              <li>Narrower publisher story than Moz Local&apos;s 90-plus directories claim. BLM covers Google, Apple, Bing, and the directory network as the desk job.</li>
              <li>Early access: no promised one-click publisher cutover the day you leave an incumbent.</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-sand">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Moz Local</th>
                <th className="px-4 py-3 font-semibold">BLM</th>
              </tr>
            </thead>
            <tbody className="bg-cream">
              {[
                ["Listing health score", "Data Health analytics inside the suite", "Core desk job"],
                ["Way to try", "Self-serve plans on Moz pricing", "Create a workspace"],
                ["Public list price", "Yes, per location (Lite / Preferred / Elite)", "Yes, listed rates"],
                ["Duplicate handling", "Citation / data health workflows", "Core radar"],
                ["Local Grid / map-pack ranks", "Yes (product feature)", "No"],
                ["Reviews / social suite", "Yes on higher plans", "No. Listings only"],
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

        <section className="mt-10 max-w-3xl" aria-labelledby="moz-sources-title">
          <h2 id="moz-sources-title" className="font-display text-2xl font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Primary vendor and BLM pages checked 2026-09-06. Confirm the live page before procurement. These links ground
            the claims above. They are not a measured win rate.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <a
                href="https://moz.com/products/local/pricing"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Moz Local pricing: Lite / Preferred / Elite per location, annual discounts, Enterprise custom for 50-plus
                locations
              </a>
            </li>
            <li>
              <a
                href="https://moz.com/products/local"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Moz Local product: auto-sync listings, listing health, Local Grid, reviews, and social toolkit
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
