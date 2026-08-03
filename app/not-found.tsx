import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, Home, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
          <SearchX className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">404</h1>
          <h2 className="text-lg font-semibold">Page not found...</h2>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Wrench className="h-4 w-4" /> Browse Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
