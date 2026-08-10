import { OrderStatus, Prisma } from "@prisma/client";

export const getMyOrders = async (
    tx: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
    options: {
        userId: string;
        where: Record<string, any>;
        orderBy: Record<string, any> | undefined;
        skip: number;
        take: number;
    }
) => {
    const {
        userId,
        where,
        orderBy,
        skip,
        take,
    } = options;

    const finalWhere = {
        ...where,
        userId,
    };

    const [orders, total] =
        await Promise.all([

            tx.order.findMany({
                where: finalWhere,
                orderBy,
                skip,
                take,
                select: {
                    id: true,
                    orderNumber: true,

                    status: true,
                    paymentStatus: true,
                    paymentMethod: true,

                    subtotal: true,
                    discount: true,
                    shippingCharge: true,
                    tax: true,
                    grandTotal: true,

                    createdAt: true,

                    _count: {
                        select: {
                            orderItems: true,
                        },
                    },
                },
            }),

            tx.order.count({
                where: finalWhere,
            }),
        ]);

    return {
        orders,
        total,
    };
}
