/** User-agents that only need head/OG tags — keep SSR HTML tiny for unfurlers. */
const SOCIAL_BOT_RE =
  /Slackbot|Slack-ImgProxy|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Discordbot|WhatsApp|TelegramBot|Pinterest|redditbot|Embedly|Quora Link Preview|Showyoubot|outbrain|vkShare|W3C_Validator|Google-PageRenderer|bingpreview|Applebot|Iframely/i;

export function isSocialUnfurlBot(userAgent: string | null | undefined) {
  return SOCIAL_BOT_RE.test(String(userAgent || ""));
}
