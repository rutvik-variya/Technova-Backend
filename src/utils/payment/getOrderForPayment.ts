import { Prisma } from "@prisma/client";

export const getOrderForPayment = async (
    tx:
        | Prisma.TransactionClient
        | Prisma.DefaultPrismaClient,
    userId: string,
    orderId: string
) => {

    return tx.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
        select: {
            id: true,
            userId: true,
            status: true,
            paymentStatus: true,
            grandTotal: true,
            payment: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
    });
};