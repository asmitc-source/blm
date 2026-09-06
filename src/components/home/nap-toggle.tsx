import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BEFORE = {
  google: "Northline  ·  1420 N Milwaukee, Chicago  ·  (312) 555-0199",
  apple: "Northline Coffee LLC  ·  1420 North Milwaukee Ave  ·  3125550199",
  bing: "Northline  ·  1420 N Milwaukee Avenue Ste 2  ·  312-555-0142",
};

const AFTER = {
  google: "Northline  ·  1420 N Milwaukee Ave, Ste 2, Chicago  ·  (312) 555-0199",
  apple: "Northline  ·  1420 N Milwaukee Ave, Ste 2, Chicago  ·  (312) 555-0199",
  bing: "Northline  ·  1420 N Milwaukee Ave, Ste 2, Chicago  ·  (312) 555-0199",
};

export function NapToggle() {
  const [fixed, setFixed] = useState(false);
  const data = fixed ? AFTER : BEFORE;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">NAP before / after</p>
        <Button type="button" size="sm" variant={fixed ? "mint" : "primary"} onClick={() => setFixed((v) => !v)}>
          {fixed ? "Unified" : "Fix NAP"}
        </Button>
      </div>
      <ul className="mt-4 space-y-2">
        {Object.entries(data).map(([k, v]) => (
          <li key={k} className="rounded-xl bg-paper px-3 py-2 hairline">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{k}</p>
            <p className={cn("mt-1 text-sm", fixed ? "text-brand" : "text-ink-soft")}>{v}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
