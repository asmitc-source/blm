import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, PenLine, Settings2, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cmsBootstrap, cmsDashboard, cmsLogin } from "@/lib/cms/actions";
import { setDeskToken } from "@/lib/cms/token";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  loader: () => cmsBootstrap(),
  head: () => pageHead({ title: "The desk", description: "BLM admin desk.", path: "/admin" }),
  component: AdminHome,
});

function AdminHome() {
  const initial = Route.useLoaderData();
  const [boot, setBoot] = useState(initial);
  const [dash, setDash] = useState<Awaited<ReturnType<typeof cmsDashboard>> | null>(null);

  useEffect(() => {
    void cmsBootstrap().then(setBoot).catch(() => undefined);
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
          <AuthForm
            onDone={async (id, password) => {
              const res = await cmsLogin({ data: { username: id, password } });
              setDeskToken(res.token);
              window.location.reload();
            }}
          />
        </div>
      </main>
    );
  }

  const stats = dash?.stats;
  return (
    <AdminShell username={boot.admin.username}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Desk</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Good. Write something that can be cited.</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Articles land in Resources, Compare, and the blog. Pricing and homepage copy live under Site.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        <Stat label="Articles" value={stats?.articles ?? "—"} />
        <Stat label="Live" value={stats?.published ?? "—"} />
        <Stat label="Drafts" value={stats?.drafts ?? "—"} />
        <Stat label="Leads" value={stats?.leads ?? "—"} />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Action to="/admin/write" title="Write an article" copy="Title, answer-first, then the body. Or drop a Google Doc." icon={PenLine} />
        <Action to="/admin/articles" title="All articles" copy="Drafts, live posts, comparisons, and resources." icon={FileText} />
        <Action to="/admin/site" title="Edit the site" copy="Pricing, homepage lede, and the questions people actually ask." icon={Settings2} />
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">Recent</h2>
      <div className="mt-4 grid gap-2">
        {(dash?.recent ?? []).map((a) => (
          <Link
            key={a.id}
            to="/admin/write"
            search={{ id: a.id }}
            className="flex items-center justify-between rounded-2xl bg-cream px-5 py-4 hairline"
          >
            <div>
              <p className="font-semibold text-ink">{a.title}</p>
              <p className="mt-1 text-xs text-muted">
                {a.status} · {a.kind} · {a.date}
              </p>
            </div>
            <Sparkles className="size-4 text-faint" />
          </Link>
        ))}
      </div>
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
        <Input
          id="desk-id"
          autoComplete="username"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          className="mt-1.5"
        />
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-cream px-4 py-4 hairline">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Action({
  to,
  title,
  copy,
  icon: Icon,
}: {
  to: "/admin/write" | "/admin/articles" | "/admin/site";
  title: string;
  copy: string;
  icon: typeof PenLine;
}) {
  return (
    <Link to={to} className="rounded-2xl bg-cream p-5 hairline transition-transform hover:-translate-y-0.5">
      <Icon className="size-5 text-brand" />
      <p className="mt-3 font-display text-xl font-semibold">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{copy}</p>
    </Link>
  );
}
