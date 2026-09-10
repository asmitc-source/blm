import { useRef } from "react";
import { Check } from "lucide-react";
import { usePinnedProgress } from "@/components/home/scroll";
import { LogoMark } from "@/components/logo";
import {
  AppleMark,
  BingMark,
  GoogleMark,
  MetaMark,
  TripadvisorMark,
  MapQuestMark,
} from "@/components/brand-marks";
import { cn } from "@/lib/utils";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

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

function quad(a: number, b: number, c: number, t: number) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * b + t * t * c;
}

const SLIPS = [
  {
    name: "Google",
    Mark: GoogleMark,
    listed: "Northline Coffee LLC",
    line: "1422 Milwaukee Ave",
    wrong: "(312) 555-0142",
    issue: "Wrong phone",
    tile: "var(--tile-b)",
    x: 30,
    y: 32,
    r: -6,
    bulge: 12,
    spin: 16,
    t0: 0.14,
    t1: 0.7,
    mobile: true,
  },
  {
    name: "Apple",
    Mark: AppleMark,
    listed: "Northline",
    line: "1420 N Milwaukee",
    wrong: "Sun 9-5",
    issue: "Stale hours",
    tile: "var(--tile-a)",
    x: 70,
    y: 30,
    r: 6,
    bulge: -12,
    spin: -16,
    t0: 0.18,
    t1: 0.74,
    mobile: true,
  },
  {
    name: "MapQuest",
    Mark: MapQuestMark,
    listed: "Northline Cafe",
    line: "Same block · 12 reviews",
    wrong: "Forked listing",
    issue: "Duplicate",
    tile: "var(--tile-a)",
    x: 30,
    y: 68,
    r: -5,
    bulge: -10,
    spin: 14,
    t0: 0.22,
    t1: 0.76,
    mobile: true,
  },
  {
    name: "Bing",
    Mark: BingMark,
    listed: "Northline Coffee LLC",
    line: "1420 North Milwaukee",
    wrong: "Unclaimed",
    issue: "Missing Places",
    tile: "var(--tile-c)",
    x: 70,
    y: 68,
    r: 6,
    bulge: 11,
    spin: -18,
    t0: 0.26,
    t1: 0.8,
    mobile: true,
  },
  {
    name: "Facebook",
    Mark: MetaMark,
    listed: "Northline Coffee LLC",
    line: "Legal name on the door",
    wrong: "DBA drift",
    issue: "DBA drift",
    tile: "var(--tile-c)",
    x: 50,
    y: 28,
    r: 2,
    bulge: 8,
    spin: 12,
    t0: 0.2,
    t1: 0.72,
    mobile: false,
  },
  {
    name: "Tripadvisor",
    Mark: TripadvisorMark,
    listed: "N. Line Cafe",
    line: "Old pin · Wicker Pk",
    wrong: "Ghost pin",
    issue: "Ghost pin",
    tile: "var(--tile-d)",
    x: 50,
    y: 72,
    r: -4,
    bulge: -9,
    spin: -12,
    t0: 0.24,
    t1: 0.78,
    mobile: false,
  },
] as const;

const GHOSTS = [
  { text: "Northline Coffee LLC", x: 28, y: 40, r: -5, size: "text-2xl sm:text-4xl", t0: 0.12, t1: 0.5 },
  { text: "(312) 555-0142", x: 62, y: 30, r: 4, size: "text-xl sm:text-3xl", t0: 0.16, t1: 0.52 },
  { text: "Sun 9-5", x: 58, y: 66, r: -3, size: "text-2xl sm:text-4xl", t0: 0.2, t1: 0.54 },
] as const;

export function LockIn() {
  const trackRef = useRef<HTMLDivElement>(null);
  const p = usePinnedProgress(trackRef);
  const cardOn = p >= 0.44;
  const assemble = span(p, 0.46, 0.78);
  const seal = span(p, 0.64, 0.92);
  const stack = span(p, 0.68, 1);
  const label =
    p < 0.2 ? "Six versions of Northline" : p < 0.64 ? "Filing the record" : "Northline is one listing";

  return (
    <section aria-labelledby="desk-title">
      <div className="page-wrap pt-16 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">From the pile</p>
          <h2 id="desk-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Six printouts. One Northline.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Scroll the desk. Wrong phones, stale hours, and ghost pins leave the pile. A single governed listing remains.
          </p>
        </div>
      </div>

      <div ref={trackRef} data-lock-track className="relative mt-10 h-[260vh]">
        <div className="sticky top-16 z-[1] flex h-[calc(100svh-4rem)] items-center">
          <div className="page-wrap w-full">
            <div
              className="lock-stage relative mx-auto overflow-hidden rounded-3xl border border-line shadow-[var(--shadow-lift)]"
              style={{ height: "min(42rem, calc(100svh - 6.75rem))" }}
            >
              {GHOSTS.map((g) => {
                const t = span(p, g.t0, g.t1);
                return (
                  <p
                    key={g.text}
                    className={cn(
                      "pointer-events-none absolute z-0 font-display font-semibold tracking-tight text-coral/40",
                      g.size,
                    )}
                    style={{
                      left: `${g.x}%`,
                      top: `${g.y}%`,
                      opacity: Number((0.34 * (1 - t)).toFixed(3)),
                      transform: `rotate(${g.r}deg) translateY(${(-28 * t).toFixed(1)}px)`,
                      filter: `blur(${(t * 3).toFixed(2)}px)`,
                    }}
                  >
                    <span className="relative">
                      {g.text}
                      <span
                        className="absolute left-0 top-1/2 h-[3px] origin-left bg-coral/70"
                        style={{ width: "100%", transform: `scaleX(${t.toFixed(3)})` }}
                      />
                    </span>
                  </p>
                );
              })}

              {SLIPS.map((slip) => {
                const t = span(p, slip.t0, slip.t1);
                const lift = Math.sin(Math.PI * t);
                const dx = 50 - slip.x;
                const dy = 50 - slip.y;
                const len = Math.hypot(dx, dy) || 1;
                const cx = (slip.x + 50) / 2 + (-dy / len) * slip.bulge;
                const cy = (slip.y + 50) / 2 + (dx / len) * slip.bulge;
                const x = quad(slip.x, cx, 50, t);
                const y = quad(slip.y, cy, 50, t);
                const r = lerp(slip.r, 0, t) + lift * slip.spin;
                const s = 1 + lift * 0.12 - t * 0.46;
                const fade = t < 0.72 ? 1 : Math.max(0, 1 - (t - 0.72) / 0.22);
                const tear = span(t, 0.22, 0.85);
                const strike = span(t, 0.12, 0.4);
                const z = t > 0.02 && t < 0.78 ? 6 : 3;
                return (
                  <article
                    key={slip.name}
                    className={cn("absolute w-[13.75rem] sm:w-[15.5rem]", !slip.mobile && "hidden md:block")}
                    style={{
                      left: `${x.toFixed(2)}%`,
                      top: `${y.toFixed(2)}%`,
                      zIndex: z,
                      opacity: Number(fade.toFixed(3)),
                      transform: `translate(-50%, -50%) rotate(${r.toFixed(1)}deg) scale(${s.toFixed(3)})`,
                      filter: t > 0.68 ? `blur(${((t - 0.68) * 10).toFixed(2)}px)` : "none",
                    }}
                  >
                    <SlipCard
                      slip={slip}
                      strike={strike}
                      tear={tear}
                      lift={lift}
                    />
                  </article>
                );
              })}

              <div
                className="absolute left-1/2 top-1/2 z-[5] w-[min(26rem,88%)]"
                style={{
                  opacity: cardOn ? 1 : 0,
                  visibility: cardOn ? "visible" : "hidden",
                  transform: `translate(-50%, -50%) scale(${(0.84 + assemble * 0.16).toFixed(3)}) rotate(${((1 - assemble) * -2.4).toFixed(2)}deg)`,
                }}
              >
                <Canonical assemble={assemble} seal={seal} stack={stack} />
              </div>

              <div className="absolute inset-x-0 bottom-3 z-[8] flex justify-center">
                <p className="rounded-full bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft hairline">
                  {p < 0.86 ? `${label} · Scroll` : label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlipCard({
  slip,
  strike,
  tear,
  lift,
}: {
  slip: (typeof SLIPS)[number];
  strike: number;
  tear: number;
  lift: number;
}) {
  const dir = slip.bulge >= 0 ? 1 : -1;
  return (
    <div
      className="relative overflow-visible rounded-2xl bg-cream hairline"
      style={{
        boxShadow: `0 ${(6 + lift * 22).toFixed(1)}px ${(16 + lift * 36).toFixed(1)}px rgb(18 21 28 / ${(0.06 + lift * 0.16).toFixed(3)})`,
      }}
    >
      <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-2xl" style={{ background: slip.tile }} />
      <div className="overflow-hidden rounded-2xl py-4 pl-5 pr-4">
        <div className="flex items-center justify-between gap-2">
          <slip.Mark />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-coral"
            style={{ opacity: Number((1 - tear).toFixed(3)) }}
          >
            {slip.issue}
          </span>
        </div>
        <p className="mt-3 font-display text-xl font-semibold leading-tight text-ink">{slip.listed}</p>
        <p className="mt-1 text-sm text-ink-soft">{slip.line}</p>
        <p className="relative mt-2 w-fit font-semibold tabular-nums text-ink">
          {slip.wrong}
          <span
            className="absolute left-0 top-1/2 h-0.5 origin-left bg-coral"
            style={{ width: "100%", transform: `scaleX(${strike.toFixed(3)})` }}
          />
        </p>
      </div>
      <span
        className="pointer-events-none absolute right-3 top-4 rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-coral hairline"
        style={{
          opacity: Number(Math.min(1, tear * (1 - tear) * 3.6).toFixed(3)),
          transform: `translate(${(dir * tear * 52).toFixed(1)}px, ${(-8 - tear * 36).toFixed(1)}px) rotate(${(dir * tear * 28).toFixed(1)}deg) scale(${(0.25 + Math.min(tear, 0.5)).toFixed(3)})`,
          filter: `blur(${(tear * 2.4).toFixed(2)}px)`,
        }}
      >
        {slip.issue}
      </span>
      <span
        className="pointer-events-none absolute bottom-4 left-5 font-semibold tabular-nums text-coral"
        style={{
          opacity: Number((tear * 0.9 * (1 - tear)).toFixed(3)),
          transform: `translate(${(-dir * tear * 28).toFixed(1)}px, ${(tear * 24).toFixed(1)}px) rotate(${(-dir * tear * 16).toFixed(1)}deg)`,
        }}
      >
        {slip.wrong}
      </span>
    </div>
  );
}

function reveal(t: number) {
  return {
    opacity: Number(t.toFixed(3)),
    transform: `translateY(${((1 - t) * 12).toFixed(2)}px)`,
    filter: `blur(${((1 - t) * 4).toFixed(2)}px)`,
  };
}

function Canonical({ assemble, seal, stack }: { assemble: number; seal: number; stack: number }) {
  const locked = assemble > 0.88;
  const nameIn = span(assemble, 0, 0.45);
  const napIn = span(assemble, 0.18, 0.62);
  const hoursIn = span(assemble, 0.32, 0.74);
  return (
    <div
      className="relative rounded-[1.6rem] bg-cream px-6 py-6 sm:px-8 sm:py-7"
      style={{
        boxShadow:
          stack > 0.12
            ? `${(8 * stack).toFixed(1)}px ${(8 * stack).toFixed(1)}px 0 color-mix(in oklab, var(--cream) 88%, var(--sand)), ${(8 * stack).toFixed(1)}px ${(8 * stack).toFixed(1)}px 0 1px var(--line), ${(16 * stack).toFixed(1)}px ${(16 * stack).toFixed(1)}px 0 var(--paper), ${(16 * stack).toFixed(1)}px ${(16 * stack).toFixed(1)}px 0 1px var(--line), var(--elev-lift)`
            : "var(--elev-lift)",
      }}
    >
      <div className="absolute inset-x-6 top-0 h-1.5 overflow-hidden rounded-b-full">
        <div
          className="flex h-full origin-left"
          style={{ transform: `scaleX(${assemble.toFixed(3)})` }}
        >
          <span className="h-full flex-1 bg-[var(--tile-a)]" />
          <span className="h-full flex-1 bg-[var(--tile-b)]" />
          <span className="h-full flex-1 bg-[var(--tile-c)]" />
          <span className="h-full flex-1 bg-[var(--tile-d)]" />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            <span
              className="inline-flex"
              style={{
                opacity: Number(seal.toFixed(3)),
                transform: `scale(${(0.25 + seal * 0.75).toFixed(3)})`,
                filter: `blur(${((1 - seal) * 4).toFixed(2)}px)`,
              }}
            >
              <LogoMark className="size-5" />
            </span>
            Canonical listing
          </p>
          <p
            className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl"
            style={reveal(nameIn)}
          >
            Northline Coffee
          </p>
          <p className="mt-3 text-base text-ink-soft" style={reveal(napIn)}>
            Wicker Park · 1420 N Milwaukee Ave
          </p>
          <p className="text-base font-medium tabular-nums text-ink" style={reveal(napIn)}>
            (312) 555-0199
          </p>
          <p className="mt-1 text-sm text-muted" style={reveal(hoursIn)}>
            Cafe · Open 7-6 · Closed Sun
          </p>
        </div>
        <div
          className="grid size-16 shrink-0 place-items-center rounded-full hairline sm:size-[4.25rem]"
          style={locked ? { boxShadow: "inset 0 0 0 2px var(--tile-d)" } : undefined}
        >
          <span className="font-display text-2xl font-semibold tabular-nums text-ink">
            {Math.round(lerp(12, 86, assemble))}
          </span>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {SLIPS.map((slip, i) => {
          const on = span(assemble, 0.28 + i * 0.08, 0.52 + i * 0.08);
          return (
            <span
              key={slip.name}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                opacity: Number(on.toFixed(3)),
                color: on > 0.7 ? "var(--brand)" : "var(--muted)",
                background: on > 0.7 ? "var(--brand-soft)" : "var(--sand)",
                transform: `scale(${(0.25 + on * 0.75).toFixed(3)})`,
                filter: `blur(${((1 - on) * 4).toFixed(2)}px)`,
              }}
            >
              {on > 0.7 ? <Check className="size-3" /> : null}
              {slip.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
