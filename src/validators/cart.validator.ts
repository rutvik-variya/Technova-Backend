import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.uuid(),
    variantId: z.uuid().optional(),
    quantity: z.number()
        .int()
        .min(1, "Quantity must be least 1")
        .max(10)
})

export type AddToCartInput = z.infer<typeof addToCartSchema>;