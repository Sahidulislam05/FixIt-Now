import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvatarUrl } from "@/lib/avatar";
import { formatRating } from "@/lib/format";
import type { User } from "@/lib/types";

export function TechnicianCard({ technician }: { technician: User }) {
  const profile = technician.technicianProfile;
  const skills = profile?.skills ?? [];

  return (
    <article className="group lift flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="relative size-16 overflow-hidden rounded-xl">
          <Image
            src={getAvatarUrl(technician.id || technician.name)}
            alt={technician.name}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-mono text-xs">
          <Star className="size-3.5 fill-highlight text-highlight" />
          {formatRating(profile?.avgRating, profile?.totalReviews)}
          {!!profile?.totalReviews && (
            <span className="text-muted-foreground">· {profile.totalReviews}</span>
          )}
        </span>
      </div>

      <h3 className="mt-4 flex items-center gap-1.5 font-display text-xl font-semibold">
        <span className="truncate">{technician.name}</span>
        <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified" />
      </h3>
      <p className="eyebrow mt-1">
        {profile?.experienceYears
          ? `${profile.experienceYears} yrs experience`
          : "New on FixItNow"}
      </p>

      <ul className="mt-4 flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
        {skills.slice(0, 3).map((skill) => (
          <li key={skill} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
            {skill}
          </li>
        ))}
        {skills.length === 0 && (
          <li className="text-xs text-muted-foreground">Skills not listed yet</li>
        )}
      </ul>

      <Link
        href={`/technicians/${technician.id}`}
        className="mt-auto inline-flex items-center justify-between border-t border-dashed pt-4 text-sm font-medium transition-colors hover:text-primary"
      >
        View profile
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}

export function TechnicianCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex justify-between">
        <Skeleton className="size-16 rounded-xl" />
        <Skeleton className="h-6 w-14" />
      </div>
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-5 w-full" />
    </div>
  );
}
