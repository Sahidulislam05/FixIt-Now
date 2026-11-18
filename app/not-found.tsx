import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/shared/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Nothing to fix here"
      description="This page doesn't exist, or it was moved. Let's get you back to something useful."
      actions={
        <>
          <Button asChild>
            <Link href="/">
              <ArrowLeft /> Back home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/services">
              <Search /> Browse services
            </Link>
          </Button>
        </>
      }
    />
  );
}
