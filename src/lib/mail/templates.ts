import { SITE } from "@/lib/site";

const cream = "#faf6ef";
const card = "#fffdf8";
const border = "#eadfce";
const ink = "#1a1a1a";
const soft = "#5c5a55";
const muted = "#8a857c";
const tileA = "#f58b4c";
const tileB = "#f0c808";
const tileC = "#a78bfa";
const tileD = "#34d399";
const accentBlue = "#2563eb";

/** Absolute HTTPS assets for email clients (relative paths break in Gmail etc.). */
const EMAIL_HEADER =
  "https://businesslistingmanagement.com/email/blm-header.png";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(opts: {
  preheader: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
}): string {
  const cta =
    opts.ctaLabel && opts.ctaHref
      ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px auto 0">
          <tr>
            <td align="center" style="border-radius:999px;background:${tileA}">
              <a href="${opts.ctaHref}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:999px">${opts.ctaLabel}</a>
            </td>
          </tr>
        </table>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <meta name="supported-color-schemes" content="light"/>
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:${cream};color:${ink};font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${opts.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${cream};padding:32px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:${card};border:1px solid ${border};border-radius:24px;overflow:hidden">
          <tr>
            <td style="padding:0;line-height:0;font-size:0">
              <img src="${EMAIL_HEADER}" width="560" alt="blm - Keep every location accurate." style="display:block;width:100%;max-width:560px;height:auto;border:0;outline:none;text-decoration:none"/>
            </td>
          </tr>
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,${tileA},${tileB},${tileC},${tileD})"></td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px">
              <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${soft};font-weight:700">Business Listing Management</p>
              <h1 style="margin:12px 0 0;font-size:26px;line-height:1.25;font-weight:700;color:${ink}">${opts.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 8px;font-size:15px;line-height:1.65;color:${soft}">
              ${opts.bodyHtml}
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 28px;font-size:12px;line-height:1.55;color:${muted};border-top:1px solid ${border}">
              ${opts.footerNote ?? ""}
              <p style="margin:12px 0 0">&copy; ${new Date().getFullYear()} ${SITE.legalName} &middot; <a href="${SITE.domain}" style="color:${ink};text-decoration:underline">${SITE.domain.replace(/^https?:\/\//, "")}</a></p>
              <p style="margin:8px 0 0;font-size:11px;color:${muted}">Questions? Write us at <a href="mailto:${SITE.email}" style="color:${ink}">${SITE.email}</a></p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:${muted};max-width:560px">You are receiving this because you subscribed at businesslistingmanagement.com.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeNewsletterEmail(opts: {
  name?: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const hello = opts.name ? `Hi ${escapeHtml(opts.name)},` : "Hi there,";
  const helloText = opts.name ? `Hi ${opts.name},` : "Hi there,";
  const subject = "You're on the BLM newsletter";
  const html = shell({
    preheader: "Listing ops tips, new guides, and product notes. No spam.",
    title: "Welcome to the BLM newsletter",
    bodyHtml: `<p style="margin:0 0 14px;color:${ink};font-size:16px">${hello}</p>
      <p style="margin:0 0 14px">Thanks for subscribing. We will send the occasional note when we publish a new guide on NAP, duplicates, coverage, and multi-location listing ops.</p>
      <p style="margin:0">No spam. Unsubscribe anytime with one click.</p>`,
    ctaLabel: "Read the blog",
    ctaHref: `${SITE.domain}/blog`,
    footerNote: `<p style="margin:0"><a href="${opts.unsubscribeUrl}" style="color:${ink};text-decoration:underline">Unsubscribe</a> from future emails.</p>`,
  });
  const text = `${helloText}

Thanks for subscribing to the BLM newsletter. We will send the occasional note when we publish a new guide on NAP, duplicates, coverage, and multi-location listing ops.

Read the blog: ${SITE.domain}/blog
Unsubscribe: ${opts.unsubscribeUrl}
`;
  return { subject, html, text };
}

export function newArticleEmail(opts: {
  title: string;
  excerpt: string;
  url: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const safeTitle = escapeHtml(opts.title);
  const safeExcerpt = escapeHtml(opts.excerpt);
  const subject = `New on BLM: ${opts.title}`;
  const html = shell({
    preheader: opts.excerpt.slice(0, 120),
    title: safeTitle,
    bodyHtml: `<p style="margin:0 0 14px">We just published a new article.</p>
      <p style="margin:0 0 4px;padding:16px 18px;background:${cream};border-left:3px solid ${accentBlue};border-radius:0 12px 12px 0;color:${ink}">${safeExcerpt}</p>`,
    ctaLabel: "Read the article",
    ctaHref: opts.url,
    footerNote: `<p style="margin:0"><a href="${opts.unsubscribeUrl}" style="color:${ink};text-decoration:underline">Unsubscribe</a> from future emails.</p>`,
  });
  const text = `New on BLM: ${opts.title}

${opts.excerpt}

Read: ${opts.url}
Unsubscribe: ${opts.unsubscribeUrl}
`;
  return { subject, html, text };
}
