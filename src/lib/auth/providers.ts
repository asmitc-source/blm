/**
 * Upstream identity providers this app may offer for federated sign-in.
 *
 * Source of truth for both the server (`server.ts`, Better Auth
 * `socialProviders.google` when Google OAuth env is configured) and the client
 * (sign-in buttons). Kept dependency-free so the client can import it without
 * pulling server-only Better Auth into the browser bundle.
 *
 * Federated OAuth is optional. Email/password is the primary path
 * (`./email-password`). Set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` on the
 * server and `VITE_OAUTH_ENABLED=true` for the client UI.
 */
export type AuthProvider = {
  /** Local provider id; also the Better Auth social provider key. */
  providerId: string;
  /** Upstream IdP hint used by social button branding. */
  idp: string;
  /** Human label for the sign-in button. */
  label: string;
};

/** Providers shown when OAuth is enabled (`VITE_OAUTH_ENABLED=true`). */
export const AUTH_PROVIDERS: readonly AuthProvider[] = [
  { providerId: "google", idp: "google", label: "Google" },
];
