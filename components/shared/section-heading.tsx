import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index?: string;
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-12",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl space-y-3", centered && "mx-auto")}>
        <p className="eyebrow flex items-center gap-2">
          {index && <span className="text-primary">{index}</span>}
          {index && <span className="h-px w-6 bg-border" aria-hidden />}
          {label}
        </p>
        <h2 className="text-3xl leading-[1.08] font-semibold text-balance md:text-[2.6rem]">
          {title}
        </h2>
        {description && (
          <p className="max-w-xl text-[0.98rem] text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
