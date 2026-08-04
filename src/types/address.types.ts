import { AddressType } from "@prisma/client";

export interface CreateAddressDto {
    fullName: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    addressType?: AddressType;
    isDefault?: boolean
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> { }

export const ADDRESS_MESSAGE = {
    CREATED: "Address created successfully.",
    UPDATED: "Address updated successfully.",
    DELETED: "Address deleted successfully.",

    FETCHED: "Address fetched successfully.",
    FETCHED_ALL: "Addresses fetched successfully.",

    NOT_FOUND: "Address not found.",
    UNAUTHORIZED: "You are not allowed to access this address.",
    ADDRESS_NOT_FOUND: "Address id not found",

    DEFAULT_UPDATED: "Default address updated successfully.",
};

