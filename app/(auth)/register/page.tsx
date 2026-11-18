import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/register-form";
import { AuthShell } from "@/components/layout/auth-shell";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Book trusted technicians or offer your services on FixItNow.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="New here?"
      title={<>Create your <em className="text-primary">account</em></>}
      subtitle="It takes about a minute. Choose whether you're booking work or doing it."
      aside={{
        heading: (
          <>
            Fair prices, <em className="text-highlight">real reviews.</em>
          </>
        ),
        points: [
          "Customers book in a few taps and pay only after acceptance",
          "Technicians list services free and set their own hours",
          "Ratings come only from completed, paid jobs",
        ],
      }}
    >
      <RegisterForm />
    </AuthShell>
  );
}
