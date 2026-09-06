import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cmsBootstrap, cmsGetSite, cmsSaveSettings, cmsSaveSite } from "@/lib/cms/actions";
import { SqlCopy } from "@/components/admin/sql-copy";
import type { PricingPlan, SiteCopy } from "@/lib/cms/types";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/site")({
  head: () => pageHead({ title: "Site copy", description: "Edit homepage, pricing, and FAQs.", path: "/admin/site" }),
  component: SitePage,
});

function SitePage() {
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState<"home" | "pricing" | "faq" | "supabase">("home");
  const [copy, setCopy] = useState<SiteCopy | null>(null);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [ping, setPing] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    void cmsBootstrap().then((b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      setSupabaseUrl(b.supabase.url);
      setPing(b.supabase.ping.ok ? "Connected" : b.supabase.ping.reason);
    });
    void cmsGetSite().then((s) => {
      setCopy(s.copy);
      setFaqs(s.faqs.map((f) => ({ question: f.question, answer: f.answer })));
    });
  }, []);

  async function save() {
    if (!copy) return;
    setSaving(true);
    setNote("");
    try {
      await cmsSaveSite({ data: { copy, faqs } });
      setNote("Saved. Live pages pick this up on the next load.");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (!copy) return null;

  return (
    <AdminShell username={username}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Site</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">What the public site says</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["home", "pricing", "faq", "supabase"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={t === tab ? "scale-pill is-on" : "scale-pill"}
          >
            {t === "faq" ? "Questions" : t === "supabase" ? "Supabase" : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "home" ? (
        <div className="mt-8 grid max-w-2xl gap-4">
          <Field label="Hero lede" value={copy.home.lede} onChange={(home) => setCopy({ ...copy, home: { ...copy.home, lede: home } })} area />
          <Field label="Trial line under the buttons" value={copy.home.trialLine} onChange={(trialLine) => setCopy({ ...copy, home: { ...copy.home, trialLine } })} />
        </div>
      ) : null}

      {tab === "pricing" ? (
        <div className="mt-8 grid gap-6">
          <Field label="Pricing title" value={copy.pricingTitle} onChange={(pricingTitle) => setCopy({ ...copy, pricingTitle })} />
          <Field label="Pricing lede" value={copy.pricingLede} onChange={(pricingLede) => setCopy({ ...copy, pricingLede })} area />
          <div className="grid gap-4 lg:grid-cols-3">
            {copy.plans.map((plan, i) => (
              <PlanEditor
                key={plan.id}
                plan={plan}
                onChange={(next) => {
                  const plans = [...copy.plans];
                  plans[i] = next;
                  setCopy({ ...copy, plans });
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {tab === "faq" ? (
        <div className="mt-8 grid gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl bg-cream p-5 hairline">
              <Input
                value={f.question}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...f, question: e.target.value };
                  setFaqs(next);
                }}
              />
              <Textarea
                className="mt-2"
                value={f.answer}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...f, answer: e.target.value };
                  setFaqs(next);
                }}
              />
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-coral"
                onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}>
            Add question
          </Button>
        </div>
      ) : null}

      {tab === "supabase" ? (
        <div className="mt-8 grid max-w-xl gap-4">
          <p className="text-sm text-ink-soft">
            Paste the project URL from Supabase → Settings. Then run this SQL once.
          </p>
          <SqlCopy />
          <Field label="Project URL" value={supabaseUrl} onChange={setSupabaseUrl} />
          <p className="text-xs text-muted">Status: {ping || "not connected"}</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void cmsSaveSettings({ data: { supabaseUrl } }).then((r) => {
                setPing(r.ping.ok ? "Connected" : r.ping.reason);
              });
            }}
          >
            Save connection
          </Button>
        </div>
      ) : null}

      {tab !== "supabase" ? (
        <div className="mt-8 flex items-center gap-3">
          <Button type="button" disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {note ? <p className="text-sm text-ink-soft">{note}</p> : null}
        </div>
      ) : null}
    </AdminShell>
  );
}

function Field({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {area ? (
        <Textarea className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function PlanEditor({ plan, onChange }: { plan: PricingPlan; onChange: (p: PricingPlan) => void }) {
  return (
    <div className="rounded-2xl bg-cream p-5 hairline">
      <Input value={plan.name} onChange={(e) => onChange({ ...plan, name: e.target.value })} />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Input value={plan.price} onChange={(e) => onChange({ ...plan, price: e.target.value })} />
        <Input value={plan.cadence} onChange={(e) => onChange({ ...plan, cadence: e.target.value })} />
      </div>
      <Textarea className="mt-2 min-h-20" value={plan.blurb} onChange={(e) => onChange({ ...plan, blurb: e.target.value })} />
      <Input className="mt-2" value={plan.cta} onChange={(e) => onChange({ ...plan, cta: e.target.value })} />
      <Textarea
        className="mt-2"
        value={plan.features.join("\n")}
        onChange={(e) => onChange({ ...plan, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
      />
    </div>
  );
}
