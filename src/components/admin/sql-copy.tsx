import { useState } from "react";
import { SUPABASE_SCHEMA_SQL } from "@/lib/cms/schema-sql";
import { Button } from "@/components/ui/button";

export function SqlCopy() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl bg-ink p-4 text-cream">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">Paste in Supabase SQL editor</p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            void navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            });
          }}
        >
          {copied ? "Copied" : "Copy SQL"}
        </Button>
      </div>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-cream/90">{SUPABASE_SCHEMA_SQL}</pre>
    </div>
  );
}
