
import { Prisma } from "@prisma/client";

export const getCartForOrder = async (
    tx: Prisma.TransactionClient,
    userId: string
) => {
    return tx.cart.findUnique({
        where: { userId },
        select: {
            id: true,
            couponId: true,
            cartItems: {
                select: {
                    productId: true,
                    variantId: true,
                    quantity: true,

                    product: {
                        select: {
                            name: true,
                            slug: true,
                            brand: true,
                        },
                    },

                    variant: {
                        select: {
                            sku: true,
                            price: true,
                            stock: true,
                        },
                    },
                },
            },
        },
    });
};