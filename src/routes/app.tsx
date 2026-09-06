import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceDashboard } from "@/components/app/workspace-dashboard";
import {
  WorkspaceShell,
  type WorkspaceSection,
} from "@/components/app/workspace-shell";
import { takeAuthIntent } from "@/components/auth/social-buttons";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureTrialWorkspace, recordAuthLead, type WorkspaceRow } from "@/lib/leads";
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
  const [section, setSection] = useState<WorkspaceSection>("overview");

  useEffect(() => {
    if (!user) return;
    void ensureTrialWorkspace().then((row) => setWorkspace(row));

    // Silent lead capture — never surfaced in the workspace UI.
    const intent = takeAuthIntent();
    const email = user.primaryEmail;
    if (intent && email) {
      void recordAuthLead({
        data: {
          kind: intent,
          email,
          name: user.displayName ?? undefined,
          source: intent === "signup" ? "google-signup" : "google-login",
        },
      }).catch(() => undefined);
    }
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

  return (
    <WorkspaceShell section={section} onSectionChange={setSection}>
      <WorkspaceDashboard
        displayName={user.displayName}
        workspace={workspace}
        section={section}
        onSectionChange={setSection}
      />
    </WorkspaceShell>
  );
}
