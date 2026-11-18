import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_BADGE_CLASSES, formatBookingStatus } from "@/lib/booking-status";
import type { BookingStatus } from "@/lib/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={`font-mono text-[0.68rem] tracking-wide uppercase ${BOOKING_STATUS_BADGE_CLASSES[status] ?? ""}`}
    >
      {formatBookingStatus(status)}
    </Badge>
  );
}
