import Link from "next/link";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  // Facebook,
  // Twitter,
  // Linkedin,
  // Instagram,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wrench className="h-4 w-4" />
              </div>
              <span>FixItNow</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted home service platform. Connect with qualified
              technicians for plumbing, electrical, cleaning, and more.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a
                href="#"
                className="hover:text-primary transition-colors"
                title="Facebook"
              >
                {/* <Facebook className="h-5 w-5" /> */}
              </a>
              <a
                href="#"
                className="hover:text-primary transition-colors"
                title="Twitter"
              >
                {/* <Twitter className="h-5 w-5" /> */}
              </a>
              <a
                href="#"
                className="hover:text-primary transition-colors"
                title="LinkedIn"
              >
                {/* <Linkedin className="h-5 w-5" /> */}
              </a>
              <a
                href="#"
                className="hover:text-primary transition-colors"
                title="Instagram"
              >
                {/* <Instagram className="h-5 w-5" /> */}
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/technicians"
                  className="hover:text-white transition-colors"
                >
                  Find Technicians
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Join as Technician
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Policy */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ & Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@fixitnow.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
