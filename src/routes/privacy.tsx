import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy",
      description: "Privacy policy for Business Listing Management: how we collect, use, and store lead and account data.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteShell>
      <InnerPage eyebrow="Legal" title="Privacy policy" lede="Last updated 1 September 2026.">
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            {SITE.legalName} (“BLM”, “we”) provides business listing management software at {SITE.domain}. This policy
            describes the information we collect when you use the site, the auditor, forms, and a workspace. For product
            context, start on the{" "}
            <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
              BLM homepage
            </Link>
            .
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">What we collect</h2>
          <p>
            Work email, name, company, role, location count, and messages you submit on contact, demo, signup, and “email me the full report.” If you create an account, we store authentication data via our identity provider (Google or email and password).
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">How we use it</h2>
          <p>
            To run the product, reply to you, measure demand, and send the listing report you requested. We do not sell personal information. We do not use listing form contents to train public models.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Storage</h2>
          <p>
            Lead rows live in our application database. You can ask us to delete a lead or close an account by emailing {SITE.email}.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Cookies</h2>
          <p>
            We use a session cookie to keep you signed in, and essential cookies required to run the site. See the cookies page for details.
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">Contact</h2>
          <p>{SITE.email}</p>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
