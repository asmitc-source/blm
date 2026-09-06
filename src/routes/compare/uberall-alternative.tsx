import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/uberall-alternative")({
  head: () =>
    pageHead({
      title: "Uberall alternative",
      description:
        "BLM as an Uberall alternative when listing hygiene is the job. Equal-weakness notes, dated Uberall primary sources, and where Uberall still wins for US teams.",
      path: "/compare/uberall-alternative",
    }),
  component: UberallPage,
});

const faqs = [
  {
    q: "Is BLM a full Uberall replacement?",
    a: "No. BLM focuses on listing health: NAP, coverage, duplicates, and hours across Google, Apple, Bing, and the directory network. Uberall is a multi-location marketing platform with listings, reviews, local social, local pages, GEO Studio, and related modules. If you need that full location-marketing stack, stay on Uberall.",
  },
  {
    q: "Where does Uberall still win?",
    a: "Listings across 150-plus directories including Google, Apple Maps, Bing, voice, and AI search surfaces as Uberall describes them, plus duplicate suppression and profile protection. Reviews, local social, locator and local pages, GEO Studio, and analytics sit in the same platform. Pricing plans (Show Up, Stand Out, Connect) are sold with get-started and request-pricing paths rather than a single public sticker price.",
  },
  {
    q: "Can we migrate off Uberall?",
    a: "Export locations, run the BLM auditor, then open a Growth or Enterprise workspace. We do not promise a one-click publisher cutover on day one of early access. Confirm live publisher status yourself before you cancel any incumbent contract.",
  },
];

function UberallPage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "Uberall alternative",
          description:
            "When BLM fits listing hygiene, and when Uberall still wins on multi-location marketing breadth and 150-plus publisher distribution.",
          path: "/compare/uberall-alternative",
          date: "2026-09-06",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Uberall alternative", path: "/compare/uberall-alternative" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InnerPage
        eyebrow="Compare · Uberall"
        title="An Uberall alternative when listing hygiene is the real RFP."
        lede="Uberall is excellent at being a multi-location marketing platform. A surprising number of US buyers needed something narrower: keep every location accurate on Google, Apple, Bing, and the directory network. This page states both fits and weaknesses. It is not a scored win-rate chart."
      >
        <div className="prose-like max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            If your RFP is really about{" "}
            <strong className="text-ink">NAP consistency, duplicate suppression, and publisher coverage</strong>, you do
            not automatically need reviews, local social, local pages, GEO Studio, and listings as one enterprise
            contract. Uberall&apos;s own materials describe that broader stack. BLM does not pretend to match it.
          </p>
          <p>
            BLM starts with a workspace and public pricing. Starter unlocks after you sign in. Growth is listed at
            $149/month for 25 locations when billing goes live. Enterprise is for unlimited locations, agency structure,
            and SSO. Uberall publishes Show Up, Stand Out, and Connect plan families with listings as a core module,
            plus add-ons such as posting, analytics, and collaborate features. Stand Out uses a request-pricing path on
            the live pricing page. There is no single sticker price for the full suite.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Uberall is stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Listings management Uberall describes across 150-plus directories, including Google, Apple Maps, Bing, voice, and AI search.</li>
              <li>Duplicate suppression, profile protection, and bulk location updates for large footprints.</li>
              <li>Reviews, local social, locator and local pages, GEO Studio, and analytics in one platform.</li>
              <li>Enterprise multi-location motion with integrations and agentic location-performance tooling.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is weaker (honest)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>No reviews suite, no local social, no locator or local pages product, no GEO Studio.</li>
              <li>Narrower publisher story than Uberall&apos;s 150-plus network claim. BLM covers Google, Apple, Bing, and the directory network as the desk job.</li>
              <li>Early access: no promised one-click publisher cutover the day you leave an incumbent.</li>
              <li>Not built for AI citation suites or agentic marketing orchestration. Listing health only.</li>
            </ul>
          </article>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-sand">
              <tr>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Uberall</th>
                <th className="px-4 py-3 font-semibold">BLM</th>
              </tr>
            </thead>
            <tbody className="bg-cream">
              {[
                ["Listing health score", "Inside a multi-location marketing suite", "Core desk job"],
                ["Way to try", "Demo / get started / request pricing", "Create a workspace"],
                ["Public list price", "Plan families; popular path requests pricing", "Yes, listed rates"],
                ["Duplicate handling", "Duplicate suppression / profile protection", "Core radar"],
                ["Reviews / social / local pages", "Yes (platform modules)", "No. Listings only"],
                ["GEO / AI search studio", "Yes (GEO Studio)", "No"],
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

        <section className="mt-10 max-w-3xl" aria-labelledby="uberall-sources-title">
          <h2 id="uberall-sources-title" className="font-display text-2xl font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Primary vendor and BLM pages checked 2026-09-06. Confirm the live page before procurement. These links ground
            the claims above. They are not a measured win rate.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <a
                href="https://uberall.com/en-us/products/listings"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Uberall Listings: 150-plus directories, duplicate suppression, profile protection, Google / Apple / Bing /
                AI search surfaces
              </a>
            </li>
            <li>
              <a
                href="https://uberall.com/en-us/pricing"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Uberall pricing: Show Up / Stand Out / Connect plan families, listings module, request-pricing path on
                Stand Out
              </a>
            </li>
            <li>
              <a
                href="https://uberall.com/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Uberall home: multi-location marketing platform overview (listings, reviews, social, pages, GEO Studio)
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
