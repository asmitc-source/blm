import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/site";
import { Logo } from "@/components/logo";
import { AuthSlot } from "@/components/layout/auth-slot";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? root.scrollTop / max : 0);
      setScrolled(root.scrollTop > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("glass-bar sticky top-0 z-40", scrolled && "is-scrolled")}>
      <div className="chrome-pad relative flex h-16 items-center justify-between sm:h-[4.25rem]">
        <Logo className="relative z-10 shrink-0" />
        <nav
          className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex"
          aria-label="Primary"
        >
          <div className="pointer-events-auto flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn("glass-nav-item", active && "is-active")}
                >
                  <span className="relative z-[1]">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <AuthSlot />
          </div>
          <button
            type="button"
            className="glass-icon inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-transparent">
        <div className="h-full origin-left bg-brand/80" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className={cn("border-t border-line/60 lg:hidden", open ? "block" : "hidden")}>
        <nav className="chrome-pad flex flex-col gap-1.5 py-3" aria-label="Mobile">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn("glass-nav-item w-full justify-start px-4", active && "is-active")}
                onClick={() => setOpen(false)}
              >
                <span className="relative z-[1]">{item.label}</span>
              </Link>
            );
          })}
          <div className="mt-2 flex flex-col gap-2 pb-2 sm:hidden">
            <Button asChild variant="secondary">
              <Link to="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button asChild>
              <Link to="/signup" onClick={() => setOpen(false)}>
                Create workspace
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
