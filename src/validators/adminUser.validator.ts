import { z } from "zod";

export const adminUsersQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10),

    search: z
        .string()
        .trim()
        .optional(),

    role: z
        .enum(["USER", "ADMIN"])
        .optional(),

    sortBy: z
        .enum(["createdAt", "name", "email"])
        .default("createdAt"),

    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});

export type AdminUsersQueryDto = z.infer<
    typeof adminUsersQuerySchema
>;