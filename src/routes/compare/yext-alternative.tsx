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
        "BLM as a Yext alternative for teams who need listing health, NAP consistency, and duplicate control without an enterprise-only sales process.",
      path: "/compare/yext-alternative",
    }),
  component: YextPage,
});

const faqs = [
  { q: "Is BLM a full Yext replacement?", a: "BLM focuses on listing health: NAP, coverage, duplicates, hours, across Google, Apple, Bing, and directories. Yext is a broader knowledge graph platform. Many teams only needed the listings layer." },
  { q: "Can we migrate off Yext?", a: "Export locations, run the BLM auditor, then open a Growth or Enterprise workspace. We do not promise a one-click publisher cutover on day one of early access." },
];

function YextPage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "Yext alternative",
          description: "When BLM is a better fit than an enterprise knowledge graph.",
          path: "/compare/yext-alternative",
          date: "2026-04-15",
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
        title="A Yext alternative for teams who actually needed listing hygiene."
        lede="Yext is excellent at being Yext. A surprising number of buyers needed something narrower: keep every location accurate on Google, Apple, Bing, and directories."
      >
        <div className="prose-like max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            If your RFP is really about <strong className="text-ink">NAP consistency, duplicate suppression, and publisher coverage</strong>, you do not automatically need a knowledge graph that also wants to own pages, search, and listings as a single contract.
          </p>
          <p>
            BLM starts with a workspace and public pricing. Starter unlocks after you sign in. Growth is $149/month for 25 locations. Enterprise is for unlimited locations, agency structure, and SSO.
          </p>
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
                ["Listing health score", "Part of a larger suite", "The product"],
                ["Way to try", "Sales-led", "Create a workspace"],
                ["Public list price", "Usually not", "Yes"],
                ["Duplicate radar", "Yes, enterprise", "Core"],
                ["Pages / search / ads", "Yes", "No. Listings only"],
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
