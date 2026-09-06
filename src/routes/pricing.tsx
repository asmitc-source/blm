import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";
import { PRICING } from "@/lib/site";
import { pageHead, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead({
      title: "Pricing",
      description:
        "BLM pricing: Starter at $49/month, Growth at $149/month, Enterprise custom. Both Starter and Growth include a 7-day free trial.",
      path: "/pricing",
    }),
  component: PricingPage,
});

const faqs = [
  { q: "How do I start?", a: "Start a 7-day free trial of Starter or Growth. We capture the lead. After seven days Starter is $49/month and Growth is $149/month." },
  { q: "What counts as a location?", a: "A unique storefront NAP: one canonical name, address, and phone. Service-area businesses count as one location per coverage area you publish." },
  { q: "Is there a free plan?", a: "No. Starter is $49/month and Growth is $149/month. Both include a 7-day free trial." },
];

const SCALES = [
  { id: "starter", label: "1 location" },
  { id: "growth", label: "Up to 25" },
  { id: "enterprise", label: "80 and up" },
] as const;

function PricingPage() {
  const [picked, setPicked] = useState("growth");

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InnerPage
        compact
        eyebrow="Pricing"
        title="Starter $49. Growth $149. Seven days free."
        lede="Start a free trial of Starter or Growth. After seven days, pick the plan that matches the footprint."
      >
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
          {PRICING.map((plan, i) => (
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
                  {plan.id === "enterprise" ? (
                    <Link to="/demo">{plan.cta}</Link>
                  ) : (
                    <Link to="/signup">{plan.cta}</Link>
                  )}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
        <dl className="mt-12 grid gap-3">
          {faqs.map((f) => (
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
