import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";
import { AuthShell } from "@/components/layout/auth-shell";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to book a technician or manage your services.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title={<>Log in to <em className="text-primary">FixItNow</em></>}
      subtitle="Book a technician, follow a job, or manage your services."
      aside={{
        heading: (
          <>
            Every booking, <em className="text-highlight">one place.</em>
          </>
        ),
        points: [
          "See whether your request was accepted",
          "Pay securely once a technician confirms",
          "Rate the work when the job is done",
        ],
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
