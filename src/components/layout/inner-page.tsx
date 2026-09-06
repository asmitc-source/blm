import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InnerPage({
  eyebrow,
  title,
  lede,
  compact,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <main>
      <header className="hero-wash border-b border-line">
        <div className={cn("page-wrap", compact ? "py-8 sm:py-10" : "py-12 sm:py-16")}>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
          ) : null}
          <h1
            className={cn(
              "mt-3 max-w-3xl font-display font-semibold tracking-tight text-ink",
              compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
            )}
          >
            {title}
          </h1>
          {lede ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{lede}</p> : null}
        </div>
      </header>
      {children ? <div className="page-wrap py-12">{children}</div> : null}
    </main>
  );
}
