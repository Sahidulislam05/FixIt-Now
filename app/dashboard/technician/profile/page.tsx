"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Wrench } from "lucide-react";
import { toast } from "sonner";

import { getMyProfile } from "@/lib/api/users";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TechnicianProfileForm } from "@/components/forms/technician-profile-form";
import { ProfileSettings, SettingsPanel } from "@/components/layout/profile-settings";

export default function TechnicianProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((res) => setMe(res.data.profile))
      .catch(() => toast.error("Failed to load your profile"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileSettings>
        <SettingsPanel
          icon={Wrench}
          title="Public profile"
          description="Shown to customers on your technician page."
        >
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-11 w-48" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <TechnicianProfileForm profile={me?.technicianProfile} />
          )}
          {me && (
            <Link
              href={`/technicians/${me.id}`}
              target="_blank"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              See it as customers do <ExternalLink className="size-3.5" />
            </Link>
          )}
        </SettingsPanel>
      </ProfileSettings>
    </div>
  );
}
