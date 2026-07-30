import { z } from "zod";

export const createReviewSchema = z.object({
    rating: z
        .number()
        .int()
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),

    comment: z
        .string()
        .trim()
        .min(5, "Comment must be at least 5 characters")
        .max(1000)
        .optional()
})

export const updateReviewSchema = createReviewSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        }
    );
