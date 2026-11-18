import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  hint?: string;
  prefix?: string;
  loading?: boolean;
  tone?: "default" | "primary" | "deep";
}

/** Overview number tile used on every dashboard. */
export function StatCard({ label, value, icon: Icon, hint, prefix, loading, tone = "default" }: StatCardProps) {
  const dark = tone !== "default";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 transition-transform duration-300 hover:-translate-y-0.5",
        tone === "default" && "bg-card",
        tone === "primary" && "border-primary bg-primary text-primary-foreground",
        tone === "deep" && "border-deep bg-deep text-deep-foreground",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("eyebrow", dark && "!text-current opacity-75")}>{label}</p>
        <Icon className={cn("size-4", dark ? "opacity-75" : "text-primary")} />
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-20" />
      ) : (
        <p className="mt-3 font-display text-4xl leading-none font-semibold">
          {prefix}
          <CountUp value={value} />
        </p>
      )}
      {hint && <p className={cn("mt-2 text-xs", dark ? "opacity-75" : "text-muted-foreground")}>{hint}</p>}
    </div>
  );
}
