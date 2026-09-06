import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export function AuthSlot({ compact = false }: { compact?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="glass-chip h-11 w-24 animate-pulse" />;
  }
  if (user) {
    return (
      <Button asChild size={compact ? "sm" : "md"} variant="secondary">
        <Link to="/app">Workspace</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <Button asChild size={compact ? "sm" : "md"} variant="secondary">
        <Link to="/login">Log in</Link>
      </Button>
      <Button asChild size={compact ? "sm" : "md"}>
        <Link to="/signup">Create workspace</Link>
      </Button>
    </div>
  );
}
