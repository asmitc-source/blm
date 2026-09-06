import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/demo")({
  head: () =>
    pageHead({
      title: "Book a call",
      description:
        "Book a business listing management call with BLM for franchise, agency, or multi-location teams. Redirects to /book.",
      path: "/demo",
    }),
  component: DemoRedirect,
});

function DemoRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/book", replace: true });
  }, [navigate]);

  return (
    <SiteShell>
      <main className="hero-wash grid min-h-[calc(100svh-5rem)] place-items-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl bg-cream p-6 text-center shadow-[var(--shadow-soft)] hairline sm:p-8">
          <Logo compact className="mx-auto" />
          <h1 className="mt-6 font-display text-3xl font-semibold">Demo is now Book a call</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Same walkthrough, clearer next step. Opening the Book a call page.
          </p>
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
