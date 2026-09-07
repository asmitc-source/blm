import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import {
  cmsBootstrap,
  cmsDeleteArticle,
  cmsLibraryStatus,
  cmsListArticles,
  cmsSeedLibrary,
} from "@/lib/cms/actions";
import type { CmsArticle } from "@/lib/cms/types";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/articles")({
  head: () => pageHead({ title: "Articles", description: "All desk articles.", path: "/admin/articles" }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [username, setUsername] = useState("");
  const [rows, setRows] = useState<CmsArticle[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [expected, setExpected] = useState(6);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const autoSeeded = useRef(false);

  async function load(opts?: { allowAutoSeed?: boolean }) {
    setLoading(true);
    setError("");
    try {
      let list = await cmsListArticles();
      let status = await cmsLibraryStatus();
      if (!list.length && opts?.allowAutoSeed !== false && !autoSeeded.current) {
        autoSeeded.current = true;
        setBusy(true);
        try {
          await cmsSeedLibrary();
          list = await cmsListArticles();
          status = await cmsLibraryStatus();
        } finally {
          setBusy(false);
        }
      }
      setRows(list);
      setMissing(status.missing);
      setExpected(status.expected);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load articles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cmsBootstrap().then((b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      void load({ allowAutoSeed: true });
    });
  }, []);

  return (
    <AdminShell username={username}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Library</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Articles</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {loading ? "Loading…" : `${rows.length} in The desk`}
            {!loading && missing.length ? ` · ${missing.length} of ${expected} live posts still missing` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.length || !rows.length ? (
            <Button
              type="button"
              variant="secondary"
              disabled={busy || loading}
              onClick={() => {
                setBusy(true);
                void cmsSeedLibrary()
                  .then(() => load({ allowAutoSeed: false }))
                  .finally(() => setBusy(false));
              }}
            >
              {busy ? "Loading…" : "Load existing articles"}
            </Button>
          ) : null}
          <Button asChild>
            <Link to="/admin/write">New article</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-3xl bg-cream px-5 py-5 hairline sm:px-6">
          <p className="font-display text-xl font-semibold text-coral">Could not load articles</p>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">{error}</p>
          <Button type="button" className="mt-4" variant="secondary" onClick={() => void load({ allowAutoSeed: false })}>
            Try again
          </Button>
        </div>
      ) : null}

      {missing.length ? (
        <div className="mt-6 rounded-3xl bg-cream px-5 py-5 hairline sm:px-6">
          <p className="font-display text-xl font-semibold">Load existing articles</p>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Import the polished blog posts that power businesslistingmanagement.com/blog into The desk.
            Missing: {missing.join(", ")}.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-2">
        {loading ? (
          <div className="grid gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[4.5rem] animate-pulse rounded-2xl bg-cream hairline" />
            ))}
          </div>
        ) : !rows.length ? (
          <div className="rounded-3xl bg-cream px-6 py-12 text-center hairline">
            <p className="font-display text-xl font-semibold">No articles in The desk yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Load the six live blog posts, or write a new one.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  void cmsSeedLibrary()
                    .then(() => load({ allowAutoSeed: false }))
                    .finally(() => setBusy(false));
                }}
              >
                {busy ? "Loading…" : "Load existing articles"}
              </Button>
              <Button asChild variant="secondary">
                <Link to="/admin/write">Write a new one</Link>
              </Button>
            </div>
          </div>
        ) : (
          rows.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream px-5 py-4 hairline"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {a.status} · {a.kind} · /{a.kind === "comparison" ? "compare" : "blog"}/{a.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/admin/write" search={{ id: a.id }}>
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (!window.confirm("Delete this article?")) return;
                    void cmsDeleteArticle({ data: { id: a.id } }).then(() => load({ allowAutoSeed: false }));
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
