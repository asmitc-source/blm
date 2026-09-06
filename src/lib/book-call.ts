/** Host email for Book a call calendar invites (Google Calendar TEMPLATE fallback). */
export const BOOK_CALL_EMAIL = "asmit@nakama.in";

/**
 * Google Appointment Schedule booking page.
 * Claire sets VITE_GOOGLE_APPOINTMENT_URL in Vercel once the schedule URL exists.
 * GOOGLE_APPOINTMENT_URL is accepted as an optional alias at build time.
 * Empty until that env is injected; /book then falls back to a TEMPLATE invite.
 */
const BOOKING_SCHEDULE_URL_PLACEHOLDER = "";

function readAppointmentEnv(): string {
  const vitePrefixed = String(import.meta.env.VITE_GOOGLE_APPOINTMENT_URL ?? "").trim();
  if (vitePrefixed) return vitePrefixed;
  const alias = String(
    (import.meta.env as ImportMetaEnv & { GOOGLE_APPOINTMENT_URL?: string }).GOOGLE_APPOINTMENT_URL ??
      "",
  ).trim();
  if (alias) return alias;
  if (typeof process !== "undefined") {
    const fromProcess = (
      process.env.VITE_GOOGLE_APPOINTMENT_URL ||
      process.env.GOOGLE_APPOINTMENT_URL ||
      ""
    ).trim();
    if (fromProcess) return fromProcess;
  }
  return BOOKING_SCHEDULE_URL_PLACEHOLDER;
}

export const BOOKING_SCHEDULE_URL = readAppointmentEnv();

export function hasBookingSchedule(): boolean {
  return BOOKING_SCHEDULE_URL.length > 0;
}

/**
 * Last-resort Google Calendar TEMPLATE invite for asmit@nakama.in.
 * Used only when BOOKING_SCHEDULE_URL is not set at build time.
 */
export function googleCalendarBookUrl(opts?: {
  title?: string;
  details?: string;
  durationMinutes?: number;
}): string {
  const title = opts?.title ?? "BLM listing walkthrough";
  const details =
    opts?.details ??
    `Book a call with ${BOOK_CALL_EMAIL} about multi-location listing health, NAP consistency, and directory coverage. Host: ${BOOK_CALL_EMAIL}.`;
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
