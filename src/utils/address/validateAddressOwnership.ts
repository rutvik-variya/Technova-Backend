import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { ADDRESS_MESSAGE } from "../../types/address.types";

export const validateAddressOwnership = async (
    tx: Prisma.TransactionClient,
    userId: string,
    addressId: string
) => {
    const address = await tx.address.findUnique({
        where: {
            id: addressId,
        },
    });

    if (!address) {
        throw new ApiError(404, ADDRESS_MESSAGE.NOT_FOUND);
    }

    if (address.userId !== userId) {
        throw new ApiError(403, ADDRESS_MESSAGE.UNAUTHORIZED);
    }

    return address;
}