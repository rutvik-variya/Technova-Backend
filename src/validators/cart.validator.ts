import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.uuid(),
    variantId: z.uuid().optional(),
    quantity: z.number()
        .int()
        .min(1, "Quantity must be least 1")
})

export const updateCartItemSchema = z.object({
    quantity: z.number()
        .int()
        .min(1, "Quantity must be least 1")
        .max(100, "Maximum quantity is 100")
})


export const syncCartSchema = z.object({
    items: z
        .array(
            z.object({
                productId: z.string().uuid(),
                variantId: z.string().uuid(),
                quantity: z.number().int().positive(),
            }),
        )
        .max(100),
});


export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;