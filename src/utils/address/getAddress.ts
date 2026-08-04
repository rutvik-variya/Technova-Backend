import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";

import { ADDRESS_MESSAGE } from "../../types/address.types";

export const getAddress = async (
    tx: Prisma.TransactionClient,
    addressId: string
) => {
    const address = await tx.address.findUnique({
        where: {
            id: addressId,
        },
    });

    if (!address) {
        throw new ApiError(404, ADDRESS_MESSAGE.ADDRESS_NOT_FOUND);
    }

    return address;
};