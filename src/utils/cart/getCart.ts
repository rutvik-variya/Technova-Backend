import { Prisma } from "@prisma/client";

export const getCart = async (
    tx: Prisma.TransactionClient,
    cartId: string
) => {
    return await tx.cart.findUnique({
        where: {
            id: cartId
        },
        include: {
            cartItems: {
                include: {
                    product: true,
                    variant: true
                }
            }
        }
    })
}