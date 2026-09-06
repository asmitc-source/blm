import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { unsubscribeNewsletter } from "@/lib/newsletter";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  head: () =>
    pageHead({
      title: "Unsubscribe",
      description: "Unsubscribe from the BLM newsletter.",
      path: "/unsubscribe",
    }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { token, email } = Route.useSearch();
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token && !email) return;
    let cancelled = false;
    (async () => {
      setStatus("saving");
      try {
        await unsubscribeNewsletter({ data: { token, email } });
        if (!cancelled) setStatus("done");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Could not unsubscribe.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, email]);

  return (
    <SiteShell>
      <main className="hero-wash grid min-h-[calc(100svh-5rem)] place-items-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-[var(--shadow-soft)] hairline sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Newsletter</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Unsubscribe</h1>
          {!token && !email ? (
            <p className="mt-3 text-sm text-ink-soft">
              Open the unsubscribe link from a BLM email, or contact{" "}
              <a className="cursor-pointer font-semibold text-ink underline-offset-2 hover:underline focus-visible:underline" href="mailto:hello@businesslistingmanagement.com">
                hello@businesslistingmanagement.com
              </a>
              .
            </p>
          ) : null}
          {status === "saving" ? <p className="mt-4 text-sm text-muted">Updating your preference…</p> : null}
          {status === "done" ? (
            <p className="mt-4 text-sm text-ink-soft">
              You are unsubscribed. You will not receive new-article emails from BLM.
            </p>
          ) : null}
          {status === "error" ? <p className="mt-4 text-sm text-coral">{error}</p> : null}
          <Button asChild className="mt-6" variant="secondary">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>
    </SiteShell>
  );
}
