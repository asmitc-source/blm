import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Copy, MapPin, Radar } from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureTrialWorkspace, type WorkspaceRow } from "@/lib/leads";
import { Logo } from "@/components/logo";
import { ListingAuditor } from "@/components/auditor/listing-auditor";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/app")({
  head: () =>
    pageHead({
      title: "Workspace",
      description: "BLM workspace: monitor locations, coverage, and listing health.",
      path: "/app",
    }),
  component: AppWorkspace,
});

function AppWorkspace() {
  const { user, isPending } = useCurrentUserState();
  const [workspace, setWorkspace] = useState<WorkspaceRow | null>(null);

  useEffect(() => {
    if (!user) return;
    void ensureTrialWorkspace().then((row) => setWorkspace(row));
  }, [user]);

  if (!user) {
    if (isPending) {
      return (
        <div className="grid min-h-svh place-items-center bg-paper px-6">
          <p className="text-sm text-muted">Checking your session…</p>
        </div>
      );
    }
    return <RedirectToSignIn />;
  }

  const display = user.displayName;
  const company = workspace?.company;
  const locations = workspace?.locations_count;

  return (
    <div className="min-h-svh bg-paper">
      <header className="border-b border-line bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo compact />
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden text-sm font-medium text-muted hover:text-ink sm:inline">
              Marketing site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Welcome{display ? `, ${display.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          {company ? `${company} is in early access.` : "Your listing workspace is in early access."}{" "}
          Listed rates are Starter $49/month or Growth $149/month when billing goes live.
        </p>

        <div className="mt-6 rounded-2xl bg-cream px-5 py-4 hairline">
          <p className="text-sm font-semibold text-ink">No card required</p>
          <p className="mt-1 text-sm text-ink-soft">
            We logged this workspace as a lead. Billing is not live yet. When it is, Starter is listed at $49/month and Growth at $149/month.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <DashCard icon={<MapPin className="size-5 text-brand" />} label="Locations" value={locations ?? "Add first"} hint="Storefronts in this workspace" />
          <DashCard icon={<Radar className="size-5 text-sky" />} label="Coverage" value="–" hint="Connect publishers to fill" />
          <DashCard icon={<Copy className="size-5 text-ink-soft" />} label="Duplicates" value="–" hint="Near-match radar" />
          <DashCard icon={<Bell className="size-5 text-butter" />} label="Alerts" value="0" hint="Hours, NAP, takedowns" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/pricing">See Growth</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/demo">Talk to sales</Link>
          </Button>
        </div>

        <div id="workspace-auditor" className="mt-10 scroll-mt-24">
          <ListingAuditor compact />
        </div>
      </main>
    </div>
  );
}

function DashCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-cream p-4 hairline">
      <div className="flex items-center justify-between">
        {icon}
        <p className="font-display text-2xl font-semibold tabular-nums">{value}</p>
      </div>
      <p className="mt-3 text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}
