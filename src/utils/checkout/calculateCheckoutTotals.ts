import { Prisma } from "@prisma/client";

export const calculateCheckoutTotals = (
    items: any[]
) => {
    const subtotal = items.reduce(
        (total: Prisma.Decimal, item) => {
            const itemTotal = item.variant.price.mul(item.quantity);

            return total.add(itemTotal);
        },
        new Prisma.Decimal(0)
    );

    const discount = new Prisma.Decimal(0);

    const shippingFee = new Prisma.Decimal(0);

    const grandTotal = subtotal
        .sub(discount)
        .add(shippingFee);

    return {
        subtotal,
        discount,
        shippingFee,
        grandTotal,
    };
};