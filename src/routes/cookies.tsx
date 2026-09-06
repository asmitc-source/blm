import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: () =>
    pageHead({
      title: "Cookies",
      description: "Cookie policy for Business Listing Management: session cookies for sign-in and essential site cookies.",
      path: "/cookies",
    }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <SiteShell>
      <InnerPage eyebrow="Legal" title="Cookies" lede="Last updated 1 September 2026.">
        <div className="max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-soft">
          <p>
            We use essential cookies to run the business listing management site and a session cookie to keep you signed
            in to a workspace. We do not run a third-party advertising pixel on the marketing pages. For the category
            definition, read{" "}
            <Link
              to="/blog/$slug"
              params={{ slug: "what-is-business-listing-management" }}
              className="font-medium text-ink underline-offset-2 hover:underline"
            >
              what is business listing management
            </Link>
            .
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">What you can control</h2>
          <p>
            You can block cookies in your browser. If you block session cookies, sign-in will not stay active. The Listing Health Auditor itself does not require an account cookie to run.
          </p>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
