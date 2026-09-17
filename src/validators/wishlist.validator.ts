import { z } from "zod";

export const wishlistSchema = z.object({
    productId: z.uuid("Invalid product ID"),
});



export const syncWishlistSchema = z.object({
    productIds: z
        .array(z.string().uuid())
        .max(100)
        .default([]),
});

export const addWishlistSchema = wishlistSchema;
export const removeWishlistSchema = wishlistSchema;