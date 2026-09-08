import { useCallback, useRef, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { cmsArticlesPage, cmsDeleteArticle, cmsSeedLibrary } from "@/lib/cms/actions";
import type { CmsArticle } from "@/lib/cms/types";
import { pageHead } from "@/lib/seo";

type PageData = Awaited<ReturnType<typeof cmsArticlesPage>>;

export const Route = createFileRoute("/admin/articles")({
  loader: () => cmsArticlesPage(),

  pendingComponent: () => (
    <div className="admin-desk min-h-svh px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold text-muted">Loading…</p>
    </div>
  ),
  head: () => pageHead({ title: "Articles", description: "All desk articles.", path: "/admin/articles" }),
  component: ArticlesPage,
});

const REFRESH_MS = 12_000;

function ArticlesPage() {
  const initial = Route.useLoaderData() as PageData;
  const router = useRouter();
  const [username, setUsername] = useState(initial.admin?.username ?? "");
  const [rows, setRows] = useState<CmsArticle[]>(initial.articles ?? []);
  const [missing, setMissing] = useState<string[]>(initial.missing ?? []);
  const [expected, setExpected] = useState(initial.expected ?? 6);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoSeeded = useRef(false);
  const hasPaintedList = useRef((initial.articles ?? []).length > 0);

  const apply = useCallback((data: PageData) => {
    if (!data.admin) {
      window.location.href = "/admin";
      return;
    }
    setUsername(data.admin.username);
    setRows(data.articles);
    setMissing(data.missing);
    setExpected(data.expected);
    if (data.articles.length) hasPaintedList.current = true;
  }, []);

  const refresh = useCallback(
    async (opts?: { allowAutoSeed?: boolean }) => {
      setLoading(true);
      setError("");
      const timedOut = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("Articles refresh timed out. Try again.")), REFRESH_MS);
      });
      try {
        let data = await Promise.race([cmsArticlesPage(), timedOut]);
        if (!data.admin) {
          window.location.href = "/admin";
          return;
        }
        if (!data.articles.length && opts?.allowAutoSeed !== false && !autoSeeded.current) {
          autoSeeded.current = true;
          // Kick seed in background — never block showing empty state / Load button.
          void cmsSeedLibrary()
            .then(async () => {
              try {
                const next = await Promise.race([cmsArticlesPage(), timedOut]);
                apply(next);
                void router.invalidate();
              } catch {
                /* ignore background seed refresh errors */
              }
            })
            .catch(() => undefined);
        }
        apply(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load articles.");
      } finally {
        setLoading(false);
      }
    },
    [apply, router],
  );

  const showSkeleton = loading && !hasPaintedList.current && !rows.length && !error;

  if (!initial.admin && !username) {
    if (typeof window !== "undefined") window.location.href = "/admin";
    return null;
  }

  return (
    <AdminShell username={username || initial.admin?.username || ""}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Library</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Articles</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {showSkeleton ? "Loading…" : `${rows.length} in The desk`}
            {!showSkeleton && missing.length ? ` · ${missing.length} of ${expected} live posts still missing` : ""}.
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
                  .then(() => refresh({ allowAutoSeed: false }))
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
          <Button type="button" className="mt-4" variant="secondary" onClick={() => void refresh({ allowAutoSeed: false })}>
            Retry
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
        {showSkeleton ? (
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
                    .then(() => refresh({ allowAutoSeed: false }))
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
                    void cmsDeleteArticle({ data: { id: a.id } }).then(() => refresh({ allowAutoSeed: false }));
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
