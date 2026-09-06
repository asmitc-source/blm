import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { LeadForm } from "@/components/lead-form";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/demo")({
  head: () =>
    pageHead({
      title: "Book a demo",
      description:
        "Book a BLM demo for franchise, agency, or multi-location listing management. Early access for operators.",
      path: "/demo",
    }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book a demo", path: "/demo" },
        ])}
      />
      <InnerPage
        eyebrow="Demo"
        title="Thirty minutes on your actual footprint."
        lede="Bring a few locations. We’ll show NAP drift, duplicates, and coverage, then how Growth and Enterprise keep the score from sliding."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-cream p-6 hairline">
            <LeadForm kind="demo" source="demo" submitLabel="Request a demo" showMessage />
          </div>
          <ul className="space-y-3 text-sm text-ink-soft">
            {[
              "A listing health score on locations you name",
              "How duplicates and NAP drift show up in the product",
              "Coverage across Google, Apple, Bing, and the directory network",
              "What Growth vs Enterprise looks like for your team",
            ].map((item) => (
              <li key={item} className="rounded-xl bg-paper px-4 py-3 hairline">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
