import { z } from "zod";

// AUTH
export const registerSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email format"),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),

    role: z.enum(["viewer", "analyst", "admin"]).optional(),
});

export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email format"),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),
});

// TRANSACTION
export const transactionSchema = z.object({
    amount: z
        .coerce.number({ required_error: "Amount is required" })
        .positive("Amount must be positive"),

    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: "Type must be income or expense" }),
    }),

    category: z
        .string({ required_error: "Category is required" })
        .min(1, "Category cannot be empty"),

    date: z.string().optional(),
    notes: z.string().optional(),
});