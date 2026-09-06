import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/uberall-alternative")({
  head: () =>
    pageHead({
      title: "Uberall alternative",
      description:
        "Coming soon: equal-weakness notes on BLM as an Uberall alternative for US teams that need listing hygiene without a full location-marketing suite.",
      path: "/compare/uberall-alternative",
    }),
  component: UberallStub,
});

function UberallStub() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Uberall alternative", path: "/compare/uberall-alternative" },
        ])}
      />
      <InnerPage
        eyebrow="Compare · Uberall"
        title="Uberall alternative"
        lede="Coming soon. A short equal-weakness teaser when location marketing suites outgrow a listings-only RFP."
      >
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            Uberall is typically evaluated as a broader location marketing platform. BLM stays on listing health: NAP,
            coverage, duplicates, and hours. Full comparison copy lands later. This stub keeps the compare dropdown and
            footer links honest with a real 200 route.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Uberall is often stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Location marketing surface beyond listings (pages, reviews, social adjacency).</li>
              <li>Enterprise sales motion for multi-market footprints.</li>
              <li>Fit when one vendor must own presence marketing, not only NAP hygiene.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is narrower on purpose</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Public list pricing and a create-workspace try path.</li>
              <li>Listing ops as the product, not a module inside a larger suite.</li>
              <li>Equal-weakness framing: we do not claim suite breadth we do not ship.</li>
            </ul>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Prefer the product whose weakness you can live with. Start with the{" "}
          <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
            compare hub
          </Link>{" "}
          and the published{" "}
          <Link to="/compare/yext-alternative" className="font-medium text-ink underline-offset-2 hover:underline">
            Yext alternative
          </Link>{" "}
          guide.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/signup">Create workspace</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/compare">Back to compare</Link>
          </Button>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
