import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createOrderSchema = z.object({
    addressId: z.uuid("Invalid address ID"),
    paymentMethod: z.enum(PaymentMethod)
});



