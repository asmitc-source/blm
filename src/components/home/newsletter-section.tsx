import { useState, type FormEvent } from "react";
import { subscribeNewsletter } from "@/lib/newsletter";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewsletterSection() {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("saving");
    setError("");
    try {
      await subscribeNewsletter({
        data: {
          email: String(data.get("email") ?? ""),
          name: String(data.get("name") ?? ""),
          source: "homepage",
          website: String(data.get("website") ?? ""),
        },
      });
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not subscribe. Try again.");
    }
  }

  return (
    <section id="newsletter" className="page-wrap py-16 sm:py-20" aria-labelledby="home-newsletter-title">
      <Reveal>
        <div className="newsletter-card relative overflow-hidden rounded-3xl bg-paper px-6 py-12 sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 50% 60% at 0% 100%, color-mix(in oklab, var(--tile-a) 18%, transparent), transparent 60%), radial-gradient(ellipse 46% 50% at 100% 0%, color-mix(in oklab, var(--tile-c) 16%, transparent), transparent 55%), radial-gradient(ellipse 40% 40% at 80% 100%, color-mix(in oklab, var(--tile-d) 14%, transparent), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-[1] grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Newsletter</p>
              <h2 id="home-newsletter-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Subscribe to our newsletter
              </h2>
              <p className="mt-4 max-w-lg text-ink-soft">
                New guides on NAP, duplicates, and directory coverage — plus a note when we publish. Warm, short, and easy
                to leave.
              </p>
            </div>

            {status === "done" ? (
              <div className="rounded-2xl bg-mint-soft px-5 py-6 text-ink">
                <p className="font-display text-xl font-semibold">You are subscribed.</p>
                <p className="mt-1 text-sm text-ink-soft">Check your inbox for a welcome note when SMTP is configured.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="relative">
                <div className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                  <div className="grid gap-1.5">
                    <Label htmlFor="home-news-name" className="leading-none">
                      Name (optional)
                    </Label>
                    <Input
                      id="home-news-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Alex"
                      className="h-12"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="home-news-email" className="leading-none">
                      Email
                    </Label>
                    <Input
                      id="home-news-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" disabled={status === "saving"} size="lg" className="h-12 w-full sm:w-auto">
                    {status === "saving" ? "Subscribing…" : "Subscribe"}
                  </Button>
                </div>
                <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="home-news-website">Website</label>
                  <input id="home-news-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
