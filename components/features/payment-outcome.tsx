"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBookingById } from "@/lib/api/bookings";
import { Booking } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  Calendar,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export type PaymentIntent = "success" | "cancel" | "fail";

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 4;

interface Copy {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: "success" | "warning" | "danger";
}

function getBookingIdFromParams(searchParams: URLSearchParams) {
  return (
    searchParams.get("bookingId") ||
    searchParams.get("booking_id") ||
    searchParams.get("tran_id") ||
    null
  );
}

export function PaymentOutcome({ intent }: { intent: PaymentIntent }) {
  const searchParams = useSearchParams();
  const bookingId = getBookingIdFromParams(searchParams);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [checking, setChecking] = useState(!!bookingId);
  const [pollCount, setPollCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    let cancelled = false;

    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        if (!cancelled) setBooking(res.data.booking);
      } catch (error) {
        console.error("Failed to verify payment/booking status:", error);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    void fetchBooking();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [bookingId]);

  // যদি এখনো ACCEPTED থাকে (webhook confirm এখনো আসেনি) এবং success ফ্লো হয়, কিছুক্ষণ পোল করো
  useEffect(() => {
    if (!bookingId || !booking) return;
    if (intent !== "success") return;
    if (booking.status !== "ACCEPTED") return;
    if (pollCount >= MAX_POLLS) return;

    timerRef.current = setTimeout(async () => {
      try {
        const res = await getBookingById(bookingId);
        setBooking(res.data.booking);
      } catch (error) {
        console.error("Payment status poll failed:", error);
      } finally {
        setPollCount((c) => c + 1);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [bookingId, booking, intent, pollCount]);

  const verifiedPaid =
    !!booking && ["PAID", "IN_PROGRESS", "COMPLETED"].includes(booking.status);
  const verifiedCancelled = !!booking && booking.status === "CANCELLED";
  const stillPendingConfirm =
    !!booking && booking.status === "ACCEPTED" && intent === "success";

  const copy: Copy = (() => {
    // আসল বুকিং স্ট্যাটাস পাওয়া গেলে সেটাই সত্য — URL এর intent না
    if (verifiedPaid) {
      return {
        icon: <CheckCircle2 className="h-10 w-10" />,
        title: "Payment Successful!",
        description:
          "Thank you. Your booking payment has been verified. The technician will arrive at the scheduled time.",
        tone: "success",
      };
    }
    if (verifiedCancelled) {
      return {
        icon: <XCircle className="h-10 w-10" />,
        title: "Booking Cancelled",
        description:
          "This booking has been cancelled, so no payment was completed.",
        tone: "danger",
      };
    }
    if (stillPendingConfirm && checking === false && pollCount >= MAX_POLLS) {
      return {
        icon: <AlertTriangle className="h-10 w-10" />,
        title: "Still Confirming Your Payment",
        description:
          "We haven't received final confirmation from the payment gateway yet. If money was deducted, it will reflect here shortly — please check My Bookings in a few minutes before retrying payment.",
        tone: "warning",
      };
    }

    if (intent === "success") {
      return {
        icon: <CheckCircle2 className="h-10 w-10" />,
        title: "Payment Received",
        description:
          "We've received your payment confirmation from the gateway. Track the live status of your booking from your dashboard.",
        tone: "success",
      };
    }
    if (intent === "fail") {
      return {
        icon: <XCircle className="h-10 w-10" />,
        title: "Payment Failed",
        description:
          "Your payment could not be completed by the gateway (e.g. card declined or insufficient balance). No amount has been charged. You can retry from your bookings.",
        tone: "danger",
      };
    }
    return {
      icon: <XCircle className="h-10 w-10" />,
      title: "Payment Cancelled",
      description:
        "The payment process was cancelled or was not completed. You can try paying again from your booking dashboard.",
      tone: "danger",
    };
  })();

  const toneClasses = {
    success: {
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    warning: {
      border: "border-amber-500/30",
      iconBg: "bg-amber-100 text-amber-600",
    },
    danger: {
      border: "border-red-500/30",
      iconBg: "bg-red-100 text-red-600",
    },
  }[copy.tone];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card
        className={`max-w-md w-full text-center p-8 shadow-lg ${toneClasses.border}`}
      >
        <CardContent className="space-y-6 p-0">
          {checking ? (
            <div className="h-20 w-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto ${toneClasses.iconBg}`}
            >
              {copy.icon}
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {checking ? "Verifying Payment..." : copy.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {checking
                ? "Please wait while we confirm your booking status."
                : copy.description}
            </p>
          </div>

          {!checking && (
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/dashboard/customer/bookings">
                <Button className="w-full gap-2">
                  <Calendar className="h-4 w-4" /> View My Bookings
                </Button>
              </Link>
              {copy.tone !== "success" && (
                <Link href="/dashboard/customer/bookings">
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" /> Retry Payment
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/customer">
                <Button variant="ghost" className="w-full gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
