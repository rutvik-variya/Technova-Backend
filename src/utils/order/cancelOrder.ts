import { Prisma } from "@prisma/client";

export const cancelOrder = async (
    tx: Prisma.TransactionClient,
    orderId: string
) => {

    return tx.order.update({
        where: {
            id: orderId,
        },

        data: {
            status: "CANCELLED",
        },

        select: {
            id: true,
            orderNumber: true,
            status: true,
            paymentStatus: true,
            grandTotal: true,
            updatedAt: true,
        },
    });
};