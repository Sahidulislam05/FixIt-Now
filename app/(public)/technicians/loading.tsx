import { Skeleton } from "@/components/ui/skeleton";
import { TechnicianCardSkeleton } from "@/components/shared/technician-card";

export default function TechniciansLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-lg" />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TechnicianCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
