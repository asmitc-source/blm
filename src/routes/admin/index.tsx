import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, FileText, PenLine, Settings2, Sparkles, Upload } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cmsBootstrap, cmsDashboard, cmsLogin, cmsSeedLibrary } from "@/lib/cms/actions";
import { setDeskToken } from "@/lib/cms/token";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  loader: () => cmsBootstrap(),
  head: () => pageHead({ title: "The desk", description: "BLM admin desk.", path: "/admin" }),
  component: AdminHome,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function AdminHome() {
  const initial = Route.useLoaderData();
  const [boot, setBoot] = useState(initial);
  const [dash, setDash] = useState<Awaited<ReturnType<typeof cmsDashboard>> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void cmsBootstrap()
      .then(setBoot)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!boot?.admin) return;
    void cmsDashboard()
      .then(setDash)
      .catch(() => setDash(null));
  }, [boot?.admin]);

  if (!boot?.admin) {
    return (
      <main className="admin-desk grid min-h-svh place-items-center px-4 py-10">
        <div className="w-full max-w-sm rounded-3xl bg-cream p-7 shadow-[var(--shadow-soft)] hairline sm:p-8">
          <LogoMark className="size-10" />
          <h1 className="mt-5 font-display text-3xl font-semibold">Log in</h1>
          <p className="mt-1 text-sm text-ink-soft">Stays signed in for 14 days.</p>
          <AuthForm
            onDone={async (id, password) => {
              const res = await cmsLogin({ data: { username: id, password } });
              setDeskToken(res.token, res.refresh);
              window.location.assign("/admin");
            }}
          />
        </div>
      </main>
    );
  }

  const stats = dash?.stats;
  const firstName = boot.admin.username.split("@")[0];

  return (
    <AdminShell username={boot.admin.username}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Desk</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {greeting()}, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">Write once. Publish to Resources, Compare, and the blog.</p>
        </div>
        <Button asChild>
          <Link to="/admin/write">New article</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Articles" value={stats?.articles ?? "—"} tone="a" />
        <StatTile label="Live" value={stats?.published ?? "—"} tone="b" />
        <StatTile label="Drafts" value={stats?.drafts ?? "—"} tone="c" />
        <StatTile label="Leads" value={stats?.leads ?? "—"} tone="d" />
      </div>

      <QuickCompose
        onWrite={(title) => void navigate({ to: "/admin/write", search: { title } })}
        onDoc={() => void navigate({ to: "/admin/write", search: { import: "1" } })}
      />

      {!dash ? (
        <p className="mt-10 text-sm text-muted">Opening the desk…</p>
      ) : stats?.articles === 0 ? (
        <EmptyLibrary
          onSeed={async () => {
            await cmsSeedLibrary();
            const next = await cmsDashboard();
            setDash(next);
          }}
        />
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <SectionHead title="In progress" hint="Drafts first. Then publish." />
            <Stack
              items={(dash.drafts.length ? dash.drafts : dash.recent).map((a) => ({
                id: a.id,
                title: a.title,
                meta: `${a.status} · ${a.kind} · ${a.date}`,
                status: a.status,
              }))}
            />
          </section>
          <section className="lg:col-span-2">
            <SectionHead title="Live" hint="On the public site." />
            <Stack
              items={dash.live.map((a) => ({
                id: a.id,
                title: a.title,
                meta: `${a.kind} · ${a.date}`,
                status: "published",
              }))}
            />
            <SectionHead title="Leads" hint="Trials and contact." className="mt-8" />
            {dash.leads.length ? (
              <div className="grid gap-2">
                {dash.leads.map((l) => (
                  <div key={l.id} className="rounded-2xl bg-cream px-4 py-3 hairline">
                    <p className="font-semibold text-ink">{l.name || l.email}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {l.kind}
                      {l.company ? ` · ${l.company}` : ""} · {l.email}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-cream px-4 py-6 text-sm text-muted hairline">No leads yet. Create workspace captures them.</p>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function AuthForm({ onDone }: { onDone: (id: string, password: string) => Promise<void> }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        void onDone(id, password).catch((err: Error) => {
          setError(err.message);
          setSaving(false);
        });
      }}
    >
      <div>
        <Label htmlFor="desk-id">ID</Label>
        <Input id="desk-id" autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="desk-pass">Password</Label>
        <Input
          id="desk-pass"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1.5"
        />
      </div>
      {error ? <p className="text-sm text-coral">{error}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Opening…" : "Enter"}
      </Button>
    </form>
  );
}

function StatTile({ label, value, tone }: { label: string; value: string | number; tone: "a" | "b" | "c" | "d" }) {
  return (
    <div className={cn("desk-stat rounded-2xl px-4 py-4 hairline", `desk-stat-${tone}`)}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function QuickCompose({ onWrite, onDoc }: { onWrite: (title: string) => void; onDoc: () => void }) {
  const [title, setTitle] = useState("");
  const placeholder = useMemo(() => {
    const prompts = [
      "How to clean NAP across Google and Apple",
      "Yelp vs Google Business Profile",
      "What a 7-day listing audit actually finds",
    ];
    return prompts[new Date().getDate() % prompts.length];
  }, []);

  return (
    <div className="mt-8 grid gap-3 rounded-3xl bg-cream p-5 hairline sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-brand" />
        <p className="text-sm font-semibold">Start a piece</p>
      </div>
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          onWrite(title.trim());
        }}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholder} className="flex-1" />
        <Button type="submit">
          <PenLine className="size-3.5" />
          Write
        </Button>
        <Button type="button" variant="secondary" onClick={onDoc}>
          <Upload className="size-3.5" />
          Google Doc
        </Button>
      </form>
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <Link className="inline-flex items-center gap-1 hover:text-ink" to="/admin/site">
          <Settings2 className="size-3" /> Edit pricing
        </Link>
        <Link className="inline-flex items-center gap-1 hover:text-ink" to="/admin/articles">
          <FileText className="size-3" /> All articles
        </Link>
        <a className="inline-flex items-center gap-1 hover:text-ink" href="/" target="_blank" rel="noreferrer">
          <ArrowUpRight className="size-3" /> View live site
        </a>
      </div>
    </div>
  );
}

function SectionHead({ title, hint, className }: { title: string; hint: string; className?: string }) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}

function Stack({ items }: { items: { id: string; title: string; meta: string; status: string }[] }) {
  if (!items.length) {
    return <p className="rounded-2xl bg-cream px-4 py-6 text-sm text-muted hairline">Nothing here yet.</p>;
  }
  return (
    <div className="grid gap-2">
      {items.map((a) => (
        <Link
          key={a.id}
          to="/admin/write"
          search={{ id: a.id }}
          className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-5 py-4 hairline transition-transform hover:-translate-y-0.5"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{a.title}</p>
            <p className="mt-1 text-xs text-muted">{a.meta}</p>
          </div>
          <span className={cn("desk-pill", a.status === "published" ? "is-live" : "is-draft")}>{a.status}</span>
        </Link>
      ))}
    </div>
  );
}

function EmptyLibrary({ onSeed }: { onSeed: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="mt-10 rounded-3xl bg-cream p-8 text-center hairline">
      <p className="font-display text-2xl font-semibold">The library is empty</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
        Load the six existing BLM articles into the desk, or start from a blank page.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void onSeed().finally(() => setBusy(false));
          }}
        >
          {busy ? "Loading…" : "Load starter library"}
        </Button>
        <Button asChild variant="secondary">
          <Link to="/admin/write">Write the first one</Link>
        </Button>
      </div>
    </div>
  );
}
