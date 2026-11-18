"use client";

import { useEffect, useState } from "react";
import { getAllBookings, getAllUsers } from "@/lib/api/admin";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CalendarCheck, DollarSign, Wrench } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
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
      } catch {
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
        <p className="eyebrow">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold md:text-4xl">Platform overview</h1>
        <p className="text-sm text-muted-foreground">
          Users, bookings and revenue across FixItNow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={stats.totalUsers} icon={Users} hint={`${stats.totalCustomers} customers · ${stats.totalTechnicians} technicians`} />
        <StatCard label="Active bookings" value={stats.activeBookings} icon={CalendarCheck} hint="Requested to in progress" tone="primary" />
        <StatCard label="Revenue" value={stats.totalRevenue} prefix="৳" icon={DollarSign} hint="Paid and completed jobs" tone="deep" />
        <StatCard label="Technicians" value={stats.totalTechnicians} icon={Wrench} hint="Registered providers" />
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
            <span className="font-semibold text-success">
              {stats.completedBookings}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cancelled Bookings</span>
            <span className="font-semibold text-destructive">
              {stats.cancelledBookings}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
