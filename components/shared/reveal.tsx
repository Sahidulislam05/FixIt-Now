"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";

type RevealProps = ComponentProps<typeof motion.div> & {
  delay?: number;
  /** Distance in px the element travels upward while fading in. */
  distance?: number;
};

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  delay = 0,
  distance = 18,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
