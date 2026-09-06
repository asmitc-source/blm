import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactSection } from "@/components/home/contact-section";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact business listing management at BLM",
      description:
        "Contact BLM about business listing management for multi-location brands, franchises, agencies, and local SEO teams. Sales, onboarding, and support.",
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
      <main>
        <ContactSection source="contact" className="border-t-0" />
      </main>
    </SiteShell>
  );
}
