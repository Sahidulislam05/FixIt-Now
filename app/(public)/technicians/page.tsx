"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllTechnicians } from "@/lib/api/technicians";
import { User } from "@/lib/types";
import { getAvatarUrl } from "@/lib/avatar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { Star, Search, UserCheck } from "lucide-react";

const PAGE_SIZE = 9;

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 400);

  // সার্চ বদলালে প্রথম পেজে ফিরে যাওয়া — নাহলে ইউজার এমন পেজে আটকে যেতে
  // পারে যেখানে ফিল্টার করা রেজাল্টে কিছুই নেই
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAllTechnicians({
      searchTerm: debouncedSearch || undefined,
      page,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        if (cancelled) return;
        setTechnicians(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch((err: Error) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, page]);

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
