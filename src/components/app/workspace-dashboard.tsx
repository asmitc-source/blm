import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  Clock3,
  Copy,
  Fingerprint,
  MapPin,
  Plus,
  Radar,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ListingAuditor } from "@/components/auditor/listing-auditor";
import { type WorkspaceSection } from "@/components/app/workspace-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkspaceRow } from "@/lib/leads";
import { cn } from "@/lib/utils";


const TOOLKIT_SECTIONS: {
  id: WorkspaceSection;
  label: string;
  blurb: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  {
    id: "locations",
    label: "Locations",
    blurb: "Add and manage storefronts",
    icon: MapPin,
    tone: "text-brand bg-brand-soft",
  },
  {
    id: "nap",
    label: "NAP fingerprint",
    blurb: "Canonical name, address, phone",
    icon: Fingerprint,
    tone: "text-sky bg-sky-soft",
  },
  {
    id: "coverage",
    label: "Coverage snapshot",
    blurb: "Google, Apple, Bing, directories",
    icon: Radar,
    tone: "text-lavender bg-lavender-soft",
  },
  {
    id: "duplicates",
    label: "Duplicate radar",
    blurb: "Near-match risk queue",
    icon: Copy,
    tone: "text-coral bg-coral-soft",
  },
  {
    id: "hours",
    label: "Hours & alerts",
    blurb: "Hours editor and change feed",
    icon: Clock3,
    tone: "text-butter bg-butter-soft",
  },
  {
    id: "auditor",
    label: "Listing health",
    blurb: "Run the listing auditor",
    icon: ShieldCheck,
    tone: "text-mint bg-mint-soft",
  },
];

export type WorkspaceLocation = {
  id: string;
  name: string;
  address: string;
  phone: string;
  monFri: string;
  sat: string;
  sun: string;
};

type PublisherStatus = "synced" | "missing" | "stale";

type PublisherRow = {
  name: string;
  group: string;
  status: PublisherStatus;
};

type DuplicateRisk = {
  id: string;
  title: string;
  match: string;
  confidence: number;
  publisher: string;
};

type AlertItem = {
  id: string;
  title: string;
  detail: string;
  tone: "butter" | "coral" | "sky" | "mint";
};

const DAY_DEFAULTS = {
  monFri: "09:00 – 18:00",
  sat: "10:00 – 16:00",
  sun: "Closed",
};

function seedPublishers(hasLocation: boolean): PublisherRow[] {
  if (!hasLocation) {
    return [
      { name: "Google Business Profile", group: "Maps", status: "missing" },
      { name: "Apple Maps", group: "Maps", status: "missing" },
      { name: "Bing Places", group: "Maps", status: "missing" },
      { name: "Apple Business Connect", group: "Maps", status: "missing" },
      { name: "Yelp", group: "Directories", status: "missing" },
      { name: "Facebook", group: "Directories", status: "missing" },
      { name: "Tripadvisor", group: "Directories", status: "missing" },
      { name: "BBB", group: "Directories", status: "missing" },
    ];
  }
  return [
    { name: "Google Business Profile", group: "Maps", status: "synced" },
    { name: "Apple Maps", group: "Maps", status: "stale" },
    { name: "Bing Places", group: "Maps", status: "missing" },
    { name: "Apple Business Connect", group: "Maps", status: "synced" },
    { name: "Yelp", group: "Directories", status: "stale" },
    { name: "Facebook", group: "Directories", status: "synced" },
    { name: "Tripadvisor", group: "Directories", status: "missing" },
    { name: "BBB", group: "Directories", status: "synced" },
  ];
}

function seedDuplicates(loc: WorkspaceLocation | null): DuplicateRisk[] {
  if (!loc) return [];
  return [
    {
      id: "d1",
      title: `${loc.name} — suite variant`,
      match: "Same phone · address punctuation drift",
      confidence: 86,
      publisher: "Yelp",
    },
    {
      id: "d2",
      title: `${loc.name} LLC`,
      match: "Legal vs DBA name fork",
      confidence: 71,
      publisher: "Bing Places",
    },
  ];
}

function seedAlerts(loc: WorkspaceLocation | null): AlertItem[] {
  if (!loc) {
    return [
      {
        id: "a0",
        title: "Add a location to unlock alerts",
        detail: "Hours drift, NAP mismatches, and takedown risk appear here.",
        tone: "sky",
      },
    ];
  }
  return [
    {
      id: "a1",
      title: "Apple Maps hours look stale",
      detail: `Saturday still shows 09:00 – 17:00 vs workspace ${loc.sat}.`,
      tone: "butter",
    },
    {
      id: "a2",
      title: "Bing Places missing",
      detail: "No listing matched for this storefront yet.",
      tone: "coral",
    },
    {
      id: "a3",
      title: "NAP fingerprint ready",
      detail: "Canonical name, address, and phone are set for sync.",
      tone: "mint",
    },
  ];
}

function coverageScore(rows: PublisherRow[]) {
  if (rows.every((r) => r.status === "missing")) return 0;
  const weights = { synced: 1, stale: 0.55, missing: 0 } as const;
  const sum = rows.reduce((acc, r) => acc + weights[r.status], 0);
  return Math.round((sum / rows.length) * 100);
}

function napScore(loc: WorkspaceLocation | null) {
  if (!loc) return 0;
  let score = 40;
  if (loc.name.trim().length >= 2) score += 20;
  if (loc.address.trim().length >= 8) score += 20;
  if (/[\d()\-\s+]{7,}/.test(loc.phone)) score += 20;
  return Math.min(100, score);
}

const STATUS_CHIP: Record<PublisherStatus, string> = {
  synced: "bg-mint-soft text-mint",
  stale: "bg-butter-soft text-butter",
  missing: "bg-coral-soft text-coral",
};

const STATUS_LABEL: Record<PublisherStatus, string> = {
  synced: "Synced",
  stale: "Stale",
  missing: "Missing",
};

const ALERT_TONE: Record<AlertItem["tone"], string> = {
  butter: "bg-butter-soft text-butter",
  coral: "bg-coral-soft text-coral",
  sky: "bg-sky-soft text-sky",
  mint: "bg-mint-soft text-mint",
};

export function WorkspaceDashboard({
  displayName,
  workspace,
  section,
  onSectionChange,
}: {
  displayName?: string | null;
  workspace: WorkspaceRow | null;
  section: WorkspaceSection;
  onSectionChange: (next: WorkspaceSection) => void;
}) {
  const [locations, setLocations] = useState<WorkspaceLocation[]>([]);
  const [draft, setDraft] = useState({ name: "", address: "", phone: "" });
  const [formError, setFormError] = useState("");

  const primary = locations[0] ?? null;
  const publishers = useMemo(() => seedPublishers(Boolean(primary)), [primary]);
  const duplicates = useMemo(() => seedDuplicates(primary), [primary]);
  const alerts = useMemo(() => seedAlerts(primary), [primary]);
  const cov = coverageScore(publishers);
  const nap = napScore(primary);
  const firstName = displayName?.trim().split(/\s+/)[0];
  const company = workspace?.company?.trim() || null;
  const planLabel =
    workspace?.plan === "growth"
      ? "Growth"
      : workspace?.plan === "enterprise"
        ? "Enterprise"
        : "Starter trial";
  const openAlertCount = alerts.filter((a) => a.id !== "a0").length;

  function addLocation(e: FormEvent) {
    e.preventDefault();
    const name = draft.name.trim();
    const address = draft.address.trim();
    const phone = draft.phone.trim();
    if (!name || !address || !phone) {
      setFormError("Name, address, and phone are required.");
      return;
    }
    setFormError("");
    setLocations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        address,
        phone,
        ...DAY_DEFAULTS,
      },
    ]);
    setDraft({ name: "", address: "", phone: "" });
  }

  function updateHours(id: string, field: "monFri" | "sat" | "sun", value: string) {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc)),
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Listing desk
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {company
              ? `${company} · keep every storefront accurate across Google, Apple, Bing, and directories.`
              : "Keep every storefront accurate across Google, Apple, Bing, and directories."}
          </p>
        </div>
        <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-brand-soft px-3 text-xs font-semibold text-brand">
          {planLabel}
          {workspace?.trialActive && workspace.trialDaysLeft > 0
            ? ` · ${workspace.trialDaysLeft}d left`
            : null}
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<MapPin className="size-4" />}
          tone="text-brand bg-brand-soft"
          label="Locations"
          value={String(locations.length || Number(workspace?.locations_count) || 0)}
          hint="Storefronts in this workspace"
        />
        <MetricCard
          icon={<Radar className="size-4" />}
          tone="text-sky bg-sky-soft"
          label="Coverage score"
          value={primary ? `${cov}%` : "—"}
          hint="Publisher sync health"
        />
        <MetricCard
          icon={<Copy className="size-4" />}
          tone="text-coral bg-coral-soft"
          label="Duplicates"
          value={primary ? String(duplicates.length) : "—"}
          hint="Near-match risks"
        />
        <MetricCard
          icon={<Bell className="size-4" />}
          tone="text-butter bg-butter-soft"
          label="Open alerts"
          value={String(openAlertCount)}
          hint="Hours, NAP, coverage"
        />
      </div>

      {section === "overview" ? (
        <>
          <section className="space-y-4">
            <SectionTitle
              eyebrow="Starter toolkit"
              title="Operate listing health from one desk"
              copy="Open a module to manage locations, fingerprint NAP, check coverage, close duplicates, edit hours, or run the auditor."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLKIT_SECTIONS.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSectionChange(tool.id)}
                  className="group rounded-2xl bg-cream p-5 text-left hairline transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-18px_rgba(28,25,23,0.35)]"
                >
                  <span
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-xl",
                      tool.tone,
                    )}
                  >
                    <tool.icon className="size-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">{tool.label}</p>
                  <p className="mt-1 text-sm leading-snug text-muted">{tool.blurb}</p>
                </button>
              ))}
            </div>
          </section>

          {locations.length === 0 ? (
            <LocationsPanel
              locations={locations}
              draft={draft}
              formError={formError}
              onDraftChange={setDraft}
              onSubmit={addLocation}
              intro="get-started"
            />
          ) : (
            <section className="grid gap-4 lg:grid-cols-2">
              <MiniCoverage
                publishers={publishers}
                score={cov}
                onOpen={() => onSectionChange("coverage")}
              />
              <MiniAlerts
                alerts={alerts.slice(0, 3)}
                onOpen={() => onSectionChange("hours")}
              />
            </section>
          )}
        </>
      ) : null}

      {section === "locations" ? (
        <LocationsPanel
          locations={locations}
          draft={draft}
          formError={formError}
          onDraftChange={setDraft}
          onSubmit={addLocation}
        />
      ) : null}

      {section === "nap" ? (
        <NapPanel location={primary} score={nap} onAdd={() => onSectionChange("locations")} />
      ) : null}

      {section === "coverage" ? (
        <CoveragePanel
          publishers={publishers}
          score={cov}
          hasLocation={Boolean(primary)}
          onAdd={() => onSectionChange("locations")}
        />
      ) : null}

      {section === "duplicates" ? (
        <DuplicatesPanel
          risks={duplicates}
          hasLocation={Boolean(primary)}
          onAdd={() => onSectionChange("locations")}
        />
      ) : null}

      {section === "hours" ? (
        <HoursPanel
          locations={locations}
          alerts={alerts}
          onUpdateHours={updateHours}
          onAdd={() => onSectionChange("locations")}
        />
      ) : null}

      {section === "auditor" ? (
        <section className="space-y-4" id="workspace-auditor">
          <SectionTitle
            eyebrow="Listing health"
            title="Auditor"
            copy="Scan a business name and city for coverage gaps, mismatches, and duplicate risk."
          />
          <ListingAuditor compact />
        </section>
      ) : null}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
      <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">{copy}</p>
    </div>
  );
}

function MetricCard({
  icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  tone: string;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-cream p-4 hairline sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className={cn("inline-flex size-8 items-center justify-center rounded-xl", tone)}>
          {icon}
        </span>
        <p className="font-display text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-xs leading-snug text-muted">{hint}</p>
    </div>
  );
}

function LocationsPanel({
  locations,
  draft,
  formError,
  onDraftChange,
  onSubmit,
  intro = "full",
}: {
  locations: WorkspaceLocation[];
  draft: { name: string; address: string; phone: string };
  formError: string;
  onDraftChange: (next: { name: string; address: string; phone: string }) => void;
  onSubmit: (e: FormEvent) => void;
  intro?: "full" | "get-started";
}) {
  return (
    <section className="space-y-4">
      {intro === "get-started" ? (
        <SectionTitle
          eyebrow="Get started"
          title="Add your first location"
          copy="Starter includes one location. Enter name, address, and phone to unlock coverage and duplicate radar."
        />
      ) : (
        <SectionTitle
          eyebrow="Storefronts"
          title="Locations"
          copy="Add the places you manage. Each location becomes the canonical record for NAP, hours, and coverage."
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="rounded-2xl bg-cream p-5 hairline sm:p-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Plus className="size-4" />
            </span>
            <p className="text-sm font-semibold">New storefront</p>
          </div>
          <div className="mt-4 grid gap-3">
            <div>
              <Label htmlFor="loc-name">Business name</Label>
              <Input
                id="loc-name"
                className="mt-1.5"
                placeholder="Northline Dental"
                value={draft.name}
                onChange={(e) => onDraftChange({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="loc-address">Address</Label>
              <Input
                id="loc-address"
                className="mt-1.5"
                placeholder="214 W Lake St, Chicago, IL 60601"
                value={draft.address}
                onChange={(e) => onDraftChange({ ...draft, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="loc-phone">Phone</Label>
              <Input
                id="loc-phone"
                className="mt-1.5"
                placeholder="(312) 555-0142"
                value={draft.phone}
                onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })}
              />
            </div>
            {formError ? <p className="text-sm text-coral">{formError}</p> : null}
            <Button type="submit" className="mt-1 w-full sm:w-auto">
              Add location
            </Button>
          </div>
        </form>

        <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
          <p className="text-sm font-semibold">Workspace locations</p>
          {locations.length === 0 ? (
            <div className="mt-4 rounded-xl bg-sand/70 px-4 py-6 text-center">
              <MapPin className="mx-auto size-5 text-muted" />
              <p className="mt-2 text-sm font-medium text-ink">No storefronts yet</p>
              <p className="mt-1 text-xs text-muted">Add one to seed coverage and NAP checks.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {locations.map((loc) => (
                <li key={loc.id} className="rounded-xl bg-paper px-4 py-3 hairline">
                  <p className="text-sm font-semibold">{loc.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{loc.address}</p>
                  <p className="mt-1 text-xs tabular-nums text-ink-soft">{loc.phone}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function NapPanel({
  location,
  score,
  onAdd,
}: {
  location: WorkspaceLocation | null;
  score: number;
  onAdd: () => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Consistency"
        title="NAP fingerprint"
        copy="Canonical name, address, and phone are the source of truth every publisher is diffed against."
      />
      {!location ? (
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="Fingerprint needs a location"
          detail="Add a storefront first, then review the canonical NAP string."
          actionLabel="Add location"
          onAction={onAdd}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Consistency score
            </p>
            <p className="mt-3 font-display text-5xl font-semibold tabular-nums tracking-tight">
              {score}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              {score >= 90
                ? "Canonical NAP looks complete."
                : "Fill missing fields to raise the fingerprint."}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-sky transition-[width] duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
            <p className="text-sm font-semibold">Canonical record</p>
            <dl className="mt-4 space-y-3">
              <NapField label="Name" value={location.name} ok={location.name.length >= 2} />
              <NapField
                label="Address"
                value={location.address}
                ok={location.address.length >= 8}
              />
              <NapField
                label="Phone"
                value={location.phone}
                ok={/[\d()\-\s+]{7,}/.test(location.phone)}
              />
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}

function NapField({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-paper px-4 py-3 hairline">
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
        <dd className="mt-1 truncate text-sm font-medium text-ink">{value}</dd>
      </div>
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          ok ? "bg-mint-soft text-mint" : "bg-coral-soft text-coral",
        )}
      >
        {ok ? <Check className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
      </span>
    </div>
  );
}

function CoveragePanel({
  publishers,
  score,
  hasLocation,
  onAdd,
}: {
  publishers: PublisherRow[];
  score: number;
  hasLocation: boolean;
  onAdd: () => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Publishers"
        title="Coverage snapshot"
        copy="See which networks have the location, which are stale, and which never received it."
      />
      {!hasLocation ? (
        <EmptyState
          icon={<Radar className="size-5" />}
          title="No coverage until a location exists"
          detail="Add a storefront to seed Google, Apple, Bing, and directory status."
          actionLabel="Add location"
          onAction={onAdd}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Coverage score
              </p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{score}%</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["synced", "stale", "missing"] as PublisherStatus[]).map((s) => (
                <span
                  key={s}
                  className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_CHIP[s])}
                >
                  {STATUS_LABEL[s]} · {publishers.filter((p) => p.status === s).length}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {publishers.map((pub) => (
              <div key={pub.name} className="rounded-2xl bg-cream p-4 hairline">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{pub.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{pub.group}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      STATUS_CHIP[pub.status],
                    )}
                  >
                    {STATUS_LABEL[pub.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function DuplicatesPanel({
  risks,
  hasLocation,
  onAdd,
}: {
  risks: DuplicateRisk[];
  hasLocation: boolean;
  onAdd: () => void;
}) {
  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Near-matches"
        title="Duplicate radar"
        copy="Phone, place, and name forks surface here with a confidence score before reviews split."
      />
      {!hasLocation ? (
        <EmptyState
          icon={<Copy className="size-5" />}
          title="Radar is idle"
          detail="Add a location to scan for suite variants, DBA forks, and publisher near-matches."
          actionLabel="Add location"
          onAction={onAdd}
        />
      ) : risks.length === 0 ? (
        <div className="rounded-2xl bg-mint-soft/60 px-5 py-8 text-center hairline">
          <Check className="mx-auto size-5 text-mint" />
          <p className="mt-2 text-sm font-semibold">No near-matches right now</p>
          <p className="mt-1 text-xs text-muted">We will flag risks as coverage expands.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {risks.map((risk) => (
            <li
              key={risk.id}
              className="flex flex-col gap-3 rounded-2xl bg-cream p-4 hairline sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">{risk.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {risk.match} · {risk.publisher}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-coral-soft px-2.5 py-1 text-xs font-semibold tabular-nums text-coral">
                  {risk.confidence}% match
                </span>
                <Button type="button" size="sm" variant="secondary">
                  Review
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HoursPanel({
  locations,
  alerts,
  onUpdateHours,
  onAdd,
}: {
  locations: WorkspaceLocation[];
  alerts: AlertItem[];
  onUpdateHours: (id: string, field: "monFri" | "sat" | "sun", value: string) => void;
  onAdd: () => void;
}) {
  const loc = locations[0] ?? null;
  return (
    <section className="space-y-4">
      <SectionTitle
        eyebrow="Operations"
        title="Hours & alerts"
        copy="Keep weekly hours governed and watch for drift before publishers fork a second pin."
      />
      {!loc ? (
        <EmptyState
          icon={<Clock3 className="size-5" />}
          title="No hours to edit yet"
          detail="Add a location, then set Mon–Fri, Saturday, and Sunday windows."
          actionLabel="Add location"
          onAction={onAdd}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
            <p className="text-sm font-semibold">{loc.name} hours</p>
            <div className="mt-4 grid gap-3">
              <HourField
                label="Mon – Fri"
                value={loc.monFri}
                onChange={(v) => onUpdateHours(loc.id, "monFri", v)}
              />
              <HourField
                label="Saturday"
                value={loc.sat}
                onChange={(v) => onUpdateHours(loc.id, "sat", v)}
              />
              <HourField
                label="Sunday"
                value={loc.sun}
                onChange={(v) => onUpdateHours(loc.id, "sun", v)}
              />
            </div>
          </div>
          <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-butter" />
              <p className="text-sm font-semibold">Alert feed</p>
            </div>
            <ul className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <li key={alert.id} className="rounded-xl bg-paper px-4 py-3 hairline">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                        ALERT_TONE[alert.tone],
                      )}
                    >
                      <AlertTriangle className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{alert.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">{alert.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function HourField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function MiniCoverage({
  publishers,
  score,
  onOpen,
}: {
  publishers: PublisherRow[];
  score: number;
  onOpen: () => void;
}) {
  return (
    <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Coverage at a glance</p>
        <button
          type="button"
          onClick={onOpen}
          className="text-xs font-semibold text-brand hover:underline"
        >
          Open
        </button>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{score}%</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {publishers.slice(0, 6).map((p) => (
          <span
            key={p.name}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
              STATUS_CHIP[p.status],
            )}
          >
            {p.name.split(" ")[0]} · {STATUS_LABEL[p.status]}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniAlerts({
  alerts,
  onOpen,
}: {
  alerts: AlertItem[];
  onOpen: () => void;
}) {
  return (
    <div className="rounded-2xl bg-cream p-5 hairline sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Open alerts</p>
        <button
          type="button"
          onClick={onOpen}
          className="text-xs font-semibold text-brand hover:underline"
        >
          Hours & alerts
        </button>
      </div>
      <ul className="mt-4 space-y-2.5">
        {alerts.map((a) => (
          <li key={a.id} className="flex items-start gap-2 text-sm">
            <span
              className={cn(
                "mt-0.5 size-2 shrink-0 rounded-full",
                a.tone === "mint"
                  ? "bg-mint"
                  : a.tone === "coral"
                    ? "bg-coral"
                    : a.tone === "sky"
                      ? "bg-sky"
                      : "bg-butter",
              )}
            />
            <span className="leading-snug text-ink-soft">{a.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  detail,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-2xl bg-cream px-5 py-10 text-center hairline sm:px-8">
      <span className="mx-auto inline-flex size-10 items-center justify-center rounded-2xl bg-sand text-ink-soft">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted">{detail}</p>
      <Button type="button" size="sm" className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
