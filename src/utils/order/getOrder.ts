import { Prisma } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

export const getOrder = async (
    tx: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
    userId: string,
    orderId: string
) => {

    const order = await tx.order.findFirst({
        where: {
            id: orderId,
            userId,
        },

        select: {
            id: true,
            orderNumber: true,

            status: true,
            paymentStatus: true,
            paymentMethod: true,

            subtotal: true,
            discount: true,
            shippingCharge: true,
            tax: true,
            grandTotal: true,

            createdAt: true,
            updatedAt: true,

            address: {
                select: {
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
            },
            orderItems: {
                select: {
                    id: true,

                    productId: true,
                    variantId: true,

                    productName: true,
                    productSlug: true,
                    brand: true,

                    image: true,
                    sku: true,

                    quantity: true,

                    unitPrice: true,
                    totalPrice: true,

                    createdAt: true,
                },

                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!order) {
        throw new ApiError(404, ORDER_MESSAGE.ORDER_NOT_FOUND);
    }

    return order;
};
