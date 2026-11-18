import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, HeartHandshake, ReceiptText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "FixItNow is a home-services marketplace connecting households in Dhaka with verified technicians, with clear prices and secure payment.",
};

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: "Checked before listed",
    body: "Technician accounts are reviewed before their services go live, and admins can suspend anyone who breaks the rules.",
  },
  {
    icon: ReceiptText,
    title: "Price on the label",
    body: "Each service shows a fixed price for a stated scope of work. Extra parts are billed at cost, with receipts.",
  },
  {
    icon: Clock,
    title: "Your time respected",
    body: "Technicians publish their weekly hours, so you only pick slots they can actually make.",
  },
  {
    icon: HeartHandshake,
    title: "Reviews you can trust",
    body: "Only customers with a completed, paid booking can leave a rating. We never edit or remove honest reviews.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="About FixItNow"
        title={<>Small repairs shouldn&apos;t be a <em className="text-primary">big hassle.</em></>}
        description="We started FixItNow after one too many evenings spent calling numbers from a wall flyer. Finding someone reliable to fix a socket or service an AC should take minutes, not days."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <h2 className="mt-3 text-3xl leading-tight font-semibold md:text-4xl">
            A marketplace with rules that protect both sides of the job.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 text-lg text-muted-foreground">
          <p>
            Customers see who is coming, what it costs and what other customers thought of the
            work. Technicians get steady requests, a calendar they control and payment that
            arrives through the platform instead of being chased.
          </p>
          <p>
            Every booking follows the same path — requested, accepted, paid, in progress, done —
            and both sides can see exactly where it stands at any moment.
          </p>
        </Reveal>
      </section>

      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading label="Our standards" title="Four things we don't compromise on" />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="lift h-full rounded-xl border bg-card p-6">
                  <item.icon className="size-7 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-2xl bg-deep px-8 py-14 text-deep-foreground md:px-14">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold md:text-5xl">
              Got something that needs <em className="text-highlight">fixing?</em>
            </h2>
            <p className="mt-4 text-lg text-deep-foreground/70">
              Browse services by trade, compare technicians and send a request in a couple of minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/services">
                  Browse services <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-deep-foreground/30 bg-transparent text-deep-foreground hover:bg-deep-foreground/10 hover:text-deep-foreground" asChild>
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
          <div className="stripe absolute top-0 right-0 hidden h-full w-4 md:block" aria-hidden />
        </Reveal>
      </section>
    </main>
  );
}
