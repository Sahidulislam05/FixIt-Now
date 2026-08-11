import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_BADGE_CLASSES } from "@/lib/booking-status";
import type { BookingStatus } from "@/lib/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      className={
        BOOKING_STATUS_BADGE_CLASSES[status] ?? "bg-muted text-muted-foreground"
      }
    >
      {status.replace("_", " ")}
    </Badge>
  );
}
