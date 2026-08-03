import { Suspense } from "react";
import { PaymentOutcome } from "@/components/features/payment-outcome";

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PaymentOutcome intent="fail" />
    </Suspense>
  );
}
