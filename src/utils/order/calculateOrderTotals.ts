import { Coupon } from "@prisma/client"
import { calculateDiscount } from "../coupon/calculateDiscount"

export const calculateOrderTotals = (
    items: any[],
    coupon?: Coupon | null
) => {
    const subtotal = items.reduce(
        (total, item) => {
            const price = Number(item.variant.price)
            return total + price * item.quantity
        }, 0
    )

    let discount = 0;

    if (coupon) {
        discount = calculateDiscount({
            type: coupon.type,
            value: Number(coupon.value),
            maxOrderAmount: coupon.maxOrderAmount
                ? Number(coupon.maxOrderAmount)
                : null,
            subtotal,
        });
    }

    const tax = 0;

    return {
        subtotal,
        discount,
        tax,
    }
}