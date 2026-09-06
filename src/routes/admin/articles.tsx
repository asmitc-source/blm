import { useEffect, useState } from "react";
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

  async function load() {
    const [list, status] = await Promise.all([cmsListArticles(), cmsLibraryStatus()]);
    setRows(list);
    setMissing(status.missing);
    setExpected(status.expected);
  }

  useEffect(() => {
    void cmsBootstrap().then((b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      void load();
    });
  }, []);

  return (
    <AdminShell username={username}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Library</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Articles</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {rows.length} in The desk
            {missing.length ? ` · ${missing.length} of ${expected} live posts still missing` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.length ? (
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                void cmsSeedLibrary()
                  .then(load)
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
        {!rows.length ? (
          <div className="rounded-3xl bg-cream px-6 py-12 text-center hairline">
            <p className="font-display text-xl font-semibold">No articles in The desk yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Load the six live blog posts, or write a new one.
            </p>
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
                    void cmsDeleteArticle({ data: { id: a.id } }).then(load);
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
