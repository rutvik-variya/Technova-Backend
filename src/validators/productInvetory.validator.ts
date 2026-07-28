import { z } from "zod";

export const updateInventorySchema = z.object({
    quantity: z.number().int().min(0),
    lowStock: z.number().int().min(1)
});

export const adjustInventorySchema = z.object({
    type: z.enum(["IN", "OUT"]),
    quantity: z.number().int().positive(),
})




