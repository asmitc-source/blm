import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Workflow } from "@/components/home/workflow";
import { Button } from "@/components/ui/button";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead({
      title: "How business listing management works",
      description:
        "How business listing management works on BLM: unify NAP, audit publishers, close duplicates, and govern coverage across Google, Apple, Bing, and the directory network.",
      path: "/how-it-works",
    }),
  component: HowPage,
});

function HowPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />
      <InnerPage
        compact
        eyebrow="Workflow"
        title="From messy listings to a governed presence."
        lede="Business listing management on BLM is seven steps from messy citations to a governed presence. Humans stay in control of NAP and duplicates. Automation handles fingerprinting, coverage, and the weekly digest."
      />
      <div className="page-wrap pt-8">
        <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">
          New to the category? Read{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>{" "}
          or start on the{" "}
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            BLM homepage
          </Link>
          .
        </p>
      </div>
      <Workflow showHeader={false} />
      <div className="page-wrap pb-20">
        <div className="cta-band rounded-3xl border border-line px-6 py-10 sm:px-10">
          <h2 className="font-display text-3xl font-semibold">Run it on your own footprint</h2>
          <p className="mt-2 max-w-xl text-ink-soft">Start a free trial, or book a call if you already run a national set of pins.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/trial">Start free trial</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/book">Book a call</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
