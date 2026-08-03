"use client";

import { useEffect, useState } from "react";
import { getAllBookings } from "@/lib/api/admin";
import { Booking, BookingStatus } from "@/lib/types";

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
import { Calendar, Search } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAllBookings({
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        if (cancelled) return;
        setBookings(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total ?? res.data.length);
      })
      .catch((err: Error) => {
        console.error("Failed to fetch all bookings:", err);
        if (!cancelled) toast.error("Failed to load platform bookings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [statusFilter, page]);

  // Status Badge Renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            REQUESTED
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            ACCEPTED
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            PAID
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            IN_PROGRESS
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20">
            COMPLETED
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            CANCELLED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                <SelectItem value="REQUESTED">REQUESTED</SelectItem>
                <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
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
                        <TableCell>{renderStatusBadge(b.status)}</TableCell>
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
