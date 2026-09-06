import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";
import { PRICING } from "@/lib/site";
import { loadPublicSite } from "@/lib/cms/public";
import { pageHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  loader: () => loadPublicSite(),
  head: () =>
    pageHead({
      title: "Business listing management pricing",
      description:
        "Business listing management pricing for BLM: Starter listed at $49/month for one location, Growth at $149/month for up to 25 locations, Enterprise custom. Start a free trial or book a call.",
      path: "/pricing",
    }),
  component: PricingPage,
});

const faqs = [
  { q: "How do I start?", a: "Start a free trial for Starter product access, or book a call for Growth and Enterprise. Billing is not live yet. Listed rates are Starter $49/month and Growth $149/month when charging begins." },
  { q: "What counts as a location?", a: "A unique storefront NAP: one canonical name, address, and phone. Service-area businesses count as one location per coverage area you publish." },
  { q: "Is there a free plan?", a: "There is no billed free plan. Start a free trial for product access. Listed rates are Starter $49/month and Growth $149/month when billing goes live." },
];

const SCALES = [
  { id: "starter", label: "1 location" },
  { id: "growth", label: "2-25" },
  { id: "enterprise", label: "26+" },
] as const;

function PricingPage() {
  const [picked, setPicked] = useState("growth");
  const data = Route.useLoaderData();
  const plans = data.copy.plans?.length ? data.copy.plans : PRICING;
  const pageFaqs = data.faqs.length ? data.faqs : faqs;

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd data={faqJsonLd(pageFaqs)} />
      <InnerPage
        compact
        eyebrow="Pricing"
        title={data.copy.pricingTitle}
        lede={data.copy.pricingLede}
      >
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Business listing management cost on BLM is listed SaaS plus the labor to close alerts: Starter at $49/month for one location, Growth at $149/month for up to 25 locations, Enterprise custom. Billing is not live yet. Start a free trial or book a call. For the planning model (DIY hours, agency retainers, drift), read{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "business-listing-management-cost-2026" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            business listing management cost in 2026
          </Link>
          . New to the category? Start with{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>
          , the{" "}
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            homepage
          </Link>
          , or{" "}
          <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
            compare listing software
          </Link>
          .
        </p>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-sm font-semibold text-ink-soft">How many storefronts?</p>
          {SCALES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={cn("scale-pill", picked === s.id && "is-on")}
              onClick={() => setPicked(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 80} className="h-full">
              <article
                tabIndex={0}
                onMouseEnter={() => setPicked(plan.id)}
                onFocus={() => setPicked(plan.id)}
                className={cn(
                  "flex h-full flex-col rounded-2xl p-6 transition-[transform,box-shadow] duration-200",
                  picked === plan.id ? "plan-featured shadow-[var(--elev-lift)] -translate-y-1" : "bg-cream hairline",
                )}
              >
                <p className="text-sm font-semibold">{plan.name}</p>
                <p className="mt-3 font-display text-4xl font-semibold">
                  {plan.price}
                  <span className="ml-1 text-base font-medium text-muted">{plan.cadence}</span>
                </p>
                <p className="mt-2 text-sm text-muted">{plan.blurb}</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8" variant={picked === plan.id || plan.featured ? "primary" : "secondary"}>
                  {plan.id === "starter" ? (
                    <Link to="/trial">{plan.cta}</Link>
                  ) : (
                    <Link to="/book">{plan.cta}</Link>
                  )}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
        <dl className="mt-12 grid gap-3">
          {pageFaqs.map((f) => (
            <FaqRow key={f.q} q={f.q} a={f.a} />
          ))}
        </dl>
      </InnerPage>
    </SiteShell>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-cream px-5 hairline">
      <button
        type="button"
        className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold">{q}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <p className="overflow-hidden text-sm leading-relaxed text-muted">
          <span className="block pb-4">{a}</span>
        </p>
      </div>
    </div>
  );
}
