import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
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

export const cancelOrderSchema =
    z.object({
        params: z.object({
            orderId: z.uuid(),
        }),
    });


export const adminGetOrdersSchema =
    z.object({
        query: z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            search: z.string().optional(),
            sortBy: z
                .enum([
                    "createdAt",
                    "updatedAt",
                    "grandTotal",
                ])
                .optional(),
            sortOrder: z
                .enum(["asc", "desc"])
                .optional(),
            userId: z.uuid().optional(),
            status: z.enum(
                Object.values(OrderStatus) as [
                    string,
                    ...string[]
                ]
            ).optional(),
            paymentStatus: z.enum(
                Object.values(PaymentStatus) as [
                    string,
                    ...string[]
                ]
            ).optional(),
            paymentMethod: z.enum(
                Object.values(PaymentMethod) as [
                    string,
                    ...string[]
                ]
            ).optional(),

            startDate: z
                .iso
                .datetime()
                .optional(),

            endDate: z
                .iso
                .datetime()
                .optional(),
        }),
    });


export const updateOrderStatusParamsSchema = z.object({
    orderId: z.uuid(),
});

export const updateOrderStatusBodySchema = z.object({
    status: z.enum(
        Object.values(OrderStatus) as [string, ...string[]]
    ),
});