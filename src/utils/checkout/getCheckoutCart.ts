import { Prisma } from "@prisma/client";


export const getCheckoutCart = async (
    tx:
        | Prisma.TransactionClient
        | Prisma.DefaultPrismaClient,
    userId: string
) => {
    return tx.cart.findUnique({
        where: {
            userId
        },
        select: {
            id: true,
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
                            status: true
                        }
                    },
                    variant: {
                        select: {
                            id: true,
                            name: true,
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