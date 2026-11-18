"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface AuthShellProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  aside: { heading: React.ReactNode; points: string[] };
  children: React.ReactNode;
}

/** Two-column layout for login/register: a branded panel and the form. */
export function AuthShell({ eyebrow, title, subtitle, aside, children }: AuthShellProps) {
  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden overflow-hidden rounded-2xl bg-deep p-10 text-deep-foreground lg:flex lg:flex-col"
      >
        <div className="ruled absolute inset-0 opacity-40" aria-hidden />
        <div className="relative">
          <p className="eyebrow !text-highlight">FixItNow</p>
          <h2 className="mt-4 text-4xl leading-tight font-semibold">{aside.heading}</h2>
        </div>
        <ul className="relative mt-auto space-y-4">
          {aside.points.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3 text-deep-foreground/85"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-highlight text-highlight-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {point}
            </motion.li>
          ))}
        </ul>
        <div className="stripe absolute right-0 bottom-0 left-0 h-2" aria-hidden />
      </motion.aside>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-lg self-center"
      >
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </motion.section>
    </main>
  );
}
