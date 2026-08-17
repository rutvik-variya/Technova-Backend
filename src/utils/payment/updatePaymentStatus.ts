import { Prisma, PaymentStatus } from "@prisma/client";

export const updatePaymentStatus = async (
    tx: Prisma.TransactionClient,
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string
) => {
    return tx.payment.update({
        where: {
            id: paymentId
        },
        data: {
            status,
            transactionId,
            paidAt: status === "PAID" ? new Date() : undefined
        },
        select: {
            id: true,
            orderId: true,
            amount: true,
            method: true,
            status: true,
            transactionId: true,
            paidAt: true
        }
    })
}