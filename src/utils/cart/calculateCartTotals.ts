import { CartItem } from "@prisma/client";

export const calculateCartTotals = (
    items: CartItem[]
) => {
    const subtotal = items.reduce((total, item) => {
        return total + Number(item.priceAtAdded) * item.quantity;
    }, 0);

    const totalItem = items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    return { subtotal, totalItem };
}