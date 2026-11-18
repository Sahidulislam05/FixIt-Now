"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { getBookingById } from "@/lib/api/bookings";
import { createPayment } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { Booking } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Wrench,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function PayBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const submitLockRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    getBookingById(resolvedParams.id)
      .then((res) => {
        if (!cancelled) setBooking(res.data.booking);
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to fetch booking details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  const handlePayment = async () => {
    if (!booking) return;

    if (booking.status !== "ACCEPTED") {
      toast.error(
        booking.status === "PAID" ||
          booking.status === "IN_PROGRESS" ||
          booking.status === "COMPLETED"
          ? "This booking has already been paid for."
          : "This booking is no longer eligible for payment.",
      );
      return;
    }

    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setPaying(true);

    try {
      const res = await createPayment(booking.id);
      const gatewayUrl = res.data.gatewayPageURL;

      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        toast.error("Failed to generate payment link");
        submitLockRef.current = false;
        setPaying(false);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError ? error.message : "Payment initiation failed",
      );
      submitLockRef.current = false;
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12 space-y-4">
        <p>Booking not found or unavailable.</p>
        <Link href="/dashboard/customer/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const alreadyPaid = ["PAID", "IN_PROGRESS", "COMPLETED"].includes(
    booking.status,
  );
  const notPayable = booking.status !== "ACCEPTED";

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <Link
        href="/dashboard/customer/bookings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Bookings
      </Link>

      {notPayable && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-highlight/10 p-4 text-sm text-primary">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              {alreadyPaid
                ? "This booking is already paid."
                : "This booking can no longer be paid."}
            </p>
            <p className="text-primary/80">
              Current status:{" "}
              <Badge variant="outline" className="border-primary/40">
                {booking.status}
              </Badge>{" "}
              {alreadyPaid
                ? "— no further action is needed."
                : "— payment is only available while a booking is Accepted."}
            </p>
          </div>
        </div>
      )}

      <Card className="border-primary/20 shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Payment Summary</span>
            <ShieldCheck className="h-5 w-5 text-success" />
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-primary" /> Service:
              </span>
              <span className="font-semibold">{booking.service?.title}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary" /> Technician:
              </span>
              <span className="font-semibold">{booking.technician?.name}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> Schedule:
              </span>
              <span className="font-medium text-xs">
                {new Date(booking.scheduledDate).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center pt-3 mt-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Total Payable Amount
              </span>
              <p className="text-xs text-success">
                Includes all taxes & fees
              </p>
            </div>
            <div className="font-display text-4xl font-semibold text-primary">
              ৳{booking.totalPrice}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          {notPayable ? (
            <Link href="/dashboard/customer/bookings" className="w-full">
              <Button size="lg" variant="outline" className="w-full font-bold">
                Back to My Bookings
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="w-full font-bold gap-2 bg-success text-success-foreground hover:bg-success/90"
              onClick={handlePayment}
              disabled={paying}
            >
              <CreditCard className="h-5 w-5" />
              {paying ? "Redirecting to Gateway..." : "Pay via SSLCommerz"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
