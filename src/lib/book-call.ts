/** Sales calendar invite target for Book a call flows. */
export const BOOK_CALL_EMAIL = "contact@nakama.in";

/**
 * Google Calendar TEMPLATE URL that pre-fills an invite for contact@nakama.in.
 * Opens in a new tab; mailto is the fallback when Calendar is blocked.
 */
export function googleCalendarBookUrl(opts?: {
  title?: string;
  details?: string;
  durationMinutes?: number;
}): string {
  const title = opts?.title ?? "BLM listing walkthrough";
  const details =
    opts?.details ??
    "Book a call with the BLM team about multi-location listing health, NAP consistency, and directory coverage.";
  const duration = opts?.durationMinutes ?? 30;
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 2);
  start.setUTCHours(15, 0, 0, 0);
  const end = new Date(start.getTime() + duration * 60_000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
    dates: `${fmt(start)}/${fmt(end)}`,
    add: BOOK_CALL_EMAIL,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mailtoBookUrl(opts?: { subject?: string; body?: string }): string {
  const subject = opts?.subject ?? "Book a call about BLM";
  const body =
    opts?.body ??
    "Hi BLM team,\n\nI would like to book a call about listing management for our locations.\n\nThanks";
  return `mailto:${BOOK_CALL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
