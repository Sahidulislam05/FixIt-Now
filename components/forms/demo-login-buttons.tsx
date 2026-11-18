"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Public demo accounts. They are created by `npm run seed` in Fix-it-server,
 * which also gives the demo customer one booking in every workflow stage.
 */
export const DEMO_ACCOUNTS = [
  {
    role: "Customer",
    email: "customer@fixitnow.com",
    password: "customer123",
    icon: User,
    tryThis: "Pay for an accepted job, cancel a request, review a finished one",
  },
  {
    role: "Technician",
    email: "technician@fixitnow.com",
    password: "technician123",
    icon: Wrench,
    tryThis: "Accept a new request, start a paid job, mark work complete",
  },
  {
    role: "Admin",
    email: "admin@fixitnow.com",
    password: "Admin@123456",
    icon: ShieldCheck,
    tryThis: "Watch every booking, manage users and categories, see analytics",
  },
] as const;

interface DemoLoginButtonsProps {
  onSelect: (email: string, password: string) => void;
  disabled?: boolean;
  /** Email of the demo account currently signing in, to show its spinner. */
  pendingEmail?: string | null;
}

export function DemoLoginButtons({ onSelect, disabled, pendingEmail }: DemoLoginButtonsProps) {
  return (
    <section aria-labelledby="demo-heading" className="rounded-xl border border-dashed bg-muted/40 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="demo-heading" className="font-display text-base font-semibold">
          Explore with a demo account
        </h2>
        <span className="eyebrow !text-[0.62rem]">one click</span>
      </div>
      <ul className="grid gap-2">
        {DEMO_ACCOUNTS.map((acc, i) => {
          const pending = pendingEmail === acc.email;
          return (
            <motion.li
              key={acc.role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(acc.email, acc.password)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-all",
                  "hover:-translate-y-0.5 hover:border-foreground hover:shadow-[3px_3px_0_0_var(--foreground)]",
                  "disabled:pointer-events-none disabled:opacity-60",
                  pending && "border-primary",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-deep text-deep-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {pending ? <Loader2 className="size-4 animate-spin" /> : <acc.icon className="size-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {acc.role}
                    <span className="truncate font-mono text-[0.7rem] font-normal text-muted-foreground">
                      {acc.email}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{acc.tryThis}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
