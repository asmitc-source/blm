import { useEffect, useId, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { COMPARE_LINKS, NAV } from "@/lib/site";
import { Logo } from "@/components/logo";
import { AuthSlot } from "@/components/layout/auth-slot";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const root = document.documentElement;
        const max = root.scrollHeight - root.clientHeight;
        const next = max > 0 ? root.scrollTop / max : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${next})`;
        }
        const nextScrolled = root.scrollTop > 8;
        setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setCompareOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={cn("glass-bar relative sticky top-0 z-50", scrolled && "is-scrolled")}>
      {/* Ribbon stays mounted on every viewport — menu opens beneath, never replaces it */}
      <div className="chrome-pad relative z-[60] grid h-16 grid-cols-[1fr_auto] items-center sm:h-[4.25rem] xl:grid-cols-[1fr_auto_1fr]">
        <Logo className="justify-self-start" />
        <nav className="hidden items-center justify-center xl:flex" aria-label="Primary">
          <div className="flex items-center gap-1">
            {NAV.map((item) =>
              item.href === "/compare" ? (
                <CompareDesktop key={item.href} pathname={pathname} />
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  preload="intent"
                  className={cn(
                    "glass-nav-item",
                    (pathname === item.href || pathname.startsWith(`${item.href}/`)) && "is-active",
                  )}
                >
                  <span className="relative z-[1]">{item.label}</span>
                </Link>
              ),
            )}
          </div>
        </nav>
        <div className="flex shrink-0 items-center justify-self-end gap-1.5 sm:gap-2">
          <ThemeToggle />
          <AuthSlot compact />
          <button
            type="button"
            className="glass-icon inline-flex size-11 items-center justify-center xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-transparent">
        <div ref={progressRef} className="h-full origin-left bg-brand/80" style={{ transform: "scaleX(0)" }} />
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[45] bg-ink/25 xl:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-x-0 top-full z-[55] max-h-[min(70vh,calc(100dvh-4.25rem))] overflow-y-auto border-t border-line/60 bg-cream shadow-[var(--shadow-soft)] xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="chrome-pad flex flex-col gap-1.5 py-3" aria-label="Mobile">
          {NAV.map((item) =>
            item.href === "/compare" ? (
              <CompareMobile
                key={item.href}
                pathname={pathname}
                open={compareOpen}
                onToggle={() => setCompareOpen((v) => !v)}
                onNavigate={() => setOpen(false)}
              />
            ) : (
              <Link
                key={item.href}
                to={item.href}
                preload="intent"
                className={cn(
                  "glass-nav-item w-full justify-start px-4",
                  (pathname === item.href || pathname.startsWith(`${item.href}/`)) && "is-active",
                )}
                onClick={() => setOpen(false)}
              >
                <span className="relative z-[1]">{item.label}</span>
              </Link>
            ),
          )}
          <div className="mt-2 flex flex-col gap-2 pb-2">
            <Button asChild>
              <Link to="/trial" onClick={() => setOpen(false)}>
                Start free trial
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function compareActive(pathname: string) {
  return pathname === "/compare" || pathname.startsWith("/compare/");
}

function CompareDesktop({ pathname }: { pathname: string }) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const active = compareActive(pathname);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="compare-nav relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={cn("glass-nav-item gap-1", (active || open) && "is-active")}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative z-[1]">Compare</span>
        <ChevronDown
          className={cn("relative z-[1] size-3.5 opacity-70 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <div
        id={menuId}
        role="menu"
        aria-label="Compare"
        className={cn(
          "compare-nav-panel absolute left-1/2 top-[calc(100%-0.15rem)] z-50 w-[17.5rem] -translate-x-1/2 pt-2",
          open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-2xl bg-cream p-2 shadow-[var(--shadow-soft)] hairline">
          <p className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Compare
          </p>
          <ul className="flex flex-col gap-0.5">
            {COMPARE_LINKS.map((item) => {
              const isOn = pathname === item.href || (item.href !== "/compare" && pathname.startsWith(item.href));
              return (
                <li key={item.href} role="none">
                  <Link
                    role="menuitem"
                    to={item.href}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-sand hover:text-ink",
                      isOn && "bg-sand text-ink",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CompareMobile({
  pathname,
  open,
  onToggle,
  onNavigate,
}: {
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const menuId = useId();
  const active = compareActive(pathname);

  return (
    <div className="flex w-full flex-col gap-1">
      <button
        type="button"
        className={cn("glass-nav-item w-full justify-between px-4", (active || open) && "is-active")}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onToggle}
      >
        <span className="relative z-[1]">Compare</span>
        <ChevronDown
          className={cn("relative z-[1] size-4 opacity-70 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <div id={menuId} className={cn("pl-2", open ? "block" : "hidden")} role="group" aria-label="Compare links">
        <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Compare</p>
        <ul className="flex flex-col gap-0.5 pb-1">
          {COMPARE_LINKS.map((item) => {
            const isOn = pathname === item.href || (item.href !== "/compare" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-sand hover:text-ink",
                    isOn && "bg-sand text-ink",
                  )}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
