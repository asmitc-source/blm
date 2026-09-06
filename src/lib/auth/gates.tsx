import { type ReactNode, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn, signOut } from "./client";
import { hasGateSessionMarker } from "./gate-session-marker";
import { resolveSignInGateState } from "./sign-in-gate";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";
import { GoogleMark } from "@/components/brand-marks";
import { Button } from "@/components/ui/button";

const VISIBLE_PROVIDERS = GROK_PROVIDERS.filter((p) => p.idp === "google");

export function SignedIn({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

export function SignInGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const state = resolveSignInGateState({ isPending, hasUser: user !== null });
  if (state === "pending") return null;
  if (state === "signed_in") return <>{children}</>;
  return <>{fallback ?? <SignInButtons />}</>;
}

export function RedirectToSignIn({ to = "/login" }: { to?: string }) {
  return <Navigate to={to} />;
}

export function SignInButtons() {
  if (!authEnabled) {
    return <p className="text-sm text-muted">Sign-in is disabled in this environment.</p>;
  }
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {VISIBLE_PROVIDERS.map((p) => (
        <Button
          key={p.providerId}
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => signIn(p.providerId, { callbackURL: "/", errorCallbackURL: "/login" })}
        >
          {p.idp === "google" ? <GoogleMark label={false} /> : null}
          Continue with {p.label}
        </Button>
      ))}
    </div>
  );
}

export function UserButton() {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const gateSession = hasGateSessionMarker();

  if (isPending) {
    return <div className="glass-chip h-11 w-24 animate-pulse" />;
  }
  if (!user) return null;

  const canSignOut = authEnabled && !user.isDevFallback && !gateSession;

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-[10rem] truncate text-sm font-medium text-ink-soft">
        {user.displayName ?? user.primaryEmail ?? "Workspace"}
      </span>
      {canSignOut ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={signingOut}
          onClick={async () => {
            setError("");
            setSigningOut(true);
            try {
              await signOut("/");
            } catch (err) {
              setSigningOut(false);
              setError(err instanceof Error ? err.message : "Could not sign out.");
            }
          }}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      ) : null}
      {error ? <span className="text-xs text-coral">{error}</span> : null}
    </div>
  );
}
