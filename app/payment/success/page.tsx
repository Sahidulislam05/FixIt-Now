import { Suspense } from "react";
import { PaymentOutcome } from "@/components/features/payment-outcome";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PaymentOutcome intent="success" />
    </Suspense>
  );
}
