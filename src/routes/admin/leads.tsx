import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search, Target, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cmsBootstrap } from "@/lib/cms/actions";
import {
  exportLeadsCsv,
  leadsHubSummary,
  listDeskLeads,
  type DeskLead,
  type DeskLeadKind,
  type LeadsHubSummary,
} from "@/lib/cms/leads";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  head: () =>
    pageHead({
      title: "Leads",
      description: "All capture channels: signup, login, demo, audit, contact.",
      path: "/admin/leads",
    }),
  component: LeadsPage,
});

const KIND_FILTERS: { id: DeskLeadKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "signup", label: "Signup" },
  { id: "login", label: "Login" },
  { id: "demo", label: "Demo" },
  { id: "audit", label: "Audit" },
  { id: "contact", label: "Contact" },
  { id: "early-access", label: "Early access" },
];

function dateLabel(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

function kindPill(kind: string) {
  const k = kind.toLowerCase();
  if (k === "signup" || k === "early-access") return "is-live";
  if (k === "login") return "is-read";
  if (k === "contact" || k === "demo") return "is-new";
  if (k === "audit") return "is-draft";
  return "is-draft";
}

function LeadsPage() {
  const [username, setUsername] = useState("");
  const [kind, setKind] = useState<DeskLeadKind>("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<DeskLead[]>([]);
  const [summary, setSummary] = useState<LeadsHubSummary | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (nextKind: DeskLeadKind, q: string) => {
    const [list, hub] = await Promise.all([
      listDeskLeads({ data: { kind: nextKind, q } }),
      leadsHubSummary(),
    ]);
    setRows(list);
    setSummary(hub);
    return list;
  }, []);

  useEffect(() => {
    void cmsBootstrap().then(async (b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      try {
        const list = await load("all", "");
        if (list[0]) setSelectedId(list[0].id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load leads.");
      } finally {
        setLoading(false);
      }
    });
  }, [load]);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  async function applyKind(next: DeskLeadKind) {
    setKind(next);
    setBusy("filter");
    setError("");
    try {
      const list = await load(next, search);
      if (!list.find((r) => r.id === selectedId)) setSelectedId(list[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not filter.");
    } finally {
      setBusy("");
    }
  }

  async function runSearch(q: string) {
    setSearch(q);
    setBusy("search");
    try {
      const list = await load(kind, q);
      if (!list.find((r) => r.id === selectedId)) setSelectedId(list[0]?.id ?? null);
    } finally {
      setBusy("");
    }
  }

  async function downloadCsv() {
    setBusy("csv");
    setError("");
    try {
      const res = await exportLeadsCsv();
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blm-leads.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not export CSV.");
    } finally {
      setBusy("");
    }
  }

  return (
    <AdminShell username={username}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Capture</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Leads
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Every signup, login, demo, audit, and contact intent in one feed. Newest first.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={busy === "csv"}
            onClick={() => void downloadCsv()}
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button asChild variant="secondary">
            <Link to="/admin">Back to desk</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-2xl bg-coral-soft px-4 py-3 text-sm text-coral hairline">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Opening leads…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="desk-stat desk-stat-a rounded-2xl px-4 py-4 hairline">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Total leads</p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
                {summary?.total ?? rows.length}
              </p>
            </div>
            <div className="desk-stat desk-stat-b rounded-2xl px-4 py-4 hairline">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Signups</p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
                {summary?.byKind.signup ?? 0}
              </p>
            </div>
            <div className="desk-stat desk-stat-c rounded-2xl px-4 py-4 hairline">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Logins</p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
                {summary?.byKind.login ?? 0}
              </p>
            </div>
            <Link
              to="/admin/inbox"
              className="desk-stat desk-stat-d rounded-2xl px-4 py-4 hairline transition-transform hover:-translate-y-0.5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Newsletter</p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
                {summary?.subscribersActive ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-faint">
                {summary ? `${summary.subscribersTotal} total in Inbox` : "Open Inbox"}
              </p>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {KIND_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  disabled={busy === "filter"}
                  onClick={() => void applyKind(f.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    kind === f.id
                      ? "bg-ink text-cream"
                      : "bg-cream text-ink-soft hairline hover:text-ink",
                  )}
                >
                  {f.label}
                  {f.id !== "all" && summary?.byKind[f.id] != null
                    ? ` (${summary.byKind[f.id]})`
                    : ""}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
              <Input
                className="w-56 pl-9"
                placeholder="Search email or name"
                value={search}
                onChange={(e) => void runSearch(e.target.value)}
              />
            </div>
          </div>

          {!rows.length ? (
            <div className="mt-6 rounded-3xl bg-cream px-6 py-12 text-center hairline">
              <Target className="mx-auto size-8 text-muted" />
              <p className="mt-3 font-display text-xl font-semibold">No leads yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
                Signups, logins, demos, audits, and contact forms will land here as soon as someone shows intent.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-5">
              <div className="grid gap-2 lg:col-span-2">
                {rows.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelectedId(l.id)}
                    className={cn(
                      "rounded-2xl bg-cream px-4 py-3.5 text-left hairline transition-transform hover:-translate-y-0.5",
                      selectedId === l.id && "ring-2 ring-brand/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-ink">{l.name || l.email}</p>
                      <span className={cn("desk-pill shrink-0", kindPill(l.kind))}>{l.kind}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">
                      {l.email}
                      {l.company ? ` · ${l.company}` : ""}
                    </p>
                    {l.message ? (
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{l.message}</p>
                    ) : null}
                    <p className="mt-2 text-[11px] text-faint">{dateLabel(l.created_at)}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-3xl bg-cream p-5 hairline sm:p-6 lg:col-span-3">
                {selected ? (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-2xl font-semibold">
                          {selected.name || selected.email}
                        </p>
                        <a
                          className="mt-1 inline-block text-sm text-brand hover:underline"
                          href={`mailto:${selected.email}`}
                        >
                          {selected.email}
                        </a>
                        <p className="mt-1 text-xs text-muted">
                          {selected.kind}
                          {selected.source ? ` · ${selected.source}` : ""}
                          {selected.company ? ` · ${selected.company}` : ""} ·{" "}
                          {dateLabel(selected.created_at)}
                        </p>
                      </div>
                      <span className={cn("desk-pill", kindPill(selected.kind))}>{selected.kind}</span>
                    </div>

                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Detail label="Name" value={selected.name || "-"} />
                      <Detail label="Email" value={selected.email} />
                      <Detail label="Company" value={selected.company || "-"} />
                      <Detail label="Locations" value={selected.locations || "-"} />
                      <Detail label="Kind" value={selected.kind} />
                      <Detail label="Source" value={selected.source || "-"} />
                    </dl>

                    <div className="mt-5 rounded-2xl bg-paper/60 px-4 py-4 hairline">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                        Message / note
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                        {selected.message || "No message captured."}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="py-10 text-center text-sm text-muted">Select a lead.</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 rounded-3xl bg-cream px-5 py-5 hairline sm:px-6">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-brand" />
              <p className="text-sm font-semibold">Newsletter channel</p>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              Subscribers stay in their own table and are managed in Inbox. Active:{" "}
              {summary?.subscribersActive ?? 0} of {summary?.subscribersTotal ?? 0}.
            </p>
            <Link to="/admin/inbox" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
              Open Inbox & audience
            </Link>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-paper/50 px-4 py-3 hairline">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
