"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cancelBooking, getMyBookings } from "@/lib/api/bookings";
import { createReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";
import { Booking } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/shared/simple-pagination";
import {
  Star,
  CreditCard,
  XCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch Bookings
  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await getMyBookings({ page, limit: PAGE_SIZE });
        if (!cancelled) {
          setBookings(res.data);
          setTotalPages(res.meta?.totalPages || 1);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch bookings:", error);
          toast.error("Failed to load bookings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadBookings();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const refreshBookings = async () => {
    const res = await getMyBookings({ page, limit: PAGE_SIZE });
    setBookings(res.data);
    setTotalPages(res.meta?.totalPages || 1);
  };

  // Handle Cancel Booking
  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully");
      await refreshBookings();
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to cancel booking",
      );
    }
  };

  // Handle Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;

    setSubmittingReview(true);
    try {
      await createReview({
        bookingId: reviewBooking.id,
        rating,
        comment,
      });

      toast.success("Review submitted successfully!");
      setReviewBooking(null);
      setComment("");
      setRating(5);
      await refreshBookings();
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to submit review",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">
            REQUESTED
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">
            ACCEPTED
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20">
            PAID
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
            IN_PROGRESS
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20">
            COMPLETED
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
            CANCELLED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your service booking requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Booking History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
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
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-semibold">
                        {booking.service?.title || "Service"}
                      </TableCell>
                      <TableCell>
                        {booking.technician?.name || "Technician"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(booking.scheduledDate).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ৳{booking.totalPrice}
                      </TableCell>
                      <TableCell>{renderStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* ACCEPTED Action: Pay Now */}
                        {booking.status === "ACCEPTED" && (
                          <Link
                            href={`/dashboard/customer/bookings/${booking.id}/pay`}
                          >
                            <Button
                              size="sm"
                              className="gap-1 bg-purple-600 hover:bg-purple-700"
                            >
                              <CreditCard className="h-3.5 w-3.5" /> Pay Now
                            </Button>
                          </Link>
                        )}

                        {/* REQUESTED or ACCEPTED Action: Cancel */}
                        {(booking.status === "REQUESTED" ||
                          booking.status === "ACCEPTED") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        )}

                        {/* COMPLETED Action: Leave Review (শুধু যদি আগে থেকে রিভিউ না দেওয়া থাকে) */}
                        {booking.status === "COMPLETED" &&
                          (booking.review ? (
                            <Badge
                              variant="outline"
                              className="gap-1 text-amber-600 border-amber-500/30"
                            >
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              Reviewed ({booking.review.rating}/5)
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="gap-1"
                              onClick={() => setReviewBooking(booking)}
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-amber-500" />{" "}
                              Leave Review
                            </Button>
                          ))}
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
              <p>You haven&apos;t made any bookings yet.</p>
              <Link href="/services">
                <Button className="mt-4" variant="outline">
                  Browse Services
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Submission Modal */}
      <Dialog
        open={!!reviewBooking}
        onOpenChange={() => setReviewBooking(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience for service:{" "}
              <strong>{reviewBooking?.service?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
            {/* Star Rating Picker */}
            <div className="space-y-1 text-center">
              <label className="text-xs font-semibold text-muted-foreground">
                Rating
              </label>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Your Comments</label>
              <Textarea
                placeholder="How was the technician's work?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewBooking(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
