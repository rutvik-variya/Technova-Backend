import { z } from "zod";

export const wishlistSchema = z.object({
    productId: z.uuid("Invalid product ID"),
});

export const addWishlistSchema = wishlistSchema;
export const removeWishlistSchema = wishlistSchema;