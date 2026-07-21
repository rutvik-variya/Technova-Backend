import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters")
    .optional(),

  image: z
    .url("Invalid image URL")
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
  );;

export const categoryParamsSchema = z.object({
  id: z.uuid("Invalid category id"),
});


