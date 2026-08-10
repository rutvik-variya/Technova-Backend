import { OrderStatus, PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createOrderSchema = z.object({
    addressId: z.uuid("Invalid address ID"),
    paymentMethod: z.enum(PaymentMethod)
});

export const getMyOrdersSchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10),

    status: z
        .enum(OrderStatus)
        .optional(),
});


export const getOrderSchema = z.object({
    params: z.object({
        orderId: z.uuid(),
    }),
});

