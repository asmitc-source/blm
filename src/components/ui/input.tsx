import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-[15px] text-ink placeholder:text-faint outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/25",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
