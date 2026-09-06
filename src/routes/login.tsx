import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient, authEnabled, oauthEnabled } from "@/lib/auth/client";
import { recordAuthLead } from "@/lib/leads";
import { Logo } from "@/components/logo";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/login")({
  head: () =>
    pageHead({
      title: "Log in",
      description: "Log in to your BLM workspace to monitor locations and directory health.",
      path: "/login",
      robots: "noindex, follow",
    }),
  component: Login,
});

function Login() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSaving(true);
    setError("");
    const email = String(data.get("email") ?? "");
    const { error: err } = await authClient.signIn.email({
      email,
      password: String(data.get("password") ?? ""),
      callbackURL: "/app",
    });
    setSaving(false);
    if (err) {
      setError(err.message ?? "Could not log in.");
      return;
    }
    try {
      await recordAuthLead({
        data: { kind: "login", email, source: "login-email" },
      });
    } catch {
      /* capture is best-effort; do not block sign-in */
    }
    window.location.href = "/app";
  }

  return (
    <SiteShell>
    <main className="hero-wash grid min-h-[calc(100svh-5rem)] place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-[var(--shadow-soft)] hairline sm:p-8">
        <Logo compact />
        <h1 className="mt-6 font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to your listing workspace.</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <Button type="submit" disabled={saving || !authEnabled}>
            {saving ? "Signing in…" : "Log in"}
          </Button>
        </form>
        {oauthEnabled ? (
          <>
            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-faint">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
            <SocialButtons intent="login" />
          </>
        ) : null}
        <p className="mt-6 text-sm text-muted">
          New here?{" "}
          <Link to="/trial" className="font-semibold text-ink">
            Start free trial
          </Link>
          {" · "}
          <Link to="/book" className="font-semibold text-ink">
            Book a call
          </Link>
        </p>
      </div>
    </main>
    </SiteShell>
  );
}
