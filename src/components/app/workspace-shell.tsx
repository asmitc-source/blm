import { Link } from "@tanstack/react-router";
import {
  Copy,
  LayoutGrid,
  MapPin,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export type WorkspaceSection =
  | "overview"
  | "locations"
  | "nap"
  | "coverage"
  | "duplicates"
  | "hours"
  | "auditor";

const NAV: { id: WorkspaceSection; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "coverage", label: "Coverage", icon: Radar },
  { id: "duplicates", label: "Duplicates", icon: Copy },
  { id: "auditor", label: "Auditor", icon: ShieldCheck },
];

export function WorkspaceShell({
  section,
  onSectionChange,
  children,
}: {
  section: WorkspaceSection;
  onSectionChange: (next: WorkspaceSection) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
          <Link
            to="/app"
            className="flex items-center gap-2.5 justify-self-start text-ink no-underline"
            onClick={() => onSectionChange("overview")}
          >
            <LogoMark className="size-8" />
            <span className="font-display text-xl font-semibold tracking-tight">Workspace</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Workspace sections">
            {NAV.map((item) => {
              const on = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    on ? "bg-ink text-cream" : "text-ink-soft hover:bg-sand hover:text-ink",
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center justify-end justify-self-end">
            <UserButton />
          </div>
        </div>
      </header>

      <nav
        className="flex gap-2 overflow-x-auto border-b border-line px-4 py-2 md:hidden"
        aria-label="Workspace sections mobile"
      >
        {NAV.map((item) => {
          const on = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-sm font-semibold transition-colors",
                on ? "bg-ink text-cream" : "bg-sand text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}
