import { z } from "zod";

// backend-এর userValidation.registerUserValidationSchema এর সাথে মিলিয়ে
// (role এ শুধু CUSTOMER/TECHNICIAN — ADMIN কখনো এখান থেকে বাছাই করা যাবে না)
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(255, "Name can not be more than 255 characters"),
    email: z.string().trim().email("Please provide a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().trim().optional().or(z.literal("")),
    role: z.enum(["CUSTOMER", "TECHNICIAN"], {
        message: "Please select a role",
    }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().trim().email("Please provide a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
