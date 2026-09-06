import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Inbox, Mail, Search, Send, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cmsBootstrap } from "@/lib/cms/actions";
import {
  exportSubscribersCsv,
  listContactMessages,
  listSubscribers,
  replyContactMessage,
  updateContactStatus,
  updateSubscriberStatus,
  type ContactMessage,
  type ContactStatus,
  type SubscriberRow,
  type SubscriberStatus,
} from "@/lib/cms/inbox";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inbox")({
  head: () =>
    pageHead({
      title: "Inbox & audience",
      description: "Contact messages and newsletter subscribers.",
      path: "/admin/inbox",
    }),
  component: InboxPage,
});

type MsgFilter = "all" | ContactStatus;

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

function InboxPage() {
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState<MsgFilter>("all");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyMark, setReplyMark] = useState<"read" | "closed">("read");

  const loadMessages = useCallback(async (status: MsgFilter) => {
    const rows = await listContactMessages({ data: { status } });
    setMessages(rows);
    return rows;
  }, []);

  const loadSubscribers = useCallback(async (q: string) => {
    const rows = await listSubscribers({ data: { q } });
    setSubscribers(rows);
  }, []);

  useEffect(() => {
    void cmsBootstrap().then(async (b) => {
      if (!b.admin) {
        window.location.href = "/admin";
        return;
      }
      setUsername(b.admin.username);
      try {
        const rows = await loadMessages("all");
        if (rows[0]) setSelectedId(rows[0].id);
        await loadSubscribers("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load inbox.");
      } finally {
        setLoading(false);
      }
    });
  }, [loadMessages, loadSubscribers]);

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId],
  );

  useEffect(() => {
    if (!selected) {
      setReplySubject("");
      setReplyBody("");
      return;
    }
    setReplySubject(`Re: your note to BLM`);
    setReplyBody(`Hi ${selected.name.split(" ")[0] || selected.name},\n\nThanks for writing in.\n\n`);
    setReplyMark("read");
    setError("");
  }, [selected?.id]);

  async function applyFilter(next: MsgFilter) {
    setFilter(next);
    setBusy("filter");
    setError("");
    try {
      const rows = await loadMessages(next);
      if (!rows.find((m) => m.id === selectedId)) {
        setSelectedId(rows[0]?.id ?? null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not filter.");
    } finally {
      setBusy("");
    }
  }

  async function changeMessageStatus(id: string, status: ContactStatus) {
    setBusy(`msg:${id}`);
    setError("");
    try {
      await updateContactStatus({ data: { id, status } });
      await loadMessages(filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setBusy("");
    }
  }

  async function sendReply() {
    if (!selected) return;
    setBusy("reply");
    setError("");
    try {
      await replyContactMessage({
        data: {
          id: selected.id,
          subject: replySubject,
          body: replyBody,
          markStatus: replyMark,
        },
      });
      await loadMessages(filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send reply.");
    } finally {
      setBusy("");
    }
  }

  async function changeSubscriber(id: string, status: SubscriberStatus) {
    setBusy(`sub:${id}`);
    setError("");
    try {
      await updateSubscriberStatus({ data: { id, status } });
      await loadSubscribers(search);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update subscriber.");
    } finally {
      setBusy("");
    }
  }

  async function runSearch(q: string) {
    setSearch(q);
    setBusy("search");
    try {
      await loadSubscribers(q);
    } finally {
      setBusy("");
    }
  }

  async function downloadCsv() {
    setBusy("csv");
    setError("");
    try {
      const res = await exportSubscribersCsv();
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blm-subscribers.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not export CSV.");
    } finally {
      setBusy("");
    }
  }

  const filters: { id: MsgFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "read", label: "Read" },
    { id: "closed", label: "Closed" },
  ];

  return (
    <AdminShell username={username}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Audience</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Inbox & audience
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Contact messages, replies via Resend, and newsletter subscribers in one place.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link to="/admin">Back to desk</Link>
        </Button>
      </div>

      {error ? (
        <p className="mt-6 rounded-2xl bg-coral-soft px-4 py-3 text-sm text-coral hairline">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-muted">Opening inbox…</p>
      ) : (
        <>
          <section className="mt-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-brand" />
                  <h2 className="font-display text-2xl font-semibold">Messages</h2>
                </div>
                <p className="mt-1 text-xs text-muted">{messages.length} shown</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    disabled={busy === "filter"}
                    onClick={() => void applyFilter(f.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                      filter === f.id
                        ? "bg-ink text-cream"
                        : "bg-cream text-ink-soft hairline hover:text-ink",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {!messages.length ? (
              <div className="rounded-3xl bg-cream px-6 py-12 text-center hairline">
                <Inbox className="mx-auto size-8 text-muted" />
                <p className="mt-3 font-display text-xl font-semibold">No messages yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
                  Contact form submissions from the site will land here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-5">
                <div className="grid gap-2 lg:col-span-2">
                  {messages.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedId(m.id)}
                      className={cn(
                        "rounded-2xl bg-cream px-4 py-3.5 text-left hairline transition-transform hover:-translate-y-0.5",
                        selectedId === m.id && "ring-2 ring-brand/40",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold text-ink">{m.name}</p>
                        <span className={cn("desk-pill shrink-0", `is-${m.status}`)}>{m.status}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted">
                        {m.email}
                        {m.company ? ` · ${m.company}` : ""}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{m.message}</p>
                      <p className="mt-2 text-[11px] text-faint">{dateLabel(m.created_at)}</p>
                    </button>
                  ))}
                </div>

                <div className="rounded-3xl bg-cream p-5 hairline sm:p-6 lg:col-span-3">
                  {selected ? (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-2xl font-semibold">{selected.name}</p>
                          <a
                            className="mt-1 inline-block text-sm text-brand hover:underline"
                            href={`mailto:${selected.email}`}
                          >
                            {selected.email}
                          </a>
                          <p className="mt-1 text-xs text-muted">
                            {selected.company || "No company"} · {selected.source} ·{" "}
                            {dateLabel(selected.created_at)}
                          </p>
                        </div>
                        <span className={cn("desk-pill", `is-${selected.status}`)}>{selected.status}</span>
                      </div>

                      <div className="mt-5 rounded-2xl bg-paper/60 px-4 py-4 hairline">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                          {selected.message}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Label className="text-xs text-muted">Status</Label>
                        <select
                          className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-semibold text-ink"
                          value={selected.status}
                          disabled={busy.startsWith("msg:")}
                          onChange={(e) =>
                            void changeMessageStatus(selected.id, e.target.value as ContactStatus)
                          }
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="closed">Closed</option>
                        </select>
                        {selected.replied_at ? (
                          <p className="text-xs text-muted">
                            Replied {dateLabel(selected.replied_at)}
                            {selected.reply_note ? ` · ${selected.reply_note}` : ""}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-8 border-t border-line pt-6">
                        <div className="flex items-center gap-2">
                          <Send className="size-4 text-brand" />
                          <h3 className="font-display text-xl font-semibold">Reply</h3>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Sends from BLM via Resend to {selected.email}.
                        </p>
                        <div className="mt-4 grid gap-3">
                          <div>
                            <Label htmlFor="reply-subject">Subject</Label>
                            <Input
                              id="reply-subject"
                              className="mt-1.5"
                              value={replySubject}
                              onChange={(e) => setReplySubject(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="reply-body">Message</Label>
                            <Textarea
                              id="reply-body"
                              className="mt-1.5 min-h-36"
                              value={replyBody}
                              onChange={(e) => setReplyBody(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <select
                              className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-semibold"
                              value={replyMark}
                              onChange={(e) => setReplyMark(e.target.value as "read" | "closed")}
                            >
                              <option value="read">Mark read after send</option>
                              <option value="closed">Mark closed after send</option>
                            </select>
                            <Button
                              type="button"
                              disabled={busy === "reply"}
                              onClick={() => void sendReply()}
                            >
                              <Send className="size-3.5" />
                              {busy === "reply" ? "Sending…" : "Send reply"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="py-10 text-center text-sm text-muted">Select a message.</p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="mt-14">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-brand" />
                  <h2 className="font-display text-2xl font-semibold">Subscribers</h2>
                </div>
                <p className="mt-1 text-xs text-muted">{subscribers.length} shown</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                  <Input
                    className="w-56 pl-9"
                    placeholder="Search email or name"
                    value={search}
                    onChange={(e) => void runSearch(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={busy === "csv"}
                  onClick={() => void downloadCsv()}
                >
                  <Download className="size-3.5" />
                  Export CSV
                </Button>
              </div>
            </div>

            {!subscribers.length ? (
              <div className="rounded-3xl bg-cream px-6 py-12 text-center hairline">
                <Users className="mx-auto size-8 text-muted" />
                <p className="mt-3 font-display text-xl font-semibold">No subscribers yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
                  Newsletter signups from the homepage will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl bg-cream hairline">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
                        <th className="px-5 py-3.5 font-semibold">Email</th>
                        <th className="px-3 py-3.5 font-semibold">Joined</th>
                        <th className="px-3 py-3.5 font-semibold">Status</th>
                        <th className="px-5 py-3.5 font-semibold">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((s) => (
                        <tr key={s.id} className="border-b border-line/70 last:border-0">
                          <td className="px-5 py-3.5">
                            <a className="font-semibold text-ink hover:text-brand" href={`mailto:${s.email}`}>
                              {s.email}
                            </a>
                            {s.name ? <p className="text-xs text-muted">{s.name}</p> : null}
                          </td>
                          <td className="px-3 py-3.5 text-ink-soft">{dateLabel(s.subscribed_at)}</td>
                          <td className="px-3 py-3.5">
                            <span className={cn("desk-pill", s.status === "active" ? "is-live" : "is-draft")}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <select
                              className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-semibold"
                              value={s.status}
                              disabled={busy === `sub:${s.id}`}
                              onChange={(e) =>
                                void changeSubscriber(s.id, e.target.value as SubscriberStatus)
                              }
                            >
                              <option value="active">Active</option>
                              <option value="unsubscribed">Unsubscribed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
}
