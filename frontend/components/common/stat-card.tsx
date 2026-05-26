import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "cyan"
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "cyan" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    cyan: "text-primary bg-primary/10 border-primary/20",
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-300 bg-rose-500/10 border-rose-500/20"
  };

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
        </div>
        {Icon ? (
          <div className={cn("rounded-md border p-2", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-3 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
