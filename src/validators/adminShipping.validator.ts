import { z } from "zod";

export const adminShippingMethodParamSchema = z.object({
    method: z.enum(["STANDARD", "EXPRESS"]),
});

export const adminShippingUpdateSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        baseCharge: z
            .number()
            .min(0)
            .max(1000000)
            .optional(),

        freeShippingAbove: z
            .number()
            .min(0)
            .max(10000000)
            .optional(),

        estimatedDays: z
            .number()
            .int()
            .min(1)
            .max(365)
            .optional(),

        isActive: z
            .boolean()
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message:
                "At least one field is required to update shipping method",
        }
    );

export type AdminShippingUpdateDto = z.infer<
    typeof adminShippingUpdateSchema
>;