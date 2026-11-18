import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/legal-document";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using the FixItNow platform.",
};

const sections = [
  {
    title: "1. Account usage",
    body: "To use FixItNow, customers and technicians must create an account with accurate and up-to-date information. Account credentials must be kept secure, and suspicious activity should be reported immediately.",
  },
  {
    title: "2. Booking and service",
    body: "When a customer submits a booking request, the relevant technician may accept or decline it. Once confirmed, the technician is responsible for delivering the service at the agreed time and location.",
  },
  {
    title: "3. Pricing and payment",
    body: "Pricing is shown before booking is confirmed. Payments are processed through approved payment gateways after service completion or as defined by the order workflow.",
  },
  {
    title: "4. Technician responsibilities",
    body: "Technicians must provide accurate skills and experience details and should maintain professional conduct and service quality. Repeated cancellations or complaints may trigger account review.",
  },
  {
    title: "5. Platform limitations",
    body: "FixItNow connects customers and technicians as a marketplace. The assigned technician is directly responsible for service quality and field execution, while FixItNow may assist with dispute resolution when necessary.",
  },
  {
    title: "6. Policy updates",
    body: "FixItNow may update these terms from time to time. Changes will be announced through the platform when material.",
  },
];

export default function TermsPage() {
  return <LegalDocument title="Terms of Service" updated="January 2026" sections={sections} />;
}
