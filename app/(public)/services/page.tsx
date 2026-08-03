"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllServices } from "@/lib/api/services";
import { getAllCategories } from "@/lib/api/categories";
import { Service, Category } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { SimplePagination } from "@/components/shared/simple-pagination";
import {
  Search,
  Star,
  SlidersHorizontal,
  X,
  ArrowRight,
  Wrench,
} from "lucide-react";

const PAGE_SIZE = 9;

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params State
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("categoryId") || "";

  // Local States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ইউজার টাইপ করা থামানোর পরই সার্চ/প্রাইস ফিল্টার কার্যকর হয় —
  // প্রতিটা কিস্ট্রোকে API কল হয় না, ফলে অ্যাপ দ্রুত মনে হয় এবং
  // ব্যাকএন্ডেও অপ্রয়োজনীয় লোড পড়ে না
  const debouncedSearch = useDebouncedValue(search, 400);
  const debouncedMinPrice = useDebouncedValue(minPrice, 400);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);

  // Fetch Categories
  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err: Error) => console.error(err));
  }, []);

  // ফিল্টার বদলালে প্রথম পেজে ফিরে যাওয়া
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, debouncedMinPrice, debouncedMaxPrice]);

  // Fetch Services
  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      const query: Parameters<typeof getAllServices>[0] = { page, limit: PAGE_SIZE };
      if (debouncedSearch) query.searchTerm = debouncedSearch;
      if (selectedCategory) query.categoryId = selectedCategory;
      if (debouncedMinPrice) query.minPrice = Number(debouncedMinPrice);
      if (debouncedMaxPrice) query.maxPrice = Number(debouncedMaxPrice);

      setLoading(true);
      try {
        const res = await getAllServices(query);
        if (!cancelled) {
          setServices(res.data);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadServices();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory, debouncedMinPrice, debouncedMaxPrice, page]);

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    router.push("/services");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Browse Home Services
        </h1>
        <p className="text-muted-foreground">
          Find and book qualified professionals for plumbing, electrical,
          cleaning, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="space-y-6 lg:border-r lg:pr-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" /> Filters
            </h2>
            {(search || selectedCategory || minPrice || maxPrice) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <Label>Search Keywords</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Service title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedCategory === ""
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range (৳)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </aside>

        {/* Services Grid Content */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className="flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="p-4 bg-muted/40 border-b flex items-center justify-between">
                        <Badge variant="secondary">
                          {service.category?.name || "Service"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span>
                            {service.technician?.technicianProfile?.avgRating
                              ? service.technician.technicianProfile.avgRating.toFixed(
                                  1,
                                )
                              : "4.8"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-5 space-y-2">
                        <h3 className="font-bold text-lg line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {service.description ||
                            "Professional home maintenance service."}
                        </p>
                        <div className="pt-2 text-xs text-muted-foreground">
                          Technician:{" "}
                          <span className="font-medium text-foreground">
                            {service.technician?.name || "Specialist"}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">
                          Price
                        </span>
                        <span className="text-lg font-bold text-primary">
                          ৳{service.price}
                        </span>
                      </div>
                      <Link href={`/services/${service.id}`}>
                        <Button size="sm" className="gap-1">
                          Details <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardFooter>
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
            <div className="text-center py-16 space-y-4 border rounded-xl bg-muted/10">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No Services Found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search keywords.
              </p>
              <Button onClick={handleReset} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8" />}>
      <ServicesPageContent />
    </Suspense>
  );
}
