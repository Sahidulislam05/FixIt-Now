"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Check, Home, Loader2, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/shared/password-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormAlert } from "@/components/forms/form-alert";
import { useRegister } from "@/hooks/use-auth";
import {
  passwordStrength,
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    value: "CUSTOMER" as const,
    title: "I need something fixed",
    hint: "Book and pay for services",
    icon: Home,
  },
  {
    value: "TECHNICIAN" as const,
    title: "I fix things",
    hint: "List services and take jobs",
    icon: Wrench,
  },
];

const STRENGTH_LABELS = ["Too weak", "Weak", "Okay", "Good", "Strong"];

export function RegisterForm() {
  const register = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "CUSTOMER",
      agreeToTerms: false,
    },
  });

  const password = useWatch({ control: form.control, name: "password" });
  const strength = password ? passwordStrength(password) : 0;

  function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    register.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone || undefined,
      },
      {
        onSuccess: () => toast.success("Account created — you can log in now."),
        onError: (error) => {
          if (error instanceof ApiError && error.issues?.length) {
            for (const issue of error.issues) {
              const field = issue.path.replace(/^body\./, "") as keyof RegisterFormValues;
              if (field in values) form.setError(field, { message: issue.message });
            }
          }
          setServerError(
            error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
          );
        },
      },
    );
  }

  const busy = register.isPending || register.isSuccess;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I&apos;m joining to…</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {ROLES.map((role) => {
                    const selected = field.value === role.value;
                    return (
                      <label
                        key={role.value}
                        htmlFor={`role-${role.value}`}
                        className={cn(
                          "relative flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-all",
                          selected
                            ? "border-foreground shadow-[3px_3px_0_0_var(--foreground)]"
                            : "hover:border-foreground/40",
                        )}
                      >
                        <RadioGroupItem id={`role-${role.value}`} value={role.value} className="sr-only" />
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          <role.icon className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{role.title}</span>
                          <span className="block text-xs text-muted-foreground">{role.hint}</span>
                        </span>
                        {selected && (
                          <motion.span
                            layoutId="role-check"
                            className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-foreground text-background"
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </motion.span>
                        )}
                      </label>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Rahim Uddin" autoComplete="name" {...field} />
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
                <FormLabel>
                  Mobile <span className="font-normal text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" placeholder="01712345678" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="8+ characters" autoComplete="new-password" {...field} />
                </FormControl>
                <div className="flex gap-1 pt-1" aria-hidden>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.span
                        className={cn(
                          "block h-full rounded-full",
                          strength <= 1 ? "bg-destructive" : strength === 2 ? "bg-highlight" : "bg-success",
                        )}
                        initial={false}
                        animate={{ width: i < strength ? "100%" : "0%" }}
                        transition={{ duration: 0.25 }}
                      />
                    </span>
                  ))}
                </div>
                <FormDescription className="text-xs" aria-live="polite">
                  {password ? STRENGTH_LABELS[strength] : "Use letters and at least one number"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Type it again" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                </FormControl>
                <FormLabel className="text-sm leading-snug font-normal text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-foreground underline underline-offset-4">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" className="text-foreground underline underline-offset-4">
                    Privacy Policy
                  </Link>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormAlert tone="error" message={serverError} />

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="animate-spin" /> Creating your account…
            </>
          ) : (
            <>
              Create account <ArrowRight />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
            Log in
          </Link>
        </p>
      </form>
    </Form>
  );
}
