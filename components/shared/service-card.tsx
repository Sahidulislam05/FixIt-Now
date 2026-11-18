import { createElement } from "react";
import Link from "next/link";
import {
  AirVent,
  ArrowUpRight,
  Bug,
  Droplets,
  Hammer,
  MapPin,
  PaintRoller,
  SprayCan,
  Star,
  WashingMachine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRating, formatTaka } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/plumb|pipe|water/i, Droplets],
  [/electr|wiring/i, Zap],
  [/clean/i, SprayCan],
  [/paint/i, PaintRoller],
  [/\bac\b|air ?condition|cooling/i, AirVent],
  [/carpen|wood|furniture/i, Hammer],
  [/appliance|fridge|washing/i, WashingMachine],
  [/pest|insect/i, Bug],
];

export function getCategoryIcon(name?: string | null): LucideIcon {
  if (!name) return Wrench;
  return CATEGORY_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? Wrench;
}

/** Renders the trade icon for a category name. */
export function CategoryIcon({
  category,
  ...props
}: { category?: string | null } & React.ComponentProps<LucideIcon>) {
  return createElement(getCategoryIcon(category), props);
}

/** Tone is chosen from the category name so each trade keeps the same look. */
const COVER_TONES = [
  "bg-deep text-deep-foreground",
  "bg-primary text-primary-foreground",
  "bg-highlight text-highlight-foreground",
  "bg-foreground text-background",
];

function toneFor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return COVER_TONES[Math.abs(hash) % COVER_TONES.length];
}

export function ServiceCover({
  category,
  className,
}: {
  category?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        toneFor(category ?? "service"),
        className,
      )}
      role="img"
      aria-label={`${category ?? "Home service"} illustration`}
    >
      <div className="ruled absolute inset-0 opacity-60" aria-hidden />
      <CategoryIcon
        category={category}
        className="absolute -right-5 -bottom-6 size-36 opacity-15 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110"
        strokeWidth={1.25}
        aria-hidden
      />
      <CategoryIcon
        category={category}
        className="absolute top-4 left-4 size-7"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const profile = service.technician?.technicianProfile;

  return (
    <article className="group lift flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <div className="relative">
        <ServiceCover category={service.category?.name} className="h-36" />
        <span className="absolute top-4 right-4 rounded-md bg-background/90 px-2 py-1 font-mono text-[0.68rem] tracking-wider text-foreground uppercase backdrop-blur">
          {service.category?.name ?? "Service"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3 font-mono text-[0.72rem] text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{service.location || "Dhaka"}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-foreground">
            <Star className="size-3.5 fill-highlight text-highlight" />
            {formatRating(profile?.avgRating, profile?.totalReviews)}
            {!!profile?.totalReviews && (
              <span className="text-muted-foreground">
                ({profile.totalReviews})
              </span>
            )}
          </span>
        </div>

        <h3 className="line-clamp-1 font-display text-xl leading-tight font-semibold">
          {service.title}
        </h3>
        <p className="line-clamp-2 min-h-[2.75rem] text-sm text-muted-foreground">
          {service.description || "No description provided yet."}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed pt-4">
          <div>
            <p className="eyebrow !text-[0.62rem]">
              by {service.technician?.name?.split(" ")[0] ?? "Technician"}
            </p>
            <p className="font-display text-2xl leading-none font-semibold">
              {formatTaka(service.price)}
            </p>
          </div>
          <Link
            href={`/services/${service.id}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View details
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="h-36 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-end justify-between pt-4">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
