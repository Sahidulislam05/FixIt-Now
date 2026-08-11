"use client";

import { use } from "react";
import Link from "next/link";
import { useService, useServices } from "@/hooks/queries/use-services";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Wrench,
  MessageSquareText,
} from "lucide-react";

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  // ============================================================
  // TanStack Query — আগে useEffect+useState দিয়ে fetch হতো।
  // এখন useService(id) নিজে ক্যাশ করে, একই সার্ভিস আবার ভিজিট করলে
  // ইনস্ট্যান্ট লোড হয় (staleTime এর মধ্যে refetch হয় না)।
  // ============================================================
  const { data: service, isLoading: loading } = useService(resolvedParams.id);

  // Related Services — একই ক্যাটাগরির অন্য সার্ভিস (নিজেরটা বাদে)
  const { data: relatedData, isLoading: loadingRelated } = useServices(
    service ? { categoryId: service.categoryId, limit: 4 } : {},
  );
  const relatedServices = (relatedData?.services ?? []).filter(
    (s) => s.id !== resolvedParams.id,
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <Link href="/services">
          <Button variant="outline">Back to Services</Button>
        </Link>
      </div>
    );
  }

  const tech = service.technician;
  // getServiceById রেসপন্সে টেকনিশিয়ানের reviewsAsTechnician এমবেড করা
  // থাকলে সেটা রিয়েল রিভিউ হিসেবে দেখানো হবে, নাহলে খালি-স্টেট দেখাবে —
  // কোনো ডামি রিভিউ বসানো হয়নি।
  const reviews = tech?.reviewsAsTechnician ?? [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {service.category?.name}
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {service.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="h-4 w-4 fill-amber-500" />
                {tech?.technicianProfile?.avgRating?.toFixed(1) || "4.8"} Rating
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Available nationwide
              </span>
            </div>
          </div>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold border-b pb-2">
              Service Description
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {service.description ||
                "No description provided for this service."}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Verified Service</h4>
                <p className="text-xs text-muted-foreground">
                  Quality & safety guaranteed
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-semibold text-sm">Expert Tools</h4>
                <p className="text-xs text-muted-foreground">
                  Professional tools provided
                </p>
              </div>
            </div>
          </div>

          {/* ================= REVIEWS & RATINGS ================= */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-primary" />
              Reviews & Ratings
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-4 divide-y">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {review.customer?.name || "Verified Customer"}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating
                                ? "fill-amber-500"
                                : "fill-none text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">
                এই টেকনিশিয়ানের জন্য এখনো কোনো রিভিউ জমা পড়েনি।
              </p>
            )}
          </Card>

          {/* ================= RELATED SERVICES ================= */}
          {(loadingRelated || relatedServices.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">
                Related Services in {service.category?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loadingRelated
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-28 w-full rounded-xl" />
                    ))
                  : relatedServices.slice(0, 2).map((rs) => (
                      <Link key={rs.id} href={`/services/${rs.id}`}>
                        <Card className="p-4 h-full hover:border-primary/50 hover:shadow-sm transition-all">
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {rs.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {rs.description || "Professional home service."}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-primary font-bold text-sm">
                              ৳{rs.price}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </Card>
                      </Link>
                    ))}
              </div>
            </div>
          )}
        </div>

        {/* Technician Short Profile & Booking CTA */}
        <aside className="space-y-6">
          <Card className="p-6 space-y-6 border-primary/30 shadow-md sticky top-20">
            <div className="text-center space-y-3 border-b pb-6">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Service Price
              </span>
              <div className="text-4xl font-extrabold text-primary">
                ৳{service.price}
              </div>
            </div>

            {/* Technician info */}
            {tech && (
              <div className="space-y-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Provided By
                </span>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarFallback>{tech.name[0] || "T"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {tech.technicianProfile?.experienceYears || 2}+ Years
                      Experience
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link
              href={`/technicians/${tech?.id}?serviceId=${service.id}`}
              className="block"
            >
              <Button size="lg" className="w-full gap-2 font-bold">
                <Calendar className="h-5 w-5" /> Book This Service
              </Button>
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  );
}
