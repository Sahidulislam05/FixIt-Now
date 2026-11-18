import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Top band used by the public inner pages (services, about, contact…). */
export function PageHeader({ eyebrow, title, description, children, className }: PageHeaderProps) {
  return (
    <header className={cn("ruled relative overflow-hidden border-b", className)}>
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 md:pt-20 md:pb-16">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl animate-rise text-4xl leading-[1.05] font-semibold text-balance [animation-delay:80ms] md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl animate-rise text-lg text-muted-foreground [animation-delay:160ms]">
            {description}
          </p>
        )}
        {children && <div className="mt-8 animate-rise [animation-delay:240ms]">{children}</div>}
      </div>
    </header>
  );
}
