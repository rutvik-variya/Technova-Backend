import prisma from "../lib/prisma";
import { CreateAddressDto, UpdateAddressDto } from "../types/address.types";
import { addressResponse } from "../utils/address/addressResponse";
import { getAddress } from "../utils/address/getAddress";
import { getUserAddress } from "../utils/address/getUserAddress";
import { unsetDefaultAddress } from "../utils/address/unsetDefaultAddress";
import { validateAddressOwnership } from "../utils/address/validateAddressOwnership";
import { ApiError } from "../utils/ApiError";


export const createAddressService = async (
    userId: string,
    data: CreateAddressDto
) => {
    return prisma.$transaction(async (tx) => {
        const addressCount = await tx.address.count({
            where: {
                userId
            }
        })

        const shouldBeDefault = addressCount === 0 || data.isDefault === true;

        if (shouldBeDefault) {
            await unsetDefaultAddress(tx, userId)
        }

        const address = await tx.address.create({
            data: {
                userId,
                fullName: data.fullName,
                phone: data.phone,
                country: data.country,
                state: data.state,
                city: data.city,
                postalCode: data.postalCode,

                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                landmark: data.landmark,
                addressType: data.addressType,
                isDefault: shouldBeDefault
            }
        })

        return addressResponse(address)
    })
}

export const getMyAddressesService = async (
    userId: string
) => {
    const addresses = await prisma.address.findMany({
        where: {
            userId,
        },
        orderBy: [
            {
                isDefault: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    if (!addresses) {
        throw new ApiError(404, "Address not found");
    }

    return addresses.map(addressResponse);
};


export const getSingleAddressService = async (
    userId: string,
    addressId: string
) => {
    return prisma.$transaction(async (tx) => {
        const address = await validateAddressOwnership(
            tx,
            userId,
            addressId
        );

        return addressResponse(address);
    });
};

export const updateAddressService = async (
    userId: string,
    addressId: string,
    payload: UpdateAddressDto
) => {
    return prisma.$transaction(async (tx) => {
        await getUserAddress(
            tx,
            userId,
            addressId
        );

        if (payload.isDefault) {
            await unsetDefaultAddress(
                tx,
                userId
            );
        }

        return tx.address.update({
            where: {
                id: addressId,
            },
            data: payload,
        });
    });
};


export const deleteAddressService = async (
    userId: string,
    addressId: string
) => {
    return prisma.$transaction(async (tx) => {
        const address =
            await getUserAddress(
                tx,
                userId,
                addressId
            );

        await tx.address.delete({
            where: {
                id: address.id,
            },
        });

        if (address.isDefault) {
            const newestAddress =
                await tx.address.findFirst({
                    where: {
                        userId,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

            if (newestAddress) {
                await tx.address.update({
                    where: {
                        id: newestAddress.id,
                    },
                    data: {
                        isDefault: true,
                    },
                });
            }
        }
    });
};


export const setDefaultAddressService = async (
    userId: string,
    addressId: string
) => {
    return prisma.$transaction(async (tx) => {
        await validateAddressOwnership(
            tx,
            userId,
            addressId
        );

        await unsetDefaultAddress(tx, userId);
        const address = await tx.address.update({
            where: {
                id: addressId,
            },
            data: {
                isDefault: true,
            },
        });
        return address;
    });
};


