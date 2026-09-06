/**
 * Upstream identity providers this app may offer for federated sign-in.
 *
 * Source of truth for both the server (`server.ts`, one `genericOAuth` provider
 * per entry when OAuth env is configured) and the client (sign-in buttons).
 * Kept dependency-free so the client can import it without pulling server-only
 * Better Auth into the browser bundle.
 *
 * Federated OAuth is optional. Email/password is the primary path
 * (`./email-password`). Leave this list empty unless you configure
 * `AUTH_ISSUER`, `AUTH_CLIENT_ID`, and `AUTH_CLIENT_SECRET` on the server and
 * `VITE_OAUTH_ENABLED=true` for the client UI.
 */
export type AuthProvider = {
  /** Local provider id; also the OAuth callback path segment. */
  providerId: string;
  /** Upstream IdP hint forwarded to the auth broker, if any. */
  idp: string;
  /** Human label for the sign-in button. */
  label: string;
};

/** Providers shown when OAuth is enabled. Empty by default (email/password only). */
export const AUTH_PROVIDERS: readonly AuthProvider[] = [];
