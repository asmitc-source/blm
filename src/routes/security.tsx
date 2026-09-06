import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/security")({
  head: () =>
    pageHead({
      title: "Security",
      description:
        "How BLM protects listing data: encryption in transit, least-privilege access, session isolation, and a data processing agreement on request.",
      path: "/security",
    }),
  component: SecurityPage,
});

const ITEMS = [
  { t: "Encryption in transit", d: "TLS for every browser session and server function. Listing payloads are never posted to a third-party form by default." },
  { t: "Least-privilege access", d: "Workspace data is scoped to the signed-in user. Server functions authorize with a verified session, never a client-supplied user id." },
  { t: "Session isolation", d: "Sign-in uses Google or email and password. Sessions are same-origin. Gate viewers inherit a workspace session without extra clicks." },
  { t: "Lead capture with purpose", d: "Audit emails, demo requests, and signup fields are stored so we can measure demand and follow up, not to sell a list." },
  { t: "No surprise processors", d: "A data processing agreement is available for Growth and Enterprise. We will not claim certifications we have not completed." },
  { t: "Operational access", d: "Production access is limited to operators who need it to fulfill support. Listing data is not used to train public models." },
];

function SecurityPage() {
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Security", path: "/security" },
        ])}
      />
      <InnerPage
        eyebrow="Trust"
        title="Protect the graph of where your business exists."
        lede="Listings contain phone numbers, hours, and sometimes employee names. Treat them like operational data, not marketing collateral."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {ITEMS.map((item) => (
            <article key={item.t} className="rounded-3xl bg-cream p-6 hairline">
              <h2 className="font-display text-xl font-semibold">{item.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
            </article>
          ))}
        </div>
      </InnerPage>
    </SiteShell>
  );
}
