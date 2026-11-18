"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
  MessageSquareQuote,
  Star,
} from "lucide-react";

import { useCategories } from "@/hooks/queries/use-categories";
import { useServices } from "@/hooks/queries/use-services";
import { useTechnicians } from "@/hooks/queries/use-technicians";
import { useRecentReviews } from "@/hooks/queries/use-reviews";

import { Hero } from "@/components/home/hero";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  ServiceCard,
  ServiceCardSkeleton,
  CategoryIcon,
} from "@/components/shared/service-card";
import {
  TechnicianCard,
  TechnicianCardSkeleton,
} from "@/components/shared/technician-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Send a request",
    body: "Pick a service, choose a date and give your address. The price you see is the price you pay.",
  },
  {
    icon: CalendarClock,
    title: "Technician confirms",
    body: "The technician checks their schedule and accepts or declines — usually within a few hours.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    body: "Once accepted, pay through SSLCommerz. Your money is only taken for confirmed jobs.",
  },
  {
    icon: MessageSquareQuote,
    title: "Job done, leave a review",
    body: "After the work is marked complete you rate the technician. Ratings are never edited by us.",
  },
];

const FAQS = [
  {
    q: "How do I book a service?",
    a: "Open the Services page, pick the job you need and choose a date, time and address. You need an account to send the request.",
  },
  {
    q: "When do I pay?",
    a: "Only after the technician accepts your request. Payment goes through SSLCommerz and the booking status updates in your dashboard straight away.",
  },
  {
    q: "Are technicians verified?",
    a: "Every technician account is reviewed by our team, and ratings come only from customers with a completed booking.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes — from your dashboard, at any point before the work starts. Once a job is in progress it can no longer be cancelled online.",
  },
  {
    q: "How do I join as a technician?",
    a: "Register as a Technician, fill in your profile and working hours, then list your services. Requests start arriving as soon as a service is live.",
  },
  {
    q: "Can I try it without signing up?",
    a: "Yes. The login page has demo customer, technician and admin accounts with bookings already in every stage, so you can walk through the full flow.",
  },
];

export default function HomePage() {
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: servicesData, isLoading: loadingServices } = useServices({
    limit: 8,
  });
  const { data: techniciansData, isLoading: loadingTechnicians } =
    useTechnicians({ limit: 4 });
  const { data: reviews = [], isLoading: loadingReviews } = useRecentReviews(3);

  const services = servicesData?.services ?? [];
  const technicians = techniciansData?.technicians ?? [];

  return (
    <main className="flex flex-col">
      <Hero
        services={services}
        categories={categories}
        loading={loadingServices || loadingCategories}
        totals={{
          services: servicesData?.meta?.total,
          technicians: techniciansData?.meta?.total,
          categories: loadingCategories ? undefined : categories.length,
        }}
      />

      {/* Trades ticker */}
      {categories.length > 0 && (
        <div
          className="overflow-hidden border-b bg-highlight py-3 text-highlight-foreground"
          aria-hidden
        >
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...categories, ...categories].map((cat, i) => {
              return (
                <span
                  key={`${cat.id}-${i}`}
                  className="flex items-center gap-3 font-display text-xl italic"
                >
                  <CategoryIcon category={cat.name} className="size-5" /> {cat.name}
                  <span className="ml-7 text-highlight-foreground/40">✳</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 01 — Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <Reveal>
          <SectionHeading
            index="01"
            label="Trades"
            title={
              <>
                Whatever broke, there&apos;s a{" "}
                <em className="text-primary">specialist</em> for it.
              </>
            }
            description="Browse by trade to see every listed service, its price and who does the work."
            action={
              <Button variant="outline" asChild>
                <Link href="/services">
                  All services <ArrowRight />
                </Link>
              </Button>
            }
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
          {loadingCategories
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card p-6">
                  <Skeleton className="mb-6 size-8" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))
            : categories.slice(0, 8).map((cat, i) => {
                return (
                  <div key={cat.id} className="bg-card">
                    <Reveal delay={i * 0.04} className="h-full">
                      <Link
                        href={`/services?categoryId=${cat.id}`}
                        className="group relative flex h-full flex-col gap-6 p-5 transition-colors hover:bg-foreground hover:text-background sm:p-6"
                      >
                        <div className="flex items-start justify-between">
                          <CategoryIcon
                            category={cat.name}
                            className="size-8 text-primary transition-transform duration-500 group-hover:-rotate-12"
                            strokeWidth={1.5}
                          />
                          <span className="font-mono text-xs text-muted-foreground group-hover:text-background/60">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold sm:text-xl">
                            {cat.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground group-hover:text-background/70">
                            {cat.description}
                          </p>
                        </div>
                        <ArrowUpRight className="absolute right-5 bottom-5 size-5 opacity-0 transition-all group-hover:opacity-100" />
                      </Link>
                    </Reveal>
                  </div>
                );
              })}
        </div>
      </section>

      {/* 02 — How it works */}
      <section className="bg-deep text-deep-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
          <Reveal>
            <SectionHeading
              index="02"
              label="How it works"
              className="[&_.eyebrow]:text-deep-foreground/60 [&_p]:text-deep-foreground/70"
              title={
                <>
                  Four steps, and you always know{" "}
                  <em className="text-highlight">where you stand.</em>
                </>
              }
              description="Every booking moves through the same visible stages, for you and for the technician."
            />
          </Reveal>
          <ol className="grid gap-px overflow-hidden rounded-xl bg-deep-foreground/15 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="bg-deep">
                <Reveal
                  delay={i * 0.08}
                  className="flex h-full flex-col gap-4 p-7"
                >
                  <div className="flex items-center justify-between">
                    <step.icon
                      className="size-7 text-highlight"
                      strokeWidth={1.5}
                    />
                    <span className="font-display text-5xl text-deep-foreground/20 italic">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-sm text-deep-foreground/70">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 — Featured services */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <Reveal>
          <SectionHeading
            index="03"
            label="Recently listed"
            title="Fresh on the board"
            description="New services from technicians near you. Prices are fixed for the listed scope of work."
            action={
              <Button variant="outline" asChild>
                <Link href="/services">
                  Browse everything <ArrowRight />
                </Link>
              </Button>
            }
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingServices
            ? Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : services.map((service, i) => (
                <Reveal
                  key={service.id}
                  delay={(i % 4) * 0.06}
                  className="h-full"
                >
                  <ServiceCard service={service} />
                </Reveal>
              ))}
          {!loadingServices && services.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              No services are listed yet. Technicians can add the first one from
              their dashboard.
            </p>
          )}
        </div>
      </section>

      {/* 04 — Technicians */}
      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
          <Reveal>
            <SectionHeading
              index="04"
              label="The people"
              title={
                <>
                  Technicians with a{" "}
                  <em className="text-primary">track record.</em>
                </>
              }
              description="Ratings come only from customers who completed a paid booking."
              action={
                <Button variant="outline" asChild>
                  <Link href="/technicians">
                    Meet everyone <ArrowRight />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loadingTechnicians
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TechnicianCardSkeleton key={i} />
                ))
              : technicians.map((tech, i) => (
                  <Reveal key={tech.id} delay={i * 0.06} className="h-full">
                    <TechnicianCard technician={tech} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* 05 — Reviews */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <Reveal>
          <SectionHeading
            index="05"
            label="Straight from customers"
            title="What people said after the job"
          />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {loadingReviews &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          {!loadingReviews &&
            reviews.map((review, i) => (
              <Reveal key={review.id} delay={i * 0.08}>
                <figure
                  className={`flex h-full flex-col rounded-xl border p-7 ${
                    i === 1
                      ? "bg-primary text-primary-foreground md:-translate-y-4"
                      : "bg-card"
                  }`}
                >
                  <div
                    className="flex gap-0.5"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`size-4 ${s < review.rating ? "fill-highlight text-highlight" : "opacity-30"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 font-display text-lg leading-snug">
                    “{review.comment}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-current/15 pt-4 text-sm">
                    <span className="font-semibold">{review.customerName}</span>
                    <span className="opacity-75">
                      {" "}
                      on {review.booking.service.title}
                    </span>
                    <Link
                      href={`/technicians/${review.technician.id}`}
                      className="mt-1 block font-mono text-xs opacity-75 hover:underline"
                    >
                      Technician: {review.technician.name}
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          {!loadingReviews && reviews.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              Reviews show up here once customers rate their completed jobs.
            </p>
          )}
        </div>
      </section>

      {/* 06 — FAQ */}
      <section id="faq" className="scroll-mt-20 border-t">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <SectionHeading
              index="06"
              label="Questions"
              title="Before you book"
              description={
                <>
                  Still unsure?{" "}
                  <Link
                    href="/contact"
                    className="text-primary underline underline-offset-4"
                  >
                    Write to us
                  </Link>{" "}
                  — a person replies within a working day.
                </>
              }
              className="lg:sticky lg:top-24"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="border-t">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${i}`}
                  className="border-b"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-lg font-medium hover:no-underline">
                    <span>
                      <span className="mr-3 font-mono text-xs text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-8 text-[0.95rem] text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* 07 — Calls to action */}
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-24 sm:px-6 md:grid-cols-2">
        <Reveal className="h-full">
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-foreground p-8 text-background md:p-10">
            <p className="eyebrow !text-background/60">For technicians</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Run your trade,{" "}
              <em className="text-highlight">not your inbox.</em>
            </h2>
            <p className="mt-4 max-w-md text-background/70">
              List your services, set your working hours and get paid through
              the platform. No listing fees.
            </p>
            <Button className="mt-8 w-max" size="lg" asChild>
              <Link href="/register">
                Join as a technician <ArrowRight />
              </Link>
            </Button>
            <div
              className="stripe absolute top-0 right-0 h-full w-3"
              aria-hidden
            />
          </div>
        </Reveal>
        <Reveal delay={0.08} className="h-full">
          <div className="ruled flex h-full flex-col rounded-2xl border bg-card p-8 md:p-10">
            <p className="eyebrow">Just looking around?</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Try the whole flow with a{" "}
              <em className="text-primary">demo account.</em>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Log in as a customer, technician or admin. The demo data has a
              booking waiting at every stage — accept it, pay for it, finish it,
              review it.
            </p>
            <Button className="mt-8 w-max" size="lg" variant="ink" asChild>
              <Link href="/login">
                Open the demo <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
