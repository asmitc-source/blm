import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { submitLead } from "@/lib/leads";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { SiteShell } from "@/components/layout/site-shell";

/**
 * Legacy /signup path. Public "Create workspace" CTAs are retired.
 * Record a background lead when query params carry contact info, then send
 * visitors to Book a call. Intentional product access lives on /trial.
 */
export const Route = createFileRoute("/signup")({
  head: () =>
    pageHead({
      title: "Book a call",
      description:
        "Create workspace is no longer the public path. Book a call with BLM or start a free trial.",
      path: "/signup",
    }),
  component: LegacySignupRedirect,
});

function LegacySignupRedirect() {
  const navigate = useNavigate();
  const [note, setNote] = useState("Sending you to Book a call…");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        try {
          window.sessionStorage.setItem("blm-lead-source", "create-workspace");
        } catch {
          /* ignore */
        }
        const params = new URLSearchParams(window.location.search);
        const email = (params.get("email") ?? "").trim().toLowerCase();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          await submitLead({
            data: {
              kind: "early-access",
              email,
              name: params.get("name") ?? undefined,
              company: params.get("company") ?? undefined,
              source: "create-workspace",
              payload: "legacy-signup-redirect",
            },
          });
        } else {
          // Anonymous click still counts as intent when we have a fingerprint email placeholder skip.
          // Background fire-and-forget without fake email is skipped; redirect still happens.
        }
      } catch {
        /* best-effort */
      }
      if (cancelled) return;
      setNote("Opening Book a call…");
      void navigate({ to: "/book", replace: true });
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <SiteShell>
      <main className="hero-wash grid min-h-[calc(100svh-5rem)] place-items-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-cream p-6 text-center shadow-[var(--shadow-soft)] hairline sm:p-8">
          <Logo compact className="mx-auto" />
          <h1 className="mt-6 font-display text-3xl font-semibold">Workspace signup moved</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Public create-workspace is retired. Book a call with the team, or start a free trial when you want product
            access.
          </p>
          <p className="mt-4 text-sm text-muted">{note}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/book">Book a call</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/trial">Start free trial</Link>
            </Button>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
