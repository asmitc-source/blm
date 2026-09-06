import { AUTH_PROVIDERS, authEnabled, oauthEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/brand-marks";

const VISIBLE_PROVIDERS = oauthEnabled
  ? AUTH_PROVIDERS.filter((p) => p.idp === "google")
  : [];

const AUTH_INTENT_KEY = "blm-auth-intent";

export type AuthIntent = "login" | "signup";

export function stashAuthIntent(intent: AuthIntent) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(AUTH_INTENT_KEY, intent);
  } catch {
    /* ignore */
  }
}

export function takeAuthIntent(): AuthIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(AUTH_INTENT_KEY);
    window.sessionStorage.removeItem(AUTH_INTENT_KEY);
    if (v === "login" || v === "signup") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function SocialButtons({
  callbackURL = "/app",
  intent = "login",
}: {
  callbackURL?: string;
  intent?: AuthIntent;
}) {
  if (!authEnabled || VISIBLE_PROVIDERS.length === 0) return null;
  return (
    <div className="grid gap-2">
      {VISIBLE_PROVIDERS.map((p) => (
        <Button
          key={p.providerId}
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => {
            stashAuthIntent(intent);
            void signIn(p.providerId, { callbackURL, errorCallbackURL: "/login" });
          }}
        >
          {p.idp === "google" ? <GoogleMark label={false} /> : null}
          Continue with {p.label}
        </Button>
      ))}
    </div>
  );
}
