import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a booking or joining as a technician? Get in touch with FixItNow support.",
};

const CHANNELS = [
  { icon: Phone, label: "Call us", value: "+880 1700-000000", href: "tel:+8801700000000" },
  { icon: Mail, label: "Email", value: "support@fixitnow.com", href: "mailto:support@fixitnow.com" },
  { icon: MapPin, label: "Office", value: "Level 5, Gulshan-2, Dhaka 1212" },
  { icon: Clock, label: "Hours", value: "Every day, 8 am – 10 pm" },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Contact"
        title={<>Talk to a <em className="text-primary">person.</em></>}
        description="Booking question, payment problem, or thinking of joining as a technician — write to us and we'll reply within a working day."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:py-20">
        <Reveal>
          <ul className="divide-y rounded-xl border bg-card">
            {CHANNELS.map((channel) => (
              <li key={channel.label} className="flex items-start gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-deep text-deep-foreground">
                  <channel.icon className="size-4" />
                </span>
                <div>
                  <p className="eyebrow">{channel.label}</p>
                  {channel.href ? (
                    <a href={channel.href} className="link-grow mt-1 inline-block font-medium">
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-medium">{channel.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-xl border bg-card p-6 shadow-[6px_6px_0_0_var(--foreground)] sm:p-8">
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">All fields are required.</p>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
