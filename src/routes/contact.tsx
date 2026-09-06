import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { LeadForm } from "@/components/lead-form";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact",
      description: "Contact BLM sales or support about listing management, demos, and early access.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <InnerPage
        eyebrow="Contact"
        title="Tell us how many locations you are actually running."
        lede={`Sales and onboarding share ${SITE.salesEmail}. For press and partnerships, use ${SITE.email}.`}
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl bg-cream p-6 hairline">
            <LeadForm kind="contact" source="contact" submitLabel="Send message" showMessage />
          </div>
          <div className="space-y-4 text-sm text-ink-soft">
            <p>If you already know you need a walkthrough, use the demo page. It routes to the same desk with a calendar intent.</p>
            <p>If you want the workspace that scores your footprint, create an account so we can open it against your locations.</p>
          </div>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
