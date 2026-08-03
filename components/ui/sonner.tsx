"use client"

import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

// next-themes ব্যবহার করা হয়নি (এই প্রজেক্টে dark/light toggle এখনো নেই,
// assignment-এ এটা optional bonus) — light theme fix করে globals.css এর
// CSS variable গুলোর সাথে visual consistency রাখা হয়েছে
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
