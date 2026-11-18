"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/shared/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DemoLoginButtons } from "@/components/forms/demo-login-buttons";
import { FormAlert } from "@/components/forms/form-alert";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { ApiError } from "@/lib/api/client";

export function LoginForm() {
  const login = useLogin();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [demoEmail, setDemoEmail] = useState<string | null>(null);

  const notice =
    searchParams.get("registered") === "true"
      ? "Account created. Log in with your new details."
      : searchParams.get("sessionExpired") === "true"
        ? "Your session expired. Please log in again."
        : null;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  function onSubmit(values: LoginFormValues) {
    setServerError(null);
    login.mutate(values, {
      onSuccess: () => toast.success("Welcome back!"),
      onError: (error) => {
        setDemoEmail(null);
        setServerError(
          error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
        );
      },
    });
  }

  function handleDemoSelect(email: string, password: string) {
    setDemoEmail(email);
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", password, { shouldValidate: true });
    void form.handleSubmit(onSubmit)();
  }

  const busy = login.isPending || login.isSuccess;

  return (
    <div className="space-y-6">
      <FormAlert tone={searchParams.get("registered") ? "success" : "info"} message={notice} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Your password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormAlert tone="error" message={serverError} />

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy && !demoEmail ? (
              <>
                <Loader2 className="animate-spin" /> Logging in…
              </>
            ) : (
              <>
                Log in <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>

      <DemoLoginButtons onSelect={handleDemoSelect} disabled={busy} pendingEmail={busy ? demoEmail : null} />

      <p className="text-center text-sm text-muted-foreground">
        New to FixItNow?{" "}
        <Link href="/register" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
