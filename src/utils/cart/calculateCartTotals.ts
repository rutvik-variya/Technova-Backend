import { Prisma } from "@prisma/client";

type CartItemForTotals = {
    quantity: number;
    priceAtAdded: Prisma.Decimal;
};

export const calculateCartTotals = (
    items: CartItemForTotals[]
) => {
    let subtotal = 0;
    let totalItem = 0;

    for (const item of items) {
        subtotal += Number(item.priceAtAdded) * item.quantity;
        totalItem += item.quantity;
    }

    return {
        subtotal,
        totalItem,
    };
};