import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-32 w-full rounded-xl border border-line bg-cream px-3.5 py-3 text-[15px] text-ink placeholder:text-faint outline-none transition-colors focus:border-mint focus:ring-2 focus:ring-mint/25",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
