import { Prisma } from "@prisma/client";

export const getCartForOrder = async (
    tx: Prisma.TransactionClient,
    userId: string
) => {
    return tx.cart.findUnique({
        where: {
            userId
        },
        select: {
            id: true,
            couponId: true,
            cartItems: {
                select: {
                    id: true,
                    productId: true,
                    variantId: true,
                    quantity: true,
                    priceAtAdded: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            brand: true,
                            status: true
                        }
                    },

                    variant: {
                        select: {
                            id: true,
                            sku: true,
                            price: true,
                            stock: true
                        }
                    }
                }
            }
        }
    })
}