import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how FixItNow collects, stores, and uses information to support customer and technician services.",
};

const sections = [
  {
    title: "1. Information we collect",
    body: "When you create an account, we collect your name, email address, phone number, and technician profile details such as skills and experience when applicable. Booking and payment information is also stored when needed to support service delivery.",
  },
  {
    title: "2. How information is used",
    body: "Collected information is used to process bookings, coordinate customer and technician communication, confirm payments, and maintain platform security. We do not sell personal information for advertising purposes.",
  },
  {
    title: "3. Information sharing",
    body: "After a booking is confirmed, relevant contact information such as name, phone number, and address is shared only between the customer and the assigned technician to coordinate service delivery. Payment processing is handled through a secure gateway such as SSLCommerz.",
  },
  {
    title: "4. Data protection",
    body: "Passwords are stored through secure hashing and authentication is handled through secure token-based systems. While internet transfer cannot be made completely risk-free, we implement practical safeguards to protect customer data.",
  },
  {
    title: "5. Your rights",
    body: "You can review and update your personal profile at any time. If you need to close your account or request data removal, contact our support team.",
  },
  {
    title: "6. Contact",
    body: "If you have privacy questions, email support@fixitnow.com.",
  },
];

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" updated="January 2026" sections={sections} />;
}
