import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const createPaymentSchema = z.object({
    orderId: z.uuid(),
    paymentMethod: z.enum(PaymentMethod),
});