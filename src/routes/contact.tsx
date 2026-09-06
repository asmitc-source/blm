import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactSection } from "@/components/home/contact-section";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

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
      <main>
        <ContactSection source="contact" className="border-t-0" />
      </main>
    </SiteShell>
  );
}
