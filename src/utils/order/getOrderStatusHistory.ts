import { Prisma } from "@prisma/client";

export const getOrderStatusHistory = async (
    tx: Prisma.TransactionClient |
        Prisma.DefaultPrismaClient,
    orderId: string
) => {
    return tx.orderStatusHistory.findMany({
        where: {
            orderId
        },
        orderBy: {
            createdAt: "desc"
        },

        select: {
            id: true,
            fromStatus: true,
            toStatus: true,
            note: true,
            createdAt: true,
            changedBy: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
}