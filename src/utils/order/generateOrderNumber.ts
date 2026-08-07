import crypto from "crypto"

export const generateOrderNumber = () => {
    const timestamp = Date.now();

    const random = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()

    return `TN-${timestamp}-${random}`;
}