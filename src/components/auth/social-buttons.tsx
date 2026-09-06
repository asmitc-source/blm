import { AUTH_PROVIDERS, authEnabled, oauthEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/brand-marks";

const VISIBLE_PROVIDERS = oauthEnabled
  ? AUTH_PROVIDERS.filter((p) => p.idp === "google")
  : [];

export function SocialButtons({ callbackURL = "/app" }: { callbackURL?: string }) {
  if (!authEnabled || VISIBLE_PROVIDERS.length === 0) return null;
  return (
    <div className="grid gap-2">
      {VISIBLE_PROVIDERS.map((p) => (
        <Button
          key={p.providerId}
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => signIn(p.providerId, { callbackURL, errorCallbackURL: "/login" })}
        >
          {p.idp === "google" ? <GoogleMark label={false} /> : null}
          Continue with {p.label}
        </Button>
      ))}
    </div>
  );
}
