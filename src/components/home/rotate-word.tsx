import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["accurate", "found", "synced", "listed", "trusted"] as const;
const LONGEST = "accurate";

export function RotateWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <span className="relative inline-block text-center italic text-brand" style={{ minWidth: `${LONGEST.length}ch` }}>
      {WORDS.map((word, i) => (
        <span
          key={word}
          className={cn(
            "absolute inset-x-0 top-0 transition-opacity duration-500",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          {word}
        </span>
      ))}
      <span className="invisible" aria-hidden="true">
        {LONGEST}
      </span>
    </span>
  );
}
