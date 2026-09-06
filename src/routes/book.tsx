import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { InnerPage } from "@/components/layout/inner-page";
import { LeadForm } from "@/components/lead-form";
import { Button } from "@/components/ui/button";
import {
  BOOK_CALL_EMAIL,
  BOOKING_SCHEDULE_URL,
  googleCalendarBookUrl,
  hasBookingSchedule,
} from "@/lib/book-call";
import { pageHead, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const Route = createFileRoute("/book")({
  head: () =>
    pageHead({
      title: "Book a business listing management call",
      description:
        "Book a 30-minute business listing management call with BLM. See NAP drift, duplicates, and coverage on your real multi-location footprint, then map Starter, Growth, or Enterprise.",
      path: "/book",
    }),
  component: BookPage,
});

function BookPage() {
  const [calendarOpened, setCalendarOpened] = useState(false);
  const scheduleReady = hasBookingSchedule();
  const scheduleUrl = BOOKING_SCHEDULE_URL;
  const templateUrl = useMemo(() => googleCalendarBookUrl(), []);
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
        lede="Book a business listing management walkthrough on locations you name. We cover NAP drift, duplicates, and publisher coverage, then map Starter, Growth, and Enterprise to your team."
      >
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-ink-soft">
          New to the category? Read{" "}
          <Link
            to="/blog/$slug"
            params={{ slug: "what-is-business-listing-management" }}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            what is business listing management
          </Link>
          , start on the{" "}
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            BLM homepage
          </Link>
          ,{" "}
          <Link to="/compare" className="font-medium text-ink underline-offset-2 hover:underline">
            compare listing software
          </Link>
          , or check{" "}
          <Link to="/pricing" className="font-medium text-ink underline-offset-2 hover:underline">
            business listing management pricing
          </Link>
          .
        </p>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-cream p-6 hairline">
            <p className="text-sm font-semibold text-ink">Leave your details</p>
            <p className="mt-1 text-sm text-muted">
              Tell us who you are and which locations matter. We record the lead, then you pick a time on the calendar
              with {BOOK_CALL_EMAIL}.
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
              {scheduleReady ? (
                <>
                  <p className="text-sm font-semibold text-ink">Pick a date and time</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    Choose a slot on the live calendar below. Host: {BOOK_CALL_EMAIL}.
                  </p>
                  <div className="mt-5 overflow-hidden rounded-2xl bg-paper hairline">
                    <iframe
                      title="Book a call calendar"
                      src={scheduleUrl}
                      className="w-full border-0"
                      style={{ minHeight: 680 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="mt-5">
                    <Button asChild size="lg">
                      <a
                        href={scheduleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setCalendarOpened(true)}
                      >
                        <ExternalLink className="size-4" />
                        Open calendar
                      </a>
                    </Button>
                  </div>
                  {calendarOpened ? (
                    <p className="mt-3 text-sm text-mint">Calendar opened in a new tab.</p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-ink">Booking calendar</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    The live booking calendar with dates and times loads from the appointment schedule URL once it is
                    configured. Until then, open a calendar invite hosted by {BOOK_CALL_EMAIL}.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg">
                      <a
                        href={templateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setCalendarOpened(true)}
                      >
                        <Calendar className="size-4" />
                        Open calendar invite
                      </a>
                    </Button>
                  </div>
                  {calendarOpened ? (
                    <p className="mt-3 text-sm text-mint">
                      Calendar opened in a new tab. Add the invite when ready.
                    </p>
                  ) : null}
                </>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">What you get on the call</p>
              <ul className="mt-3 space-y-3 text-sm text-ink-soft">
                {[
                  "A business listing management health score on locations you name",
                  "How duplicates and NAP drift show up in the product",
                  "Coverage across Google, Apple, Bing, and the directory network",
                  "What Starter, Growth, and Enterprise look like for your team",
                ].map((item) => (
                  <li key={item} className="rounded-xl bg-paper px-4 py-3 hairline">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted">
              Ready to try the product yourself?{" "}
              <Link to="/trial" className="cursor-pointer font-semibold text-ink underline-offset-2 hover:underline focus-visible:underline">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </InnerPage>
    </SiteShell>
  );
}
