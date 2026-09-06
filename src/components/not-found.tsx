import { Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">This listing wandered off.</h1>
        <p className="mt-3 text-muted">The page isn’t here. The product still is.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </main>
    </SiteShell>
  );
}
