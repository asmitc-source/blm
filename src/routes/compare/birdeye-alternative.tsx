import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/compare/birdeye-alternative")({
  head: () =>
    pageHead({
      title: "Birdeye alternative",
      description:
        "Coming soon: equal-weakness notes on BLM as a Birdeye alternative when listing hygiene matters more than reviews and reputation suites.",
      path: "/compare/birdeye-alternative",
    }),
  component: BirdeyeStub,
});

function BirdeyeStub() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: "Birdeye alternative", path: "/compare/birdeye-alternative" },
        ])}
      />
      <InnerPage
        eyebrow="Compare · Birdeye"
        title="Birdeye alternative"
        lede="Coming soon. A short equal-weakness teaser when reputation suites and listing desks get compared in the same RFP."
      >
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            Birdeye is commonly bought for reviews, reputation, and customer experience workflows. BLM is a listing
            health desk: NAP, coverage, duplicates, and hours. Full article content arrives later. This page exists so
            compare navigation stays free of 404s.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where Birdeye is often stronger</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Reviews and reputation as the primary product surface.</li>
              <li>Customer messaging and CX tooling adjacent to listings.</li>
              <li>Fit when the painful object is review volume and response ops, not NAP drift.</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-cream p-5 hairline">
            <h2 className="font-display text-xl font-semibold text-ink">Where BLM is narrower on purpose</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>Listing hygiene across Google, Apple, Bing, and the directory network.</li>
              <li>Public rates and workspace try without a reputation-suite sales pitch.</li>
              <li>No claim to replace reviews/CX modules we do not ship.</li>
            </ul>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Prefer the product whose weakness you can live with. Use the{" "}
          <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
            compare hub
          </Link>{" "}
          and{" "}
          <Link to="/compare/brightlocal-alternative" className="font-medium text-ink underline-offset-2 hover:underline">
            BrightLocal alternative
          </Link>{" "}
          for published equal-weakness notes today.
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
