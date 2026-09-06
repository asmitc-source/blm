import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { FileText, LayoutGrid, LogOut, PenLine, Settings2 } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cmsLogout } from "@/lib/cms/actions";
import { setDeskToken } from "@/lib/cms/token";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Desk", icon: LayoutGrid, exact: true },
  { to: "/admin/articles", label: "Articles", icon: FileText },
  { to: "/admin/write", label: "Write", icon: PenLine },
  { to: "/admin/site", label: "Site", icon: Settings2 },
] as const;

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    try {
      await cmsLogout();
    } catch {
      /* still clear local token */
    }
    setDeskToken(null);
    await navigate({ to: "/admin" });
  }

  return (
    <div className="admin-desk min-h-svh">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2.5 justify-self-start">
            <LogoMark className="size-8" />
            <span className="font-display text-xl font-semibold tracking-tight">The desk</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const on = item.exact ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    on ? "bg-ink text-cream" : "text-ink-soft hover:bg-sand hover:text-ink",
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center justify-end gap-2 justify-self-end">
            <p className="hidden text-sm text-muted sm:block">{username}</p>
            <Button type="button" size="sm" variant="ghost" onClick={() => void signOut()}>
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <nav className="flex gap-2 overflow-x-auto border-b border-line px-4 py-2 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="shrink-0 rounded-full bg-sand px-3 py-1 text-sm font-semibold text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}
