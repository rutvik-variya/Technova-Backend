import { z } from "zod";

export const shippingMethodSchema = z.object({
    shippingMethod: z.enum(["STANDARD", "EXPRESS"]),
});

