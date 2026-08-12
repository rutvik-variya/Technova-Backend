import { Prisma } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { CHECKOUT_MESSAGE } from "../../types/checkout.types";

export const validateCheckoutAddress = async (
    tx:
        | Prisma.TransactionClient
        | Prisma.DefaultPrismaClient,
    userId: string,
    addressId: string
) => {

    const address =
        await tx.address.findFirst({
            where: {
                id: addressId,
                userId,
            },

            select: {
                id: true,
                name: true,
                phone: true,
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
            },
        });

    if (!address) {
        throw new ApiError(404, CHECKOUT_MESSAGE.ADDRESS_NOT_FOUND);
    }

    return address;
};