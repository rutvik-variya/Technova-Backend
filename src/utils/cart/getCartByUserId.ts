import prisma from "../../lib/prisma";

export const getCartByUserId = async (
    userId: string,
) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },

        select: {
            id: true,
            userId: true,
            subtotal: true,
            totalItem: true,
            couponId: true,
            createdAt: true,
            updatedAt: true,

            cartItems: {
                orderBy: {
                    createdAt: "asc",
                },

                select: {
                    id: true,
                    cartId: true,
                    productId: true,
                    variantId: true,
                    quantity: true,
                    priceAtAdded: true,
                    createdAt: true,
                    updatedAt: true,

                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            brand: true,

                            productImages: {
                                where: {
                                    isPrimary: true,
                                },

                                select: {
                                    url: true,
                                },

                                take: 1,
                            },
                        },
                    },

                    variant: {
                        select: {
                            id: true,
                            sku: true,
                            ram: true,
                            storage: true,
                            color: true,
                            price: true,
                            comparePrice: true,
                            stock: true,
                            isActive: true,
                        },
                    },
                },
            },
        },
    });

    if (!cart) {
        return {
            id: null,
            userId,
            subtotal: "0",
            totalItem: 0,
            couponId: null,
            cartItems: [],
        };
    }

    return {
        ...cart,

        cartItems: cart.cartItems.map((item) => ({
            ...item,

            product: {
                ...item.product,

                image:
                    item.product.productImages[0]?.url ?? null,

                productImages: undefined,
            },
        })),
    };
};