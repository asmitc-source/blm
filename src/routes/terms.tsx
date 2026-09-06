import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      title: "Terms",
      description: "Terms of use for Business Listing Management software, audits, and workspaces.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteShell>
      <InnerPage eyebrow="Legal" title="Terms of use" lede="Last updated 1 September 2026.">
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            By using {SITE.domain} you agree to these terms for BLM business listing management software. The Listing
            Health Auditor helps you understand listing quality. Results are generated from the information you enter and
            our matching model; they are not a guarantee of search rankings. Product overview lives on the{" "}
            <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
              BLM homepage
            </Link>
            .
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Accounts</h2>
          <p>
            You are responsible for the accuracy of locations you add and for keeping your login credentials safe. Free, Growth, and Enterprise features are described on the pricing page and may change with notice.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Acceptable use</h2>
          <p>
            Do not use the auditor or workspace to harvest personal data, spam publishers, or impersonate businesses you do not represent.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Liability</h2>
          <p>
            The service is provided as available. We are not liable for lost rankings, unpublished hours, or third-party publisher decisions.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Contact</h2>
          <p>{SITE.email}</p>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
