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
        "BLM as a BrightLocal alternative when you need listing management and duplicate control, not just local rank tracking and citation reports.",
      path: "/compare/brightlocal-alternative",
    }),
  component: BrightPage,
});

const faqs = [
  { q: "Do you replace BrightLocal rank tracking?", a: "No. BLM is listing management. Keep a rank tracker if you sell rankings. Use BLM when the job is NAP, coverage, duplicates, and hours." },
  { q: "Is this for agencies?", a: "Yes. Enterprise includes multi-account structure. Read the agency guide on the blog." },
];

function BrightPage() {
  return (
    <SiteShell>
      <JsonLd
        data={articleJsonLd({
          title: "BrightLocal alternative",
          description: "When listing operations need more than a citation report.",
          path: "/compare/brightlocal-alternative",
          date: "2026-04-15",
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
        lede="BrightLocal is a staple for local SEO reporting. Listing management is a different job: keep publishers accurate after the report is sent."
      >
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            Agencies often buy rank tracking and a citation checker, then still log into Google, Apple, and Yelp by hand. BLM is the workspace that sits on that last mile: health scores, duplicate risk, hours gaps, with an auditor you can run after you sign in.
          </p>
          <p>
            If you need keyword grids, keep your tracker. If you need the listings themselves to stop drifting, look at pricing and the agency guide.
          </p>
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
                ["Citation / listing audit", "Reports", "Interactive health score"],
                ["Ongoing NAP ops", "Limited", "Core"],
                ["Duplicate radar", "Partial", "Core"],
                ["Client-facing auditor", "PDF / dashboard", "Live tool on day one"],
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
            <Link to="/blog/$slug" params={{ slug: "business-listing-management-for-agencies" }}>
              Agency guide
            </Link>
          </Button>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
