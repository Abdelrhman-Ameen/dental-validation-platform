import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, checked, ...props }, ref) => (
  <label className={cn("relative inline-flex h-6 w-11 cursor-pointer items-center", className)}>
    <input ref={ref} type="checkbox" checked={checked} className="peer sr-only" {...props} />
    <span className="h-6 w-11 rounded-full border border-border bg-muted transition peer-checked:border-primary peer-checked:bg-primary/70 peer-focus-visible:ring-1 peer-focus-visible:ring-ring" />
    <span className="absolute left-1 h-4 w-4 rounded-full bg-foreground transition peer-checked:translate-x-5 peer-checked:bg-primary-foreground" />
  </label>
));
Switch.displayName = "Switch";

export { Switch };
