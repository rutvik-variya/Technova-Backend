import { Prisma } from "@prisma/client";

export const getAllOrders = async (
    tx: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
    options: {
        where: Record<string, any>;
        orderBy:
        | Record<string, any>
        | undefined;
        skip: number;
        take: number;
    }
) => {
    const { where, orderBy, skip, take } = options

    const [orders, total] = await Promise.all([
        tx.order.findMany({
            where,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                orderNumber: true,
                userId: true,
                status: true,
                paymentStatus: true,
                paymentMethod: true,
                subtotal: true,
                discount: true,
                shippingCharge: true,
                tax: true,
                grandTotal: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orderItems: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        }),
        tx.order.count({
            where,
        })
    ]);

    return {
        orders,
        total
    }
}