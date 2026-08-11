"use client";

import { useState } from "react";
import { useAdminBookings } from "@/hooks/queries/use-admin";
import { BookingStatus } from "@/lib/types";
import { BOOKING_STATUS_OPTIONS } from "@/lib/booking-status";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { Calendar, Search } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);

  // স্ট্যাটাস ফিল্টার বদলালে পেজ ১-এ রিসেট — render-time adjustment প্যাটার্ন
  const [prevStatusFilter, setPrevStatusFilter] = useState(statusFilter);
  if (statusFilter !== prevStatusFilter) {
    setPrevStatusFilter(statusFilter);
    setPage(1);
  }

  // ============================================================
  // TanStack Query — filter/page বদলালেই queryKey বদলে যায়, হুক নিজে
  // থেকে রিফেচ করে (queryKeys.bookings.admin, দেখো lib/query-keys.ts)।
  // ============================================================
  const { data, isLoading: loading } = useAdminBookings({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit: PAGE_SIZE,
  });
  const bookings = data?.bookings ?? [];
  const totalPages = data?.meta?.totalPages || 1;
  const totalCount = data?.meta?.total ?? bookings.length;

  // ব্যাকএন্ডের /api/admin/bookings এন্ডপয়েন্টে ফ্রি-টেক্সট সার্চ প্যারামিটার
  // নেই (শুধু status/page/limit) — তাই নাম-ভিত্তিক সার্চ শুধু বর্তমান পেজে
  // লোড হওয়া রেকর্ডগুলোর মধ্যেই কাজ করে। পুরো ডেটাসেটে সার্চ করতে চাইলে
  // ব্যাকএন্ডে searchTerm সাপোর্ট যোগ করতে হবে।
  const visibleBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (b.customer?.name || "").toLowerCase().includes(q) ||
      (b.technician?.name || "").toLowerCase().includes(q) ||
      (b.service?.title || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Global Bookings Oversight
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor and filter all customer service requests across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> All Bookings
            </span>
            <Badge variant="outline">{totalCount} Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filter Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customer, technician, service (this page)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as BookingStatus | "ALL")}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {BOOKING_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Table */}
          {loading ? (
            <div className="space-y-3 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : visibleBookings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-semibold">
                          {b.customer?.name || "Customer"}
                        </TableCell>
                        <TableCell>
                          {b.technician?.name || "Technician"}
                        </TableCell>
                        <TableCell>{b.service?.title || "Service"}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(b.scheduledDate).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          ৳{b.totalPrice}
                        </TableCell>
                        <TableCell>
                          <BookingStatusBadge status={b.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <SimplePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No booking records match your search or filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
