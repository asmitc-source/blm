import { SITE } from "@/lib/site";

const cream = "#faf6ef";
const ink = "#1a1a1a";
const soft = "#5c5a55";
const tileA = "#f58b4c";
const tileB = "#f0c808";
const tileC = "#a78bfa";
const tileD = "#34d399";

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
      ? `<p style="margin:28px 0 0;text-align:center">
          <a href="${opts.ctaHref}" style="display:inline-block;background:${tileA};color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${opts.ctaLabel}</a>
        </p>`
      : "";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>${opts.title}</title></head>
<body style="margin:0;padding:0;background:${cream};color:${ink};font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${cream};padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#fffdf8;border:1px solid #eadfce;border-radius:24px;overflow:hidden">
        <tr><td style="height:6px;background:linear-gradient(90deg,${tileA},${tileB},${tileC},${tileD})"></td></tr>
        <tr><td style="padding:28px 28px 8px">
          <p style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${soft};font-weight:700">Business Listing Management</p>
          <h1 style="margin:12px 0 0;font-size:26px;line-height:1.25;font-weight:700;color:${ink}">${opts.title}</h1>
        </td></tr>
        <tr><td style="padding:12px 28px 28px;font-size:15px;line-height:1.6;color:${soft}">
          ${opts.bodyHtml}
          ${cta}
        </td></tr>
        <tr><td style="padding:0 28px 28px;font-size:12px;line-height:1.5;color:#8a857c">
          ${opts.footerNote ?? ""}
          <p style="margin:12px 0 0">© ${new Date().getFullYear()} ${SITE.legalName} · <a href="${SITE.domain}" style="color:${ink}">${SITE.domain.replace(/^https?:\/\//, "")}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeNewsletterEmail(opts: {
  name?: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const hello = opts.name ? `Hi ${opts.name},` : "Hi there,";
  const subject = "You're on the BLM newsletter";
  const html = shell({
    preheader: "Listing ops tips, new guides, and product notes — no spam.",
    title: "Welcome to the BLM newsletter",
    bodyHtml: `<p style="margin:0 0 12px;color:${ink}">${hello}</p>
      <p style="margin:0 0 12px">Thanks for subscribing. We'll send the occasional note when we publish a new guide on NAP, duplicates, coverage, and multi-location listing ops.</p>
      <p style="margin:0">No spam. Unsubscribe anytime.</p>`,
    ctaLabel: "Read the blog",
    ctaHref: `${SITE.domain}/blog`,
    footerNote: `<p style="margin:0"><a href="${opts.unsubscribeUrl}" style="color:${ink}">Unsubscribe</a></p>`,
  });
  const text = `${hello}\n\nThanks for subscribing to the BLM newsletter.\nRead the blog: ${SITE.domain}/blog\nUnsubscribe: ${opts.unsubscribeUrl}\n`;
  return { subject, html, text };
}

export function newArticleEmail(opts: {
  title: string;
  excerpt: string;
  url: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `New on BLM: ${opts.title}`;
  const html = shell({
    preheader: opts.excerpt.slice(0, 120),
    title: opts.title,
    bodyHtml: `<p style="margin:0 0 12px">We just published a new article.</p>
      <p style="margin:0 0 12px;color:${ink}">${opts.excerpt}</p>`,
    ctaLabel: "Read the article",
    ctaHref: opts.url,
    footerNote: `<p style="margin:0"><a href="${opts.unsubscribeUrl}" style="color:${ink}">Unsubscribe</a></p>`,
  });
  const text = `New on BLM: ${opts.title}\n\n${opts.excerpt}\n\nRead: ${opts.url}\nUnsubscribe: ${opts.unsubscribeUrl}\n`;
  return { subject, html, text };
}
