"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GoogleIcon, FacebookIcon } from "@/components/shared/social-icons";

function handleUnavailableProvider(provider: "Google" | "Facebook") {
  toast.info(
    `${provider} sign-in is coming soon. Please try email login for now.`,
  );
}

export function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => handleUnavailableProvider("Google")}
        >
          <GoogleIcon className="h-4 w-4" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => handleUnavailableProvider("Facebook")}
        >
          <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
          Facebook
        </Button>
      </div>
    </div>
  );
}
