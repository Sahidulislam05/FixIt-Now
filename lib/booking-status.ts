import type { BookingStatus } from "@/lib/types";

/** Badge styles per status — every colour comes from the theme tokens. */
export const BOOKING_STATUS_BADGE_CLASSES: Record<BookingStatus, string> = {
  REQUESTED: "bg-highlight/25 text-foreground border-highlight/60",
  ACCEPTED: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  DECLINED: "bg-destructive/10 text-destructive border-destructive/25",
  PAID: "bg-primary/12 text-primary border-primary/30",
  IN_PROGRESS: "bg-foreground text-background border-foreground",
  COMPLETED: "bg-success/12 text-success border-success/30",
  CANCELLED: "bg-muted text-muted-foreground border-border line-through",
};

export const BOOKING_STATUS_CHART_COLORS: Record<BookingStatus, string> = {
  REQUESTED: "var(--chart-3)",
  ACCEPTED: "var(--chart-2)",
  DECLINED: "var(--chart-5)",
  PAID: "var(--chart-1)",
  IN_PROGRESS: "var(--chart-4)",
  COMPLETED: "var(--success)",
  CANCELLED: "var(--muted-foreground)",
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

export function formatBookingStatus(status: BookingStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ");
}
