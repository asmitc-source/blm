import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/brand-marks";

const VISIBLE_PROVIDERS = GROK_PROVIDERS.filter((p) => p.idp === "google");

export function SocialButtons({ callbackURL = "/app" }: { callbackURL?: string }) {
  if (!authEnabled) {
    return <p className="text-sm text-muted">Sign-in is disabled in this environment.</p>;
  }
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
