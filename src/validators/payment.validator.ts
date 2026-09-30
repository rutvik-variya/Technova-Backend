import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const createPaymentSchema = z.object({
    orderId: z.uuid(),
    paymentMethod: z.enum(PaymentMethod),
});

export const createOnlinePaymentSchema = z.object({
    orderId: z.uuid(),
});

export const verifyPaymentSchema = z.object({
    razorpayPaymentId: z.string().min(1),
    razorpayOrderId: z.string().min(1),
    razorpaySignature: z.string().min(1),
});