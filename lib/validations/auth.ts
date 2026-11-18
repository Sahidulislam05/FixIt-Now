import { z } from "zod";

/** Bangladeshi mobile number, with or without the +88 prefix. Mirrors the server rule. */
export const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

export const optionalPhone = z
  .string()
  .trim()
  .regex(BD_PHONE, "Enter a valid Bangladeshi mobile number, e.g. 01712345678")
  .optional()
  .or(z.literal(""));

export const passwordRule = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(255, "Name can not be more than 255 characters"),
    email: z.string().trim().email("Please provide a valid email address"),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: optionalPhone,
    role: z.enum(["CUSTOMER", "TECHNICIAN"], { message: "Please select a role" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You need to accept the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** 0–4 score used by the password strength meter. */
export function passwordStrength(value: string): number {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Za-z]/.test(value) && /[0-9]/.test(value)) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score++;
  return score;
}
