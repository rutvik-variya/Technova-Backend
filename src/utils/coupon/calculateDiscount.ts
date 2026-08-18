import { CouponType } from "@prisma/client";

interface DiscountInput {
    type: CouponType;
    value: number;
    maxOrderAmount?: number | null;
    subtotal: number;
}

export const calculateDiscount = ({
    type,
    value,
    maxOrderAmount,
    subtotal
}: DiscountInput) => {
    if (subtotal <= 0) {
        return 0;
    }

    if (type === "FIXED") {
        return Math.min(value, subtotal);
    }

    let discount = (subtotal * value) / 100;

    if (maxOrderAmount !== null && maxOrderAmount !== undefined) {
        discount = Math.min(
            discount,
            maxOrderAmount
        );
    }

    return Math.min(discount, subtotal);
};