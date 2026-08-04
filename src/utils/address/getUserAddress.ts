import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { ADDRESS_MESSAGE } from "../../types/address.types";

export const getUserAddress = async (
    tx: Prisma.TransactionClient,
    userId: string,
    addressId: string
) => {
    const address = await tx.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
    });

    if (!address) {
        throw new ApiError(
            404,
            ADDRESS_MESSAGE.ADDRESS_NOT_FOUND
        );
    }

    return address;
};
