import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password cannot exceed 32 characters"),
});

export const loginSchema = z.object({
    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required"),

        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters")
            .max(100, "New password must not exceed 100 characters"),

        confirmPassword: z
            .string()
            .min(1, "Confirm password is required"),
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            message: "New password and confirm password must match",
            path: ["confirmPassword"],
        }
    )
    .refine(
        (data) => data.currentPassword !== data.newPassword,
        {
            message: "New password must be different from current password",
            path: ["newPassword"],
        }
    );


export type ChangePasswordDto = z.infer<
    typeof changePasswordSchema
>;