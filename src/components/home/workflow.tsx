import { useEffect, useRef, useState } from "react";
import { Bell, Check, GitMerge, Shield, Upload } from "lucide-react";
import { useScrollSpy } from "@/components/home/scroll";
import { AppleMark, BingMark, GoogleMark, MapQuestMark } from "@/components/brand-marks";
import { WORKFLOW } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Workflow({ showHeader = true }: { showHeader?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const mockRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");
  const [dot, setDot] = useState({ x: 0, y: 0, on: false });
  const [active] = useScrollSpy(stepRefs, 0.38);

  useEffect(() => {
    let raf = 0;
    const layout = () => {
      const root = rootRef.current;
      const from = stepRefs.current[active];
      const to = mockRef.current;
      if (!root || !from || !to) {
        setDot((d) => (d.on ? { ...d, on: false } : d));
        return;
      }
      const rb = root.getBoundingClientRect();
      const fb = from.getBoundingClientRect();
      const tb = to.getBoundingClientRect();
      if (tb.width < 40 || fb.width < 40) {
        setDot((d) => (d.on ? { ...d, on: false } : d));
        setPath("");
        return;
      }
      const x1 = fb.right - rb.left - 2;
      const y1 = fb.top + fb.height / 2 - rb.top;
      const x2 = tb.left - rb.left + 16;
      const y2 = tb.top + 48 - rb.top;
      const mid = x1 + (x2 - x1) * 0.55;
      setPath(`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
      setDot({ x: x2, y: y2, on: true });
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        layout();
      });
    };
    layout();
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active]);

  return (
    <section id="how-it-works" className="page-wrap py-16 sm:py-24" aria-label="How it works">
      {showHeader ? (
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">How it works</p>
        <h2 id="workflow-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          From messy listings to governed presence
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Scroll the steps. The workspace on the right follows. Humans keep NAP and duplicates. Automation handles the rest.
        </p>
      </div>
      ) : null}

      <div ref={rootRef} className="relative mt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,26.5rem)_minmax(0,1fr)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
          <div className="sticky top-[4.5rem] z-10 h-[min(22rem,48svh)] lg:col-start-2 lg:row-start-1 lg:h-[min(34rem,calc(100svh-9rem))]">
            <div ref={mockRef} className="h-full">
              <StepMock kind={WORKFLOW[active]?.mock ?? "import"} title={WORKFLOW[active]?.title ?? ""} step={active} />
            </div>
          </div>
          <ol className="space-y-5 lg:col-start-1 lg:row-start-1 lg:pb-[85vh]">
            {WORKFLOW.map((step, i) => (
              <li key={step.n}>
                <article
                  data-index={i}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={cn(
                    "workflow-step relative w-full overflow-visible rounded-2xl p-5 text-left transition-[box-shadow,background,border-color] duration-300 sm:p-6",
                    active === i
                      ? "workflow-step-on border-2 border-transparent"
                      : "border border-line bg-cream",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                        active === i ? "bg-brand text-brand-fg" : "bg-sand text-ink",
                      )}
                    >
                      {step.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl font-semibold text-ink">{step.title}</h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            step.tagTone === "human" ? "bg-brand-soft text-brand" : "bg-sand text-ink-soft",
                          )}
                        >
                          {step.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.copy}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-hidden lg:block" aria-hidden="true">
          {path ? <path d={path} className="thread-path" /> : null}
          {dot.on ? <circle cx={dot.x} cy={dot.y} r="5" fill="var(--brand)" /> : null}
        </svg>
      </div>
    </section>
  );
}

function StepMock({
  kind,
  title,
  step,
}: {
  kind: (typeof WORKFLOW)[number]["mock"];
  title: string;
  step: number;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-[var(--shadow-lift)]">
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3.5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Workspace · step {step + 1} of 7
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{title}</h3>
        </div>
        <span className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
          {WORKFLOW[step]?.tag}
        </span>
      </div>
      <div key={kind} className="grid min-h-0 flex-1 grid-cols-[7.25rem_minmax(0,1fr)] overflow-hidden">
        <aside className="overflow-y-auto border-r border-line bg-paper/80 p-3">
          <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Locations</p>
          <ul className="mt-2 space-y-1">
            {["Wicker Park", "River North", "Logan Square", "West Loop", "Lincoln Park"].map((loc, i) => (
              <li
                key={loc}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-xs",
                  i === 0 ? "bg-brand-soft font-semibold text-ink" : "text-ink-soft",
                )}
              >
                {loc}
              </li>
            ))}
          </ul>
        </aside>
        <div className="min-h-0 overflow-y-auto p-5">
          {kind === "import" && <ImportMock />}
          {kind === "nap" && <NapMock />}
          {kind === "audit" && <AuditMock />}
          {kind === "unify" && <UnifyMock />}
          {kind === "dupes" && <DupeMock />}
          {kind === "risk" && <RiskMock />}
          {kind === "govern" && <GovernMock />}
        </div>
      </div>
    </div>
  );
}

function ImportMock() {
  const rows = [
    { loc: "Wicker Park", city: "Chicago", phone: "(312) 555-0199", ok: true },
    { loc: "River North", city: "Chicago", phone: "(312) 555-0110", ok: true },
    { loc: "Logan Square", city: "Chicago", phone: "(312) 555-0172", ok: true },
    { loc: "West Loop", city: "Chicago", phone: "", ok: false },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <Upload className="size-4 text-brand" />
          northline.csv
        </p>
        <p className="text-xs text-muted">42 rows · 1 phone missing</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["name", "address", "phone", "hours", "category"].map((f) => (
          <span key={f} className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            {f}
          </span>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.loc} className="border-t border-line">
                <td className="px-3 py-2 font-medium text-ink">{r.loc}</td>
                <td className="px-3 py-2 text-ink-soft">{r.city}</td>
                <td className="px-3 py-2 tabular-nums text-ink-soft">{r.phone || "missing"}</td>
                <td className="px-3 py-2">
                  {r.ok ? <span className="text-brand">Parsed</span> : <span className="text-coral">Needs phone</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NapMock() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-soft">Canonical string vs each publisher. Suite, DBA, and tracking numbers included.</p>
      {[
        { Mark: GoogleMark, v: "Northline · 1420 N Milwaukee · (312) 555-0199", ok: true },
        { Mark: AppleMark, v: "Northline · 1420 N Milwaukee · (312) 555-0199", ok: true },
        { Mark: BingMark, v: "Northline Coffee LLC · 1420 North Milwaukee · 3125550142", ok: false },
        { Mark: MapQuestMark, v: "Northline · 1420 N Milwaukee Ave · (312) 555-0199", ok: true },
      ].map((row, i) => (
        <div key={i} className="rounded-xl bg-paper px-3 py-3 hairline">
          <div className="flex items-center justify-between">
            <row.Mark />
            {row.ok ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
                <Check className="size-3.5" /> Match
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-coral">Phone drift</span>
            )}
          </div>
          <p className={cn("mt-2 text-sm", row.ok ? "text-ink" : "text-ink-soft")}>{row.v}</p>
        </div>
      ))}
    </div>
  );
}

function AuditMock() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { l: "NAP", v: 96 },
          { l: "Coverage", v: 88 },
          { l: "Duplicates", v: 12 },
          { l: "Hours", v: 81 },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-paper px-4 py-3 hairline">
            <p className="text-xs text-muted">{s.l}</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{s.v}</p>
            <span className="mt-2 block h-1 overflow-hidden rounded-full bg-sand">
              <span className="block h-full rounded-full bg-brand" style={{ width: `${s.v}%` }} />
            </span>
          </div>
        ))}
      </div>
      <ul className="space-y-2 text-sm">
        {[
          { t: "Google Business Profile", s: "Healthy", ok: true, Mark: GoogleMark },
          { t: "Apple Business Connect", s: "Stale hours", ok: false, Mark: AppleMark },
          { t: "Bing Places", s: "Phone mismatch", ok: false, Mark: BingMark },
          { t: "MapQuest", s: "Duplicate risk", ok: false, Mark: MapQuestMark },
        ].map((r) => (
          <li key={r.t} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2 hairline">
            <span className="inline-flex items-center gap-2 text-ink">
              <r.Mark label={false} />
              {r.t}
            </span>
            <span className={r.ok ? "text-brand" : "text-coral"}>{r.s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UnifyMock() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-brand-soft p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Shield className="size-4 text-brand" />
          Canonical listing
        </div>
        <p className="mt-2 font-display text-2xl font-semibold">Northline · Wicker Park</p>
        <p className="mt-1 text-sm text-ink-soft">1420 N Milwaukee Ave, Chicago, IL 60622</p>
        <p className="text-sm text-ink-soft">(312) 555-0199 · Cafe · Open 7-6 · Closed Sun</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-3 py-2">Publisher</th>
              <th className="px-3 py-2">Field</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="px-3 py-2">
                <GoogleMark />
              </td>
              <td className="px-3 py-2 text-ink-soft">Phone, hours, name</td>
              <td className="px-3 py-2 font-semibold text-brand">Matches</td>
            </tr>
            <tr className="border-t border-line">
              <td className="px-3 py-2">
                <AppleMark />
              </td>
              <td className="px-3 py-2 text-ink-soft">Phone, name</td>
              <td className="px-3 py-2 font-semibold text-brand">Matches</td>
            </tr>
            <tr className="border-t border-line">
              <td className="px-3 py-2">
                <BingMark />
              </td>
              <td className="px-3 py-2 text-ink-soft">Phone 0142</td>
              <td className="px-3 py-2 font-semibold text-coral">Queued</td>
            </tr>
            <tr className="border-t border-line">
              <td className="px-3 py-2">
                <MapQuestMark />
              </td>
              <td className="px-3 py-2 text-ink-soft">Avenue suffix</td>
              <td className="px-3 py-2 font-semibold text-brand">Matches</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DupeMock() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-soft">
        Near-matches on phone, place, and name. Pick the survivor so reviews stay with the listing.
      </p>
      {[
        { t: "Northline · Wicker Park", s: "Survivor · 412 reviews · Google + Apple", ok: true },
        { t: "Northline Coffee LLC · Google", s: "94% match · 38 reviews · same block", ok: false },
        { t: "Northline Cafe · MapQuest", s: "81% match · 12 reviews · old DBA", ok: false },
      ].map((r) => (
        <div key={r.t} className="flex items-center justify-between rounded-xl bg-paper px-4 py-3 hairline">
          <div>
            <p className="text-sm font-semibold text-ink">{r.t}</p>
            <p className="mt-0.5 text-xs text-muted">{r.s}</p>
          </div>
          {r.ok ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
              <GitMerge className="size-4" /> Keep
            </span>
          ) : (
            <span className="text-xs font-semibold text-coral">Merge</span>
          )}
        </div>
      ))}
      <p className="rounded-xl bg-brand-soft px-3 py-2 text-xs text-ink-soft">
        Merging keeps 412 reviews on the survivor. The LLC pin is queued for suppression.
      </p>
    </div>
  );
}

function RiskMock() {
  return (
    <div className="space-y-3">
      {[
        { l: "Synced across publishers", v: "41", c: "text-brand", w: "97%" },
        { l: "Stale hours", v: "1", c: "text-butter", w: "4%" },
        { l: "Missing Bing Places", v: "0", c: "text-ink", w: "0%" },
        { l: "Blocked or suppressed", v: "0", c: "text-ink", w: "0%" },
      ].map((r) => (
        <div key={r.l} className="rounded-xl bg-paper px-4 py-3 hairline">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-soft">{r.l}</span>
            <span className={cn("font-display text-xl font-semibold tabular-nums", r.c)}>{r.v}</span>
          </div>
          <span className="mt-2 block h-1 overflow-hidden rounded-full bg-sand">
            <span className="block h-full rounded-full bg-brand" style={{ width: r.w }} />
          </span>
        </div>
      ))}
      <p className="text-xs text-muted">River North is the only cafe with stale Sunday hours on Apple.</p>
    </div>
  );
}

function GovernMock() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Bell className="size-4 text-brand" />
        Weekly digest · Monday 7:12am
      </div>
      <div className="rounded-2xl bg-paper p-5 hairline">
        <p className="font-display text-xl font-semibold">Northline health 86</p>
        <p className="mt-1 text-sm text-ink-soft">0 duplicates · 1 hours change pending · 42 cafes</p>
        <ul className="mt-4 space-y-2 text-sm">
          {["Sunday closure propagated to Apple", "Bing NAP unified on Wicker Park", "MapQuest category locked as Cafe"].map(
            (r) => (
              <li key={r} className="flex gap-2 text-ink-soft">
                <Check className="size-4 shrink-0 text-brand" />
                {r}
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { n: "42", l: "Locations" },
          { n: "86", l: "Health" },
          { n: "0", l: "Open dupes" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-paper py-3 hairline">
            <p className="font-display text-xl font-semibold tabular-nums">{s.n}</p>
            <p className="text-[11px] text-muted">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
