"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserX } from "lucide-react";

import { useTechnicians } from "@/hooks/queries/use-technicians";
import { useCategories } from "@/hooks/queries/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TechnicianQuery } from "@/lib/api/technicians";

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
import { TechnicianCard, TechnicianCardSkeleton } from "@/components/shared/technician-card";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "avgRating:desc", label: "Top rated" },
  { value: "experienceYears:desc", label: "Most experienced" },
  { value: "name:asc", label: "Name: A to Z" },
];

const RATING_OPTIONS = [
  { value: "any", label: "Any rating" },
  { value: "4.5", label: "4.5 ★ and up" },
  { value: "4", label: "4 ★ and up" },
  { value: "3", label: "3 ★ and up" },
];

export default function TechniciansPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minRating, setMinRating] = useState("any");
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);

  const filterKey = `${debouncedSearch}|${category}|${minRating}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];
  const query: TechnicianQuery = { page, limit: PAGE_SIZE, sortBy, sortOrder };
  if (debouncedSearch) query.searchTerm = debouncedSearch;
  if (category !== "all") query.categoryId = category;
  if (minRating !== "any") query.minRating = minRating;

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = useTechnicians(query);
  const technicians = data?.technicians ?? [];
  const total = data?.meta?.total ?? technicians.length;

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Technicians"
        title={<>The people who <em className="text-primary">show up.</em></>}
        description="Profiles list each technician's skills, experience and the rating they earned from completed jobs."
      />

      <div className="z-30 border-b bg-background/90 backdrop-blur-md md:sticky md:top-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-4 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="relative col-span-2 md:col-span-1">
            <label htmlFor="tech-search" className="sr-only">
              Search technicians
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="tech-search"
              type="search"
              placeholder="Name, skill or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full" aria-label="Filter by trade">
              <SelectValue />
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
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="w-full" aria-label="Minimum rating">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="col-span-2 w-full md:col-span-1" aria-label="Sort technicians">
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
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="mb-6 font-mono text-sm text-muted-foreground" aria-live="polite">
          {isLoading ? "Loading technicians…" : `${total} ${total === 1 ? "technician" : "technicians"}`}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <TechnicianCardSkeleton key={i} />)
            : technicians.map((tech, i) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 8) * 0.04 }}
                  className="h-full"
                >
                  <TechnicianCard technician={tech} />
                </motion.div>
              ))}
        </div>

        {!isLoading && technicians.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-20 text-center">
            <UserX className="size-10 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="text-2xl font-semibold">No technicians match</h2>
            <p className="text-muted-foreground">Try another trade or remove the rating filter.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setMinRating("any");
              }}
            >
              Clear filters
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
