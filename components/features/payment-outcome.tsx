"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getBookingById } from "@/lib/api/bookings";
import { Booking } from "@/lib/types";

import { Button } from "@/components/ui/button";
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
      } catch {
        // Status stays unknown; the page shows a neutral message.
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

  // If the booking is still ACCEPTED and the gateway has not confirmed the webhook yet, poll briefly for a confirmation state.
  useEffect(() => {
    if (!bookingId || !booking) return;
    if (intent !== "success") return;
    if (booking.status !== "ACCEPTED") return;
    if (pollCount >= MAX_POLLS) return;

    timerRef.current = setTimeout(async () => {
      try {
        const res = await getBookingById(bookingId);
        setBooking(res.data.booking);
      } catch {
        // A failed poll just counts as one attempt.
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
    // If the live booking status can be verified, that response must drive the current outcome rather than the URL intent.
    if (verifiedPaid) {
      return {
        icon: <CheckCircle2 className="size-9" />,
        title: "Payment confirmed",
        description:
          "Thank you. Your booking payment has been verified. The technician will arrive at the scheduled time.",
        tone: "success",
      };
    }
    if (verifiedCancelled) {
      return {
        icon: <XCircle className="size-9" />,
        title: "Booking cancelled",
        description:
          "This booking has been cancelled, so no payment was completed.",
        tone: "danger",
      };
    }
    if (stillPendingConfirm && checking === false && pollCount >= MAX_POLLS) {
      return {
        icon: <AlertTriangle className="size-9" />,
        title: "Still confirming your payment",
        description:
          "We haven't received final confirmation from the payment gateway yet. If money was deducted, it will reflect here shortly — please check My Bookings in a few minutes before retrying payment.",
        tone: "warning",
      };
    }

    if (intent === "success") {
      return {
        icon: <CheckCircle2 className="size-9" />,
        title: "Payment received",
        description:
          "We've received your payment confirmation from the gateway. Track the live status of your booking from your dashboard.",
        tone: "success",
      };
    }
    if (intent === "fail") {
      return {
        icon: <XCircle className="size-9" />,
        title: "Payment didn’t go through",
        description:
          "Your payment could not be completed by the gateway (e.g. card declined or insufficient balance). No amount has been charged. You can retry from your bookings.",
        tone: "danger",
      };
    }
    return {
      icon: <XCircle className="size-9" />,
      title: "Payment cancelled",
      description:
        "The payment process was cancelled or was not completed. You can try paying again from your booking dashboard.",
      tone: "danger",
    };
  })();

  const toneClass = {
    success: "bg-success text-success-foreground",
    warning: "bg-highlight text-highlight-foreground",
    danger: "bg-destructive text-white",
  }[copy.tone];

  return (
    <main className="ruled flex flex-1 items-center justify-center px-4 py-20">
      <div className="w-full max-w-md animate-rise rounded-xl border bg-card p-8 text-center shadow-[6px_6px_0_0_var(--foreground)]">
        <div
          className={`mx-auto grid size-20 place-items-center rounded-full transition-colors duration-500 ${
            checking ? "bg-muted text-muted-foreground" : toneClass
          }`}
        >
          {checking ? <Loader2 className="size-9 animate-spin" /> : copy.icon}
        </div>

        <h1 className="mt-6 text-3xl font-semibold">{checking ? "Checking your payment…" : copy.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
          {checking ? "Hold on while we confirm the booking status." : copy.description}
        </p>

        {!checking && (
          <div className="mt-8 flex flex-col gap-2">
            <Button asChild>
              <Link href="/dashboard/customer/bookings">
                <Calendar /> View my bookings
              </Link>
            </Button>
            {copy.tone !== "success" && (
              <Button variant="outline" asChild>
                <Link href="/dashboard/customer/bookings">
                  <RefreshCw /> Try paying again
                </Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link href="/dashboard/customer">
                <LayoutDashboard /> Go to dashboard
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
