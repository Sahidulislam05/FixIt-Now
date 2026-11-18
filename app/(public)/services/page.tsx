"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";

import { useServices } from "@/hooks/queries/use-services";
import { useCategories } from "@/hooks/queries/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { ServiceQuery } from "@/lib/api/services";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { ServiceCard, ServiceCardSkeleton } from "@/components/shared/service-card";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
  { value: "title:asc", label: "Name: A to Z" },
];

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);
  const debouncedMin = useDebouncedValue(minPrice, 400);
  const debouncedMax = useDebouncedValue(maxPrice, 400);

  // Any filter change sends the user back to page 1.
  const filterKey = `${debouncedSearch}|${category}|${debouncedMin}|${debouncedMax}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];
  const priceError =
    debouncedMin && debouncedMax && Number(debouncedMin) > Number(debouncedMax)
      ? "Minimum price is higher than maximum"
      : null;

  const query: ServiceQuery = { page, limit: PAGE_SIZE, sortBy, sortOrder };
  if (debouncedSearch) query.searchTerm = debouncedSearch;
  if (category) query.categoryId = category;
  if (debouncedMin && !priceError) query.minPrice = Number(debouncedMin);
  if (debouncedMax && !priceError) query.maxPrice = Number(debouncedMax);

  const { data: categories = [] } = useCategories();
  const { data, isLoading, isFetching } = useServices(query);
  const services = data?.services ?? [];
  const total = data?.meta?.total ?? services.length;
  const hasFilters = !!(search || category || minPrice || maxPrice);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort(SORT_OPTIONS[0].value);
    router.replace("/services");
  }

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Services"
        title={<>Find the right <em className="text-primary">pair of hands.</em></>}
        description="Every listing shows a fixed price for its scope of work, the technician doing it and where they're based."
      />

      <div className="z-30 border-b bg-background/90 backdrop-blur-md md:sticky md:top-16">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.6fr_1fr_0.6fr_0.6fr_1fr]">
            <div className="relative col-span-2 md:col-span-1">
              <label htmlFor="service-search" className="sr-only">
                Search services
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="service-search"
                type="search"
                placeholder="Search by service name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
              <SelectTrigger className="col-span-2 w-full md:col-span-1" aria-label="Filter by category">
                <SelectValue placeholder="All trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All trades</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Min ৳"
              aria-label="Minimum price"
              aria-invalid={!!priceError}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Max ৳"
              aria-label="Maximum price"
              aria-invalid={!!priceError}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="col-span-2 w-full md:col-span-1" aria-label="Sort services">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {priceError && <p className="mt-2 text-xs text-destructive">{priceError}</p>}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? "Loading services…" : `${total} ${total === 1 ? "service" : "services"}`}
            {isFetching && !isLoading && <span className="ml-2 animate-tick">· updating</span>}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X /> Clear filters
            </Button>
          )}
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            isFetching && !isLoading && "opacity-60",
          )}
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 8) * 0.04, duration: 0.4 }}
                  className="h-full"
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
        </div>

        {!isLoading && services.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-20 text-center">
            <SearchX className="size-10 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="text-2xl font-semibold">Nothing matches those filters</h2>
            <p className="max-w-sm text-muted-foreground">
              Try a broader search, another trade, or a wider price range.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        <SimplePagination
          page={page}
          totalPages={data?.meta?.totalPages || 1}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-12"
        />
      </section>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <ServicesPageContent />
    </Suspense>
  );
}
