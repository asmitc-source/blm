import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  animateTiles = false,
}: {
  className?: string;
  animateTiles?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-8 shrink-0", animateTiles && "logo-mark-animate", className)}
      aria-hidden="true"
    >
      <rect
        className={cn(animateTiles && "logo-tile logo-tile-a")}
        x="0"
        y="0"
        width="17"
        height="17"
        rx="5.5"
        fill="var(--tile-a)"
      />
      <rect
        className={cn(animateTiles && "logo-tile logo-tile-b")}
        x="23"
        y="0"
        width="17"
        height="17"
        rx="5.5"
        fill="var(--tile-b)"
      />
      <rect
        className={cn(animateTiles && "logo-tile logo-tile-c")}
        x="0"
        y="23"
        width="17"
        height="17"
        rx="5.5"
        fill="var(--tile-c)"
      />
      <rect
        className={cn(animateTiles && "logo-tile logo-tile-d")}
        x="23"
        y="23"
        width="17"
        height="17"
        rx="5.5"
        fill="var(--tile-d)"
      />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-2.5 text-ink no-underline", className)}
      aria-label="blm home"
    >
      <LogoMark className={compact ? "size-7" : "size-8"} />
      <span
        className={cn(
          "font-sans text-[1.5rem] font-semibold lowercase leading-none tracking-[-0.045em]",
          compact && "text-[1.35rem]",
        )}
      >
        blm
      </span>
    </Link>
  );
}
