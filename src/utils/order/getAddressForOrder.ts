import { Prisma } from "@prisma/client";

export const getAddressForOrder = async (
    tx: Prisma.TransactionClient,
    userId: string,
    addressId: string
) => {
    return tx.address.findFirst({
        where: {
            id: addressId,
            userId
        },
        select: {
            id: true,
            fullName: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            postalCode: true,
            addressLine1: true,
            addressLine2: true,
            landmark: true,
        }
    })
}