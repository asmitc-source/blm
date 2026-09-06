import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { usePinnedProgress } from "@/components/home/scroll";
import {
  AppleMark,
  BingMark,
  GoogleMark,
  MetaMark,
  TripadvisorMark,
  YelpMark,
} from "@/components/brand-marks";
import { cn } from "@/lib/utils";

const FIELDS = [
  {
    id: "phone",
    label: "Phone",
    drift: "(312) 555-0142",
    live: "(312) 555-0199",
  },
  {
    id: "hours",
    label: "Sunday hours",
    drift: "Open 9-5",
    live: "Closed",
  },
  {
    id: "name",
    label: "Listed name",
    drift: "Northline Coffee LLC",
    live: "Northline Coffee",
  },
] as const;

const PUBLISHERS = [
  { name: "Google", Mark: GoogleMark },
  { name: "Apple", Mark: AppleMark },
  { name: "Facebook", Mark: MetaMark },
  { name: "Tripadvisor", Mark: TripadvisorMark },
  { name: "Yelp", Mark: YelpMark },
  { name: "Bing", Mark: BingMark },
] as const;

const TILES = ["var(--tile-a)", "var(--tile-b)", "var(--tile-c)", "var(--tile-d)"] as const;

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function smooth(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function span(p: number, a: number, b: number) {
  if (b <= a) return p >= b ? 1 : 0;
  return smooth((p - a) / (b - a));
}

function scrollTrackToProgress(el: HTMLElement, progress: number) {
  const vh = window.innerHeight;
  const start = vh * 0.1;
  const end = el.offsetHeight - vh * 0.78;
  const rect = el.getBoundingClientRect();
  const targetTop = start - progress * Math.max(end, 1);
  window.scrollTo({ top: window.scrollY + (rect.top - targetTop), behavior: "smooth" });
}

export function ProductProof({ explore = true }: { explore?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const p = usePinnedProgress(trackRef);
  const [reduced, setReduced] = useState(false);
  const [tab, setTab] = useState<number | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const derivedField = p >= 0.999 ? 2 : Math.min(2, Math.floor(p * 3));
  const field = reduced ? (tab ?? 0) : derivedField;
  const local = reduced ? 1 : clamp01(p * 3 - derivedField);
  const current = FIELDS[field];

  const driftT = 1 - span(local, 0.22, 0.4);
  const pushT = span(local, 0.28, 0.62);
  const lockT = span(local, 0.56, 0.84);
  const strike = span(local, 0.24, 0.4);
  const pushing = pushT > 0.04 && lockT < 0.86;
  const locked = lockT >= 0.86 || reduced;
  const lockedCount = locked
    ? PUBLISHERS.length
    : Math.max(0, Math.min(PUBLISHERS.length, Math.round(pushT * PUBLISHERS.length)));

  function onTab(i: number) {
    if (reduced) {
      setTab(i);
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    scrollTrackToProgress(el, i / 3 + 0.04);
  }

  const status = locked
    ? "All six locked"
    : pushing
      ? `Writing ${lockedCount} of 6`
      : "Scroll to push this field";

  return (
    <section aria-labelledby="proof-title">
      <div className="page-wrap pt-16 sm:pt-24">
        <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">The product</p>
            <h2 id="proof-title" className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Fix it once. Every map catches up.
            </h2>
            <p className="mt-3 max-w-xl text-lg text-ink-soft">
              Change a phone, Sunday hours, or a DBA. Scroll and six publishers lock to the same Northline string.
            </p>
          </div>
          {explore ? (
          <Link to="/product" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink">
            Explore the product <ArrowRight className="size-4" />
          </Link>
          ) : null}
        </Reveal>
      </div>

      <div ref={trackRef} data-proof-track className="relative mt-8 h-[210vh]">
        <div className="sticky top-16 z-[1] flex h-[calc(100svh-4rem)] items-center">
          <div className="page-wrap w-full">
            <div
              className="proof-stage relative mx-auto overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-lift)]"
              style={{ height: "min(40rem, calc(100svh - 6.5rem))" }}
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/80 px-4 py-3 sm:gap-3 sm:px-6 sm:py-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Canonical listing</p>
                    <p className="mt-0.5 font-display text-lg font-semibold text-ink sm:text-2xl">Northline Coffee</p>
                    <p className="hidden text-sm text-ink-soft sm:block">Wicker Park · 1420 N Milwaukee Ave</p>
                  </div>
                  <div className="glass-nav flex rounded-full p-1" role="tablist" aria-label="Field to rewrite">
                    {FIELDS.map((f, i) => (
                      <button
                        key={f.id}
                        type="button"
                        role="tab"
                        aria-selected={i === field}
                        onClick={() => onTab(i)}
                        className={cn(
                          "h-8 rounded-full px-2.5 text-xs font-semibold transition-[background-color,color,box-shadow] duration-200 sm:h-9 sm:px-3.5 sm:text-sm",
                          i === field ? "glass-nav-active text-ink" : "text-ink-soft",
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                  <div className="flex flex-col justify-between gap-4 p-4 sm:gap-5 sm:p-6">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {current.label} on file
                      </p>
                      <div className="relative mt-2 min-h-[2.4rem] sm:min-h-[2.75rem]">
                        <p
                          className="relative w-fit font-display text-[1.75rem] font-semibold tracking-tight text-ink tabular-nums sm:text-[2.15rem]"
                          style={{
                            opacity: Number(Math.max(0, driftT).toFixed(3)),
                            filter: strike > 0.02 ? `blur(${(strike * 2.4).toFixed(2)}px)` : "none",
                          }}
                        >
                          {current.drift}
                          <span
                            className="absolute left-0 top-1/2 h-[2px] origin-left bg-coral"
                            style={{ width: "100%", transform: `scaleX(${strike.toFixed(3)})` }}
                          />
                        </p>
                        <p
                          className="absolute left-0 top-0 z-[1] font-display text-[1.75rem] font-semibold tracking-tight text-brand tabular-nums sm:text-[2.15rem]"
                          style={{
                            opacity: Number((1 - driftT).toFixed(3)),
                            transform: `translateY(${(driftT * 8).toFixed(1)}px)`,
                          }}
                        >
                          {current.live}
                        </p>
                      </div>
                      <p className="mt-2 max-w-sm text-sm text-ink-soft sm:mt-3">
                        {locked
                          ? "Pushed to Google, Apple, Bing, Facebook, Tripadvisor, and Yelp."
                          : "Maps still show the drifted string. Keep scrolling and every publisher rewrites."}
                      </p>
                      <div className="mt-3 flex gap-1 sm:mt-4" aria-hidden="true">
                        {PUBLISHERS.map((pub, i) => {
                          const on = i < lockedCount;
                          return (
                            <span
                              key={pub.name}
                              className="h-1.5 flex-1 origin-left rounded-full"
                              style={{
                                background: on ? TILES[i % TILES.length] : "var(--sand)",
                                transform: `scaleX(${on ? "1" : "0.45"})`,
                                opacity: on ? 1 : 0.55,
                                transition: "transform 280ms var(--ease-out-soft), background-color 280ms, opacity 280ms",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="glass-chip inline-flex h-9 items-center px-3 text-sm font-semibold text-ink sm:h-10 sm:px-3.5">
                        {status}
                      </p>
                      <p className="text-sm text-muted" aria-live="polite">
                        {field + 1} of 3 · {current.label}
                      </p>
                    </div>
                  </div>

                  <div className="min-h-0 border-t border-line/80 p-3 sm:p-5 lg:border-l lg:border-t-0">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:mb-3">
                      Publisher graph
                    </p>
                    <ul className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {PUBLISHERS.map((pub, i) => {
                        const ok = i < lockedCount;
                        const catching = pushing && !ok && i === lockedCount;
                        const shown = ok ? current.live : current.drift;
                        return (
                          <li
                            key={pub.name}
                            className={cn("proof-pub relative overflow-hidden rounded-2xl bg-paper/80 px-2.5 py-2 sm:px-3.5 sm:py-3", ok && "is-lock", catching && "is-catch")}
                            style={{ transitionDelay: `${(i * 40).toFixed(0)}ms` }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <pub.Mark />
                              {ok ? (
                                <span className="proof-lock-badge inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                                  <Check className="size-3" /> Locked
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-coral">Drift</span>
                              )}
                            </div>
                            <p className={cn("mt-2 truncate text-sm tabular-nums", ok ? "text-ink" : "text-coral")}>
                              {shown}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
