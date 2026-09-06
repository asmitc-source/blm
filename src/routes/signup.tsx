import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient, authEnabled } from "@/lib/auth/client";
import { submitLead, upsertWorkspace } from "@/lib/leads";
import { Logo } from "@/components/logo";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/layout/site-shell";

export const Route = createFileRoute("/signup")({
  head: () =>
    pageHead({
      title: "Create a workspace",
      description:
        "Create a BLM workspace for multi-location listing management. Unify NAP, close duplicates, and keep publishers in lockstep.",
      path: "/signup",
    }),
  component: Signup,
});

function Signup() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [leadOnly, setLeadOnly] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const company = String(data.get("company") ?? "");
    const role = String(data.get("role") ?? "");
    const locations = String(data.get("locations") ?? "");
    setSaving(true);
    setError("");
    try {
      await submitLead({
        data: {
          kind: "signup",
          name,
          email,
          company,
          role,
          locations,
          source: "signup",
          payload: "starter:free",
        },
      });
      if (!authEnabled) {
        setLeadOnly(true);
        setSaving(false);
        return;
      }
      const { error: err } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/app",
      });
      if (err) {
        setError(err.message ?? "Could not create the workspace.");
        setSaving(false);
        return;
      }
      try {
        await upsertWorkspace({
          data: { name, email, company, role, locationsCount: locations },
        });
      } catch {
        /* workspace + trial clock can be completed inside /app */
      }
      window.location.href = "/app";
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Could not create the workspace.");
    }
  }

  if (leadOnly) {
    return (
      <SiteShell>
        <main className="hero-wash grid min-h-[calc(100svh-5rem)] place-items-center px-4 py-10">
          <div className="w-full max-w-lg rounded-2xl bg-cream p-6 shadow-[var(--shadow-soft)] hairline sm:p-8">
            <Logo compact />
            <h1 className="mt-6 font-display text-3xl font-semibold">Workspace request received.</h1>
            <p className="mt-2 text-sm text-ink-soft">
              We captured the lead. Billing is not live yet, so no card is required. Listed rates are Starter $49/month and Growth $149/month.
            </p>
          </div>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
    <main className="hero-wash grid min-h-[calc(100svh-5rem)] place-items-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-cream p-6 shadow-[var(--shadow-soft)] hairline sm:p-8">
        <Logo compact />
        <h1 className="mt-6 font-display text-3xl font-semibold">Create a workspace</h1>
        <p className="mt-2 text-sm text-muted">
          No card required. Listed rates are Starter $49/month and Growth $149/month when billing goes live. Work email required.
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" autoComplete="name" required />
            <Field label="Work email" name="email" type="email" autoComplete="email" required />
          </div>
          <Field label="Company" name="company" autoComplete="organization" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                required
                defaultValue=""
                className="h-11 rounded-xl border border-line bg-cream px-3.5 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              >
                <option value="" disabled>
                  Select
                </option>
                {["Owner", "Marketing", "Agency", "Local SEO", "Operations", "Other"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="locations">Locations</Label>
              <select
                id="locations"
                name="locations"
                required
                defaultValue=""
                className="h-11 rounded-xl border border-line bg-cream px-3.5 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              >
                <option value="" disabled>
                  How many?
                </option>
                {["1", "2–10", "11–50", "51–200", "200+"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <Field label="Password" name="password" type="password" autoComplete="new-password" required />
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Creating workspace…" : "Create workspace"}
          </Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-faint">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>
        <SocialButtons />
        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-ink">
            Log in
          </Link>
        </p>
      </div>
    </main>
    </SiteShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} autoComplete={autoComplete} />
    </div>
  );
}
