"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Search,
  Wallet,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { getMyBookings } from "@/lib/api/bookings";
import { formatBookingStatus } from "@/lib/booking-status";
import { formatTaka } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { StatCard } from "@/components/shared/stat-card";

const STAGES: BookingStatus[] = ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS", "COMPLETED"];
const SPENT: BookingStatus[] = ["PAID", "IN_PROGRESS", "COMPLETED"];

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings({ limit: 100 })
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load your overview"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status));
    const spent = bookings.filter((b) => SPENT.includes(b.status)).reduce((sum, b) => sum + Number(b.totalPrice), 0);
    const awaitingPayment = bookings.filter((b) => b.status === "ACCEPTED").length;
    const next = [...active]
      .filter((b) => new Date(b.scheduledDate) >= new Date(new Date().toDateString()))
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))[0];
    const byStage = STAGES.map((stage) => ({
      stage,
      count: bookings.filter((b) => b.status === stage).length,
    }));

    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-GB", { month: "short" }), amount: 0 };
    });
    for (const b of bookings) {
      if (!SPENT.includes(b.status)) continue;
      const d = new Date(b.scheduledDate);
      const month = months.find((m) => m.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (month) month.amount += Number(b.totalPrice);
    }

    return {
      total: bookings.length,
      active: active.length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
      spent,
      awaitingPayment,
      next,
      byStage,
      months,
    };
  }, [bookings]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Customer overview</p>
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl">Your home, in order</h1>
        </div>
        <Button asChild>
          <Link href="/services">
            <Search /> Book a service
          </Link>
        </Button>
      </div>

      {stats.awaitingPayment > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/8 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm">
            <strong>{stats.awaitingPayment}</strong> accepted{" "}
            {stats.awaitingPayment === 1 ? "booking is" : "bookings are"} waiting for payment.
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/customer/bookings">
              Go to bookings <ArrowRight />
            </Link>
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="All bookings" value={stats.total} icon={CalendarCheck} loading={loading} />
        <StatCard label="In motion" value={stats.active} icon={CalendarClock} hint="Requested to in progress" loading={loading} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} loading={loading} />
        <StatCard label="Spent" value={stats.spent} prefix="৳" icon={Wallet} tone="deep" loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Where your bookings stand</h2>
          <ol className="mt-6 grid grid-cols-5 gap-2">
            {stats.byStage.map(({ stage, count }, i) => (
              <li key={stage} className="relative">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className={`h-2 origin-left rounded-full ${count ? "bg-primary" : "bg-muted"}`}
                />
                <p className="mt-3 font-display text-2xl font-semibold">{loading ? "–" : count}</p>
                <p className="text-[0.7rem] leading-tight text-muted-foreground sm:text-xs">{formatBookingStatus(stage)}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-8 eyebrow">Spending, last 6 months</h3>
          <div className="mt-3 h-48">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.months} margin={{ left: -12, right: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    formatter={(v) => [formatTaka(Number(v)), "Spent"]}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                  />
                  <Bar dataKey="amount" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="flex flex-col rounded-xl border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Next visit</h2>
          {loading ? (
            <Skeleton className="mt-4 h-40 w-full" />
          ) : stats.next ? (
            <div className="ruled mt-4 flex flex-1 flex-col rounded-lg border p-5">
              <BookingStatusBadge status={stats.next.status} />
              <p className="mt-3 font-display text-2xl leading-tight font-semibold">{stats.next.service?.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">with {stats.next.technician?.name}</p>
              <p className="mt-4 font-mono text-sm">
                {new Date(stats.next.scheduledDate).toLocaleString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" /> {stats.next.address}
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">Nothing scheduled.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/services">Find a technician</Link>
              </Button>
            </div>
          )}
          <Button variant="ghost" className="mt-4 justify-between" asChild>
            <Link href="/dashboard/customer/bookings">
              All bookings <ArrowRight />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
