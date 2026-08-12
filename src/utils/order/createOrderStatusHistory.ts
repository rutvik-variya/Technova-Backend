import { Prisma, OrderStatus } from "@prisma/client";

interface CreateOrderStatusHistoryParams {
    orderId: string;
    fromStatus: OrderStatus | null;
    toStatus: OrderStatus;
    changedById: string;
    note?: string;
}

export const createOrderStatusHistory = async (
    tx: Prisma.TransactionClient,
    {
        orderId,
        fromStatus,
        toStatus,
        changedById,
        note,
    }: CreateOrderStatusHistoryParams
) => {

    return tx.orderStatusHistory.create({
        data: {
            orderId,
            fromStatus,
            toStatus,
            changedById,
            note,
        },
        select: {
            id: true,
            fromStatus: true,
            toStatus: true,
            changedById: true,
            note: true,
            createdAt: true,
        },
    });
};