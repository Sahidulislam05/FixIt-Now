"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "error" | "success" | "info";

const TONES: Record<Tone, { icon: typeof Info; className: string }> = {
  error: {
    icon: AlertTriangle,
    className: "border-destructive/30 bg-destructive/8 text-destructive",
  },
  success: {
    icon: CheckCircle2,
    className: "border-success/30 bg-success/10 text-success",
  },
  info: {
    icon: Info,
    className: "border-border bg-muted text-foreground",
  },
};

/** Inline status message for forms. Animates in/out and is announced to screen readers. */
export function FormAlert({
  tone,
  message,
  className,
}: {
  tone: Tone;
  message?: string | null;
  className?: string;
}) {
  const { icon: Icon, className: toneClass } = TONES[tone];

  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={message}
          role={tone === "error" ? "alert" : "status"}
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
              toneClass,
              tone === "error" && "animate-shake",
              className,
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
