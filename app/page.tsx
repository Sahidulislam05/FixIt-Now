"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllCategories } from "@/lib/api/categories";
import { getAllServices } from "@/lib/api/services";
import { getAllTechnicians } from "@/lib/api/technicians";
import { Category, Service, User } from "@/lib/types";
import { getAvatarUrl, getCategoryIconUrl } from "@/lib/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Search,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

  // Loading States
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);

  // Data Fetching
  useEffect(() => {
    // 1. Fetch Categories
    getAllCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err: Error) => console.error("Error loading categories:", err))
      .finally(() => setLoadingCategories(false));

    // 2. Fetch Featured Services (limit 6)
    getAllServices({ limit: 6 })
      .then((res) => setServices(res.data))
      .catch((err: Error) => console.error("Error loading services:", err))
      .finally(() => setLoadingServices(false));

    // 3. Fetch Top Technicians (limit 4)
    getAllTechnicians({ limit: 4 })
      .then((res) => setTechnicians(res.data))
      .catch((err: Error) => console.error("Error loading technicians:", err))
      .finally(() => setLoadingTechnicians(false));
  }, []);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
            Your #1 Home Service Marketplace in Bangladesh
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Expert Home Services, <br className="hidden sm:inline" />
            <span className="text-primary">Just a Click Away.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Book verified plumbers, electricians, cleaners, and technicians for
            all your home repair and maintenance needs.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-2xl mx-auto pt-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services (e.g. AC Repair, Plumbing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-base rounded-lg border-muted-foreground/30 focus-visible:ring-primary"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 font-semibold text-base shadow-md"
            >
              Search
            </Button>
          </form>

          {/* CTAs & Quick Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified Technicians</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>Instant Slot Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Explore Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                Find services by specialized categories
              </p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="text-primary gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCategories ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.id} href={`/services?categoryId=${cat.id}`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer h-full text-center">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full space-y-2">
                      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-primary/10 ring-1 ring-primary/15">
                        <Image
                          src={getCategoryIconUrl(cat.icon || cat.name)}
                          alt={cat.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-sm line-clamp-1">
                        {cat.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-4">
                No categories available right now.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURED SERVICES ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Services
              </h2>
              <p className="text-muted-foreground">
                Top quality services booked by happy customers
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="gap-1">
                Explore All Services <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingServices ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
                >
                  <div>
                    {/* Placeholder / Image Header */}
                    <div className="h-44 bg-gradient-to-r from-slate-800 to-slate-900 relative p-4 flex flex-col justify-between text-white">
                      <Badge className="w-max bg-primary text-primary-foreground">
                        {service.category?.name || "General"}
                      </Badge>
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                          By{" "}
                          {service.technician?.name || "Qualified Specialist"}
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description ||
                          "Professional service guaranteed with high satisfaction and quick setup."}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="h-4 w-4 fill-amber-500" />
                          <span>
                            {service.technician?.technicianProfile?.avgRating
                              ? service.technician.technicianProfile.avgRating.toFixed(
                                  1,
                                )
                              : "4.8"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {service.location || "Available nationwide"}
                        </span>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Starting from
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ৳{service.price}
                      </span>
                    </div>
                    <Link href={`/services/${service.id}`}>
                      <Button size="sm">Book Service</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No services listed yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= TOP TECHNICIANS ================= */}
      <section className="py-16 bg-muted/20 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Top-Rated Technicians
              </h2>
              <p className="text-muted-foreground">
                Hire skilled and background-checked specialists
              </p>
            </div>
            <Link href="/technicians">
              <Button variant="outline" className="gap-1">
                View All Technicians <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Technicians Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingTechnicians ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-5 space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </Card>
              ))
            ) : technicians.length > 0 ? (
              technicians.map((tech) => (
                <Card
                  key={tech.id}
                  className="text-center p-6 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                      <Image
                        src={getAvatarUrl(tech.id || tech.name)}
                        alt={tech.name || "Technician"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        {tech.name || "Technician"}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {tech.technicianProfile?.skills?.length
                          ? tech.technicianProfile.skills.join(", ")
                          : "General Specialist"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>
                          {tech.technicianProfile?.avgRating
                            ? tech.technicianProfile.avgRating.toFixed(1)
                            : "5.0"}
                        </span>
                      </div>
                      <div>•</div>
                      <div>
                        {tech.technicianProfile?.experienceYears || 2}+ Years
                        Exp
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t">
                    <Link href={`/technicians/${tech.id}`}>
                      <Button
                        variant="secondary"
                        className="w-full text-xs font-semibold"
                      >
                        View Profile & Book
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No technicians available at this moment.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US / STATS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 space-y-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Verified Experts</h3>
              <p className="text-sm text-muted-foreground">
                Every technician goes through background verification and skill
                tests.
              </p>
            </div>

            <div className="p-6 space-y-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Hassle-free Booking</h3>
              <p className="text-sm text-muted-foreground">
                Select your required service, pick a date-time slot, and track
                everything live.
              </p>
            </div>

            <div className="p-6 space-y-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">100% Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Pay via SSLCommerz after the technician accepts your booking
                request.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
