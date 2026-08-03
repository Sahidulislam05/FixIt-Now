import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
