import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["accurate", "found", "synced", "listed", "trusted"] as const;
const LONGEST = "accurate";

export function RotateWord() {
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return undefined;
    setMotion(true);
    const tick = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2400);
    const onChange = () => {
      if (media.matches) {
        window.clearInterval(tick);
        setMotion(false);
        setIndex(0);
      }
    };
    media.addEventListener("change", onChange);
    return () => {
      window.clearInterval(tick);
      media.removeEventListener("change", onChange);
    };
  }, []);

  const word = WORDS[index];

  return (
    <span className="inline-grid text-center italic text-brand" style={{ minWidth: `${LONGEST.length}ch` }}>
      <span className="invisible col-start-1 row-start-1 select-none" aria-hidden="true">
        {LONGEST}
      </span>
      <span key={word} className={cn("col-start-1 row-start-1", motion && "animate-word-in")}>
        {word}
      </span>
    </span>
  );
}
