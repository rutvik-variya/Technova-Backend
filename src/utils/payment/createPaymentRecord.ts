import { PaymentMethod, Prisma } from "@prisma/client";

export const createPaymentRecord = async (
    tx: Prisma.TransactionClient,
    {
        orderId,
        amount,
        method,
    }: {
        orderId: string;
        amount: Prisma.Decimal;
        method: PaymentMethod
    }
) => {
    return tx.payment.create({
        data: {
            orderId,
            amount,
            method
        },
        select: {
            id: true,
            orderId: true,
            amount: true,
            method: true,
            status: true,
            createdAt: true
        }
    })
} 