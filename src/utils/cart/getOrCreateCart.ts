import { Prisma } from "@prisma/client";

// get or create cart for user

export const getOrCreateCart = async (
    tx: Prisma.TransactionClient,
    userId: string
) => {
    let cart = await tx.cart.findUnique({
        where: {
            userId
        },
    })

    if (!cart) {
        cart = await tx.cart.create({
            data: {
                userId
            }
        })
    }

    return cart;
}