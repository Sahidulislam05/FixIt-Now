"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTechnician } from "@/hooks/queries/use-technicians";
import { createBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { DayOfWeek } from "@/lib/types";
import { getAvatarUrl } from "@/lib/avatar";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Star,
  Calendar,
  UserCheck,
  Wrench,
  CalendarX2,
  MessageSquareText,
} from "lucide-react";
import { toast } from "sonner";

// JS-এর Date.getDay() (0=রবি...6=শনি) থেকে ব্যাকএন্ডের DayOfWeek enum-এ ম্যাপ করার জন্য
const DAY_INDEX_TO_ENUM: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

/**
 * "09:00" থেকে "18:00" এর মতো একটা রেঞ্জকে ১ ঘন্টার স্লটে ভেঙে
 * ["09:00 - 10:00", "10:00 - 11:00", ...] বানায়।
 */
function buildHourlySlots(startTime: string, endTime: string): string[] {
  const [startH] = startTime.split(":").map(Number);
  const [endH] = endTime.split(":").map(Number);

  if (Number.isNaN(startH) || Number.isNaN(endH) || endH <= startH) return [];

  const slots: string[] = [];
  for (let h = startH; h < endH; h++) {
    const from = `${String(h).padStart(2, "0")}:00`;
    const to = `${String(h + 1).padStart(2, "0")}:00`;
    slots.push(`${from} - ${to}`);
  }
  return slots;
}

export default function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("serviceId");

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // ============================================================
  // TanStack Query — আগে useEffect+useState দিয়ে fetch হতো।
  // এখন useTechnician(id) নিজে ক্যাশ করে; বুকিং সাবমিট করার পর কেউ
  // আবার এই প্রোফাইলে ফিরলে (বা technician নিজের সার্ভিস আপডেট করলে)
  // ক্যাশ invalidate হয়ে গেলে এই পেজও reload ছাড়াই আপডেট হবে।
  // ============================================================
  const { data: tech, isLoading: loading } = useTechnician(resolvedParams.id);

  // Booking Form State
  const [selectedServiceId, setSelectedServiceId] = useState(
    preselectedServiceId || "",
  );
  const [bookingDate, setBookingDate] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  // টেকনিশিয়ান কোনো weekly schedule সেভ না করলে ফিক্সড স্লট দেখানোর কিছু নেই —
  // তখন এই ম্যানুয়াল টাইম-পিকার ফলব্যাক হিসেবে ব্যবহার হয়
  const [manualTime, setManualTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // টেকনিশিয়ান ডেটা প্রথমবার এলে, preselected service না থাকলে প্রথম
  // সার্ভিসটা ডিফল্ট বাছাই করা — render-time adjustment প্যাটার্ন
  // ব্যবহার করা হয়েছে (useEffect+setState নয়), যাতে
  // react-hooks/set-state-in-effect lint error না আসে।
  const [prevTechId, setPrevTechId] = useState<string | undefined>(undefined);
  if (tech && tech.id !== prevTechId) {
    setPrevTechId(tech.id);
    if (!preselectedServiceId && tech.services?.length) {
      setSelectedServiceId(tech.services[0].id);
    }
  }

  // ============================================================
  // আগে এখানে একটা স্ট্যাটিক সময়সূচি (সব টেকনিশিয়ানের জন্য একই ৬টা স্লট)
  // দেখানো হতো, টেকনিশিয়ান নিজের "Availability" পেজে যা সেভ করুক না কেন।
  // এখন সিলেক্ট করা তারিখের বার (day of week) বের করে, টেকনিশিয়ানের নিজের
  // সেভ করা weekly availability থেকে ওই বারের startTime–endTime রেঞ্জ খুঁজে
  // ১ ঘন্টার স্লটে ভাঙা হচ্ছে। ব্যাকএন্ডে এই মুহূর্তে "কোন স্লট আগে থেকে বুক
  // হয়ে গেছে" জানার আলাদা কোনো পাবলিক এন্ডপয়েন্ট নেই, তাই ডাবল-বুকিং
  // এড়ানোর চূড়ান্ত নিশ্চয়তা এখনও সার্ভার-সাইডেই (booking creation validation)
  // নিতে হবে — এই UI অন্তত টেকনিশিয়ানের ঘোষিত কাজের সময়ের বাইরে বুকিং
  // নেওয়া আটকায়।
  // ============================================================
  const slotsForSelectedDate = useMemo(() => {
    if (!bookingDate || !tech) return [];

    const dayEnum =
      DAY_INDEX_TO_ENUM[new Date(`${bookingDate}T00:00:00`).getDay()];
    const daySchedule = tech.availabilities?.find(
      (a) => a.dayOfWeek === dayEnum && a.isActive,
    );

    if (!daySchedule) return [];
    return buildHourlySlots(daySchedule.startTime, daySchedule.endTime);
  }, [bookingDate, tech]);

  const hasAnyAvailability = (tech?.availabilities?.length || 0) > 0;
  // ওই দিনে টেকনিশিয়ান নির্দিষ্টভাবে "off" (schedule আছে কিন্তু সিলেক্ট করা দিনটা তার মধ্যে নেই)
  const isDayOff =
    hasAnyAvailability && !!bookingDate && slotsForSelectedDate.length === 0;

  // তারিখ বদলালে আগের স্লট/ম্যানুয়াল-টাইম সিলেকশন আর বৈধ নাও থাকতে পারে —
  // render-time adjustment প্যাটার্ন, useEffect+setState নয়।
  const [prevBookingDate, setPrevBookingDate] = useState(bookingDate);
  if (bookingDate !== prevBookingDate) {
    setPrevBookingDate(bookingDate);
    setSelectedSlot("");
    setManualTime("");
  }

  // চূড়ান্তভাবে বুকিং-এর সাথে যাওয়া সময় — হয় প্রিসেট স্লট থেকে, নাহলে
  // (কোনো schedule না থাকলে) ম্যানুয়াল টাইম-পিকার থেকে
  const effectiveStartTime = selectedSlot
    ? selectedSlot.split(" - ")[0]
    : !hasAnyAvailability
      ? manualTime
      : "";

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to book a service");
      router.push("/login");
      return;
    }

    if (
      !selectedServiceId ||
      !bookingDate ||
      !effectiveStartTime ||
      !address.trim()
    ) {
      toast.error("Please select a service, date, time, and address");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        serviceId: selectedServiceId,
        scheduledDate: `${bookingDate}T${effectiveStartTime}:00`,
        address: address.trim(),
      });

      toast.success("Booking request submitted successfully!");
      router.push("/dashboard/customer/bookings");
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to create booking request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!tech) {
    return (
      <div className="text-center py-16">Technician Profile Not Found</div>
    );
  }

  const selectedServiceObj = tech.services?.find(
    (s) => s.id === selectedServiceId,
  );

  // getTechnicianById রেসপন্সে reviewsAsTechnician এমবেড করা থাকলে রিয়েল
  // রিভিউ দেখানো হবে, নাহলে খালি-স্টেট — কোনো ডামি রিভিউ বসানো হয়নি।
  const reviews = tech.reviewsAsTechnician ?? [];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
      {/* Profile Header Card */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-background">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg bg-muted shrink-0">
            <Image
              src={getAvatarUrl(tech.id || tech.name)}
              alt={tech.name}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold">
                {tech.name}
              </h1>
              <Badge className="w-max mx-auto md:mx-0 bg-primary/10 text-primary border-primary/20">
                <UserCheck className="h-3.5 w-3.5 mr-1 inline" /> Verified
                Technician
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {tech.technicianProfile?.bio ||
                "Dedicated specialist ensuring top-quality work."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium pt-2">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="h-4 w-4 fill-amber-500" />
                <span>
                  {tech.technicianProfile?.avgRating?.toFixed(1) || "5.0"}{" "}
                  Rating
                </span>
              </div>
              <span>•</span>
              <div>
                {tech.technicianProfile?.experienceYears || 2}+ Years Experience
              </div>
              <span>•</span>
              <div>{reviews.length} Reviews</div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-2">
              {tech.technicianProfile?.skills?.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-[11px]">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Services List & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services Offered */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" /> Services Offered
            </h2>
            <div className="space-y-3">
              {tech.services && tech.services.length > 0 ? (
                tech.services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedServiceId === srv.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm">{srv.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {srv.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-primary">
                        ৳{srv.price}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        {srv.location || "Available nationwide"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No services listed yet.
                </p>
              )}
            </div>
          </Card>

          {/* ================= REVIEWS & RATINGS ================= */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" /> Reviews &
              Ratings
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-4 divide-y">
                {reviews.map((review) => (
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
        </div>

        {/* Right: Interactive Booking Box */}
        <aside>
          <Card className="p-6 border-primary/40 shadow-lg sticky top-20">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Book Technician
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Select Service */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Select Service</Label>
                <select
                  className="w-full text-sm border rounded-lg p-2.5 bg-background"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {tech.services?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} - ৳{s.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Booking Date</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
                {!hasAnyAvailability && (
                  <p className="text-[11px] text-amber-600">
                    This technician hasn&apos;t set a weekly availability yet —
                    booking may still be requested, but timing isn&apos;t
                    confirmed until they accept.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Service Address</Label>
                <Input
                  placeholder="Where should the technician come?"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Time Slots — টেকনিশিয়ানের নিজের সেভ করা availability থেকে জেনারেট করা */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Available Time Slots
                </Label>

                {!bookingDate ? (
                  <p className="text-xs text-muted-foreground italic py-2">
                    Pick a date to see available slots.
                  </p>
                ) : slotsForSelectedDate.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {slotsForSelectedDate.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className="text-[11px] h-9 px-1"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : isDayOff ? (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <CalendarX2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      This technician isn&apos;t working on the selected day.
                      Please choose another date.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                      <CalendarX2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        No fixed schedule set yet — pick your preferred time and
                        the technician will confirm after reviewing your
                        request.
                      </span>
                    </div>
                    <Input
                      type="time"
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {selectedServiceObj && (
                <div className="p-3 bg-muted rounded-lg flex items-center justify-between text-sm pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    Total Price:
                  </span>
                  <span className="font-extrabold text-primary text-base">
                    ৳{selectedServiceObj.price}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold"
                disabled={
                  submitting ||
                  (hasAnyAvailability && !!bookingDate && !selectedSlot)
                }
              >
                {submitting
                  ? "Submitting Request..."
                  : "Confirm Booking Request"}
              </Button>
            </form>
          </Card>
        </aside>
      </div>
    </div>
  );
}
