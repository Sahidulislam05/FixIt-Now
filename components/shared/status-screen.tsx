import { cn } from "@/lib/utils";

interface StatusScreenProps {
  code: string;
  title: string;
  description: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/** Full-height message used by 404, 403 and error boundaries. */
export function StatusScreen({ code, title, description, actions, className }: StatusScreenProps) {
  return (
    <main className={cn("ruled flex flex-1 items-center justify-center px-4 py-24", className)}>
      <div className="w-full max-w-xl animate-rise text-center">
        <p className="font-display text-[7rem] leading-none font-semibold text-primary italic md:text-[9rem]">
          {code}
        </p>
        <div className="stripe mx-auto mt-2 h-2 w-24 rounded-full" aria-hidden />
        <h1 className="mt-8 text-3xl font-semibold md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{description}</p>
        {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </main>
  );
}
