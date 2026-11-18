"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormAlert } from "@/components/forms/form-alert";
import { updateMyProfile } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { optionalPhone } from "@/lib/validations/auth";
import type { User } from "@/lib/types";

const accountSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(255),
  phone: optionalPhone,
});

type AccountValues = z.infer<typeof accountSchema>;

export function AccountForm({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
    defaultValues: { name: user.name, phone: user.phone ?? "" },
  });

  async function onSubmit(values: AccountValues) {
    setStatus(null);
    try {
      const res = await updateMyProfile({ name: values.name, phone: values.phone || undefined });
      const updated = { ...user, ...res.data.updatedProfile };
      setUser(updated);
      queryClient.setQueryData(["me"], updated);
      form.reset({ name: updated.name, phone: updated.phone ?? "" });
      setStatus({ tone: "success", message: "Your details were saved." });
      toast.success("Profile updated");
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof ApiError ? error.message : "Couldn't save your details.",
      });
    }
  }

  const { isSubmitting, isDirty } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="01712345678" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="account-email" className="text-[0.82rem] font-semibold">
            Email
          </Label>
          <Input id="account-email" value={user.email} readOnly disabled aria-describedby="account-email-hint" />
          <p id="account-email-hint" className="text-xs text-muted-foreground">
            Email is your login and can&apos;t be changed here.
          </p>
        </div>

        <FormAlert tone={status?.tone ?? "success"} message={status?.message} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Saving…" : "Save details"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
