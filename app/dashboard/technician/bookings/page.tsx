"use client";

import { useState, useEffect } from "react";
import {
  getTechnicianBookings,
  updateBookingStatus,
  type TechnicianSettableStatus,
} from "@/lib/api/bookings";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, CheckCircle2, Play, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getTechnicianBookings();
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load incoming bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchBookings(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Update Status Transition Function
  const handleUpdateStatus = async (
    bookingId: string,
    status: TechnicianSettableStatus,
  ) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking status changed to ${status}`);
      void fetchBookings();
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to update booking status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incoming Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage service requests and update job progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Booking Requests
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-semibold">
                        {booking.customer?.name || "Customer"}
                      </TableCell>
                      <TableCell>{booking.service?.title}</TableCell>
                      <TableCell className="text-xs">
                        {new Date(booking.scheduledDate).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">
                        {booking.address || "N/A"}
                      </TableCell>
                      <TableCell>{renderStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* Status: REQUESTED -> Accept / Decline */}
                        {booking.status === "REQUESTED" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              disabled={updatingId === booking.id}
                              onClick={() =>
                                handleUpdateStatus(booking.id, "ACCEPTED")
                              }
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />{" "}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              disabled={updatingId === booking.id}
                              onClick={() =>
                                handleUpdateStatus(booking.id, "DECLINED")
                              }
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                            </Button>
                          </>
                        )}

                        {/* Status: ACCEPTED -> Waiting for payment */}
                        {booking.status === "ACCEPTED" && (
                          <span className="text-xs text-muted-foreground italic flex items-center justify-end gap-1">
                            <Clock className="h-3.5 w-3.5" /> Awaiting Payment
                          </span>
                        )}

                        {/* Status: PAID -> Start Job */}
                        {booking.status === "PAID" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleUpdateStatus(booking.id, "IN_PROGRESS")
                            }
                          >
                            <Play className="h-3.5 w-3.5 mr-1" /> Start Job
                          </Button>
                        )}

                        {/* Status: IN_PROGRESS -> Complete Job */}
                        {booking.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={updatingId === booking.id}
                            onClick={() =>
                              handleUpdateStatus(booking.id, "COMPLETED")
                            }
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />{" "}
                            Complete Job
                          </Button>
                        )}

                        {/* Status: COMPLETED / CANCELLED */}
                        {(booking.status === "COMPLETED" ||
                          booking.status === "CANCELLED") && (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No booking requests found at the moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
