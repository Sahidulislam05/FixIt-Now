"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminBookings, useAdminUsers } from "@/hooks/queries/use-admin";
import type { BookingStatus, Role } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, PieChartIcon, TrendingUp } from "lucide-react";

const STATUS_COLORS: Record<BookingStatus, string> = {
  REQUESTED: "var(--chart-4)",
  ACCEPTED: "var(--chart-1)",
  PAID: "var(--chart-3)",
  IN_PROGRESS: "var(--chart-2)",
  COMPLETED: "var(--success)",
  CANCELLED: "var(--destructive)",
  DECLINED: "var(--muted-foreground)",
};

const ROLE_COLORS: Record<Role, string> = {
  CUSTOMER: "var(--chart-1)",
  TECHNICIAN: "var(--chart-2)",
  ADMIN: "var(--chart-4)",
};

// লাইভ ডেটা থেকে chart-friendly aggregation বানানোর ছোট হেল্পার
function countBy<T extends string>(items: T[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, key) => {
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export default function AdminAnalyticsPage() {
  const { data: bookingsData, isLoading: loadingBookings } = useAdminBookings({
    limit: 200,
  });
  const { data: usersData, isLoading: loadingUsers } = useAdminUsers({
    limit: 200,
  });

  const bookings = useMemo(() => bookingsData?.bookings ?? [], [bookingsData]);

  const users = useMemo(() => usersData?.users ?? [], [usersData]);

  const statusChartData = useMemo(() => {
    const counts = countBy(bookings.map((b) => b.status));
    return Object.entries(counts).map(([status, value]) => ({
      name: status,
      value,
      fill: STATUS_COLORS[status as BookingStatus] ?? "var(--chart-5)",
    }));
  }, [bookings]);

  const roleChartData = useMemo(() => {
    const counts = countBy(users.map((u) => u.role));
    return (["CUSTOMER", "TECHNICIAN", "ADMIN"] as Role[]).map((role) => ({
      name: role.charAt(0) + role.slice(1).toLowerCase(),
      count: counts[role] ?? 0,
      fill: ROLE_COLORS[role],
    }));
  }, [users]);

  const trendChartData = useMemo(() => {
    // শেষ ১৪ দিনের বুকিং সংখ্যা — dd/mm ফরম্যাটে গ্রুপ করা
    const days: { key: string; label: string }[] = Array.from({
      length: 14,
    }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return {
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
      };
    });

    const perDay = countBy(
      bookings.map((b) => new Date(b.createdAt).toISOString().slice(0, 10)),
    );

    return days.map((d) => ({
      day: d.label,
      bookings: perDay[d.key] ?? 0,
    }));
  }, [bookings]);

  const isLoading = loadingBookings || loadingUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          বুকিং ও ইউজার ডেটার ভিজ্যুয়াল ব্রেকডাউন (সাম্প্রতিক {bookings.length}{" "}
          বুকিং ভিত্তিক)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============= Bookings by Status — Pie Chart ============= */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              Bookings by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : statusChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">
                এখনো কোনো বুকিং রেকর্ড নেই।
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ============= Users by Role — Bar Chart ============= */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={roleChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                  />
                  <Tooltip cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {roleChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ============= Booking Trend — Bar Chart (last 14 days) ============= */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              Booking Trend — Last 14 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={1}
                  />
                  <YAxis
                    allowDecimals={false}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                  />
                  <Tooltip cursor={{ fill: "var(--muted)" }} />
                  <Bar
                    dataKey="bookings"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
