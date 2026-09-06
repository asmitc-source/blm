import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { GLOSSARY } from "@/lib/content/glossary";
import { pageHead, breadcrumbJsonLd, definedTermJsonLd, definedTermSetJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

const BLM_DEF =
  "Business listing management is the ongoing process of creating, verifying, and synchronizing a company's name, address, phone (NAP), hours, and categories across search engines, maps, and online directories so every location stays accurate.";

export const Route = createFileRoute("/glossary")({
  head: () =>
    pageHead({
      title: "Business listing management glossary",
      description:
        "Glossary of business listing management terms: the head-term definition, NAP, citations, Google Business Profile, duplicates, aggregators, coverage, and health score. Short definitions you can cite.",
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
      <JsonLd
        data={definedTermSetJsonLd({
          name: "Business listing management glossary",
          description:
            "Short definitions for business listing management, NAP, citations, Google Business Profile, duplicates, and related local presence terms.",
          url: `${SITE.domain}/glossary`,
        })}
      />
      <JsonLd
        data={definedTermJsonLd({
          name: "Business listing management",
          description: BLM_DEF,
          url: `${SITE.domain}/glossary#business-listing-management`,
        })}
      />
      <InnerPage
        eyebrow="Glossary"
        title="Business listing management vocabulary."
        lede="Short definitions you can cite. The head term lives here in brief and in full on the definition guide."
      >
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Read{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>
          , then use the{" "}
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            homepage
          </Link>
          ,{" "}
          <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
            compare listing software
          </Link>
          , and{" "}
          <Link to="/pricing" className="font-medium text-ink underline-offset-2 hover:underline">
            pricing
          </Link>{" "}
          when you move from vocabulary to buying.
        </p>
        <dl className="grid gap-3">
          {GLOSSARY.map((item) => {
            const id = item.term.toLowerCase().replace(/\s+/g, "-");
            return (
              <div key={item.term} id={id} className="rounded-2xl bg-cream px-5 py-4 hairline">
                <dt className="font-display text-lg font-semibold text-ink">{item.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{item.def}</dd>
                {item.links?.length ? (
                  <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                    {item.links.map((link) => {
                      if (link.slug) {
                        return (
                          <Link
                            key={link.label}
                            to="/blog/$slug"
                            params={{ slug: link.slug }}
                            className="text-brand hover:text-brand-hover"
                          >
                            {link.label}
                          </Link>
                        );
                      }
                      if (link.to === "/compare") {
                        return (
                          <Link key={link.label} to="/compare" className="text-ink-soft hover:text-ink">
                            {link.label}
                          </Link>
                        );
                      }
                      if (link.to === "/pricing") {
                        return (
                          <Link key={link.label} to="/pricing" className="text-ink-soft hover:text-ink">
                            {link.label}
                          </Link>
                        );
                      }
                      return (
                        <Link key={link.label} to="/" className="text-ink-soft hover:text-ink">
                          {link.label}
                        </Link>
                      );
                    })}
                  </dd>
                ) : null}
              </div>
            );
          })}
        </dl>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
          Sources checked 2026-09-06:{" "}
          <a className="underline-offset-2 hover:underline" href="https://support.google.com/business/" target="_blank" rel="noreferrer">
            Google Business Profile Help
          </a>
          ,{" "}
          <a className="underline-offset-2 hover:underline" href="https://businessconnect.apple.com/" target="_blank" rel="noreferrer">
            Apple Business Connect
          </a>
          ,{" "}
          <a className="underline-offset-2 hover:underline" href="https://www.bingplaces.com/" target="_blank" rel="noreferrer">
            Bing Places for Business
          </a>
          ,{" "}
          <a className="underline-offset-2 hover:underline" href="https://moz.com/learn/seo/local" target="_blank" rel="noreferrer">
            Moz Local SEO
          </a>
          . Publisher UIs move; confirm the live help article before you file a change.
        </p>
      </InnerPage>
    </SiteShell>
  );
}
