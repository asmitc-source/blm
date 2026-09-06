import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Sparkles } from "lucide-react";
import {
  runListingAudit,
  SCAN_STEPS,
  scoreTone,
  statusLabel,
  type AuditResult,
  type DirectoryTone,
} from "@/lib/auditor";
import { submitLead } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { query: "Northline", city: "Chicago" },
  { query: "Atelier", city: "Brooklyn" },
  { query: "Kite & Co", city: "Austin" },
];

const TONE_BG: Record<DirectoryTone, string> = {
  mint: "bg-mint-soft text-mint",
  coral: "bg-coral-soft text-coral",
  lavender: "bg-lavender-soft text-lavender",
  butter: "bg-butter-soft text-butter",
  sky: "bg-sky-soft text-sky",
};

const TONE_BAR: Record<DirectoryTone, string> = {
  mint: "bg-mint",
  coral: "bg-coral",
  lavender: "bg-lavender",
  butter: "bg-butter",
  sky: "bg-sky",
};

const TONE_TEXT: Record<DirectoryTone, string> = {
  mint: "text-mint",
  coral: "text-coral",
  lavender: "text-lavender",
  butter: "text-butter",
  sky: "text-sky",
};

const TONE_FILL: Record<DirectoryTone, string> = {
  mint: "stroke-mint",
  coral: "stroke-coral",
  lavender: "stroke-lavender",
  butter: "stroke-butter",
  sky: "stroke-sky",
};

const STATUS_TONE: Record<string, DirectoryTone> = {
  synced: "mint",
  mismatch: "coral",
  missing: "butter",
  duplicate: "lavender",
};

export function ListingAuditor({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [phase, setPhase] = useState<"idle" | "scan" | "result">("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function start(nextQuery = query, nextCity = city) {
    const q = nextQuery.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    const audit = runListingAudit({ query: q, city: nextCity });
    setResult(audit);
    setQuery(q);
    setCity(nextCity);
    setPhase("scan");
    setStep(0);
    setDisplayScore(0);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    start();
  }

  useEffect(() => {
    if (phase !== "scan") return;
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      setPhase("result");
      return;
    }
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= SCAN_STEPS.length - 1) {
          window.clearInterval(id);
          window.setTimeout(() => setPhase("result"), 280);
          return s;
        }
        return s + 1;
      });
    }, 380);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "result" || !result) return;
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      setDisplayScore(result.score);
      return;
    }
    let frame = 0;
    const startVal = 0;
    const end = result.score;
    const ticks = 28;
    const id = window.setInterval(() => {
      frame += 1;
      const t = frame / ticks;
      const eased = 1 - (1 - t) * (1 - t);
      setDisplayScore(Math.round(startVal + (end - startVal) * eased));
      if (frame >= ticks) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [phase, result]);

  return (
    <section id="auditor" className={cn("relative", compact ? "" : "scroll-mt-24")}>
      <div className="surface-card relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-7">
        <div className="spectrum-bar absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-mint/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-coral/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Listing Health Auditor
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
                See what maps and directories actually show.
              </p>
            </div>
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-muted">
              No signup to try
            </span>
          </div>

          <form onSubmit={onSubmit} className="grid gap-2 sm:grid-cols-[1fr_9.5rem_auto]">
            <label className="sr-only" htmlFor="audit-query">
              Business name, website, or Google Business Profile URL
            </label>
            <Input
              ref={inputRef}
              id="audit-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Business name, website, or GBP URL"
              autoComplete="organization"
            />
            <label className="sr-only" htmlFor="audit-city">
              City
            </label>
            <Input
              id="audit-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              autoComplete="address-level2"
            />
            <Button type="submit" className="w-full sm:w-auto">
              Run listing audit
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>Try</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.query}
                type="button"
                className="rounded-full border border-line bg-cream px-2.5 py-1 text-ink-soft hover:border-line-strong hover:text-ink"
                onClick={() => start(ex.query, ex.city)}
              >
                {ex.query} · {ex.city}
              </button>
            ))}
          </div>

          {phase === "idle" ? <IdlePreview /> : null}
          {phase === "scan" ? <ScanPanel step={step} /> : null}
          {phase === "result" && result ? (
            <ResultPanel result={result} displayScore={displayScore} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function IdlePreview() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "NAP", tone: "mint", value: "Match" },
        { label: "Coverage", tone: "sky", value: "Maps" },
        { label: "Duplicates", tone: "lavender", value: "Risk" },
        { label: "Hours", tone: "butter", value: "Gaps" },
      ].map((card) => (
        <div key={card.label} className="rounded-2xl bg-paper/80 px-3 py-3 hairline">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {card.label}
          </p>
          <p className={cn("mt-2 font-display text-lg font-semibold", TONE_TEXT[card.tone as DirectoryTone])}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ScanPanel({ step }: { step: number }) {
  return (
    <div className="mt-5 rounded-2xl bg-paper p-4 hairline sm:p-5" aria-live="polite">
      <div className="relative h-1.5 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-mint transition-[width] duration-300"
          style={{ width: `${((step + 1) / SCAN_STEPS.length) * 100}%` }}
        />
        <div className="scan-bar absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cream/80 to-transparent" style={{ animation: "sweep 1.1s linear infinite" }} />
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {SCAN_STEPS.map((s, i) => {
          const on = i <= step;
          return (
            <li
              key={s.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                on ? "animate-chip-on bg-ink text-cream" : "bg-sand text-muted",
              )}
            >
              {on ? <Check className="size-3.5" /> : null}
              {s.label}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-muted">
        Scanning Google, Apple Maps, Bing, Facebook, and the directory network…
      </p>
    </div>
  );
}

function ResultPanel({
  result,
  displayScore,
}: {
  result: AuditResult;
  displayScore: number;
}) {
  const tone = scoreTone(result.score);
  const showBurst = result.score >= 85;

  return (
    <div className="mt-5 space-y-4">
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="relative flex flex-col items-center justify-center rounded-2xl bg-paper px-6 py-5 hairline">
          {showBurst ? <ConfettiLite /> : null}
          <ScoreRing score={displayScore} tone={tone} />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Health score
          </p>
          <p className="mt-1 max-w-[16rem] text-center text-sm text-ink-soft">{result.summary}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label="NAP consistency" value={result.nap} tone="mint" hint="Name, address, phone" />
          <MetricCard label="Directory coverage" value={result.coverage} tone="sky" hint={`${result.scannedSources} sources checked`} />
          <MetricCard label="Duplicate risk" value={result.duplicateRisk} tone="lavender" invert hint="Lower is healthier" />
          <MetricCard label="Hours / category" value={result.hours} tone="butter" hint="Gaps and mismatches" />
        </div>
      </div>

      <PresenceMap directories={result.directories} city={result.city} name={result.displayName} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Top issues</p>
        <ul className="mt-2 grid gap-2">
          {result.issues.map((issue) => (
            <li key={issue.id} className="flex flex-col gap-1 rounded-2xl bg-paper px-4 py-3 hairline sm:flex-row sm:items-start sm:gap-4">
              <SeverityPill severity={issue.severity} />
              <div>
                <p className="font-semibold text-ink">{issue.title}</p>
                <p className="mt-0.5 text-sm text-muted">{issue.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <EmailGate result={result} />
    </div>
  );
}

function ScoreRing({ score, tone }: { score: number; tone: DirectoryTone }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div className="relative size-[148px]">
      <svg viewBox="0 0 132 132" className="size-full -rotate-90">
        <circle cx="66" cy="66" r={r} fill="none" className="stroke-sand" strokeWidth="10" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          className={TONE_FILL[tone]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-4xl font-semibold tabular-nums tracking-tight text-ink">
          {score}
        </span>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
  hint,
  invert,
}: {
  label: string;
  value: number;
  tone: DirectoryTone;
  hint: string;
  invert?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-paper px-4 py-3 hairline">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-soft">{label}</p>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums", TONE_BG[tone])}>
          {invert ? `${value} risk` : value}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand">
        <div
          className={cn("h-full rounded-full", TONE_BAR[tone])}
          style={{ width: `${invert ? 100 - value : value}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-faint">{hint}</p>
    </div>
  );
}

function PresenceMap({
  directories,
  city,
  name,
}: {
  directories: AuditResult["directories"];
  city: string;
  name: string;
}) {
  const pins = useMemo(
    () => [
      { top: "22%", left: "28%" },
      { top: "34%", left: "62%" },
      { top: "48%", left: "44%" },
      { top: "58%", left: "18%" },
      { top: "30%", left: "78%" },
      { top: "66%", left: "70%" },
      { top: "18%", left: "50%" },
      { top: "72%", left: "40%" },
    ],
    [],
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative overflow-hidden rounded-2xl bg-sky-soft/60 p-4 hairline">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
          <MapPin className="size-4 text-sky" />
          Presence field{city ? ` · ${city}` : ""}
        </div>
        <div className="relative h-40 rounded-xl bg-gradient-to-br from-cream/40 to-sky/10">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-1 rounded-full bg-sky/30"
              style={{
                top: `${(i * 37) % 90}%`,
                left: `${(i * 53) % 94}%`,
              }}
            />
          ))}
          {directories.map((dir, i) => (
            <span
              key={dir.id}
              className={cn(
                "animate-pin absolute flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm",
                TONE_BG[STATUS_TONE[dir.status] ?? dir.tone],
              )}
              style={{ ...pins[i], animationDelay: `${i * 40}ms` }}
            >
              {dir.short}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Colored pins mark how {name} appears across publishers.</p>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {directories.map((dir) => (
          <li key={dir.id} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2 hairline">
            <span className="text-sm font-medium text-ink">{dir.short}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", TONE_BG[STATUS_TONE[dir.status] ?? "mint"])}>
              {statusLabel(dir.status)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeverityPill({ severity }: { severity: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-coral-soft text-coral",
    medium: "bg-butter-soft text-butter",
    low: "bg-mint-soft text-mint",
  } as const;
  return (
    <span className={cn("mt-0.5 inline-flex h-6 shrink-0 items-center rounded-full px-2 text-[11px] font-semibold uppercase tracking-wide", map[severity])}>
      {severity}
    </span>
  );
}

function EmailGate({ result }: { result: AuditResult }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function send(e: FormEvent) {
    e.preventDefault();
    setState("saving");
    setError("");
    try {
      await submitLead({
        data: {
          kind: "audit",
          email,
          source: "homepage-auditor",
          payload: JSON.stringify({
            query: result.query,
            city: result.city,
            score: result.score,
          }),
        },
      });
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not send.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-mint-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-ink">Full report is on its way to {email}.</p>
          <p className="text-sm text-ink-soft">Want the workspace that closes these gaps?</p>
        </div>
        <Button asChild>
          <Link to="/signup">
            Start workspace <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-sand/80 px-4 py-4 hairline">
      <div className="flex items-start gap-2">
        <Sparkles className="mt-0.5 size-4 text-lavender" />
        <div>
          <p className="font-semibold text-ink">Email me the full report</p>
          <p className="text-sm text-muted">
            We’ll send the source-by-source breakdown for {result.displayName}.
          </p>
        </div>
      </div>
      <form onSubmit={send} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          className="sm:flex-1"
        />
        <Button type="submit" variant="mint" disabled={state === "saving"}>
          {state === "saving" ? "Sending…" : "Send report"}
        </Button>
        <Button asChild variant="secondary">
          <Link to="/signup">Create workspace</Link>
        </Button>
      </form>
      {error ? <p className="mt-2 text-sm text-coral">{error}</p> : null}
    </div>
  );
}

function ConfettiLite() {
  const bits = [
    { left: "18%", color: "bg-mint", delay: "0ms" },
    { left: "34%", color: "bg-coral", delay: "80ms" },
    { left: "52%", color: "bg-lavender", delay: "40ms" },
    { left: "68%", color: "bg-butter", delay: "120ms" },
    { left: "82%", color: "bg-sky", delay: "60ms" },
  ];
  return (
    <div className="pointer-events-none absolute inset-x-6 top-3 h-8 overflow-hidden" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.left}
          className={cn("absolute top-0 size-1.5 rounded-full", b.color)}
          style={{ left: b.left, animation: `confetti-fall 900ms ease-out ${b.delay} both` }}
        />
      ))}
    </div>
  );
}
