import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  /** Use light text on dark surfaces such as the footer. */
  inverted?: boolean;
}

export function BrandMark({ className, inverted }: BrandMarkProps) {
  return (
    <Link
      href="/"
      aria-label="FixItNow home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-primary text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          className="size-5 transition-transform duration-500 group-hover:-rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <span className="stripe absolute inset-x-0 bottom-0 h-1 opacity-90" />
      </span>
      <span
        className={cn(
          "font-display text-[1.35rem] leading-none font-semibold tracking-tight",
          inverted ? "text-deep-foreground" : "text-foreground",
        )}
      >
        FixIt<span className="italic text-primary">Now</span>
      </span>
    </Link>
  );
}
