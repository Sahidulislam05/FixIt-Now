"use client";

import { useEffect, useState } from "react";
import { getAllBookings, getAllUsers } from "@/lib/api/admin";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CalendarCheck, DollarSign, Wrench } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalBookings: number;
  totalRevenue: number;
}

const EMPTY_STATS: Stats = {
  totalUsers: 0,
  totalCustomers: 0,
  totalTechnicians: 0,
  activeBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
  totalBookings: 0,
  totalRevenue: 0,
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // ============================================================
    // আগে এখানে getAllUsers()/getAllBookings() কল করে res.data.length
    // দিয়ে টোটাল গণনা হতো — কিন্তু list endpoint গুলো paginated
    // (ডিফল্ট limit অনুযায়ী শুধু একটা পেজ ফেরত দেয়), তাই ইউজার/বুকিং
    // সংখ্যা বেশি হলে ড্যাশবোর্ডের সংখ্যাগুলো ভুল (কম) দেখাতো।
    // এখন প্রতিটা ক্যাটাগরির জন্য limit:1 দিয়ে হালকা রিকোয়েস্ট পাঠিয়ে
    // শুধু res.meta.total থেকে সঠিক সংখ্যা নেওয়া হচ্ছে। রেভিনিউ হিসাবের
    // জন্য PAID/COMPLETED বুকিং একসাথে (limit বাড়িয়ে) আনা হচ্ছে —
    // ব্যাকএন্ডে aggregate/summary endpoint যোগ হলে এটা আরও দ্রুত করা যাবে।
    // ============================================================
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [
          allUsersRes,
          customersRes,
          techniciansRes,
          allBookingsRes,
          activeReqRes,
          activeAccRes,
          activePaidRes,
          activeProgressRes,
          completedRes,
          cancelledRes,
          paidBookingsRes,
          completedBookingsForRevenueRes,
        ] = await Promise.all([
          getAllUsers({ limit: 1 }),
          getAllUsers({ role: "CUSTOMER", limit: 1 }),
          getAllUsers({ role: "TECHNICIAN", limit: 1 }),
          getAllBookings({ limit: 1 }),
          getAllBookings({ status: "REQUESTED", limit: 1 }),
          getAllBookings({ status: "ACCEPTED", limit: 1 }),
          getAllBookings({ status: "PAID", limit: 1 }),
          getAllBookings({ status: "IN_PROGRESS", limit: 1 }),
          getAllBookings({ status: "COMPLETED", limit: 1 }),
          getAllBookings({ status: "CANCELLED", limit: 1 }),
          getAllBookings({ status: "PAID", limit: 200 }),
          getAllBookings({ status: "COMPLETED", limit: 200 }),
        ]);

        if (cancelled) return;

        const totalOf = (res: { meta?: { total: number }; data: unknown[] }) =>
          res.meta?.total ?? res.data.length;

        const revenue =
          [...paidBookingsRes.data, ...completedBookingsForRevenueRes.data].reduce(
            (sum, b) => sum + Number(b.totalPrice || 0),
            0,
          );

        setStats({
          totalUsers: totalOf(allUsersRes),
          totalCustomers: totalOf(customersRes),
          totalTechnicians: totalOf(techniciansRes),
          totalBookings: totalOf(allBookingsRes),
          activeBookings:
            totalOf(activeReqRes) +
            totalOf(activeAccRes) +
            totalOf(activePaidRes) +
            totalOf(activeProgressRes),
          completedBookings: totalOf(completedRes),
          cancelledBookings: totalOf(cancelledRes),
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Failed to load platform stats:", error);
        if (!cancelled) toast.error("Failed to load overview data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform performance and system overview
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalCustomers} Customers • {stats.totalTechnicians}{" "}
              Technicians
            </p>
          </CardContent>
        </Card>

        {/* Active Bookings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bookings
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.activeBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ongoing service requests
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ৳{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From completed/paid orders
            </p>
          </CardContent>
        </Card>

        {/* Total Technicians Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Service Providers
            </CardTitle>
            <Wrench className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTechnicians}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered technicians
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            System Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm border-b pb-2">
            <span className="text-muted-foreground">
              Total System Bookings Recorded
            </span>
            <span className="font-semibold">{stats.totalBookings}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-b pb-2">
            <span className="text-muted-foreground">Completed Services</span>
            <span className="font-semibold text-emerald-600">
              {stats.completedBookings}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cancelled Bookings</span>
            <span className="font-semibold text-red-600">
              {stats.cancelledBookings}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
