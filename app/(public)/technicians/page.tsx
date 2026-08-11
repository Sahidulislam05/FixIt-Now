"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTechnicians } from "@/hooks/queries/use-technicians";
import { getAvatarUrl } from "@/lib/avatar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TechnicianQuery } from "@/lib/api/technicians";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { Star, Search, UserCheck, ArrowUpDown } from "lucide-react";

const PAGE_SIZE = 9;

// ============================================================
// সর্ট অপশন — value ফরম্যাট "sortBy:sortOrder"। /api/technicians
// এন্ডপয়েন্ট sortBy/sortOrder সাপোর্ট করে (lib/api/technicians.ts)।
// "avgRating" TechnicianProfile রিলেশনের ফিল্ড — ব্যাকএন্ড nested sort
// সাপোর্ট না করলে এটা ignore হয়ে ডিফল্ট অর্ডারে ফিরে আসবে, ক্র্যাশ
// করবে না। ব্যাকএন্ডের প্রকৃত সাপোর্টেড sortBy ফিল্ড অনুযায়ী দরকার
// হলে নিচের value গুলো বদলে নাও।
// ============================================================
const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "avgRating:desc", label: "Top Rated" },
  { value: "experienceYears:desc", label: "Most Experienced" },
];

export default function TechniciansPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);

  // ফিল্টার/সর্ট বদলালে পেজ ১-এ ফিরে যাওয়া উচিত — render-time adjustment
  // প্যাটার্ন ব্যবহার করা হয়েছে, useEffect+setState নয় (দেখো Services
  // পেজের একই কমেন্ট, কারণ যুক্তি অভিন্ন)।
  const filterKey = `${debouncedSearch}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];

  const query: TechnicianQuery = {
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
  };
  if (debouncedSearch) query.searchTerm = debouncedSearch;

  // ============================================================
  // TanStack Query — সার্চ/সর্ট/পেজ বদলালে queryKey বদলে যায়,
  // হুক নিজে থেকে রিফেচ করে; keepPreviousData থাকায় পেজ বদলানোর
  // সময় গ্রিড ফ্ল্যাশ করে না।
  // ============================================================
  const { data: techniciansData, isLoading: loading } = useTechnicians(query);
  const technicians = techniciansData?.technicians ?? [];
  const totalPages = techniciansData?.meta?.totalPages || 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Qualified Technicians
          </h1>
          <p className="text-muted-foreground">
            Find background-checked specialists for your home tasks
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Result count + Sort */}
      <div className="flex items-center justify-between gap-3 flex-wrap -mt-4">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading..."
            : `${techniciansData?.meta?.total ?? technicians.length} technicians found`}
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              className="w-[190px] h-9"
              aria-label="Sort technicians"
            >
              <SelectValue placeholder="Sort by" />
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

      {/* Technicians Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-5 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      ) : technicians.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <Card
                key={tech.id}
                className="p-6 flex flex-col justify-between hover:border-primary/40 transition-colors text-center"
              >
                <div className="space-y-4">
                  <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                    <Image
                      src={getAvatarUrl(tech.id || tech.name)}
                      alt={tech.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg flex items-center justify-center gap-1">
                      {tech.name}
                      <UserCheck className="h-4 w-4 text-primary" />
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-amber-500 text-sm font-semibold mt-1">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span>
                        {tech.technicianProfile?.avgRating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1">
                    {tech.technicianProfile?.skills?.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-[11px]">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tech.technicianProfile?.bio ||
                      "Experienced specialist offering dedicated home services."}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t">
                  <Link href={`/technicians/${tech.id}`}>
                    <Button className="w-full" variant="secondary">
                      View Profile & Book
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <SimplePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          No technicians match your search.
        </p>
      )}
    </div>
  );
}
