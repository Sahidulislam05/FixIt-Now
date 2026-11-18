"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/shared/password-input";
import { FormAlert } from "@/components/forms/form-alert";
import { changeMyPassword } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { passwordRule } from "@/lib/validations/auth";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordRule,
    confirmPassword: z.string().min(1, "Confirm the new password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: "Choose a password you haven't used here",
    path: ["newPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: PasswordValues) {
    setStatus(null);
    try {
      await changeMyPassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      form.reset();
      setStatus({ tone: "success", message: "Password changed. Use it next time you log in." });
      toast.success("Password changed");
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof ApiError ? error.message : "Couldn't change your password.",
      });
    }
  }

  const fields = [
    { name: "currentPassword" as const, label: "Current password", autoComplete: "current-password" },
    { name: "newPassword" as const, label: "New password", autoComplete: "new-password" },
    { name: "confirmPassword" as const, label: "Confirm new password", autoComplete: "new-password" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-3">
          {fields.map((f) => (
            <FormField
              key={f.name}
              control={form.control}
              name={f.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{f.label}</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete={f.autoComplete} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormAlert tone={status?.tone ?? "success"} message={status?.message} />
        <div className="flex justify-end">
          <Button type="submit" variant="ink" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            Update password
          </Button>
        </div>
      </form>
    </Form>
  );
}
