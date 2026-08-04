import { Address } from "@prisma/client";

export const addressResponse = (address: Address) => {
    return {
        id: address.id,
        fullName: address.fullName,
        phone: address.phone,
        country: address.country,
        state: address.state,
        city: address.city,
        postalCode: address.postalCode,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        landmark: address.landmark,
        addressType: address.addressType,
        isDefault: address.isDefault,
        createdAt: address.createdAt
    }
}