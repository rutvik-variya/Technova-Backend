import { CouponStatus, CouponType } from "@prisma/client";
import { z } from "zod";

const couponFieldsSchema = z.object({
    code: z
        .string()
        .trim()
        .min(3)
        .max(30)
        .transform((value) => value.toUpperCase()),

    description: z
        .string()
        .trim()
        .max(200)
        .optional(),

    type: z.enum(CouponType),

    value: z.number().positive(),

    minOrderAmount: z
        .number()
        .positive(),

    maxOrderAmount: z
        .number()
        .positive()
        .optional(),

    usageLimit: z
        .number()
        .int()
        .positive()
        .optional(),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    status: z
        .enum(CouponStatus)
        .optional()
});

const couponRefinements = (
    data: z.infer<typeof couponFieldsSchema>,
    ctx: z.RefinementCtx
) => {
    if (data.endDate <= data.startDate) {
        ctx.addIssue({
            code: "custom",
            path: ["endDate"],
            message: "End date must be after start date"
        });
    }

    if (data.type === "PERCENTAGE" && data.value > 100) {
        ctx.addIssue({
            code: "custom",
            path: ["value"],
            message: "Percentage discount cannot exceed 100"
        });
    }

    if (
        data.type === "PERCENTAGE" &&
        data.maxOrderAmount === undefined
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["maxDiscount"],
            message:
                "Maximum discount is required for percentage coupons"
        });
    }
};

export const createCouponSchema =
    couponFieldsSchema.superRefine(couponRefinements);

export const updateCouponSchema =
    couponFieldsSchema.partial();

export const applyCouponSchema = z.object({
    code: z
        .string()
        .trim()
        .min(3)
        .max(30)
        .transform((value) => value.toUpperCase())
});
