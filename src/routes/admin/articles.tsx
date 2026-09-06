import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { cmsBootstrap, cmsDeleteArticle, cmsListArticles } from "@/lib/cms/actions";
import type { CmsArticle } from "@/lib/cms/types";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/articles")({
  head: () => pageHead({ title: "Articles", description: "All desk articles.", path: "/admin/articles" }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [username, setUsername] = useState("");
  const [rows, setRows] = useState<CmsArticle[]>([]);

  function load() {
    void cmsListArticles().then(setRows);
  }

  useEffect(() => {
    void cmsBootstrap().then((b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      load();
    });
  }, []);

  return (
    <AdminShell username={username}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Library</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Articles</h1>
        </div>
        <Button asChild>
          <Link to="/admin/write">New article</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-2">
        {rows.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream px-5 py-4 hairline">
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
        ))}
      </div>
    </AdminShell>
  );
}
