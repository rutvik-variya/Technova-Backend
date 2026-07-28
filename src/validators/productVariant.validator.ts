import { z } from "zod";

export const createVariantSchema = z.object({
    sku: z.string().min(3),
    ram: z.string().optional(),
    storage: z.string().optional(),
    color: z.string().optional(),
    price: z.number().positive(),
    comparePrice: z.number().positive().optional(),
    stock: z.number().int().min(0),
});

export const updateVariantSchema = createVariantSchema.partial();