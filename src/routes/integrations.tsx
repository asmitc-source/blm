import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Button } from "@/components/ui/button";
import { INTEGRATIONS } from "@/lib/site";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/integrations")({
  head: () =>
    pageHead({
      title: "Business listing management integrations",
      description:
        "Business listing management integrations on BLM: Google Business Profile, Apple Maps, Bing Places, Facebook, Yelp, and the directory network used in local search.",
      path: "/integrations",
    }),
  component: IntegrationsPage,
});

const TONE: Record<string, string> = {
  mint: "bg-mint-soft text-mint",
  coral: "bg-coral-soft text-coral",
  lavender: "bg-lavender-soft text-lavender",
  butter: "bg-butter-soft text-butter",
  sky: "bg-sky-soft text-sky",
};

function IntegrationsPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Integrations", path: "/integrations" },
        ])}
      />
      <InnerPage
        eyebrow="Integrations"
        title="Google, Apple, Bing, and the directory network customers still open."
        lede="Business listing management is not a Google-only job. BLM treats maps, social discovery, and classic directories as one coverage graph so every location stays accurate."
      >
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ink-soft">
          See the product view on the{" "}
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            BLM homepage
          </Link>{" "}
          or the category definition in{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>
          .
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INTEGRATIONS.map((item) => (
            <article key={item.name} className="rounded-3xl bg-cream p-5 hairline">
              <span className={`inline-flex size-10 items-center justify-center rounded-2xl text-sm font-bold ${TONE[item.tone]}`}>
                {item.name.slice(0, 1)}
              </span>
              <h2 className="mt-3 font-semibold">{item.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">{item.group}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm text-muted">
          Publisher availability varies by country and category. Growth covers the core maps graph. Enterprise extends the directory set for franchises and agencies.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/trial">Start free trial</Link>
          </Button>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
