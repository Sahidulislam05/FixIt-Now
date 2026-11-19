"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin, Search, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CountUp } from "@/components/shared/count-up";
import { CategoryIcon } from "@/components/shared/service-card";
import { formatRating, formatTaka } from "@/lib/format";
import type { Category, Service } from "@/lib/types";

interface HeroProps {
  services: Service[];
  categories: Category[];
  totals: { services?: number; technicians?: number; categories?: number };
  loading: boolean;
}

const ROTATE_MS = 4200;

export function Hero({ services, categories, totals, loading }: HeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const board = services.slice(0, 5);

  useEffect(() => {
    if (paused || board.length < 2) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % board.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [paused, board.length]);

  const current = board[active % Math.max(board.length, 1)];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    router.push(
      term ? `/services?search=${encodeURIComponent(term)}` : "/services",
    );
  }

  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto grid min-h-[64vh] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-16">
        <div>
          <h1 className="text-[2.6rem] leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.4rem]">
            {["Fix", "the", "leak"].map((word, i) => (
              <motion.span
                key={word}
                className="mr-[0.22em] inline-block"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 * i,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="relative inline-block italic text-primary"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.26,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              before
              <motion.svg
                viewBox="0 0 200 12"
                className="absolute -bottom-2 left-0 h-3 w-full text-highlight"
                aria-hidden
              >
                <motion.path
                  d="M2 8 C 50 2, 120 2, 198 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                />
              </motion.svg>
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.34,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              it becomes a renovation.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty"
          >
            Book verified plumbers, electricians, cleaners and AC technicians.
            You see the price before you book, choose a time that suits you, and
            pay only once the technician accepts.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-xl border bg-card p-2 shadow-[4px_4px_0_0_var(--foreground)] sm:flex-row"
            role="search"
          >
            <label htmlFor="hero-search" className="sr-only">
              What needs fixing?
            </label>
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="hero-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What needs fixing? e.g. AC, socket, leak"
                className="h-12 w-full rounded-lg bg-transparent pr-3 pl-11 text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" size="lg">
              Find a technician <ArrowRight />
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-5 flex flex-wrap items-center gap-2"
          >
            <span className="eyebrow mr-1">Popular:</span>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))
              : categories.slice(0, 5).map((cat) => {
                  return (
                    <Link
                      key={cat.id}
                      href={`/services?categoryId=${cat.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      <CategoryIcon category={cat.name} className="size-3.5" />{" "}
                      {cat.name}
                    </Link>
                  );
                })}
          </motion.div>
        </div>

        {/* Live job board: real listings that rotate, hover to pause, dots to pick */}
        <motion.div
          initial={{ opacity: 0, rotate: 2, y: 24 }}
          animate={{ opacity: 1, rotate: 0, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative"
        >
          <div className="absolute -top-3 -right-3 -bottom-3 -left-3 -z-10 hidden rotate-2 rounded-2xl bg-deep sm:block" />
          <div className="overflow-hidden rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b bg-muted/60 px-5 py-3">
              <p className="eyebrow">Open on the board</p>
              <p className="font-mono text-xs text-muted-foreground">
                {board.length
                  ? `${String(active + 1).padStart(2, "0")} / ${String(board.length).padStart(2, "0")}`
                  : "--"}
              </p>
            </div>

            <div className="ruled relative h-[15.5rem] px-6 py-6">
              {loading || !current ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col"
                  >
                    <p className="eyebrow !text-primary">
                      {current.category?.name ?? "Service"}
                    </p>
                    <Link
                      href={`/services/${current.id}`}
                      className="mt-2 line-clamp-2 font-display text-2xl leading-tight font-semibold hover:underline sm:text-[1.7rem]"
                    >
                      {current.title}
                    </Link>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {current.description}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-4">
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">
                          {current.technician?.name}
                        </p>
                        <p className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />{" "}
                            {current.location || "Dhaka"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="size-3 fill-highlight text-highlight" />
                            {formatRating(
                              current.technician?.technicianProfile?.avgRating,
                              current.technician?.technicianProfile
                                ?.totalReviews,
                            )}
                          </span>
                        </p>
                      </div>
                      <p className="-rotate-3 rounded-md border-2 border-primary px-2.5 py-1 font-display text-2xl font-semibold text-primary">
                        {formatTaka(current.price)}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="flex items-center gap-1.5 border-t px-5 py-3">
              {board.map((service, i) => (
                <button
                  key={service.id}
                  onClick={() => setActive(i)}
                  aria-label={`Show listing ${i + 1}`}
                  aria-current={i === active}
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                >
                  {i === active && (
                    <motion.span
                      key={`${service.id}-${paused}`}
                      className="block h-full rounded-full bg-primary"
                      initial={{ width: paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: paused ? 0 : ROTATE_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <dl className="grid grid-cols-3 divide-x border-t bg-foreground text-background">
              {[
                { label: "Services", value: totals.services },
                { label: "Technicians", value: totals.technicians },
                { label: "Trades", value: totals.categories },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-4">
                  <dt className="font-mono text-[0.65rem] tracking-widest text-background/60 uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-semibold">
                    {stat.value === undefined ? (
                      "—"
                    ) : (
                      <CountUp value={stat.value} />
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
