"use client";

import { useEffect, useState } from "react";
import { CalendarSearch, CheckCircle2, Clock, Loader2, MapPin, Play, XCircle } from "lucide-react";
import { toast } from "sonner";

import { getTechnicianBookings, updateBookingStatus, type TechnicianSettableStatus } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { formatBookingStatus } from "@/lib/booking-status";
import { formatTaka } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatusBadge } from "@/components/shared/booking-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SimplePagination } from "@/components/shared/simple-pagination";

const PAGE_SIZE = 10;
const FILTERS: ("ALL" | BookingStatus)[] = ["ALL", "REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS", "COMPLETED", "DECLINED", "CANCELLED"];

const SUCCESS_COPY: Record<TechnicianSettableStatus, string> = {
  ACCEPTED: "Request accepted — the customer can now pay.",
  DECLINED: "Request declined.",
  IN_PROGRESS: "Job started.",
  COMPLETED: "Job marked complete. Nice work!",
};

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toDecline, setToDecline] = useState<Booking | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTechnicianBookings({ page, limit: PAGE_SIZE, status: filter === "ALL" ? undefined : filter })
      .then((res) => {
        if (cancelled) return;
        setBookings(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch(() => !cancelled && toast.error("Failed to load job requests"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, filter, reloadKey]);

  async function changeStatus(booking: Booking, status: TechnicianSettableStatus) {
    setUpdatingId(booking.id);
    try {
      await updateBookingStatus(booking.id, status);
      toast.success(SUCCESS_COPY[status]);
      setToDecline(null);
      setLoading(true);
      setReloadKey((k) => k + 1);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update the booking");
    } finally {
      setUpdatingId(null);
    }
  }

  function action(booking: Booking) {
    const busy = updatingId === booking.id;
    const spinner = busy ? <Loader2 className="animate-spin" /> : null;
    switch (booking.status) {
      case "REQUESTED":
        return (
          <>
            <Button size="sm" disabled={busy} onClick={() => changeStatus(booking, "ACCEPTED")}>
              {spinner ?? <CheckCircle2 />} Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={busy}
              onClick={() => setToDecline(booking)}
            >
              <XCircle /> Decline
            </Button>
          </>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Clock className="size-3.5" /> Awaiting payment
          </span>
        );
      case "PAID":
        return (
          <Button size="sm" variant="ink" disabled={busy} onClick={() => changeStatus(booking, "IN_PROGRESS")}>
            {spinner ?? <Play />} Start job
          </Button>
        );
      case "IN_PROGRESS":
        return (
          <Button size="sm" disabled={busy} onClick={() => changeStatus(booking, "COMPLETED")}>
            {spinner ?? <CheckCircle2 />} Mark complete
          </Button>
        );
      default:
        return <span className="text-muted-foreground">—</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Technician</p>
        <h1 className="mt-1 text-3xl font-semibold md:text-4xl">Job requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accept new requests, start paid jobs and mark them complete when you&apos;re done.
        </p>
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => {
              if (f === filter) return;
              setLoading(true);
              setFilter(f);
              setPage(1);
            }}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors",
              filter === f ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/40",
            )}
          >
            {f === "ALL" ? "All" : formatBookingStatus(f)}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : bookings.length ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>Where</TableHead>
                    <TableHead className="text-right">Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="animate-rise">
                      <TableCell className="font-semibold">{booking.customer?.name ?? "Customer"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{booking.service?.title}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {new Date(booking.scheduledDate).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" /> {booking.address}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-display text-base font-semibold">
                        {formatTaka(booking.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">{action(booking)}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <SimplePagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setLoading(true);
                setPage(p);
              }}
              className="mt-4"
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <CalendarSearch className="size-9 text-muted-foreground" strokeWidth={1.5} />
            <p className="font-display text-xl font-semibold">
              {filter === "ALL" ? "No job requests yet" : `Nothing ${formatBookingStatus(filter).toLowerCase()}`}
            </p>
            <p className="text-sm text-muted-foreground">New requests appear here as soon as customers book you.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDecline}
        onOpenChange={(open) => !open && setToDecline(null)}
        title="Decline this request?"
        description={
          <>
            {toDecline?.customer?.name} will be told you can&apos;t take{" "}
            <strong className="text-foreground">{toDecline?.service?.title}</strong>. This can&apos;t be undone.
          </>
        }
        confirmLabel="Decline request"
        pending={!!toDecline && updatingId === toDecline.id}
        onConfirm={() => toDecline && changeStatus(toDecline, "DECLINED")}
      />
    </div>
  );
}
