import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { GLOSSARY } from "@/lib/content/glossary";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/glossary")({
  head: () =>
    pageHead({
      title: "Glossary",
      description:
        "Glossary of business listing management terms: NAP, citations, Google Business Profile, duplicates, aggregators, and health score.",
      path: "/glossary",
    }),
  component: GlossaryPage,
});

function GlossaryPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Glossary", path: "/glossary" },
        ])}
      />
      <InnerPage
        eyebrow="Glossary"
        title="The vocabulary of listing operations."
        lede="Short definitions you can cite. For the long version, start with the business listing management guide."
      >
        <dl className="grid gap-3">
          {GLOSSARY.map((item) => (
            <div key={item.term} id={item.term.toLowerCase().replace(/\s+/g, "-")} className="rounded-2xl bg-cream px-5 py-4 hairline">
              <dt className="font-display text-lg font-semibold text-ink">{item.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{item.def}</dd>
            </div>
          ))}
        </dl>
      </InnerPage>
    </SiteShell>
  );
}
