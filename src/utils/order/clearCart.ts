import { Prisma } from "@prisma/client";

export const clearCart = async (
    tx: Prisma.TransactionClient,
    cartId: string

) => {
    await tx.cartItem.deleteMany({
        where: {
            cartId,
        },
    });

    await tx.cart.update({
        where: {
            id: cartId,
        },
        data: {
            subtotal: 0,
            totalItems: 0,
        },
    });
}