"use client";

import Image from "next/image";
import { KeyRound, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountForm } from "@/components/forms/account-form";
import { PasswordForm } from "@/components/forms/password-form";
import { Reveal } from "@/components/shared/reveal";
import { useAuth } from "@/hooks/use-auth";
import { getAvatarUrl } from "@/lib/avatar";

/** Panel with a title row and content; used to group settings forms. */
export function SettingsPanel({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="rounded-xl border bg-card">
      <div className="flex items-start gap-3 border-b p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </Reveal>
  );
}

/** Header + account details + password change. Shared by every role's profile page. */
export function ProfileSettings({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-card shadow-[4px_4px_0_0_var(--foreground)]">
          <Image src={getAvatarUrl(user.id)} alt="" fill sizes="80px" />
        </div>
        <div className="min-w-0">
          <p className="eyebrow !text-primary">{user.role.toLowerCase()} account</p>
          <h1 className="mt-1 truncate text-3xl font-semibold md:text-4xl">{user.name}</h1>
          <p className="truncate text-sm text-muted-foreground">
            Member since {new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {children}

      <SettingsPanel icon={UserRound} title="Account details" description="Your name and number as technicians and customers see them.">
        <AccountForm user={user} />
      </SettingsPanel>

      <SettingsPanel icon={KeyRound} title="Password" description="Use at least 8 characters with a letter and a number." delay={0.08}>
        <PasswordForm />
      </SettingsPanel>
    </div>
  );
}
