"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/shared/stat-card";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import Link from "next/link";
import { getTechnicianBookings } from "@/lib/api/bookings";
import { getMyServices } from "@/lib/api/services";
import { getMyProfile } from "@/lib/api/users";
import { Booking, Service, User } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarClock,
  Wallet,
  Bell,
  Star,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const EARNED_STATUSES = ["PAID", "IN_PROGRESS", "COMPLETED"];

export default function TechnicianOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [bookingsRes, servicesRes, profileRes] = await Promise.all([
          getTechnicianBookings(),
          getMyServices(),
          getMyProfile(),
        ]);
        if (!cancelled) {
          setBookings(bookingsRes.data);
          setServices(servicesRes.data.services);
          setProfile(profileRes.data.profile);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load your overview");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingRequests = bookings.filter((b) => b.status === "REQUESTED");
  const upcomingJobs = bookings.filter((b) =>
    ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status),
  );
  const totalEarnings = bookings
    .filter((b) => EARNED_STATUSES.includes(b.status))
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
  const completedJobs = bookings.filter((b) => b.status === "COMPLETED").length;

  const nextJob = [...upcomingJobs].sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
  )[0];

  const techProfile = profile?.technicianProfile;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Your workshop
        </h1>
        <p className="text-sm text-muted-foreground">
          Requests, upcoming jobs and earnings at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New requests" value={pendingRequests.length} icon={Bell} hint="Waiting for your answer" tone="primary" />
        <StatCard label="Upcoming jobs" value={upcomingJobs.length} icon={CalendarClock} hint="Accepted, paid or in progress" />
        <StatCard label="Earned" value={totalEarnings} prefix="৳" icon={Wallet} hint={`${completedJobs} jobs completed`} tone="deep" />
        <StatCard label="Reviews" value={techProfile?.totalReviews ?? 0} icon={Star} hint={techProfile?.totalReviews ? `Average ${techProfile.avgRating.toFixed(1)} / 5` : "No ratings yet"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Job */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" /> Next Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextJob ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4">
                <div>
                  <p className="font-semibold">{nextJob.service?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {nextJob.customer?.name} • {nextJob.address}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(nextJob.scheduledDate).toLocaleString()}
                  </p>
                </div>
                <BookingStatusBadge status={nextJob.status} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No upcoming jobs right now.
              </p>
            )}
            <div className="pt-4">
              <Link href="/dashboard/technician/bookings">
                <Button variant="outline" className="w-full gap-2">
                  View All Bookings <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/technician/services">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Wrench className="h-4 w-4" /> Manage Services (
                {services.length})
              </Button>
            </Link>
            <Link href="/dashboard/technician/availability">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CalendarClock className="h-4 w-4" /> Set Availability
              </Button>
            </Link>
            <Link href="/dashboard/technician/profile">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CheckCircle2 className="h-4 w-4" /> Complete Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
