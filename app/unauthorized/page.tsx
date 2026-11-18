import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/shared/status-screen";

export default function UnauthorizedPage() {
  return (
    <StatusScreen
      code="403"
      title="This area isn't for your account"
      description="You're signed in, but your role doesn't have access to this page. Switch accounts or head back."
      actions={
        <>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Log in with another account</Link>
          </Button>
        </>
      }
    />
  );
}
