import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">403 — Access Denied.</h1>
      <p className="max-w-md text-muted-foreground">
        Your account does not have permission to view this page. If you arrived
        here by mistake, use the button below to return home.
      </p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
}
