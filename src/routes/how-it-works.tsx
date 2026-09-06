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
      title: "How it works",
      description:
        "How BLM unifies, audits, and governs business listings across Google, Apple, Bing, and the directory network.",
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
        lede="Scroll the seven steps. The Northline desk follows. Humans stay in control of NAP and duplicates. Automation handles fingerprinting, coverage, and the weekly digest."
      />
      <Workflow showHeader={false} />
      <div className="page-wrap pb-20">
        <div className="cta-band rounded-3xl border border-line px-6 py-10 sm:px-10">
          <h2 className="font-display text-3xl font-semibold">Run it on your own footprint</h2>
          <p className="mt-2 max-w-xl text-ink-soft">Create a workspace, or book a walkthrough if you already run a national set of pins.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/signup">Create workspace</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/demo">Book a demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
