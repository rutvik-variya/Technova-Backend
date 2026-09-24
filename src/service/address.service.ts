import prisma from "../lib/prisma";
import { ADDRESS_MESSAGE, CreateAddressDto, UpdateAddressDto } from "../types/address.types";
import { getUserAddress } from "../utils/address/getUserAddress";
import { unsetDefaultAddress } from "../utils/address/unsetDefaultAddress";
import { validateAddressOwnership } from "../utils/address/validateAddressOwnership";
import { ApiError } from "../utils/ApiError";


export const createAddressService = async (
    userId: string,
    data: CreateAddressDto
) => {
    return prisma.$transaction(async (tx) => {
        const existingAddress = await tx.address.findFirst({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        const shouldBeDefault =
            !existingAddress || data.isDefault === true;

        if (shouldBeDefault) {
            await tx.address.updateMany({
                where: {
                    userId,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }

        return tx.address.create({
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
                isDefault: shouldBeDefault,
            },
            select: {
                id: true,
                fullName: true,
                phone: true,
                country: true,
                state: true,
                city: true,
                postalCode: true,
                addressLine1: true,
                addressLine2: true,
                landmark: true,
                addressType: true,
                isDefault: true,
                createdAt: true,
            },
        });
    });
};

export const getMyAddressesService = async (
    userId: string
) => {
    const addresses = await prisma.address.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            fullName: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            postalCode: true,
            addressLine1: true,
            addressLine2: true,
            landmark: true,
            addressType: true,
            isDefault: true,
            createdAt: true,
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

    return addresses;
};

export const getSingleAddressService = async (
    userId: string,
    addressId: string
) => {
    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
        select: {
            id: true,
            fullName: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            postalCode: true,
            addressLine1: true,
            addressLine2: true,
            landmark: true,
            addressType: true,
            isDefault: true,
            createdAt: true,
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

export const updateAddressService = async (
    userId: string,
    addressId: string,
    payload: UpdateAddressDto
) => {
    if (payload.isDefault === true) {
        return prisma.$transaction(async (tx) => {
            await getUserAddress(
                tx,
                userId,
                addressId
            );

            await tx.address.updateMany({
                where: {
                    userId,
                    isDefault: true,
                    id: {
                        not: addressId,
                    },
                },
                data: {
                    isDefault: false,
                },
            });

            return tx.address.update({
                where: {
                    id: addressId,
                },
                data: payload,
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    country: true,
                    state: true,
                    city: true,
                    postalCode: true,
                    addressLine1: true,
                    addressLine2: true,
                    landmark: true,
                    addressType: true,
                    isDefault: true,
                    createdAt: true,
                },
            });
        });
    }

    const address = await prisma.address.findFirst({
        where: {
            id: addressId,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!address) {
        throw new ApiError(
            404,
            ADDRESS_MESSAGE.ADDRESS_NOT_FOUND
        );
    }

    return prisma.address.update({
        where: {
            id: addressId,
        },
        data: payload,
        select: {
            id: true,
            fullName: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            postalCode: true,
            addressLine1: true,
            addressLine2: true,
            landmark: true,
            addressType: true,
            isDefault: true,
            createdAt: true,
        },
    });
};

export const deleteAddressService = async (
    userId: string,
    addressId: string
) => {
    return prisma.$transaction(async (tx) => {
        const address = await tx.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
            select: {
                id: true,
                isDefault: true,
            },
        });

        if (!address) {
            throw new ApiError(
                404,
                ADDRESS_MESSAGE.ADDRESS_NOT_FOUND
            );
        }

        await tx.address.delete({
            where: {
                id: address.id,
            },
        });

        if (address.isDefault) {
            const newestAddress = await tx.address.findFirst({
                where: {
                    userId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
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
        const address = await tx.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!address) {
            throw new ApiError(
                404,
                ADDRESS_MESSAGE.ADDRESS_NOT_FOUND
            );
        }

        await tx.address.updateMany({
            where: {
                userId,
                isDefault: true,
                id: {
                    not: addressId,
                },
            },
            data: {
                isDefault: false,
            },
        });

        return tx.address.update({
            where: {
                id: addressId,
            },
            data: {
                isDefault: true,
            },
            select: {
                id: true,
                fullName: true,
                phone: true,
                country: true,
                state: true,
                city: true,
                postalCode: true,
                addressLine1: true,
                addressLine2: true,
                landmark: true,
                addressType: true,
                isDefault: true,
                createdAt: true,
            },
        });
    });
};


