import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Clock,
  Wrench,
  Target,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | FixItNow",
  description:
    "FixItNow is a home service marketplace where customers can find trusted, verified technicians for fast and secure home support.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description:
      "Every technician is reviewed, screened, and assessed before joining our network so you can book with confidence.",
  },
  {
    icon: Target,
    title: "Transparent Pricing",
    description:
      "You see service pricing before booking, with no hidden charges or last-minute surprises.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description:
      "Once a service request is submitted, nearby technicians can respond quickly and help when you need it most.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description:
      "From booking to payment, we design every step to be simple, reliable, and transparent.",
  },
];

const steps = [
  {
    step: "1",
    title: "Find a service",
    description:
      "Search by category or use the service directory to find what you need.",
  },
  {
    step: "2",
    title: "Choose a technician",
    description:
      "Review ratings, experience, skills, and pricing before selecting the right professional.",
  },
  {
    step: "3",
    title: "Book your slot",
    description: "Choose a convenient date and time and confirm your request.",
  },
  {
    step: "4",
    title: "Pay after service",
    description:
      "Complete a secure online payment after the technician completes the job.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-20 border-b">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            We make home support easier and more reliable
          </h1>
          <p className="text-muted-foreground text-lg">
            FixItNow brings customers and trusted specialists into one modern
            home service platform — from plumbing and electrical work to
            cleaning, repairs, and everyday home maintenance.
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Finding a dependable professional for a small repair or urgent home
            need should not be complicated. FixItNow removes the guesswork with
            verified technicians, transparent prices, and secure online booking.
          </p>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            Our Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="text-center">
                <CardContent className="p-6 space-y-3">
                  <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative p-6 rounded-2xl border">
                <span className="text-4xl font-extrabold text-primary/20">
                  {s.step}
                </span>
                <h3 className="font-semibold mt-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-5">
          <Users className="h-10 w-10 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold">
            Find the right technician for your next home task
          </h2>
          <Link href="/services">
            <Button size="lg" variant="secondary" className="gap-1.5">
              Explore services <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
