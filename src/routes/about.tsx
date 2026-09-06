import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About",
      description:
        "BLM is an independent business listing management company building software so every location stays accurate across Google, Apple, Bing, and the directory network.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <InnerPage
        eyebrow="About BLM"
        title="Listings are the storefronts most companies forgot they had."
        lede={`${SITE.legalName} exists because multi-location teams still discover a wrong phone number from a customer, not from a dashboard.`}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 text-[17px] leading-relaxed text-ink-soft">
            <p>
              Maps do not wait for a rebrand. Apple, Google, Bing, and a long tail of directories each keep a copy of your name, address, phone, hours, and category. When those copies drift, the map pack splits, reviews orphan, and a franchisee’s weekend hours never leave Google.
            </p>
            <p>
              BLM is independent software, not a reseller overlay, not a directory that wants your listing as inventory. We build the listing health auditor and the workspace around it so operators can see, in color, what is actually published.
            </p>
            <p>
              The company is led by {SITE.author}. Editorial is published as {SITE.editorial} when a piece is collaborative. We would rather be useful to local SEO teams than famous to them.
            </p>
          </article>
          <aside className="rounded-3xl bg-sand p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Facts</p>
            <ul className="mt-3 space-y-3 text-sm">
              <li>Independent brand. No parent logo in the hero.</li>
              <li>Category: business listing management for multi-location, franchise, agency, and local SEO teams.</li>
              <li>Early access: start a free trial, then Growth and Enterprise as the footprint grows.</li>
            </ul>
            <Button asChild className="mt-6">
              <Link to="/contact">Say hello</Link>
            </Button>
          </aside>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
