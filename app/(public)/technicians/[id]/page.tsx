"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin, Star, UserX } from "lucide-react";

import { useTechnician } from "@/hooks/queries/use-technicians";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/shared/reveal";
import { BookingForm } from "@/components/forms/booking-form";
import { CategoryIcon } from "@/components/shared/service-card";
import { getAvatarUrl } from "@/lib/avatar";
import { formatRating, formatTaka } from "@/lib/format";

const DAY_ORDER = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

export default function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { data: tech, isLoading } = useTechnician(id);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
        <div className="flex gap-6">
          <Skeleton className="size-28 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Skeleton className="mt-10 h-96 w-full rounded-xl" />
      </main>
    );
  }

  if (!tech) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <UserX className="size-10 text-muted-foreground" strokeWidth={1.5} />
        <h1 className="text-3xl font-semibold">Technician not found</h1>
        <Button variant="outline" asChild>
          <Link href="/technicians">See all technicians</Link>
        </Button>
      </main>
    );
  }

  const profile = tech.technicianProfile;
  const reviews = tech.reviewsAsTechnician ?? [];
  const schedule = [...(tech.availabilities ?? [])]
    .filter((a) => a.isActive)
    .sort(
      (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
    );

  return (
    <main className="flex-1">
      <header className="ruled border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <Link
            href="/technicians"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />{" "}
            All technicians
          </Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="relative size-28 shrink-0 animate-rise overflow-hidden rounded-2xl border-4 border-card shadow-[5px_5px_0_0_var(--foreground)]">
              <Image
                src={getAvatarUrl(tech.id)}
                alt={tech.name}
                fill
                sizes="112px"
                priority
              />
            </div>
            <div className="animate-rise [animation-delay:100ms]">
              <p className="eyebrow flex items-center gap-1.5 !text-primary">
                <BadgeCheck className="size-3.5" /> Verified technician
              </p>
              <h1 className="mt-2 text-4xl font-semibold md:text-5xl">
                {tech.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-highlight text-highlight" />
                  {formatRating(profile?.avgRating, profile?.totalReviews)}
                  {!!profile?.totalReviews &&
                    ` · ${profile.totalReviews} reviews`}
                </span>
                <span>
                  {profile?.experienceYears
                    ? `${profile.experienceYears} years in the trade`
                    : "New on FixItNow"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-12">
          <Reveal>
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {profile?.bio ||
                `${tech.name.split(" ")[0]} hasn't written a bio yet.`}
            </p>
            {!!profile?.skills?.length && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border px-2.5 py-1 text-sm"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold">Services</h2>
            {tech.services?.length ? (
              <ul className="mt-5 divide-y rounded-xl border bg-card">
                {tech.services.map((srv) => {
                  return (
                    <li key={srv.id}>
                      <Link
                        href={`/services/${srv.id}`}
                        className="group flex items-center gap-4 p-5 transition-colors hover:bg-muted/60"
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-deep text-deep-foreground">
                          <CategoryIcon
                            category={srv.category?.name}
                            className="size-5"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold group-hover:underline">
                            {srv.title}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <MapPin className="size-3" />{" "}
                            {srv.location || "Dhaka"}
                          </span>
                        </span>
                        <span className="font-display text-xl font-semibold">
                          {formatTaka(srv.price)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-5 text-muted-foreground">
                No services listed yet.
              </p>
            )}
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold">Working hours</h2>
            {schedule.length ? (
              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
                {schedule.map((slot) => (
                  <div key={slot.id} className="bg-card p-4">
                    <dt className="eyebrow">{slot.dayOfWeek.slice(0, 3)}</dt>
                    <dd className="mt-1 font-mono text-sm">
                      {slot.startTime}–{slot.endTime}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-muted-foreground">
                No fixed schedule — suggest a time when you book.
              </p>
            )}
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold">Reviews</h2>
            {reviews.length ? (
              <ul className="mt-5 divide-y border-y">
                {reviews.map((review) => (
                  <li key={review.id} className="py-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">
                        {review.customer?.name ?? "Customer"}
                      </span>
                      <span
                        className="flex gap-0.5"
                        aria-label={`${review.rating} out of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${i < review.rating ? "fill-highlight text-highlight" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                No reviews yet. Reviews appear after a customer&apos;s job is
                completed.
              </p>
            )}
          </Reveal>
        </div>

        <aside
          id="book"
          className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start"
        >
          <Reveal className="rounded-xl border bg-card p-6 shadow-[6px_6px_0_0_var(--foreground)]">
            <p className="eyebrow">Book {tech.name.split(" ")[0]}</p>
            <h2 className="mt-1 mb-6 text-2xl font-semibold">
              Request a visit
            </h2>
            <BookingForm
              technician={tech}
              defaultServiceId={searchParams.get("serviceId")}
            />
          </Reveal>
        </aside>
      </div>
    </main>
  );
}
