/**
 * Self-hosted Better Auth for THIS app (server-only).
 *
 * The app runs Better Auth at `/api/auth/*`, so the session cookie stays on this
 * app's own origin. Primary sign-in is local email/password
 * (`./email-password`). Optional federated OAuth is enabled only when
 * `AUTH_ISSUER`, `AUTH_CLIENT_ID`, and `AUTH_CLIENT_SECRET` are all set.
 *
 * Modes:
 *   - Deployed: set `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `DATABASE_URL`, and
 *     leave `VITE_AUTH_ENABLED` unset or `"true"`.
 *   - Local/dev: PGLite-backed sessions when `DATABASE_URL` is absent; loopback
 *     origins are trusted for email/password.
 *   - Off (`VITE_AUTH_ENABLED=false`): no real auth; `requireUserId` resolves a
 *     shared dev user when no database is configured (see `verify.server.ts`).
 *
 * NEVER import this from client code — it pulls in `pg` and server-only Better
 * Auth internals. The client uses `@/lib/auth/client`; components read the user
 * via `@/lib/auth/use-current-user`; server functions get a verified id via
 * `@/lib/auth/middleware`.
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { AUTH_PROVIDERS } from "./providers";
import { pgliteDialect } from "./pglite-dialect";

// Kick (and share) PGLite bootstrap as soon as the auth server module loads.
void ensureDbReady();

/**
 * Preview/dev secret must outlive module reloads: PGLite (and its session rows)
 * is stored on `globalThis`, so an HMR re-eval of this file must NOT mint a new
 * signing secret or every existing session becomes invalid mid-dev. Process
 * restart clears both the secret and PGLite together.
 */
const globalAuthRef = globalThis as typeof globalThis & {
  __blmAuthPreviewSecret__?: string;
};
function previewAuthSecret(): string {
  globalAuthRef.__blmAuthPreviewSecret__ ??= randomBytes(32).toString("hex");
  return globalAuthRef.__blmAuthPreviewSecret__;
}

/** Read an env var, treating empty/whitespace as unset. */
const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

// Explicit off-switch. Set `VITE_AUTH_ENABLED=false` to force auth off (dev user).
const authDisabled = env("VITE_AUTH_ENABLED") === "false";

// Optional federated OAuth (no baked-in third-party issuer defaults).
const authIssuer = env("AUTH_ISSUER");
const authClientId = env("AUTH_CLIENT_ID");
const authClientSecret = env("AUTH_CLIENT_SECRET");
const oauthConfigured = Boolean(authIssuer && authClientId && authClientSecret);

/** True when real auth is enforced (email/password and/or optional OAuth). */
export const authConfigured = !authDisabled;

// This app's own Better Auth origin. When deployed, set BETTER_AUTH_URL to the
// public site URL. Locally we use a dynamic baseURL over loopback hosts.
const explicitBaseURL = env("BETTER_AUTH_URL");
const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];
const vercelUrl = env("VERCEL_URL");
const vercelOrigin = vercelUrl
  ? vercelUrl.startsWith("http")
    ? vercelUrl
    : `https://${vercelUrl}`
  : undefined;

const baseURL = explicitBaseURL ?? {
  allowedHosts: ["localhost", "127.0.0.1", "[::1]"],
  protocol: "auto" as const,
  fallback: "http://localhost:8080",
};

const trustedOrigins: string[] = [
  ...(explicitBaseURL ? [explicitBaseURL] : []),
  ...(vercelOrigin ? [vercelOrigin] : []),
  ...LOCAL_DEV_ORIGINS,
];

const databaseUrl = env("DATABASE_URL");

const issuerBase = (authIssuer ?? "").replace(/\/+$/, "");
const oauthAuthorizationUrl = issuerBase
  ? `${issuerBase}/api/auth/oauth2/authorize`
  : "";
const oauthTokenUrl = issuerBase ? `${issuerBase}/api/auth/oauth2/token` : "";
const oauthUserInfoUrl = issuerBase
  ? `${issuerBase}/api/auth/oauth2/userinfo`
  : "";

// Real Postgres when `DATABASE_URL` is set (deployed apps), else the app's
// embedded PGLite (local/dev) via a Kysely dialect.
const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

/** Session token cookie name — also read by the optional OAuth popup completion page. */
export const SESSION_TOKEN_COOKIE = "__Host-blm-auth.session_token";

const oauthPlugin =
  authConfigured && oauthConfigured && AUTH_PROVIDERS.length > 0
    ? genericOAuth({
        config: AUTH_PROVIDERS.map(({ providerId, idp }) => ({
          providerId,
          clientId: authClientId as string,
          clientSecret: authClientSecret as string,
          authorizationUrl: oauthAuthorizationUrl,
          tokenUrl: oauthTokenUrl,
          userInfoUrl: oauthUserInfoUrl,
          scopes: ["openid", "profile", "email"],
          authorizationUrlParams: { idp, prompt: "login" },
        })),
      })
    : null;

export const auth = betterAuth({
  baseURL,
  secret: env("BETTER_AUTH_SECRET") ?? previewAuthSecret(),
  database,

  trustedOrigins,

  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: AUTH_PROVIDERS.map((p) => p.providerId),
      requireLocalEmailVerified: false,
    },
  },

  session: { cookieCache: { enabled: true, maxAge: 300 } },

  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),

  // `__Host-` prefixed cookies: the browser refuses any same-named cookie that
  // carries a `Domain` attribute. `__Host-` requires Secure + Path=/ + no Domain.
  advanced: {
    useSecureCookies: false,
    defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "__Host-blm-auth.session_data" },
      account_data: { name: "__Host-blm-auth.account_data" },
      dont_remember: { name: "__Host-blm-auth.dont_remember" },
    },
  },

  plugins: [
    ...(oauthPlugin ? [oauthPlugin] : []),
    bearer(),
    // Bridges Better Auth's Set-Cookie into TanStack Start responses. MUST be last.
    tanstackStartCookies(),
  ],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}

export { AUTH_PROVIDERS } from "./providers";
