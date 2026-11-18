import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/shared/social-icons";

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://x.com", label: "X", Icon: XIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
];

const COLUMNS = [
  {
    title: "Book",
    links: [
      { href: "/services", label: "All services" },
      { href: "/technicians", label: "Technicians" },
      { href: "/register", label: "Join as a technician" },
      { href: "/login", label: "Try the demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/blog", label: "Journal" },
      { href: "/contact", label: "Contact" },
      { href: "/#faq", label: "Help & FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of service" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-deep text-deep-foreground">
      <div className="stripe h-2" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-6">
            <BrandMark inverted />
            <p className="max-w-sm text-[0.95rem] text-deep-foreground/70">
              A marketplace for fixing things at home. Verified local technicians,
              prices you can see before you book, and payment only after the job is
              accepted.
            </p>
            <ul className="space-y-2.5 text-sm text-deep-foreground/80">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-highlight" /> Gulshan-2, Dhaka 1212
              </li>
              <li>
                <a href="tel:+8801700000000" className="link-grow inline-flex items-center gap-2.5">
                  <Phone className="size-4 text-highlight" /> +880 1700-000000
                </a>
              </li>
              <li>
                <a href="mailto:support@fixitnow.com" className="link-grow inline-flex items-center gap-2.5">
                  <Mail className="size-4 text-highlight" /> support@fixitnow.com
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 font-mono text-xs tracking-[0.12em] text-highlight uppercase">
                  {col.title}
                </h3>
                <ul className="space-y-3 text-[0.95rem]">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="link-grow text-deep-foreground/80 transition-colors hover:text-deep-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-deep-foreground/15 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-deep-foreground/60">
            © {new Date().getFullYear()} FixItNow Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`FixItNow on ${label}`}
                className="grid size-9 place-items-center rounded-full border border-deep-foreground/20 text-deep-foreground/80 transition-all hover:-translate-y-0.5 hover:border-highlight hover:text-highlight"
              >
                <Icon className="size-4" />
              </a>
            ))}
            <a
              href="#top"
              className="ml-2 inline-flex items-center gap-1 font-mono text-xs text-deep-foreground/60 hover:text-highlight"
            >
              Back to top <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
