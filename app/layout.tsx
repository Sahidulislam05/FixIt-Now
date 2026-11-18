import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers/providers";
import { SiteChrome } from "@/components/layout/site-chrome";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
});

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "FixItNow — Book trusted home technicians in Dhaka",
    template: "%s · FixItNow",
  },
  description:
    "Book verified plumbers, electricians, cleaners and AC technicians. See prices upfront, pick a time, pay securely.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", display.variable, sans.variable, mono.variable)}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
