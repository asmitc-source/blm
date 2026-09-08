import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { RichEditor } from "@/components/admin/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cmsBootstrap, cmsGetArticle, cmsImportDoc, cmsSaveArticle } from "@/lib/cms/actions";
import { imagesMissingAlt } from "@/lib/cms/gdoc";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

type Search = { id?: string; title?: string; import?: string };
type FormStatus = "draft" | "published" | "scheduled";

export const Route = createFileRoute("/admin/write")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
    title: typeof s.title === "string" ? s.title : undefined,
    import: typeof s.import === "string" ? s.import : undefined,
  }),
  head: () => pageHead({ title: "Write", description: "Write an article.", path: "/admin/write" }),
  component: WritePage,
});

function toDatetimeLocal(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    // already YYYY-MM-DD or YYYY-MM-DDTHH:mm
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T09:00`;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return value.slice(0, 16);
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
    meta_title: "",
    canonical_url: "",
    body_html: "",
    author: "BLM Editorial",
    tags: "",
    category: "",
    kind: "article",
    status: "draft" as FormStatus,
    date: new Date().toISOString().slice(0, 10),
    published_at: "",
    minutes: 6,
    cover_url: "",
    cover_alt: "",
  });

  function patch(p: Partial<typeof form>) {
    setForm((f) => ({ ...f, ...p }));
  }

  const livePath = useMemo(() => {
    const base = form.kind === "comparison" ? "/compare/" : "/blog/";
    return `${base}${form.slug || "your-slug"}`;
  }, [form.kind, form.slug]);

  const destinationHint = useMemo(() => {
    if (form.kind === "comparison") {
      return "Compare guide — lists on /compare and uses /compare/{slug}. Not in homepage top-6.";
    }
    if (form.kind === "resource") {
      return "Resource — surfaces on /resources and /blog/{slug}. Newest publishes enter homepage top-6 and shift older posts back; full set stays on /blog.";
    }
    return "Blog article — publishes to /blog/{slug}. Shows on homepage top-6 when newly published (older shift back); archived with the full set on /blog.";
  }, [form.kind]);

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
        meta_title: a.meta_title ?? "",
        canonical_url: a.canonical_url ?? "",
        body_html: a.body_html,
        author: a.author,
        tags: a.tags.join(", "),
        category: a.category ?? "",
        kind: a.kind,
        status: a.status,
        date: a.date,
        published_at: toDatetimeLocal(a.published_at || a.date),
        minutes: a.minutes,
        cover_url: a.cover_url ?? "",
        cover_alt: a.cover_alt ?? "",
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

  function validateForPublish(status: FormStatus) {
    const desc = form.description.trim();
    if (status === "published" || status === "scheduled") {
      if (!desc) return "Meta description is required before publishing.";
      if (desc.length > 170) return "Meta description must be 170 characters or fewer.";
      const missingAlts = imagesMissingAlt(form.body_html);
      if (missingAlts.length) {
        return `Every image needs alt text before publishing (${missingAlts.length} missing).`;
      }
      if (form.cover_url.trim() && !form.cover_alt.trim()) {
        return "Cover image alt text is required before publishing.";
      }
    }
    if (desc.length > 170) return "Meta description must be 170 characters or fewer.";
    if (status === "scheduled" && !form.published_at) {
      return "Set a publish date/time for scheduled posts.";
    }
    return "";
  }

  async function save(status: FormStatus) {
    const clientError = validateForPublish(status);
    if (clientError) {
      setError(clientError);
      return;
    }
    setSaving(true);
    setError("");
    const started = performance.now();
    let timer = 0;
    const timedOut = new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => reject(new Error("Publish timed out after 12s — check Articles")), 12_000);
    });
    try {
      const published_at =
        form.published_at ||
        (status === "published" ? new Date().toISOString().slice(0, 16) : "");
      const date = (published_at || form.date || new Date().toISOString()).slice(0, 10);
      const payload = {
        ...form,
        status,
        date,
        published_at: published_at ? new Date(published_at).toISOString() : "",
        cover_url: form.cover_url.trim(),
      };
      const saved = await Promise.race([cmsSaveArticle({ data: payload }), timedOut]);
      if (!saved) throw new Error("Could not save.");
      const elapsed = Math.round(performance.now() - started);
      console.info(`[desk] publish ok in ${elapsed}ms`, saved.slug);
      // Clear Publishing… immediately — do not wait on navigation / articles load.
      setSaving(false);
      patch({
        id: saved.id,
        slug: saved.slug,
        status: saved.status,
        minutes: saved.minutes,
        description: saved.description,
        published_at: toDatetimeLocal(saved.published_at || saved.date),
      });
      if (status === "published") {
        void navigate({ to: "/admin/articles" });
      } else {
        void navigate({ to: "/admin/write", search: { id: saved.id } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
      setSaving(false);
    } finally {
      window.clearTimeout(timer);
    }
  }

  if (!ready) return null;

  const descLen = form.description.length;

  return (
    <AdminShell username={username}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Write</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        {form.id ? "Edit article" : "New article"}
      </h1>

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
            <p className="text-xs text-muted">
              The doc must be shared as anyone with the link. Bold, italic, lists, and headings come through.
            </p>
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
          void save(form.status === "published" || form.status === "scheduled" ? form.status : "draft");
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

        <div className="rounded-3xl bg-cream p-5 hairline sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">SEO</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="meta_title">SEO title</Label>
              <Input
                id="meta_title"
                value={form.meta_title}
                onChange={(e) => patch({ meta_title: e.target.value })}
                className="mt-1.5"
                placeholder="Optional · defaults to title"
                maxLength={70}
              />
              <p className="mt-1.5 text-xs text-muted">{form.meta_title.length}/70</p>
            </div>
            <div>
              <Label htmlFor="canonical_url">Canonical URL</Label>
              <Input
                id="canonical_url"
                value={form.canonical_url}
                onChange={(e) => patch({ canonical_url: e.target.value })}
                className="mt-1.5"
                placeholder={`${SITE.domain}${livePath}`}
              />
              <p className="mt-1.5 text-xs text-muted">Leave blank to use the live path on {SITE.domain}</p>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="description">
              Meta description <span className="text-coral">*</span>
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => patch({ description: e.target.value.slice(0, 170) })}
              className="mt-1.5 min-h-20"
              placeholder="Required to publish. Search / social snippet (max 170)."
              required={form.status === "published" || form.status === "scheduled"}
            />
            <p className={cn("mt-1.5 text-xs", descLen > 170 ? "text-coral" : "text-muted")}>
              {descLen}/170 · required before Publish or Schedule
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-cream p-5 hairline sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Where it publishes</p>
          <p className="mt-1 text-sm text-ink-soft">{destinationHint}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="kind">Section / destination</Label>
              <select
                id="kind"
                value={form.kind}
                onChange={(e) => patch({ kind: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[15px]"
              >
                <option value="article">Blog ( /blog )</option>
                <option value="resource">Resources ( /resources )</option>
                <option value="comparison">Compare ( /compare )</option>
              </select>
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => patch({ slug: e.target.value })}
                className="mt-1.5"
                placeholder="auto from title"
              />
              <p className="mt-1.5 text-xs text-muted">
                Live path: <span className="font-semibold text-ink">{livePath}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                { id: "article", label: "Blog article", hint: "homepage top-6 + /blog" },
                { id: "resource", label: "Resource", hint: "/resources + top-6" },
                { id: "comparison", label: "Compare guide", hint: "/compare" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => patch({ kind: opt.id })}
                className={
                  form.kind === opt.id
                    ? "rounded-full bg-ink px-3.5 py-1.5 text-sm font-semibold text-cream"
                    : "rounded-full bg-paper px-3.5 py-1.5 text-sm font-semibold text-ink-soft hairline hover:text-ink"
                }
              >
                {opt.label}
                <span className="ml-1 text-[11px] opacity-70">{opt.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-cream p-5 hairline sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Publishing</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => patch({ status: e.target.value as FormStatus })}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3.5 text-[15px]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <Label htmlFor="published_at">Publish date</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={form.published_at}
                onChange={(e) =>
                  patch({
                    published_at: e.target.value,
                    date: e.target.value.slice(0, 10) || form.date,
                  })
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="minutes">Reading time (min)</Label>
              <Input
                id="minutes"
                type="number"
                min={1}
                max={60}
                value={form.minutes}
                onChange={(e) => patch({ minutes: Number(e.target.value) || 1 })}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={form.author} onChange={(e) => patch({ author: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="category">Topic / category</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => patch({ category: e.target.value })}
              className="mt-1.5"
              placeholder="NAP, Listings, GBP"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={(e) => patch({ tags: e.target.value })}
              className="mt-1.5"
              placeholder="NAP, Duplicates"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="cover_url">Cover image URL</Label>
            <Input
              id="cover_url"
              value={form.cover_url}
              onChange={(e) => patch({ cover_url: e.target.value })}
              className="mt-1.5"
              placeholder="https://…"
            />
          </div>
          <div>
            <Label htmlFor="cover_alt">Cover image alt</Label>
            <Input
              id="cover_alt"
              value={form.cover_alt}
              onChange={(e) => patch({ cover_alt: e.target.value })}
              className="mt-1.5"
              placeholder="Describe the image"
            />
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
            {saving ? "Saving…" : "Save draft"}
          </Button>
          <Button type="button" variant="secondary" disabled={saving} onClick={() => void save("scheduled")}>
            {saving ? "Saving…" : "Schedule"}
          </Button>
          <Button type="button" disabled={saving} onClick={() => void save("published")}>
            {saving ? "Publishing…" : "Publish"}
          </Button>
          {form.slug ? (
            <Button asChild variant="ghost">
              <a href={livePath} target="_blank" rel="noreferrer">
                View live
              </a>
            </Button>
          ) : null}
        </div>
      </form>
    </AdminShell>
  );
}
