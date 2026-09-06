import { useState, type FormEvent } from "react";
import { submitLead, type LeadKind } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ROLES = ["Owner", "Marketing", "Agency", "Local SEO", "Operations", "Other"];
const LOCS = ["1", "2–10", "11–50", "51–200", "200+"];

export function LeadForm({
  kind,
  source,
  submitLabel,
  showMessage = false,
  compact = false,
  onDone,
}: {
  kind: LeadKind;
  source: string;
  submitLabel: string;
  showMessage?: boolean;
  compact?: boolean;
  onDone?: (email: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("saving");
    setError("");
    try {
      await submitLead({
        data: {
          kind,
          source,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          role: String(data.get("role") ?? ""),
          locations: String(data.get("locations") ?? ""),
          message: String(data.get("message") ?? ""),
        },
      });
      setStatus("done");
      onDone?.(String(data.get("email") ?? ""));
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-mint-soft px-5 py-6 text-ink">
        <p className="font-display text-xl font-semibold">You’re on the list.</p>
        <p className="mt-1 text-sm text-ink-soft">
          We’ll follow up at the work email you shared.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Full name" name="name" autoComplete="name" required={!compact} />
      <Field
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@company.com"
      />
      {compact ? null : (
        <>
          <Field label="Company" name="company" autoComplete="organization" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                className="h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-[15px] text-ink outline-none focus:border-mint focus:ring-2 focus:ring-mint/25"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="locations">Locations</Label>
              <select
                id="locations"
                name="locations"
                className="h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-[15px] text-ink outline-none focus:border-mint focus:ring-2 focus:ring-mint/25"
                defaultValue=""
              >
                <option value="" disabled>
                  How many?
                </option>
                {LOCS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      {showMessage ? (
        <div className="grid gap-1.5">
          <Label htmlFor="message">What should we know?</Label>
          <Textarea id="message" name="message" rows={4} />
        </div>
      ) : null}
      {error ? <p className="text-sm text-coral">{error}</p> : null}
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Sending…" : submitLabel}
      </Button>
      <p className="text-xs text-faint">We’ll follow up at the work email you share.</p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </div>
  );
}
