import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Mail } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { LeadForm } from "@/components/lead-form";
import { Button } from "@/components/ui/button";
import { BOOK_CALL_EMAIL, googleCalendarBookUrl, mailtoBookUrl } from "@/lib/book-call";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/book")({
  head: () =>
    pageHead({
      title: "Book a call",
      description:
        "Book a call with BLM about franchise, agency, or multi-location listing management. Calendar invite goes to contact@nakama.in.",
      path: "/book",
    }),
  component: BookPage,
});

function BookPage() {
  const [calendarOpened, setCalendarOpened] = useState(false);
  const calendarUrl = useMemo(() => googleCalendarBookUrl(), []);
  const mailUrl = useMemo(() => mailtoBookUrl(), []);
  const leadSource = useMemo(() => {
    if (typeof window === "undefined") return "book-a-call";
    try {
      const stashed = window.sessionStorage.getItem("blm-lead-source");
      if (stashed === "create-workspace") {
        window.sessionStorage.removeItem("blm-lead-source");
        return "create-workspace";
      }
    } catch {
      /* ignore */
    }
    return "book-a-call";
  }, []);

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book a call", path: "/book" },
        ])}
      />
      <InnerPage
        eyebrow="Book a call"
        title="Thirty minutes on your actual footprint."
        lede="Share a few locations. We will walk NAP drift, duplicates, and coverage, then how Starter, Growth, and Enterprise fit your team. The invite goes to contact@nakama.in."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-cream p-6 hairline">
            <p className="text-sm font-semibold text-ink">Leave your details</p>
            <p className="mt-1 text-sm text-muted">
              We record the lead, then you can open a calendar invite for {BOOK_CALL_EMAIL}.
            </p>
            <div className="mt-5">
              <LeadForm
                kind={leadSource === "create-workspace" ? "early-access" : "demo"}
                source={leadSource}
                submitLabel="Save details"
                showMessage
                onDone={() => {
                  /* keep form success state; calendar CTA stays below */
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-cream p-6 hairline">
              <p className="text-sm font-semibold text-ink">Open a calendar invite</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Primary path opens Google Calendar with {BOOK_CALL_EMAIL} already on the invite. Prefer email? Use the
                mailto fallback.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalendarOpened(true)}
                  >
                    <Calendar className="size-4" />
                    Open Google Calendar
                  </a>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <a href={mailUrl}>
                    <Mail className="size-4" />
                    Email {BOOK_CALL_EMAIL}
                  </a>
                </Button>
              </div>
              {calendarOpened ? (
                <p className="mt-3 text-sm text-mint">Calendar opened in a new tab. Add the invite when ready.</p>
              ) : null}
            </div>
            <ul className="space-y-3 text-sm text-ink-soft">
              {[
                "A listing health score on locations you name",
                "How duplicates and NAP drift show up in the product",
                "Coverage across Google, Apple, Bing, and the directory network",
                "What Starter, Growth, and Enterprise look like for your team",
              ].map((item) => (
                <li key={item} className="rounded-xl bg-paper px-4 py-3 hairline">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              Ready to try the product yourself?{" "}
              <Link to="/trial" className="font-semibold text-ink">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
