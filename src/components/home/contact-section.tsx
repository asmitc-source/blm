import { useState, type FormEvent } from "react";
import { submitContact } from "@/lib/contact";
import { Reveal } from "@/components/home/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/site";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("saving");
    setError("");
    try {
      await submitContact({
        data: {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          message: String(data.get("message") ?? ""),
          source: "homepage",
          website: String(data.get("website") ?? ""),
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        },
      });
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
    }
  }

  return (
    <section id="contact" className="border-y border-line bg-cream py-16 sm:py-24" aria-labelledby="home-contact-title">
      <div className="page-wrap grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Contact us</p>
          <h2 id="home-contact-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us about your footprint.
          </h2>
          <p className="mt-4 max-w-md text-ink-soft">
            Sales and onboarding share {SITE.salesEmail}. Prefer a form? Send a note and we will follow up at your work email.
          </p>
          <div className="mt-8 flex gap-2" aria-hidden="true">
            <span className="h-2 flex-1 rounded-full bg-[var(--tile-a)]" />
            <span className="h-2 flex-1 rounded-full bg-[var(--tile-b)]" />
            <span className="h-2 flex-1 rounded-full bg-[var(--tile-c)]" />
            <span className="h-2 flex-1 rounded-full bg-[var(--tile-d)]" />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative overflow-hidden rounded-3xl bg-paper p-6 shadow-[var(--shadow-soft)] hairline sm:p-8">
            <span
              className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--tile-c) 55%, transparent), transparent 70%)" }}
              aria-hidden="true"
            />
            {status === "done" ? (
              <div className="relative rounded-2xl bg-mint-soft px-5 py-6 text-ink">
                <p className="font-display text-xl font-semibold">Message received.</p>
                <p className="mt-1 text-sm text-ink-soft">We will follow up at the work email you shared.</p>
                <Button type="button" className="mt-4" variant="secondary" onClick={() => setStatus("idle")}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="relative grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" autoComplete="name" required />
                  <Field label="Work email" name="email" type="email" autoComplete="email" required />
                </div>
                <Field label="Company (optional)" name="company" autoComplete="organization" />
                <div className="grid gap-1.5">
                  <Label htmlFor="home-contact-message">Message</Label>
                  <Textarea id="home-contact-message" name="message" rows={4} required placeholder="Locations, directories, timeline…" />
                </div>
                {/* honeypot */}
                <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="home-contact-website">Website</label>
                  <input id="home-contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                {error ? <p className="text-sm text-coral">{error}</p> : null}
                <Button type="submit" disabled={status === "saving"} size="lg">
                  {status === "saving" ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
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
      <Label htmlFor={`home-contact-${name}`}>{label}</Label>
      <Input id={`home-contact-${name}`} name={name} type={type} required={required} autoComplete={autoComplete} />
    </div>
  );
}
