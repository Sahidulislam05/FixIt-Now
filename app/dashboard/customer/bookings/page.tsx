"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarSearch,
  CreditCard,
  MessageSquare,
  Star,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { cancelBooking, getMyBookings } from "@/lib/api/bookings";
import { createReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";
import { formatBookingStatus } from "@/lib/booking-status";
import { formatTaka } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ReviewForm } from "@/components/forms/review-form";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const CANCELLABLE: BookingStatus[] = ["REQUESTED", "ACCEPTED", "PAID"];
const FILTERS: ("ALL" | BookingStatus)[] = [
  "ALL",
  "REQUESTED",
  "ACCEPTED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [toReview, setToReview] = useState<Booking | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getMyBookings({
      page,
      limit: PAGE_SIZE,
      status: filter === "ALL" ? undefined : filter,
    })
      .then((res) => {
        if (cancelled) return;
        setBookings(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch(() => !cancelled && toast.error("Failed to load your bookings"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, filter, reloadKey]);

  function reload() {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  async function confirmCancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      await cancelBooking(toCancel.id, cancelReason.trim() || undefined);
      toast.success("Booking cancelled");
      setToCancel(null);
      setCancelReason("");
      reload();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Couldn't cancel the booking",
      );
    } finally {
      setCancelling(false);
    }
  }

  async function submitReview(values: { rating: number; comment: string }) {
    if (!toReview) return;
    setReviewing(true);
    setReviewError(null);
    try {
      await createReview({ bookingId: toReview.id, ...values });
      toast.success("Thanks for the review!");
      setToReview(null);
      reload();
    } catch (error) {
      setReviewError(
        error instanceof ApiError ? error.message : "Couldn't post your review",
      );
    } finally {
      setReviewing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Customer</p>
        <h1 className="mt-1 text-3xl font-semibold md:text-4xl">My bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pay for accepted jobs, cancel before work starts, and review finished
          ones.
        </p>
      </div>

      <div
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Filter by status"
      >
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
              filter === f
                ? "border-foreground bg-foreground text-background"
                : "bg-card hover:border-foreground/40",
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
        ) : bookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="animate-rise">
                      <TableCell className="max-w-[220px]">
                        <Link
                          href={`/services/${booking.serviceId}`}
                          className="block truncate font-semibold hover:underline"
                        >
                          {booking.service?.title ?? "Service"}
                        </Link>
                      </TableCell>
                      <TableCell>{booking.technician?.name ?? "—"}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {formatWhen(booking.scheduledDate)}
                      </TableCell>
                      <TableCell className="text-right font-display text-base font-semibold">
                        {formatTaka(booking.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {booking.status === "ACCEPTED" && (
                            <Button size="sm" asChild>
                              <Link
                                href={`/dashboard/customer/bookings/${booking.id}/pay`}
                              >
                                <CreditCard /> Pay now
                              </Link>
                            </Button>
                          )}
                          {booking.status === "COMPLETED" &&
                            (booking.review ? (
                              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                                <Star className="size-3.5 fill-highlight text-highlight" />
                                {booking.review.rating}/5
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="ink"
                                onClick={() => {
                                  setReviewError(null);
                                  setToReview(booking);
                                }}
                              >
                                <MessageSquare /> Review
                              </Button>
                            ))}
                          {CANCELLABLE.includes(booking.status) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setToCancel(booking)}
                            >
                              <XCircle /> Cancel
                            </Button>
                          )}
                        </div>
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
            <CalendarSearch
              className="size-9 text-muted-foreground"
              strokeWidth={1.5}
            />
            <p className="font-display text-xl font-semibold">
              {filter === "ALL"
                ? "No bookings yet"
                : `No ${formatBookingStatus(filter).toLowerCase()} bookings`}
            </p>
            {filter === "ALL" && (
              <Button variant="outline" asChild>
                <Link href="/services">Find a service</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toCancel}
        onOpenChange={(open) => {
          if (!open) {
            setToCancel(null);
            setCancelReason("");
          }
        }}
        title="Cancel this booking?"
        description={
          <>
            <strong className="text-foreground">
              {toCancel?.service?.title}
            </strong>{" "}
            on {toCancel && formatWhen(toCancel.scheduledDate)}.{" "}
            {toCancel?.status === "PAID" &&
              "Since it's already paid, our team will process your refund."}
          </>
        }
        confirmLabel="Cancel booking"
        pending={cancelling}
        onConfirm={confirmCancel}
      >
        <div className="grid gap-1.5">
          <Label
            htmlFor="cancel-reason"
            className="text-[0.82rem] font-semibold"
          >
            Reason{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Textarea
            id="cancel-reason"
            rows={2}
            className="min-h-16"
            maxLength={300}
            placeholder="e.g. The problem fixed itself"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </ConfirmDialog>

      <Dialog
        open={!!toReview}
        onOpenChange={(open) => !open && !reviewing && setToReview(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Rate the job
            </DialogTitle>
            <DialogDescription>
              {toReview?.service?.title} with {toReview?.technician?.name}
            </DialogDescription>
          </DialogHeader>
          <ReviewForm
            key={toReview?.id}
            pending={reviewing}
            serverError={reviewError}
            onSubmit={submitReview}
            onCancel={() => setToReview(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
