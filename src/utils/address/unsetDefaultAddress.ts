import { Prisma } from "@prisma/client";

export const unsetDefaultAddress = async (
    tx: Prisma.TransactionClient,
    userId: string
) => {
    await tx.address.updateMany({
        where: {
            userId,
            isDefault: true
        },
        data: {
            isDefault: false
        }
    })
}
