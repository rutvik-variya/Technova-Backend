import { z } from "zod";

export const adminCouponQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const adminCouponParamsSchema = z.object({
    couponId: z.uuid(),
});