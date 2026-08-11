import type { BookingStatus } from "@/lib/types";

export const BOOKING_STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  REQUESTED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  ACCEPTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  DECLINED: "bg-red-500/10 text-red-600 border-red-500/20",
  PAID: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  IN_PROGRESS: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  COMPLETED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
};

// চার্টের জন্য — CSS ভ্যারিয়েবল রেফারেন্স (globals.css-এর ব্র্যান্ড/চার্ট প্যালেট)
export const BOOKING_STATUS_CHART_COLORS: Record<BookingStatus, string> = {
  REQUESTED: "var(--chart-4)",
  ACCEPTED: "var(--chart-1)",
  DECLINED: "var(--muted-foreground)",
  PAID: "var(--chart-3)",
  IN_PROGRESS: "var(--chart-2)",
  COMPLETED: "var(--success)",
  CANCELLED: "var(--destructive)",
};

export const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];
