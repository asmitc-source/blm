import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/moz-local-alternative")({
  head: () =>
    pageHead({
      title: "Moz Local alternative",
      description:
        "Coming soon: equal-weakness notes on BLM as a Moz Local alternative for US teams focused on listing health, NAP, and directory coverage.",
      path: "/compare/moz-local-alternative",
    }),
  component: MozLocalStub,
});

function MozLocalStub() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Moz Local alternative", path: "/compare/moz-local-alternative" },
        ])}
      />
      <InnerPage
        eyebrow="Compare · Moz Local"
        title="Moz Local alternative"
        lede="Coming soon. A short equal-weakness teaser for teams choosing between Moz Local and a listings-only desk."
      >
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            Moz Local is often bought as part of a broader local SEO toolkit. BLM is narrower: NAP consistency,
            coverage, duplicates, and hours across Google, Apple, Bing, and the directory network. Full article content
            is still being written. The route is live so compare nav and footer links do not 404.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Moz Local is often stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Local SEO tooling adjacent to Moz&apos;s research and rank workflows.</li>
              <li>Citation / directory submission packaging familiar to agency retainers.</li>
              <li>Fit when listings are one chapter of a larger Moz-shaped stack.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is narrower on purpose</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Listing health desk with public rates and a workspace try path.</li>
              <li>Duplicate radar and hours gaps treated as first-class tickets.</li>
              <li>No rank grids, no knowledge graph, no pretend win-rate chart.</li>
            </ul>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Prefer the product whose weakness you can live with. See the{" "}
          <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
            compare hub
          </Link>{" "}
          for the Yext and BrightLocal guides already published.
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
