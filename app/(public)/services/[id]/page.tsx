"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import { useService, useServices } from "@/hooks/queries/use-services";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/shared/reveal";
import {
  ServiceCard,
  ServiceCardSkeleton,
  ServiceCover,
} from "@/components/shared/service-card";
import { getAvatarUrl } from "@/lib/avatar";
import { formatRating, formatTaka } from "@/lib/format";

const PROMISES = [
  { icon: ShieldCheck, title: "Verified technician", body: "Account reviewed by the FixItNow team." },
  { icon: CreditCard, title: "Pay after acceptance", body: "Nothing is charged until the job is confirmed." },
  { icon: CalendarCheck, title: "Free cancellation", body: "Cancel from your dashboard before work starts." },
];

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: service, isLoading } = useService(id);
  const { data: relatedData, isLoading: loadingRelated } = useServices(
    service ? { categoryId: service.categoryId, limit: 5 } : { limit: 0 },
  );
  const related = (relatedData?.services ?? []).filter((s) => s.id !== id).slice(0, 4);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
        <Skeleton className="h-4 w-32" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <Wrench className="size-10 text-muted-foreground" strokeWidth={1.5} />
        <h1 className="text-3xl font-semibold">This service isn&apos;t available</h1>
        <p className="text-muted-foreground">It may have been removed by the technician.</p>
        <Button variant="outline" asChild>
          <Link href="/services">Back to all services</Link>
        </Button>
      </main>
    );
  }

  const tech = service.technician;
  const profile = tech?.technicianProfile;
  const reviews = tech?.reviewsAsTechnician ?? [];

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <Link
          href="/services"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> All services
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0 space-y-10">
            <Reveal>
              <ServiceCover category={service.category?.name} className="group h-56 rounded-xl md:h-72" />
            </Reveal>

            <Reveal>
              <p className="eyebrow !text-primary">{service.category?.name}</p>
              <h1 className="mt-2 text-4xl leading-tight font-semibold md:text-5xl">{service.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" /> {service.location || "Dhaka"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-highlight text-highlight" />
                  {formatRating(profile?.avgRating, profile?.totalReviews)}
                  {!!profile?.totalReviews && ` (${profile.totalReviews} reviews)`}
                </span>
              </div>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl font-semibold">What&apos;s included</h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">
                {service.description || "The technician hasn't added a description yet."}
              </p>
            </Reveal>

            <Reveal>
              <dl className="grid overflow-hidden rounded-xl border sm:grid-cols-3">
                {[
                  { label: "Price", value: formatTaka(service.price) },
                  { label: "Trade", value: service.category?.name ?? "—" },
                  { label: "Area", value: service.location || "Dhaka" },
                ].map((item) => (
                  <div key={item.label} className="border-b p-5 last:border-0 sm:border-r sm:border-b-0">
                    <dt className="eyebrow">{item.label}</dt>
                    <dd className="mt-1 font-display text-xl font-semibold">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-semibold">Reviews for {tech?.name?.split(" ")[0]}</h2>
                {!!profile?.totalReviews && (
                  <p className="font-mono text-sm text-muted-foreground">{profile.totalReviews} total</p>
                )}
              </div>
              {reviews.length > 0 ? (
                <ul className="mt-5 divide-y border-y">
                  {reviews.slice(0, 5).map((review) => (
                    <li key={review.id} className="py-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{review.customer?.name ?? "Customer"}</span>
                        <span className="flex gap-0.5" aria-label={`${review.rating} out of 5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${i < review.rating ? "fill-highlight text-highlight" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </span>
                      </div>
                      {review.comment && <p className="mt-2 text-muted-foreground">{review.comment}</p>}
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
                  No reviews yet. Reviews appear after a customer&apos;s job is completed.
                </p>
              )}
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal className="overflow-hidden rounded-xl border bg-card shadow-[6px_6px_0_0_var(--foreground)]">
              <div className="border-b p-6">
                <p className="eyebrow">Fixed price</p>
                <p className="mt-1 font-display text-5xl font-semibold">{formatTaka(service.price)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Parts, if needed, are billed at cost.</p>
              </div>

              {tech && (
                <Link
                  href={`/technicians/${tech.id}`}
                  className="flex items-center gap-3 border-b p-6 transition-colors hover:bg-muted/60"
                >
                  <div className="relative size-12 overflow-hidden rounded-lg">
                    <Image src={getAvatarUrl(tech.id)} alt={tech.name} fill sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-semibold">
                      <span className="truncate">{tech.name}</span>
                      <BadgeCheck className="size-4 shrink-0 text-primary" />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.experienceYears ? `${profile.experienceYears} years experience` : "New technician"}
                    </p>
                  </div>
                </Link>
              )}

              <div className="space-y-4 p-6">
                <Button size="lg" className="w-full" asChild>
                  <Link href={`/technicians/${tech?.id}?serviceId=${service.id}#book`}>
                    <CalendarCheck /> Choose a date &amp; book
                  </Link>
                </Button>
                <ul className="space-y-3 pt-2">
                  {PROMISES.map((p) => (
                    <li key={p.title} className="flex gap-3 text-sm">
                      <p.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <span className="font-medium">{p.title}.</span>{" "}
                        <span className="text-muted-foreground">{p.body}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      {(loadingRelated || related.length > 0) && (
        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <h2 className="mb-8 text-3xl font-semibold">More {service.category?.name?.toLowerCase()} services</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {loadingRelated
                ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                : related.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
