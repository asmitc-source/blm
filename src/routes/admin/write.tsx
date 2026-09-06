import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { RichEditor } from "@/components/admin/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cmsBootstrap, cmsGetArticle, cmsImportDoc, cmsSaveArticle } from "@/lib/cms/actions";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

type Search = { id?: string; title?: string; import?: string };

export const Route = createFileRoute("/admin/write")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
    title: typeof s.title === "string" ? s.title : undefined,
    import: typeof s.import === "string" ? s.import : undefined,
  }),
  head: () => pageHead({ title: "Write", description: "Write an article.", path: "/admin/write" }),
  component: WritePage,
});

function WritePage() {
  const { id, title: seedTitle } = Route.useSearch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [form, setForm] = useState({
    id: "",
    title: seedTitle ?? "",
    answer: "",
    slug: "",
    description: "",
    body_html: "",
    author: "BLM Editorial",
    tags: "",
    kind: "article",
    status: "draft",
    date: new Date().toISOString().slice(0, 10),
    minutes: 6,
  });

  function patch(p: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...p }));
  }

  useEffect(() => {
    void cmsBootstrap().then((b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    void cmsGetArticle({ data: { id } }).then((a) => {
      if (!a) return;
      setForm({
        id: a.id,
        title: a.title,
        answer: a.answer,
        slug: a.slug,
        description: a.description,
        body_html: a.body_html,
        author: a.author,
        tags: a.tags.join(", "),
        kind: a.kind,
        status: a.status,
        date: a.date,
        minutes: a.minutes,
      });
    });
  }, [id]);

  async function importDoc(html?: string, url?: string) {
    setError("");
    try {
      const res = await cmsImportDoc({ data: { html: html ?? "", url: url ?? docUrl } });
      patch({
        title: form.title || res.title,
        answer: form.answer || res.answer,
        body_html: res.body_html,
        minutes: res.minutes,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not import that document.");
    }
  }

  async function save(status: "draft" | "published") {
    setSaving(true);
    setError("");
    try {
      const saved = await cmsSaveArticle({ data: { ...form, status } });
      if (saved) {
        patch({ id: saved.id, slug: saved.slug, status: saved.status });
        await navigate({ to: "/admin/write", search: { id: saved.id } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return null;

  return (
    <AdminShell username={username}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Write</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{form.id ? "Edit article" : "New article"}</h1>

      <div
        className={cn("desk-drop mt-6 rounded-2xl px-5 py-4", over && "is-over")}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const file = e.dataTransfer.files[0];
          const uri = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
          if (uri.includes("docs.google.com")) {
            void importDoc("", uri);
            return;
          }
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => void importDoc(String(reader.result ?? ""));
          reader.readAsText(file);
        }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <FileUp className="size-5 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Drop a Google Doc link, or an HTML / Markdown file</p>
            <p className="text-xs text-muted">The doc must be shared as anyone with the link. Bold, italic, lists, and headings come through.</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            placeholder="https://docs.google.com/document/d/…"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={() => void importDoc()}>
            Import
          </Button>
        </div>
      </div>

      <form
        className="mt-8 grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          void save(form.status === "published" ? "published" : "draft");
        }}
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(e) => patch({ title: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label htmlFor="answer">Answer first</Label>
          <Textarea
            id="answer"
            value={form.answer}
            onChange={(e) => patch({ answer: e.target.value })}
            className="mt-1.5 min-h-24"
            placeholder="The first sentence a human or a model should quote."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={form.slug} onChange={(e) => patch({ slug: e.target.value })} className="mt-1.5" placeholder="auto from title" />
          </div>
          <div>
            <Label htmlFor="kind">Section</Label>
            <select
              id="kind"
              value={form.kind}
              onChange={(e) => patch({ kind: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-[15px]"
            >
              <option value="article">Blog / resources</option>
              <option value="comparison">Compare</option>
              <option value="resource">Resource hub</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={form.author} onChange={(e) => patch({ author: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={form.date} onChange={(e) => patch({ date: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" value={form.tags} onChange={(e) => patch({ tags: e.target.value })} className="mt-1.5" placeholder="NAP, Duplicates" />
          </div>
        </div>
        <div>
          <Label>Body</Label>
          <div className="mt-1.5">
            <RichEditor value={form.body_html} onChange={(body_html) => patch({ body_html })} />
          </div>
        </div>
        {error ? <p className="text-sm text-coral">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={saving} onClick={() => void save("draft")}>
            Save draft
          </Button>
          <Button type="button" disabled={saving} onClick={() => void save("published")}>
            {saving ? "Publishing…" : "Publish"}
          </Button>
          {form.slug ? (
            <Button asChild variant="ghost">
              <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer">
                View live
              </a>
            </Button>
          ) : null}
        </div>
      </form>
    </AdminShell>
  );
}
