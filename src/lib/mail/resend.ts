/**
 * Resend email client for newsletter / transactional mail.
 *
 * Env:
 *   RESEND_API_KEY  required — from https://resend.com (Vercel/local only, never commit)
 *   RESEND_FROM     optional — default "BLM <hello@businesslistingmanagement.com>"
 */
import { Resend } from "resend";

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function env(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

const DEFAULT_FROM = "BLM <hello@businesslistingmanagement.com>";

export function isMailConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

/** @deprecated Use isMailConfigured — kept for any older call sites. */
export function smtpConfigured(): boolean {
  return isMailConfigured();
}

function fromAddress(): string {
  return env("RESEND_FROM") || DEFAULT_FROM;
}

/**
 * Send one email via Resend. Throws on API failure.
 * Callers should catch and continue when mail is best-effort.
 */
export async function sendMail(msg: MailMessage): Promise<void> {
  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const resend = new Resend(apiKey);
  const text =
    msg.text ??
    msg.html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    text,
  });

  if (error) {
    throw new Error(error.message || "Resend send failed");
  }
}

/**
 * Best-effort send: returns { ok, skipped?, error? } and never throws.
 */
export async function trySendMail(msg: MailMessage): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  if (!isMailConfigured()) {
    return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }
  try {
    await sendMail(msg);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
