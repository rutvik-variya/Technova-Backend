import z from "zod";
import { ProductStatus } from "@prisma/client";


export const createProductSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Product name must be at least 3 characters"),
    description: z.string()
        .trim()
        .min(20, "Description is too short"),
    shortDescription: z.string().trim().optional(),
    brand: z
        .string()
        .trim()
        .min(2, "Brand name is required"),
    status: z.enum(ProductStatus).optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.uuid()
})

export const updateProductSchema = createProductSchema.partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        }
    );;

export const updateFeaturedSchema = z.object({
    isFeatured: z.boolean(),
});